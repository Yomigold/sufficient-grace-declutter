const crypto = require('crypto');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.RESEND_API_KEY;
  const secret = process.env.OTP_SECRET;
  if (!apiKey || !secret) return res.status(200).json({ sent: false, error: 'Not configured' });

  const { email } = req.body || {};
  if (!email) return res.status(400).json({ sent: false, error: 'Missing email' });

  const code    = String(Math.floor(100000 + Math.random() * 900000));
  const expires = Date.now() + 10 * 60 * 1000;
  const hash    = crypto.createHmac('sha256', secret).update(`${code}:${expires}`).digest('hex');
  const token   = Buffer.from(JSON.stringify({ expires, hash })).toString('base64');

  const from = process.env.FROM_EMAIL || 'Ledgr <onboarding@resend.dev>';
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0b0b13;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<div style="max-width:480px;margin:0 auto;padding:40px 20px">
  <div style="text-align:center;margin-bottom:32px">
    <div style="font-size:24px;font-weight:800;letter-spacing:.1em;color:#c9a84c">LEDGR</div>
    <div style="font-size:12px;color:#555;margin-top:4px;letter-spacing:.06em;text-transform:uppercase">Inventory Management</div>
  </div>
  <div style="background:#111120;border:1px solid #232338;border-radius:12px;padding:32px;text-align:center">
    <h1 style="font-size:18px;font-weight:700;color:#e2e2f0;margin:0 0 8px">Verification code</h1>
    <p style="font-size:14px;color:#8888b0;line-height:1.6;margin:0 0 28px">Enter this code to complete your Ledgr sign-in. It expires in <strong style="color:#e2e2f0">10 minutes</strong>.</p>
    <div style="background:#0b0b13;border:1px solid #232338;border-radius:10px;padding:24px 20px;margin-bottom:24px">
      <div style="font-size:42px;font-weight:800;letter-spacing:.3em;color:#c9a84c;font-family:monospace;padding-left:.3em">${code}</div>
    </div>
    <p style="font-size:12px;color:#40405a;margin:0;line-height:1.6">If you didn&rsquo;t try to sign in to Ledgr, you can safely ignore this email.</p>
  </div>
  <div style="text-align:center;margin-top:24px;font-size:11px;color:#333">Ledgr &middot; Inventory Management</div>
</div>
</body></html>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [email], subject: 'Your Ledgr verification code', html }),
    });
    const data = await r.json();
    if (r.ok) return res.status(200).json({ sent: true, token });
    return res.status(200).json({ sent: false, error: data.message || 'Email error' });
  } catch (e) {
    return res.status(200).json({ sent: false, error: e.message });
  }
};
