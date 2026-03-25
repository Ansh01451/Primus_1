import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';


import screensBg from '../assets/screens_bg.png';

const ClientLayout = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div 
      className="flex h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${screensBg})` }}
    >
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Right side: Navbar (sticky) + Scrollable Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky Navbar */}
        <Navbar />

        {/* Scrollable main content area */}
        <main
          id="main-scroll-area"
          className="flex-1 overflow-y-auto p-8"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
