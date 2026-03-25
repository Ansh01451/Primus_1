import React from 'react';
import { CheckCircle2, Clock, Circle } from 'lucide-react';
import { cn, formatDate, formatCurrency } from '../../../../utils/utils';

export const PhaseCard = ({ phase }) => {
  const statusConfig = {
    completed: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: CheckCircle2 },
    ongoing:   { bg: 'bg-amber-50',   text: 'text-amber-600',   icon: Clock },
    pending:   { bg: 'bg-slate-50',   text: 'text-slate-400',   icon: Circle },
  };
  const c = statusConfig[phase.status] || statusConfig.pending;
  const Icon = c.icon;

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-[inset_0px_1px_2px_#00000008]">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-bold text-slate-700 line-clamp-2 flex-1 mr-2">{phase.phaseName}</h4>
        <span className={cn('text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0', c.bg, c.text)}>
          <Icon size={10} />
          {phase.status}
        </span>
      </div>
      <div className="space-y-1.5 text-[11px] text-slate-400">
        <div className="flex justify-between">
          <span>Start</span>
          <span className="font-medium text-slate-600">{formatDate(phase.startDate)}</span>
        </div>
        <div className="flex justify-between">
          <span>End</span>
          <span className="font-medium text-slate-600">{formatDate(phase.endDate)}</span>
        </div>
        <div className="flex justify-between">
          <span>Billed Amount</span>
          <span className="font-medium text-slate-600">{formatCurrency(phase.actualBillingAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span>Remaining</span>
          <span className="font-medium text-amber-500">{formatCurrency(phase.remainingAmount)}</span>
        </div>
      </div>
    </div>
  );
};
