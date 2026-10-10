import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

const CONFIG = {
  processing: { style: 'bg-amber-500/15 text-amber-300 border-amber-500/40', Icon: Loader2, spin: true },
  ready: { style: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40', Icon: CheckCircle2 },
  failed: { style: 'bg-red-500/15 text-red-300 border-red-500/40', Icon: XCircle },
};

export default function StatusBadge({ status }) {
  const { style, Icon, spin } = CONFIG[status] ?? CONFIG.failed;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${style}`}>
      <Icon className={`h-3 w-3 ${spin ? 'animate-spin' : ''}`} />
      {status}
    </span>
  );
}