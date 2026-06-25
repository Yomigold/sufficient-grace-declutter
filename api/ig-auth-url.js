module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const appId       = process.env.IG_APP_ID;
  const redirectUri = process.env.IG_REDIRECT_URI;
  if (!appId || !redirectUri) {
    return res.status(200).json({ configured: false });
  }
  const url = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=instagram_basic%2Cinstagram_manage_insights&response_type=code`;
  res.status(200).json({ configured: true, url });
};
