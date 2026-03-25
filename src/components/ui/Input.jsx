import React from 'react';

const Input = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">{label}</label>}
      <input
        className={`
          w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm
          placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary
          transition-all duration-200
          ${error ? 'border-red-500' : 'border-slate-200'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500 ml-1">{error}</p>}
    </div>
  );
};

export default Input;
