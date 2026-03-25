import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { menuConfigByRole } from './menuConfig';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import primusLogo from '../assets/primus_logo.png';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Sidebar = () => {
  const location = useLocation();

  // Derive role from URL — /vendor/* → vendor, anything else → client
  const role = location.pathname.startsWith('/vendor') ? 'vendor' : 'client';
  const menuConfig = menuConfigByRole[role] ?? menuConfigByRole.client;

  return (
    <aside className="w-20 bg-transparent flex flex-col items-center py-6 h-screen sticky top-0">
      <div className="mb-10">
        <img src={primusLogo} alt="Primus" className="w-12 h-12 object-contain" />
      </div>

      <nav className="flex-1 flex flex-col gap-6">
        {menuConfig.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.path} to={item.path}>
              {({ isActive }) => (
                <div
                  className={cn(
                    'p-3 rounded-xl transition-all duration-200 group relative cursor-pointer',
                    isActive
                      ? 'bg-primary/5 text-primary'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
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
    </aside>
  );
};

export default Sidebar;

