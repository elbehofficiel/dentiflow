import { useState } from 'react'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import ForgotPasswordForm from '../components/ForgotPasswordForm'
import bgAuth from '../assets/bgAuth.jpg';

function AuthPage() {
  const [view, setView] = useState('login')

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{ backgroundImage: `url(${bgAuth})` }}
    >
      {view === 'login' && <LoginForm setView={setView} />}
      {view === 'register' && <RegisterForm setView={setView} />}
      {view === 'forgot' && <ForgotPasswordForm setView={setView} />}
    </div>
  )
}

export default AuthPage