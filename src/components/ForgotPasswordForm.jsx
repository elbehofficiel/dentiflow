import { useState } from 'react'

function ForgotPasswordForm({ setView }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleReset = () => {
    setError('')
    setIsLoading(true)

    setTimeout(() => {
      if (!email) {
        setError('Veuillez entrer un email.')
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Veuillez entrer un email valide.')
      } else {
        alert('Un lien de réinitialisation a été envoyé à votre email. (Simulation)')
        setEmail('')
        setView('login')
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full transform transition-all hover:scale-105">
      <div className="flex justify-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Dentiflow</h1>
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Réinitialiser le mot de passe</h2>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="votre@email.com"
        />
      </div>
      {error && (
        <div className="text-red-500 text-sm text-center mb-4">{error}</div>
      )}
      <button
        onClick={handleReset}
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
        {isLoading ? 'Envoi...' : 'Envoyer le lien'}
      </button>
      <p className="text-gray-600 text-sm text-center mt-4">
        Retour à la connexion ?{' '}
        <button onClick={() => setView('login')} className="text-blue-600 hover:underline">Connectez-vous</button>
      </p>
    </div>
  )
}

export default ForgotPasswordForm