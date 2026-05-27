export function loadTelegramScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src*="telegram-login.js"]')) return resolve();
    const s = document.createElement('script');
    s.src = 'https://oauth.telegram.org/js/telegram-login.js?3';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load Telegram SDK'));
    document.head.appendChild(s);
  });
}
