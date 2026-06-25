export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return res.status(200).json({ sent: false, error: 'Email not configured — add RESEND_API_KEY in Vercel settings' });

  const { email, stats, items = [], date } = req.body || {};
  if (!email) return res.status(400).json({ sent: false, error: 'No email address provided' });

  const from = process.env.FROM_EMAIL || 'Ledgr <reports@ledgr.app>';

  const listedItems    = items.filter(i => i.status === 'listed');
  const availableItems = items.filter(i => i.status === 'available');
  const soldItems      = items.filter(i => i.status === 'sold');

  const CURRENCY_SYMBOLS = { SGD: 'S$', NGN: '₦', USD: 'US$', EUR: '€', GBP: '£', JPY: '¥', AUD: 'A$', HKD: 'HK$', CNY: 'CN¥' };
  function fmt(amount, currency = 'SGD') {
    const sym = CURRENCY_SYMBOLS[currency] || (currency + ' ');
    return sym + Number(amount || 0).toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function fmtSGD(n) {
    return 'S$' + Number(n || 0).toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function itemRows(arr) {
    if (!arr.length) return '<tr><td colspan="4" style="color:#888;padding:10px 12px;font-size:13px">No items</td></tr>';
    return arr.map(i => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #2a2a3a;font-size:13px;color:#e2e2e8">${i.name || '—'}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #2a2a3a;font-size:12px;color:#888;font-family:monospace">${i.sellerRef || '—'}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #2a2a3a;font-size:13px;color:#c9a84c">${fmt(i.sellersAmount, i.sellersCurrency || 'SGD')}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #2a2a3a;font-size:13px;color:#8bba6a">${fmtSGD(i.sgdMargin)}</td>
      </tr>`).join('');
  }

  function section(title, color, arr) {
    return `
    <div style="margin-bottom:24px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
        <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color}"></span>
        <span style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#aaa">${title} <span style="color:${color}">(${arr.length})</span></span>
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#12121e;border-radius:8px;overflow:hidden">
        <thead>
          <tr style="background:#1a1a2e">
            <th style="padding:8px 12px;text-align:left;font-size:11px;color:#666;font-weight:600;letter-spacing:.05em">ITEM</th>
            <th style="padding:8px 12px;text-align:left;font-size:11px;color:#666;font-weight:600;letter-spacing:.05em">REF</th>
            <th style="padding:8px 12px;text-align:left;font-size:11px;color:#666;font-weight:600;letter-spacing:.05em">COST</th>
            <th style="padding:8px 12px;text-align:left;font-size:11px;color:#666;font-weight:600;letter-spacing:.05em">MARGIN</th>
          </tr>
        </thead>
        <tbody>${itemRows(arr)}</tbody>
      </table>
    </div>`;
  }

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0b0b13;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px">
    <div style="text-align:center;margin-bottom:32px">
      <div style="font-size:22px;font-weight:800;letter-spacing:.08em;color:#c9a84c">LEDGR</div>
      <div style="font-size:13px;color:#666;margin-top:4px">Daily Inventory Report · ${date}</div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:28px">
      <div style="background:#12121e;border-radius:8px;padding:16px;text-align:center">
        <div style="font-size:24px;font-weight:700;color:#e2e2e8">${stats?.total || 0}</div>
        <div style="font-size:11px;color:#666;margin-top:4px;letter-spacing:.05em">TOTAL ITEMS</div>
      </div>
      <div style="background:#12121e;border-radius:8px;padding:16px;text-align:center">
        <div style="font-size:24px;font-weight:700;color:#c9a84c">${fmtSGD(stats?.revenue || 0)}</div>
        <div style="font-size:11px;color:#666;margin-top:4px;letter-spacing:.05em">COST BASE</div>
      </div>
      <div style="background:#12121e;border-radius:8px;padding:16px;text-align:center">
        <div style="font-size:24px;font-weight:700;color:#8bba6a">${fmtSGD(stats?.margin || 0)}</div>
        <div style="font-size:11px;color:#666;margin-top:4px;letter-spacing:.05em">SGD MARGIN</div>
      </div>
    </div>

    ${section('Listed', '#c9a84c', listedItems)}
    ${section('Available', '#5fa8d3', availableItems)}
    ${section('Sold', '#8bba6a', soldItems)}

    <div style="text-align:center;margin-top:32px;font-size:11px;color:#444">
      Sent by Ledgr · Report schedule can be changed in Settings
    </div>
  </div>
</body>
</html>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [email],
        subject: `Ledgr Daily Report · ${date}`,
        html,
      }),
    });
    const data = await r.json();
    if (r.ok) return res.status(200).json({ sent: true, id: data.id });
    return res.status(200).json({ sent: false, error: data.message || 'Resend error' });
  } catch (e) {
    return res.status(200).json({ sent: false, error: e.message });
  }
}
