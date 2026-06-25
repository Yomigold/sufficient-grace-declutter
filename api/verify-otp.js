const crypto = require('crypto');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const secret = process.env.OTP_SECRET;
  if (!secret) return res.status(200).json({ valid: false, error: 'Not configured' });

  const { token, code } = req.body || {};
  if (!token || !code) return res.status(400).json({ valid: false, error: 'Missing fields' });

  let payload;
  try {
    payload = JSON.parse(Buffer.from(token, 'base64').toString());
  } catch {
    return res.status(200).json({ valid: false, error: 'Invalid token' });
  }

  if (!payload.expires || !payload.hash) {
    return res.status(200).json({ valid: false, error: 'Invalid token' });
  }

  if (Date.now() > payload.expires) {
    return res.status(200).json({ valid: false, error: 'Code expired' });
  }

  const expected = crypto.createHmac('sha256', secret).update(`${code}:${payload.expires}`).digest('hex');

  let valid = false;
  try {
    valid = crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(payload.hash, 'hex'));
  } catch {
    valid = false;
  }

  return res.status(200).json({ valid });
};
