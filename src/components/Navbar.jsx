import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  FiCalendar,
  FiUsers,
  FiUserCheck,
  FiHome,
  FiSettings,
  FiFileText,
  FiActivity,
  FiCreditCard,
  FiGrid,
  FiFile,
  FiUser,
  FiBarChart2,
  FiLogOut
} from 'react-icons/fi';

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const handleLogout = () => { logout(); navigate('/auth'); };

  return (
    <nav className="w-64 bg-blue-800 text-white fixed top-0 left-0 h-full p-4 shadow-lg">
      <div className="flex flex-col h-full">
        <div className="mb-8">
          <span className="text-2xl font-semibold">Dentoflow</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col space-y-2">
            <Link to="/dashboard" className={`flex items-center px-2 py-2 rounded ${pathname === '/dashboard' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}>
              <FiBarChart2 size={20} className={`transition-colors ${pathname === '/dashboard' ? 'text-yellow-300' : 'text-white'}`} />
              <span className="ml-3">Tableau de bord</span>
            </Link>
            <Link to="/appointments" className={`flex items-center px-2 py-2 rounded ${pathname === '/appointments' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}>
              <FiCalendar size={20} className={`transition-colors ${pathname === '/appointments' ? 'text-yellow-300' : 'text-white'}`} />
              <span className="ml-3">Rendez-vous</span>
            </Link>
            <Link to="/patients" className={`flex items-center px-2 py-2 rounded ${pathname === '/patients' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}>
              <FiUsers size={20} className={`transition-colors ${pathname === '/patients' ? 'text-yellow-300' : 'text-white'}`} />
              <span className="ml-3">Patients</span>
            </Link>
            <Link to="/invoices" className={`flex items-center px-2 py-2 rounded ${pathname === '/invoices' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}>
              <FiFileText size={20} className={`transition-colors ${pathname === '/invoices' ? 'text-yellow-300' : 'text-white'}`} />
              <span className="ml-3">Factures</span>
            </Link>
            <Link to="/payments" className={`flex items-center px-2 py-2 rounded ${pathname === '/payments' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}>
              <FiCreditCard size={20} className={`transition-colors ${pathname === '/payments' ? 'text-yellow-300' : 'text-white'}`} />
              <span className="ml-3">Paiements</span>
            </Link>
            <Link to="/treatments" className={`flex items-center px-2 py-2 rounded ${pathname === '/treatments' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}>
              <FiActivity size={20} className={`transition-colors ${pathname === '/treatments' ? 'text-yellow-300' : 'text-white'}`} />
              <span className="ml-3">Soins</span>
            </Link>
            <Link to="/doctors" className={`flex items-center px-2 py-2 rounded ${pathname === '/doctors' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}>
              <FiUserCheck size={20} className={`transition-colors ${pathname === '/doctors' ? 'text-yellow-300' : 'text-white'}`} />
              <span className="ml-3">Médecins</span>
            </Link>
            <Link to="/rooms" className={`flex items-center px-2 py-2 rounded ${pathname === '/rooms' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}>
              <FiHome size={20} className={`transition-colors ${pathname === '/rooms' ? 'text-yellow-300' : 'text-white'}`} />
              <span className="ml-3">Salles</span>
            </Link>
            <Link to="/room-types" className={`flex items-center px-2 py-2 rounded ${pathname === '/room-types' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}>
              <FiGrid size={20} className={`transition-colors ${pathname === '/room-types' ? 'text-yellow-300' : 'text-white'}`} />
              <span className="ml-3">Types de salles</span>
            </Link>
            <Link to="/specialties" className={`flex items-center px-2 py-2 rounded ${pathname === '/specialties' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}>
              <FiSettings size={20} className={`transition-colors ${pathname === '/specialties' ? 'text-yellow-300' : 'text-white'}`} />
              <span className="ml-3">Spécialités</span>
            </Link>
            <Link to="/documents" className={`flex items-center px-2 py-2 rounded ${pathname === '/documents' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}>
              <FiFile size={20} className={`transition-colors ${pathname === '/documents' ? 'text-yellow-300' : 'text-white'}`} />
              <span className="ml-3">Documents</span>
            </Link>
            <Link to="/accounts" className={`flex items-center px-2 py-2 rounded ${pathname === '/accounts' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}>
              <FiUser size={20} className={`transition-colors ${pathname === '/accounts' ? 'text-yellow-300' : 'text-white'}`} />
              <span className="ml-3">Comptes</span>
            </Link>
          </nav>
        </div>
        <button onClick={handleLogout} className="mt-4 flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-white">
          <FiLogOut size={20} />
          <span className="ml-2">Déconnexion</span>
        </button>
      </div>
    </nav>
  );
}