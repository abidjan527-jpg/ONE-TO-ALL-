if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then((reg) => {
      console.log('Service Worker registered');
      setInterval(() => reg.update(), 3600000);
    })
    .catch((err) => console.error('SW registration failed:', err));
}
