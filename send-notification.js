import fs from 'fs';
import webpush from 'web-push';

const vapidKeys = {
  publicKey: 'BCg2eRfEBXzSxqO6h9mKd1QaDBHuThd_JTxzEoMwrF3mLSV2xctyKATPQdImbWqHNSz6ywhCZhxHYyBC0AaeMq0',
  privateKey: 'FxLdPWTdvTk5vCBpbyu1pjqnlp6wppc4ahW9j17hd8s'
};

webpush.setVapidDetails('mailto:your@email.com', vapidKeys.publicKey, vapidKeys.privateKey);

export default async function handler(req, res) {
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

  res.status(200).json({ message: 'Push sent' });
}
