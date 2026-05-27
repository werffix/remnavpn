export function formatKopeks(kopeks: number): string {
  return (kopeks / 100).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
}

export function formatBytes(bytes: number): string {
  if (!bytes) return '0 ГБ';
  const gb = bytes / (1024 ** 3);
  if (gb >= 1024) return `${(gb / 1024).toFixed(1)} ТБ`;
  return `${gb.toFixed(1)} ГБ`;
}

export function daysLeft(date: string): number {
  const diff = new Date(date).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

export function isExpired(date: string): boolean {
  return new Date(date).getTime() < Date.now();
}

export function progressPercent(used: number, total: number): number {
  if (!total) return 0;
  return Math.min(100, Math.round((used / total) * 100));
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
