import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  FiMenu,
  FiCalendar,
  FiUsers,
  FiUserCheck,
  FiHome,
  FiLayers,
  FiSettings,
  FiFileText,
  FiUser,
  FiGrid,
  FiLogOut,
} from 'react-icons/fi';

function Navbar({ isOpen, toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <nav className={`${isOpen ? 'w-64' : 'w-16'} bg-blue-800 text-white fixed h-full p-4 transition-all duration-200`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <FiMenu onClick={toggleSidebar} size={20} className="cursor-pointer text-blue-300" />
            {isOpen && <span className="text-2xl font-semibold">Dentoflow</span>}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {user && (
            <nav className="flex flex-col space-y-2">
              <Link
                to="/appointments"
                className={`flex items-center px-2 py-2 rounded transition-colors duration-200 ${pathname === '/appointments' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
              >
                <FiCalendar size={20} className={`transition-colors ${pathname === '/appointments' ? 'text-yellow-300' : 'text-white'}`} />
                {isOpen && <span className="ml-3 text-white">Rendez-vous</span>}
              </Link>
              {['ADMIN', 'INFERMIERE'].includes(user.role) && (
                <>
                  <Link
                    to="/patients"
                    className={`flex items-center px-2 py-2 rounded transition-colors duration-200 ${pathname === '/patients' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
                  >
                    <FiUsers size={20} className={`transition-colors ${pathname === '/patients' ? 'text-yellow-300' : 'text-white'}`} />
                    {isOpen && <span className="ml-3 text-white">Patients</span>}
                  </Link>
                  <Link
                    to="/doctors"
                    className={`flex items-center px-2 py-2 rounded transition-colors duration-200 ${pathname === '/doctors' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
                  >
                    <FiUserCheck size={20} className={`transition-colors ${pathname === '/doctors' ? 'text-yellow-300' : 'text-white'}`} />
                    {isOpen && <span className="ml-3 text-white">Médecins</span>}
                  </Link>
                  <Link
                    to="/rooms"
                    className={`flex items-center px-2 py-2 rounded transition-colors duration-200 ${pathname === '/rooms' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
                  >
                    <FiHome size={20} className={`transition-colors ${pathname === '/rooms' ? 'text-yellow-300' : 'text-white'}`} />
                    {isOpen && <span className="ml-3 text-white">Salles</span>}
                  </Link>
                  <Link
                    to="/room-types"
                    className={`flex items-center px-2 py-2 rounded transition-colors duration-200 ${pathname === '/room-types' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
                  >
                    <FiLayers size={20} className={`transition-colors ${pathname === '/room-types' ? 'text-yellow-300' : 'text-white'}`} />
                    {isOpen && <span className="ml-3 text-white">Types de salles</span>}
                  </Link>
                  <Link
                    to="/specialties"
                    className={`flex items-center px-2 py-2 rounded transition-colors duration-200 ${pathname === '/specialties' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
                  >
                    <FiSettings size={20} className={`transition-colors ${pathname === '/specialties' ? 'text-yellow-300' : 'text-white'}`} />
                    {isOpen && <span className="ml-3 text-white">Spécialités</span>}
                  </Link>
                  <Link
                    to="/invoices"
                    className={`flex items-center px-2 py-2 rounded transition-colors duration-200 ${pathname === '/invoices' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
                  >
                    <FiFileText size={20} className={`transition-colors ${pathname === '/invoices' ? 'text-yellow-300' : 'text-white'}`} />
                    {isOpen && <span className="ml-3 text-white">Factures</span>}
                  </Link>
                </>
              )}
              {user.role === 'ADMIN' && (
                <>
                  <Link
                    to="/accounts"
                    className={`flex items-center px-2 py-2 rounded transition-colors duration-200 ${pathname === '/accounts' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
                  >
                    <FiUser size={20} className={`transition-colors ${pathname === '/accounts' ? 'text-yellow-300' : 'text-white'}`} />
                    {isOpen && <span className="ml-3 text-white">Comptes</span>}
                  </Link>
                  <Link
                    to="/dashboard"
                    className={`flex items-center px-2 py-2 rounded transition-colors duration-200 ${pathname === '/dashboard' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
                  >
                    <FiGrid size={20} className={`transition-colors ${pathname === '/dashboard' ? 'text-yellow-300' : 'text-white'}`} />
                    {isOpen && <span className="ml-3 text-white">Tableau de bord</span>}
                  </Link>
                </>
              )}
            </nav>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center px-2 py-2 rounded transition-colors duration-200 hover:bg-red-600"
        >
          <FiLogOut size={20} className="text-white" />
          {isOpen && <span className="ml-3 text-white">Déconnexion</span>}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;