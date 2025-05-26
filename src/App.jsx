import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage.jsx';
import AppointmentsPage from './pages/AppointmentsPage.jsx';
import RoomsPage from './pages/RoomsPage.jsx';
import PatientsPage from './pages/PatientsPage.jsx';
import DoctorsPage from './pages/DoctorsPage.jsx';
import SpecialtiesPage from './pages/SpecialtiesPage.jsx';
import InvoicesPage from './pages/InvoicesPage.jsx';
import AccountsPage from './pages/AccountPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import Layout from './components/Layout.jsx';
import { useAuth } from './context/AuthContext.jsx';
import RoomTypesPage from './pages/RoomTypesPage.jsx';

function App() {
  const { user } = useAuth();

  return (
    <div>
      <Routes>
        <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/appointments" replace />} />
        <Route element={user ? <Layout /> : <Navigate to="/auth" replace />}>
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/room-types" element={<RoomTypesPage />} />
          <Route path="/specialties" element={<SpecialtiesPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/accounts" element={user && user.role==='ADMIN' ? <AccountsPage /> : <Navigate to="/appointments" />} />
          <Route path="/dashboard" element={user && user.role==='ADMIN' ? <DashboardPage /> : <Navigate to="/appointments" />} />
          <Route path="/" element={<Navigate to={user ? "/appointments" : "/auth"} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;