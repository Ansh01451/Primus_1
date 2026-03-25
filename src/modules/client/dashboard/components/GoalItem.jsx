import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '../../../../utils/utils';

export const GoalItem = ({ completed, active, label }) => (
  <li className={cn(
    "flex items-center gap-3 text-xs font-medium",
    completed ? "text-emerald-600" : active ? "text-amber-500 italic" : "text-slate-300"
  )}>
    {completed ? (
      <CheckCircle2 size={16} />
    ) : active ? (
      <div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent border-r-transparent animate-spin" />
    ) : (
      <div className="w-4 h-4 rounded-full border-2 border-slate-100" />
    )}
    {label}
  </li>
);
