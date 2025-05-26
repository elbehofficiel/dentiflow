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
  FiUser,
  FiGrid,
  FiLogOut,
} from 'react-icons/fi';

// Static sidebar
function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <nav className="w-64 bg-blue-800 text-white fixed top-0 left-0 h-full p-4">
      <div className="flex flex-col h-full">
        <div className="mb-8">
          <span className="text-2xl font-semibold text-white">Dentoflow</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {user && (
            <nav className="flex flex-col space-y-2">
              <Link
                to="/appointments"
                className={`flex items-center px-2 py-2 rounded ${pathname === '/appointments' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
              >
                <FiCalendar size={20} className={`transition-colors ${pathname === '/appointments' ? 'text-yellow-300' : 'text-white'}`} />
                <span className="ml-3 text-white">Rendez-vous</span>
              </Link>
              {/* Dashboard at top */}
              {user.role === 'ADMIN' && (
                <Link
                  to="/dashboard"
                  className={`flex items-center px-2 py-2 rounded ${pathname === '/dashboard' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
                >
                  <FiGrid size={20} className={`transition-colors ${pathname === '/dashboard' ? 'text-yellow-300' : 'text-white'}`} />
                  <span className="ml-3 text-white">Tableau de bord</span>
                </Link>
              )}
              {['ADMIN', 'INFERMIERE'].includes(user.role) && (
                <>
                  <Link
                    to="/patients"
                    className={`flex items-center px-2 py-2 rounded ${pathname === '/patients' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
                  >
                    <FiUsers size={20} className={`transition-colors ${pathname === '/patients' ? 'text-yellow-300' : 'text-white'}`} />
                    <span className="ml-3 text-white">Patients</span>
                  </Link>
                  <Link
                    to="/doctors"
                    className={`flex items-center px-2 py-2 rounded ${pathname === '/doctors' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
                  >
                    <FiUserCheck size={20} className={`transition-colors ${pathname === '/doctors' ? 'text-yellow-300' : 'text-white'}`} />
                    <span className="ml-3 text-white">Médecins</span>
                  </Link>
                  <Link
                    to="/rooms"
                    className={`flex items-center px-2 py-2 rounded ${pathname === '/rooms' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
                  >
                    <FiHome size={20} className={`transition-colors ${pathname === '/rooms' ? 'text-yellow-300' : 'text-white'}`} />
                    <span className="ml-3 text-white">Salles</span>
                  </Link>
                  <Link
                    to="/specialties"
                    className={`flex items-center px-2 py-2 rounded ${pathname === '/specialties' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
                  >
                    <FiSettings size={20} className={`transition-colors ${pathname === '/specialties' ? 'text-yellow-300' : 'text-white'}`} />
                    <span className="ml-3 text-white">Spécialités</span>
                  </Link>
                  <Link
                    to="/invoices"
                    className={`flex items-center px-2 py-2 rounded ${pathname === '/invoices' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
                  >
                    <FiFileText size={20} className={`transition-colors ${pathname === '/invoices' ? 'text-yellow-300' : 'text-white'}`} />
                    <span className="ml-3 text-white">Factures</span>
                  </Link>
                </>
              )}
              {user.role === 'ADMIN' && (
                <>
                  <Link
                    to="/accounts"
                    className={`flex items-center px-2 py-2 rounded ${pathname === '/accounts' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
                  >
                    <FiUser size={20} className={`transition-colors ${pathname === '/accounts' ? 'text-yellow-300' : 'text-white'}`} />
                    <span className="ml-3 text-white">Comptes</span>
                  </Link>
                </>
              )}
            </nav>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center px-2 py-2 rounded bg-red-600 hover:bg-red-700"
        >
          <FiLogOut size={20} className="text-white" />
          <span className="ml-3 text-white">Déconnexion</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;