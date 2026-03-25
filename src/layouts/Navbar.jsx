import React, { useState, useEffect } from 'react';
import { Search, Settings, Bell } from 'lucide-react';
import { useGetMeQuery } from '../services/apiSlice';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { data: user, isLoading } = useGetMeQuery(undefined, {
    skip: !localStorage.getItem('token'),
  });

  const storedEmail = localStorage.getItem('user_email');
  const storedName = localStorage.getItem('user_name');

  // Extract name (prioritize backend display_name)
  const userName = user?.display_name || (isLoading ? (storedName || 'Loading...') : (storedName || storedEmail || 'Guest'));

  useEffect(() => {
    const mainContent = document.getElementById('main-scroll-area');
    if (!mainContent) return;

    const handleScroll = () => {
      setScrolled(mainContent.scrollTop > 10);
    };

    mainContent.addEventListener('scroll', handleScroll);
    return () => mainContent.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`h-16 flex items-center justify-end px-8 gap-6 sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-sm border-b border-slate-100'
          : 'bg-background'
      }`}
    >
      <div className="mr-auto">
        <h2 className="text-xl font-serif text-slate-800">
          Welcome, <span className="font-bold text-primary">{userName}</span>
        </h2>
      </div>

      <div className="relative w-64">
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-white border border-slate-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20"
        />
        <Search className="absolute right-3 top-2.5 text-slate-400" size={16} />
      </div>

      <div className="flex items-center gap-4">
        <button className="text-slate-500 hover:bg-slate-100 p-2 rounded-lg transition-colors">
          <Settings size={20} />
        </button>
        <div className="bg-slate-100 text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-200 select-none">
          EN
        </div>
        <button className="relative text-slate-500 hover:bg-slate-100 p-2 rounded-lg transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="relative group">
          <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-all p-0.5 bg-white shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User profile"
              className="w-full h-full object-cover rounded-full"
            />
          </button>
          
          <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
            <div className="p-4 border-b border-slate-50 bg-slate-50/50">
              <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
              <p className="text-[10px] text-slate-400 capitalize">{user?.type || 'User'}</p>
            </div>
            <div className="p-1">
              <button className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-primary/5 hover:text-primary transition-all flex items-center gap-2">
                <Settings size={14} /> My Profile
              </button>
              <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-all flex items-center gap-2"
              >
                <Bell size={14} className="rotate-180" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
