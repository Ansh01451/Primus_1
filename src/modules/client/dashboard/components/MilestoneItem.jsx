import React from 'react';

export const MilestoneItem = ({ label, date, days }) => (
  <div className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0 group hover:bg-slate-50 px-2 rounded-lg transition-colors">
    <div>
      <div className="text-xs font-bold text-slate-700">{label}</div>
      <div className="text-[10px] text-slate-400 mt-0.5">{date}</div>
    </div>
    {days && (
      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#FDE8E8] text-primary whitespace-nowrap">
        {days}
      </span>
    )}
  </div>
);
