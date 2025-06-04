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
import DocumentsPage from './pages/DocumentsPage.jsx';
import PaymentsPage from './pages/PaymentsPage.jsx';
import TreatmentsPage from './pages/TreatmentsPage.jsx';
import TreatmentRecordsPage from './pages/TreatmentRecordsPage.jsx';
import PatientTreatmentsPage from './pages/PatientTreatmentsPage.jsx';

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
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/treatments" element={<TreatmentsPage />} />
          <Route path="/appointments/:appointmentId/records" element={<TreatmentRecordsPage />} />
          <Route path="/patients/:patientId/soins" element={<PatientTreatmentsPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/" element={<Navigate to={user ? "/appointments" : "/auth"} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;