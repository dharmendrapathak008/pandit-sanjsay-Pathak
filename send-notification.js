import fs from 'fs';
import webpush from 'web-push';

const vapidKeys = {
  publicKey: 'BCg2eRfEBXzSxqO6h9mKd1QaDBHuThd_JTxzEoMwrF3mLSV2xctyKATPQdImbWqHNSz6ywhCZhxHYyBC0AaeMq0',
  privateKey: 'FxLdPWTdvTk5vCBpbyu1pjqnlp6wppc4ahW9j17hd8s'
};

webpush.setVapidDetails('mailto:your@email.com', vapidKeys.publicKey, vapidKeys.privateKey);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // This allows browser to visit the link without breaking
    return res.status(200).send('✅ Push Notification API is active. Use POST to send notifications.');
  }

  if (req.method === 'POST') {
    const subscriptionsFile = 'subscriptions.json';

    const { title, body, url } = req.body;
    const payload = JSON.stringify({ title, body, url });

    let subscriptions = [];
    if (fs.existsSync(subscriptionsFile)) {
      const data = fs.readFileSync(subscriptionsFile);
      subscriptions = JSON.parse(data);
    }

    for (let sub of subscriptions) {
      try {
        await webpush.sendNotification(sub, payload);
      } catch (err) {
        console.error('Push error:', err);
      }
    }

    return res.status(200).json({ message: 'Push notifications sent.' });
  }

  // For unsupported methods
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
