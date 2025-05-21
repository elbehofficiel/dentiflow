import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function ProtectedRoute({ element }) {
  const { user } = useAuth();
  return user ? element : <Navigate to="/auth" replace />;
}

export default ProtectedRoute;