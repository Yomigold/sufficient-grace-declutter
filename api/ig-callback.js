const APP_SECRET   = process.env.IG_APP_SECRET;
const REDIRECT_URI = process.env.IG_REDIRECT_URI;

module.exports = async function handler(req, res) {
  const { code, error, error_description } = req.query;

  if (error) {
    const msg = encodeURIComponent(error_description || error || 'access_denied');
    return res.redirect(`/settings.html#ig_error=${msg}`);
  }
  if (!code) {
    return res.redirect('/settings.html#ig_error=missing_code');
  }

  const APP_ID = process.env.IG_APP_ID;
  if (!APP_ID || !APP_SECRET || !REDIRECT_URI) {
    return res.redirect('/settings.html#ig_error=not_configured');
  }

  try {
    // Exchange code for short-lived token
    const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id:     APP_ID,
        client_secret: APP_SECRET,
        grant_type:    'authorization_code',
        redirect_uri:  REDIRECT_URI,
        code,
      }).toString(),
    });
    const tokenData = await tokenRes.json();

    if (tokenData.error_type || tokenData.error) {
      const msg = encodeURIComponent(tokenData.error_message || tokenData.error_description || 'auth_failed');
      return res.redirect(`/settings.html#ig_error=${msg}`);
    }

    const shortToken = tokenData.access_token;
    const userId     = String(tokenData.user_id);

    // Exchange for long-lived token (~60 days)
    const longRes  = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${APP_SECRET}&access_token=${shortToken}`
    );
    const longData = await longRes.json();

    if (longData.error) {
      const msg = encodeURIComponent(longData.error.message || 'token_exchange_failed');
      return res.redirect(`/settings.html#ig_error=${msg}`);
    }

    const longToken = longData.access_token;
    const expiresAt = Date.now() + (longData.expires_in || 5184000) * 1000;

    // Get username
    let username = '';
    try {
      const profileRes = await fetch(
        `https://graph.instagram.com/me?fields=id,username&access_token=${longToken}`
      );
      const profile = await profileRes.json();
      username = profile.username || '';
    } catch {}

    // Return token to client via hash fragment (not sent to server)
    const hash = new URLSearchParams({
      ig_token:    longToken,
      ig_user_id:  userId,
      ig_username: username,
      ig_expires:  String(expiresAt),
    });
    res.redirect(`/settings.html#${hash.toString()}`);
  } catch {
    res.redirect('/settings.html#ig_error=connection_failed');
  }
};
