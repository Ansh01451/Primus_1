import React from 'react';
import { cn } from '../../../../utils/utils';

export const StatusBadge = ({ status }) => {
  const s = (status || '').toLowerCase();
  const map = {
    open:      { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500', label: 'Active' },
    completed: { bg: 'bg-blue-50',    text: 'text-blue-600',    dot: 'bg-blue-500',    label: 'Completed' },
    planning:  { bg: 'bg-amber-50',   text: 'text-amber-600',   dot: 'bg-amber-500',   label: 'Planning' },
  };
  const c = map[s] || { bg: 'bg-slate-50', text: 'text-slate-500', dot: 'bg-slate-400', label: status || 'Unknown' };

  return (
    <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5', c.bg, c.text)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', c.dot)} />
      {c.label}
    </span>
  );
};
