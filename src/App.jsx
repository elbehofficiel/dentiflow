import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage.jsx'
import RoomsPage from './pages/RoomsPage.jsx'
import AccountPage from './pages/AccountPage.jsx'
import { useAuth } from './context/AuthContext.jsx'

function App() {
  const { user } = useAuth()

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/rooms" /> : <Navigate to="/auth" />}
        />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/rooms"
          element={user ? <RoomsPage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/account"
          element={user ? <AccountPage /> : <Navigate to="/auth" />}
        />
      </Routes>
    </Router>
  )
}

export default App