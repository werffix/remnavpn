import clsx from 'clsx';
import { type ReactNode } from 'react';
import { X } from 'lucide-react';

export function Modal({ open, onClose, title, children, className }: { open: boolean; onClose: () => void; title?: string; children: ReactNode; className?: string }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={clsx('modal-content', className)} onClick={e => e.stopPropagation()}>
        {title && <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold">{title}</h2><button onClick={onClose} className="text-dark-400 hover:text-white"><X size={18} /></button></div>}
        {children}
      </div>
    </div>
  );
}

export function ProgressBar({ value, max = 100, className }: { value: number; max?: number; className?: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const color = pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-yellow-500' : 'bg-accent-500';
  return (
    <div className={clsx('w-full bg-dark-600 rounded-full h-2 overflow-hidden', className)}>
      <div className={clsx('h-full rounded-full transition-all duration-500', color)} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      {subtitle && <p className="text-dark-400 mt-1">{subtitle}</p>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('skeleton', className)} />;
}

export function EmptyState({ icon: Icon, title, description }: { icon?: React.ComponentType<{ className?: string }>; title: string; description?: string }) {
  return (
    <div className="text-center py-12">
      {Icon && <Icon className="mx-auto h-12 w-12 text-dark-400 mb-4" />}
      <p className="text-lg font-medium text-dark-200">{title}</p>
      {description && <p className="text-dark-400 mt-1">{description}</p>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE: 'badge-green', TRIAL: 'badge-blue', EXPIRED: 'badge-red',
    DISABLED: 'badge-gray', LIMITED: 'badge-yellow', PENDING: 'badge-yellow',
    OPEN: 'badge-green', ANSWERED: 'badge-blue', CLOSED: 'badge-gray',
  };
  return <span className={map[status] || 'badge-gray'}>{status}</span>;
}
