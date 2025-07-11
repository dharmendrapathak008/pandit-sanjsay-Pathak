import fs from 'fs';
import webpush from 'web-push';

// ✅ Your VAPID keys (public and private)
const VAPID_KEYS = {
  publicKey: 'BCg2eRfEBXzSxqO6h9mKd1QaDBHuThd_JTxzEoMwrF3mLSV2xctyKATPQdImbWqHNSz6ywhCZhxHYyBC0AaeMq0',
  privateKey: 'sXN-MU-0i7o65CrBHwBP26vL_fvuJ9UAp81he1JSMgQ'
};

// ✅ Set VAPID details
webpush.setVapidDetails(
  'mailto:example@mumbaiwebsiteagency.com',
  VAPID_KEYS.publicKey,
  VAPID_KEYS.privateKey
);

// ✅ File where subscriptions are stored
const file = 'subscriptions.json';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { title, body, url } = req.body;

  if (!title || !body || !url) {
    return res.status(400).json({ error: 'Missing title, body, or url' });
  }

  const payload = JSON.stringify({ title, body, url });

  try {
    const subscriptions = fs.existsSync(file)
      ? JSON.parse(fs.readFileSync(file, 'utf-8'))
      : [];

    const results = await Promise.allSettled(
      subscriptions.map((sub) => webpush.sendNotification(sub, payload))
    );

    res.status(200).json({
      success: true,
      message: 'Push notifications attempted',
      results
    });
  } catch (error) {
    console.error('Push Error:', error);
    res.status(500).json({ error: 'Failed to send push notifications', details: error });
  }
}
