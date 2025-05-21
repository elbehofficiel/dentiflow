import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Header from './Header.jsx';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(open => !open);

  return (
    <div className="flex min-h-screen bg-background font-sans">
      <Navbar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <main className={`flex-grow ${sidebarOpen ? 'ml-64' : 'ml-20'} p-8 bg-white transition-all`}> 
        <div className="max-w-6xl mx-auto">
          <Header toggleSidebar={toggleSidebar} />
          <div className="space-y-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
