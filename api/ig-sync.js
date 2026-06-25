const IG_TOKEN   = process.env.IG_ACCESS_TOKEN;
const IG_USER_ID = process.env.IG_USER_ID;

// Strip all emoji Unicode ranges
const EMOJI_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FEFF}‼⚠✅🚨]/gu;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed', items: [] });

  const token  = req.query.token   || IG_TOKEN;
  const userId = req.query.user_id || IG_USER_ID;

  if (!token || !userId) {
    return res.status(200).json({
      items: [],
      status: 'not_configured',
      diagnostic: { hasToken: !!token, hasUserId: !!userId },
    });
  }

  const since = req.query.since ? parseInt(req.query.since, 10) : null;
  const until = req.query.until ? parseInt(req.query.until, 10) : null;
  const days  = req.query.days  ? req.query.days.split(',').map(Number) : null;

  const fields = 'id,caption,timestamp,media_type,permalink';

  function buildUrl(host, after) {
    let url = `https://${host}/${userId}/media?fields=${fields}&limit=50&access_token=${token}`;
    if (since) url += `&since=${since}`;
    if (until) url += `&until=${until}`;
    if (after) url += `&after=${after}`;
    return url;
  }

  const hosts = ['graph.facebook.com/v19.0', 'graph.instagram.com'];
  const errors = [];

  for (const host of hosts) {
    try {
      const allMedia = [];
      let cursor = null;
      let pages  = 0;

      while (pages < 20) {
        const r    = await fetch(buildUrl(host, cursor));
        const data = await r.json();
        if (data.error) { errors.push(`${host}: ${data.error.message}`); break; }
        const batch = data.data || [];
        allMedia.push(...batch);
        cursor = data.paging?.cursors?.after || null;
        if (!cursor || !batch.length) break;
        pages++;
      }

      if (!errors.find(e => e.startsWith(host))) {
        let items = allMedia.map(parseMedia).filter(Boolean);

        // Day-of-week filter (JS getDay: 0=Sun … 6=Sat)
        if (days && days.length) {
          items = items.filter(item => days.includes(new Date(item.createdAt).getDay()));
        }

        return res.status(200).json({
          items,
          syncedAt: new Date().toISOString(),
          source: host,
          rawCount: allMedia.length,
          filteredCount: items.length,
          pages: pages + 1,
        });
      }
    } catch (err) {
      errors.push(`${host}: ${err.message}`);
    }
  }

  return res.status(200).json({ items: [], error: errors.join(' | ') || 'Sync failed' });
};

function parseMedia(media) {
  const caption = (media.caption || '').replace(/\r\n/g, '\n');
  if (!caption.trim()) return null;

  // STRICT: only import posts that have an explicit ITEM: label.
  // Allow optional leading whitespace or emoji on the same line before ITEM.
  const itemMatch = caption.match(/^[^\S\n]*[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}✅‼⚠🚨\s]*ITEM[:\s]+(.+)$/imu);
  if (!itemMatch) return null;

  // Clean the name: strip emojis, then reject junk names
  let name = itemMatch[1]
    .replace(EMOJI_RE, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!name || name.length < 3) return null;
  if (/^\d+$/.test(name)) return null;                                         // bare number
  if (/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)(day)?\b/i.test(name)) return null;      // day of week
  if (/^\d{1,2}[\/\-]\d{1,2}([\/\-]\d{2,4})?$/.test(name)) return null;      // date string

  const isSold = /\bSOLD\b/i.test(caption);

  // Price: prefer labelled PRICE: line, fall back to bare ₦ symbol
  let sellersAmount = 0, sellersCurrency = 'NGN';
  const priceMatch = caption.match(/^PRICE[:\s]+[₦$]?\s*([\d,]+(?:\.\d+)?)\s*([KkMm]?)/im)
                  || caption.match(/₦\s*([\d,]+(?:\.\d+)?)\s*([KkMm]?)/);
  if (priceMatch) {
    let raw = parseFloat(priceMatch[1].replace(/,/g, '')) || 0;
    const suf = (priceMatch[2] || '').toLowerCase();
    if (suf === 'k') raw *= 1000;
    if (suf === 'm') raw *= 1000000;
    sellersAmount   = raw;
    sellersCurrency = (caption.includes('₦') || /\bNGN\b/i.test(caption)) ? 'NGN' : 'SGD';
  }

  let sellerRef = `IG-${media.id.slice(-6)}`;
  const refMatch = caption.match(/^(?:Reference\s*ID|Ref)[:\s]+(.+)$/im);
  if (refMatch) sellerRef = refMatch[1].trim();

  const notes = [];
  const condMatch = caption.match(/^Condition[:\s]+(.+)$/im);
  const locMatch  = caption.match(/^Location[:\s]+(.+)$/im);
  const descMatch = caption.match(/^(?:Description|Desc)[:\s]+(.+)$/im);
  if (condMatch) notes.push(`Condition: ${condMatch[1].trim()}`);
  if (locMatch)  notes.push(`Location: ${locMatch[1].trim()}`);
  if (descMatch) notes.push(descMatch[1].trim());

  return {
    id:               `ig-${media.id}`,
    name,
    status:           isSold ? 'sold' : 'listed',
    sellerRef,
    buyerRef:         '',
    sellersAmount,
    sellersCurrency,
    sgdMargin:        0,
    notifyOnChange:   true,
    notes:            notes.join(' · '),
    source:           'instagram',
    instagramMediaId: media.id,
    instagramPostUrl: media.permalink,
    createdAt:        media.timestamp,
    updatedAt:        media.timestamp,
  };
}
