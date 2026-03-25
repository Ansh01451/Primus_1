import React from 'react';
import { cn } from '../../../../utils/utils';

export const MetricSmall = ({ label, value, color = "text-slate-800" }) => (
  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-50">
    <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">{label}</div>
    <div className={cn("text-xl font-bold flex items-center gap-1", color)}>
      {value}
    </div>
  </div>
);
