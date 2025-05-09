import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  return (
    <nav className="bg-blue-600 text-white p-4 sticky top-0 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dentiflow</h1>
        <div className="flex space-x-4">
          <Link to="/rooms" className="hover:text-blue-200">
            Gestion des Salles
          </Link>
          <Link to="/account" className="hover:text-blue-200">
            Mon Compte
          </Link>
          <button onClick={handleLogout} className="hover:text-blue-200">
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar