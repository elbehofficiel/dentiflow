import { useState } from 'react'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import ForgotPasswordForm from '../components/ForgotPasswordForm'

function AuthPage() {
  const [view, setView] = useState('login')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      {view === 'login' && <LoginForm setView={setView} />}
      {view === 'register' && <RegisterForm setView={setView} />}
      {view === 'forgot' && <ForgotPasswordForm setView={setView} />}
    </div>
  )
}

export default AuthPage