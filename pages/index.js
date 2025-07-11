async function subscribeUser() {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('Push messaging is not supported.');
      return;
    }

    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('✅ Service Worker registered', registration);

    const permission = await Notification.requestPermission();
    console.log('🔐 Notification permission:', permission);
    if (permission !== 'granted') {
      alert('Permission denied for notifications');
      return;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array('BCg2eRfEBXzSxqO6h9mKd1QaDBHuThd_JTxzEoMwrF3mLSV2xctyKATPQdImbWqHNSz6ywhCZhxHYyBC0AaeMq0')
    });

    console.log('📦 Push Subscription:', subscription);

    await fetch('/api/save-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    });

    alert('✅ Subscribed successfully!');
  } catch (err) {
    console.error('❌ Subscription failed:', err);
    alert('❌ Subscription failed: ' + err.message);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}
