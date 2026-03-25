import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '../../../../utils/utils';

export const TimelineStep = ({ label, status, stepIndex }) => (
  <div className="flex items-center gap-2 relative z-10 transition-all">
    {status === 'completed' && (
      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white border-4 border-white shadow-sm shrink-0">
        <CheckCircle2 size={16} />
      </div>
    )}
    {status === 'active' && (
      <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-primary text-primary text-sm font-bold bg-white ring-4 ring-primary/5 shrink-0">
        {stepIndex}
      </div>
    )}
    {status === 'upcoming' && (
      <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-slate-200 text-slate-300 text-sm font-bold bg-white shrink-0">
        {stepIndex}
      </div>
    )}
    <span className={cn(
      "font-bold text-[11px] whitespace-nowrap truncate max-w-[90px]",
      status === 'completed' || status === 'active' ? "text-slate-700" : "text-slate-300"
    )}>
      {label}
    </span>
  </div>
);

export const PhaseTimeline = ({ phases }) => (
  <div className="bg-[#4A100D0D] rounded-xl py-4 px-6 mb-6">
    <div className="flex items-center justify-between overflow-x-auto">
      {phases.map((phase, idx) => (
        <div key={idx} className="flex items-center flex-1">
          <TimelineStep
            label={phase.phaseName}
            status={phase.status === 'completed' ? 'completed' : phase.status === 'ongoing' ? 'active' : 'upcoming'}
            stepIndex={idx + 1}
          />
          {idx !== phases.length - 1 && (
            <div className={cn(
              'flex-1 h-[2px] mx-2',
              phase.status === 'completed' ? 'bg-primary/40' : 'bg-slate-200'
            )} />
          )}
        </div>
      ))}
    </div>
  </div>
);
