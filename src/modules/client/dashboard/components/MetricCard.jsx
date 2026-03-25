import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn, formatDate, formatCurrency } from '../../../../utils/utils';

export const MetricCard = ({ title, value, subtitle, status, statusType, badges, actionLabel }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-100 card-shadow relative min-h-[120px] flex flex-col justify-between">
    {actionLabel && (
      <button className="absolute top-4 right-4 text-[9px] font-bold border border-slate-200 px-2 py-0.5 rounded flex items-center gap-1 text-slate-600">
        {actionLabel} <ChevronRight size={10} />
      </button>
    )}
    <div>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{title}</span>
        {status && (
          <span className={cn(
            "text-[9px] font-bold px-1.5 py-0.5 rounded",
            statusType === 'success' ? "bg-emerald-50 text-emerald-600" :
            statusType === 'danger' ? "bg-red-50 text-red-600" :
            "bg-amber-50 text-amber-600"
          )}>
            {statusType === 'warning' ? "⏰ " : statusType === 'success' ? "↑ " : "⚠ "}{status}
          </span>
        )}
        {badges && (
          <span className="flex gap-1">
            {badges.map((b, i) => (
              <span key={i} className={cn(
                "text-[9px] font-bold px-1.5 py-0.5 rounded",
                b.includes('Critical') ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
              )}>{b}</span>
            ))}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-800 truncate">{value}</div>
    </div>
    <div className="text-[10px] text-slate-400 font-sans mt-2 truncate">{subtitle}</div>
  </div>
);
