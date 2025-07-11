import Head from 'next/head';

export default function Home() {
  async function subscribeUser() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('Push messaging is not supported.');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Permission denied.');
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BCg2eRfEBXzSxqO6h9mKd1QaDBHuThd_JTxzEoMwrF3mLSV2xctyKATPQdImbWqHNSz6ywhCZhxHYyBC0AaeMq0'
      });

      await fetch('/api/save-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });

      alert('Successfully subscribed to push notifications!');
    } catch (err) {
      console.error('Subscription failed:', err);
      alert('Subscription failed. See console.');
    }
  }

  return (
    <>
      <Head>
        <title>MWA Push Notification PWA</title>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#d32f2f" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </Head>
      <main>
        <h1>Welcome to Mumbai Website Agency</h1>
        <p>This PWA supports push notifications. Click the button below to subscribe.</p>
        <button onClick={subscribeUser}>Subscribe to Notifications</button>
      </main>
    </>
  );
}
