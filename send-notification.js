import fs from 'fs';
import webpush from 'web-push';

const vapidKeys = {
  publicKey: 'BCg2eRfEBXzSxqO6h9mKd1QaDBHuThd_JTxzEoMwrF3mLSV2xctyKATPQdImbWqHNSz6ywhCZhxHYyBC0AaeMq0',
  privateKey: 'FxLdPWTdvTk5vCBpbyu1pjqnlp6wppc4ahW9j17hd8s'
};

webpush.setVapidDetails('mailto:your@email.com', vapidKeys.publicKey, vapidKeys.privateKey);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).send('✅ Push Notification API is ready. Use POST to send messages.');
  }

  if (req.method === 'POST') {
    const subscriptions = fs.existsSync('subscriptions.json') ? JSON.parse(fs.readFileSync('subscriptions.json')) : [];
    const { title, body, url } = req.body;
    const payload = JSON.stringify({ title, body, url });

    for (let sub of subscriptions) {
      try {
        await webpush.sendNotification(sub, payload);
      } catch (e) {
        console.error("Push error:", e);
      }
    }

    return res.status(200).json({ message: 'Push sent' });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
