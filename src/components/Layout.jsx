import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Header from './Header.jsx';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-background font-sans">
      <Navbar />
      <main className="flex-grow ml-64 p-8 bg-base-200"> 
        <div className="max-w-6xl mx-auto">
          <Header />
          <div className="space-y-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
