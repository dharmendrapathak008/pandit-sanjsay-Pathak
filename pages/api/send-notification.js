export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { title, body, url } = req.body;

  if (!title || !body || !url) {
    return res.status(400).json({ error: 'Missing title, body, or url' });
  }

  // Here you can send the notification using a service or store in DB
  // For now, we just log and return success
  console.log('Received Notification:', { title, body, url });

  res.status(200).json({
    success: true,
    message: 'Notification received successfully',
    data: { title, body, url },
  });
}
