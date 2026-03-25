import React from 'react';

const Table = ({ headers, data, renderRow }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            {headers.map((header, i) => (
              <th key={i} className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((item, i) => renderRow ? renderRow(item, i) : (
            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
              {Object.values(item).map((val, j) => (
                <td key={j} className="px-6 py-4 text-sm text-slate-600">
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
