import fs from 'fs';
const file = 'subscriptions.json';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const subscription = req.body;
    const subscriptions = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
    subscriptions.push(subscription);
    fs.writeFileSync(file, JSON.stringify(subscriptions, null, 2));
    res.status(200).json({ message: 'Subscription saved' });
  } else {
    res.status(405).end();
  }
}
