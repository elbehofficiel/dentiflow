import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function AccountManagement() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChangePassword = () => {
    setError('')
    setIsLoading(true)

    setTimeout(() => {
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        setError('Veuillez remplir tous les champs.')
      } else if (newPassword !== confirmNewPassword) {
        setError('Les nouveaux mots de passe ne correspondent pas.')
      } else if (newPassword.length < 6) {
        setError('Le nouveau mot de passe doit contenir au moins 6 caractères.')
      } else {
        alert('Mot de passe changé avec succès ! (Simulation)')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmNewPassword('')
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.')) {
      logout()
      alert('Compte supprimé avec succès ! (Simulation)')
      navigate('/auth')
    }
  }

  return (
    <div className="py-16 bg-gray-100">
      <div className="container mx-auto max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-8">Mon Compte</h2>
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-4">Informations du compte</h3>
          <div className="mb-6">
            <p className="text-gray-600"><strong>Email :</strong> {user?.email || 'Non défini'}</p>
            <p className="text-gray-600"><strong>Nom d'utilisateur :</strong> {user?.username || 'Non défini'}</p>
            <p className="text-gray-600"><strong>Date d'inscription :</strong> {user?.createdAt || 'Non défini'}</p>
          </div>
          <h3 className="text-xl font-semibold mb-4">Changer le mot de passe</h3>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="currentPassword">Mot de passe actuel</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="********"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="newPassword">Nouveau mot de passe</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="********"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="confirmNewPassword">Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="********"
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center mb-4">{error}</div>
          )}
          <button
            onClick={handleChangePassword}
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading && (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
              </svg>
            )}
            {isLoading ? 'Changement...' : 'Changer le mot de passe'}
          </button>
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4 text-red-600">Zone de danger</h3>
            <button
              onClick={handleDeleteAccount}
              className="w-full bg-red-600 text-white p-3 rounded-lg font-medium hover:bg-red-700 transition"
            >
              Supprimer mon compte
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountManagement