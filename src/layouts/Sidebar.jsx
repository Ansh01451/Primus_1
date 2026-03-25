import React from 'react';
import { NavLink } from 'react-router-dom';
import { clientMenuConfig } from './menuConfig';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_type');
    localStorage.removeItem('vendor_type');
    localStorage.removeItem('vendor_name');
    navigate('/login');
  };

  return (
    <aside className="w-20 bg-white border-r border-slate-100 flex flex-col items-center py-6 h-screen sticky top-0">
      <div className="mb-10">
        <div className="w-10 h-10 border-2 border-primary border-double flex items-center justify-center font-bold text-primary text-xl">
          P
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-6">
        {clientMenuConfig.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
            >
              {({ isActive }) => (
                <div
                  className={cn(
                    "p-3 rounded-xl transition-all duration-200 group relative cursor-pointer",
                    isActive
                      ? "bg-primary/5 text-primary"
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />

                  {/* Tooltip */}
                  <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
                    {item.title}
                  </div>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="p-3 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 group relative cursor-pointer"
        >
          <LogOut size={24} />
          {/* Tooltip */}
          <div className="absolute left-full ml-4 px-2 py-1 bg-red-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
            Logout
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
