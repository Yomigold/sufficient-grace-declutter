// Lists all Facebook Pages and their connected Instagram Business Accounts
// for a given user access token. Used to discover the correct IG_USER_ID.
//
// GET /api/ig-accounts?token=<user_access_token>

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.query.token || process.env.IG_ACCESS_TOKEN;
  if (!token) {
    return res.status(400).json({ error: 'Missing token. Pass ?token=YOUR_ACCESS_TOKEN' });
  }

  try {
    // Step 1: get all Facebook Pages this user manages
    const pagesUrl = `https://graph.facebook.com/v19.0/me/accounts?fields=id,name,instagram_business_account&access_token=${token}`;
    const pagesRes  = await fetch(pagesUrl);
    const pagesData = await pagesRes.json();

    if (pagesData.error) {
      return res.status(200).json({ error: pagesData.error.message, code: pagesData.error.code });
    }

    const pages = pagesData.data || [];

    // Step 2: for each page that has an IG business account, fetch its details
    const accounts = await Promise.all(
      pages.map(async page => {
        const igId = page.instagram_business_account?.id;
        if (!igId) {
          return {
            facebookPageId:   page.id,
            facebookPageName: page.name,
            instagramAccount: null,
          };
        }

        const igUrl  = `https://graph.facebook.com/v19.0/${igId}?fields=id,name,username,profile_picture_url,followers_count&access_token=${token}`;
        const igRes  = await fetch(igUrl);
        const igData = await igRes.json();

        return {
          facebookPageId:   page.id,
          facebookPageName: page.name,
          instagramAccount: igData.error ? { error: igData.error.message } : {
            id:             igData.id,
            name:           igData.name,
            username:       igData.username,
            followers:      igData.followers_count,
            profilePicture: igData.profile_picture_url,
          },
        };
      })
    );

    // Step 3: also check the token owner directly (for personal/creator tokens)
    const meUrl  = `https://graph.facebook.com/v19.0/me?fields=id,name&access_token=${token}`;
    const meRes  = await fetch(meUrl);
    const meData = await meRes.json();

    return res.status(200).json({
      tokenOwner: meData.error ? null : { id: meData.id, name: meData.name },
      pages: accounts,
      hint: accounts.some(a => a.instagramAccount?.id)
        ? 'Use the instagramAccount.id as your IG_USER_ID in Vercel env vars.'
        : 'No Instagram Business Accounts found. Make sure your Instagram is a Business or Creator account linked to a Facebook Page.',
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
