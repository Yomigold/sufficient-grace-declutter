module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ sent: false, error: 'Method not allowed' });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return res.status(200).json({ sent: false, error: 'Email not configured' });

  const { type, email, identifier } = req.body || {};
  if (!email || !type) return res.status(400).json({ sent: false, error: 'Missing email or type' });

  const from = process.env.FROM_EMAIL || 'Ledgr <onboarding@resend.dev>';
  const now  = new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short', timeZone: 'UTC' }) + ' UTC';

  let subject, html;

  if (type === 'register') {
    subject = 'Welcome to Ledgr';
    html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0b0b13;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<div style="max-width:520px;margin:0 auto;padding:40px 20px">
  <div style="text-align:center;margin-bottom:32px">
    <div style="font-size:24px;font-weight:800;letter-spacing:.1em;color:#c9a84c">LEDGR</div>
    <div style="font-size:12px;color:#555;margin-top:4px;letter-spacing:.06em;text-transform:uppercase">Inventory Management</div>
  </div>
  <div style="background:#111120;border:1px solid #232338;border-radius:12px;padding:28px">
    <h1 style="font-size:18px;font-weight:700;color:#e2e2f0;margin:0 0 8px">Welcome to Ledgr!</h1>
    <p style="font-size:14px;color:#8888b0;line-height:1.6;margin:0 0 20px">Your account <strong style="color:#e2e2f0">${identifier}</strong> has been created. You can now start tracking your inventory.</p>
    <div style="background:#0b0b13;border-radius:8px;padding:14px 16px;font-size:13px;color:#8888b0">
      <div style="margin-bottom:6px"><span style="color:#555">Account created:</span> <span style="color:#e2e2f0">${now}</span></div>
      <div><span style="color:#555">Username:</span> <span style="color:#c9a84c;font-family:monospace">${identifier}</span></div>
    </div>
    <p style="font-size:12px;color:#40405a;margin:20px 0 0;line-height:1.6">If you did not create this account, you can safely ignore this email. This notification was sent because this email address was registered on Ledgr.</p>
  </div>
  <div style="text-align:center;margin-top:24px;font-size:11px;color:#333">Ledgr · Inventory Management</div>
</div>
</body></html>`;
  } else if (type === 'login') {
    subject = 'New sign-in to your Ledgr account';
    html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0b0b13;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<div style="max-width:520px;margin:0 auto;padding:40px 20px">
  <div style="text-align:center;margin-bottom:32px">
    <div style="font-size:24px;font-weight:800;letter-spacing:.1em;color:#c9a84c">LEDGR</div>
    <div style="font-size:12px;color:#555;margin-top:4px;letter-spacing:.06em;text-transform:uppercase">Inventory Management</div>
  </div>
  <div style="background:#111120;border:1px solid #232338;border-radius:12px;padding:28px">
    <h1 style="font-size:18px;font-weight:700;color:#e2e2f0;margin:0 0 8px">New sign-in detected</h1>
    <p style="font-size:14px;color:#8888b0;line-height:1.6;margin:0 0 20px">Someone signed in to your Ledgr account. If this was you, no action is needed.</p>
    <div style="background:#0b0b13;border-radius:8px;padding:14px 16px;font-size:13px;color:#8888b0">
      <div style="margin-bottom:6px"><span style="color:#555">Time:</span> <span style="color:#e2e2f0">${now}</span></div>
      <div><span style="color:#555">Account:</span> <span style="color:#c9a84c;font-family:monospace">${identifier}</span></div>
    </div>
    <p style="font-size:12px;color:#40405a;margin:20px 0 0;line-height:1.6">If you did not sign in, your password may be compromised. Consider changing it immediately from the Ledgr login page.</p>
  </div>
  <div style="text-align:center;margin-top:24px;font-size:11px;color:#333">Ledgr · Inventory Management</div>
</div>
</body></html>`;
  } else {
    return res.status(400).json({ sent: false, error: 'Unknown notification type' });
  }

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [email], subject, html }),
    });
    const data = await r.json();
    if (r.ok) return res.status(200).json({ sent: true, id: data.id });
    return res.status(200).json({ sent: false, error: data.message || 'Resend error' });
  } catch (e) {
    return res.status(200).json({ sent: false, error: e.message });
  }
};
