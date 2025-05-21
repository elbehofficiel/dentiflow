import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchAppointments, createAppointment, deleteAppointment, fetchPatients, fetchDoctors, fetchRooms } from '../api.js';
import PageContainer from '../components/PageContainer.jsx';

function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ patientId: '', doctorId: '', roomId: '', date: '', time: '', status: 'programmé' });

  useEffect(() => {
    async function loadAll() {
      const [apps, pats, docs, rms] = await Promise.all([
        fetchAppointments(),
        fetchPatients(),
        fetchDoctors(),
        fetchRooms()
      ]);
      setAppointments(apps);
      setPatients(pats);
      setDoctors(docs);
      setRooms(rms);
    }
    loadAll();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!['ADMIN', 'INFERMIERE', 'ASSISTANTE'].includes(user.role)) return;
    const newApp = await createAppointment(form);
    setAppointments((prev) => [...prev, newApp]);
    setForm({ patientId: '', doctorId: '', roomId: '', date: '', time: '', status: 'programmé' });
  };

  const handleDelete = async (id) => {
    if (!['ADMIN', 'INFERMIERE'].includes(user.role)) return;
    await deleteAppointment(id);
    setAppointments((prev) => prev.filter((app) => app.id !== id));
  };

  return (
    <PageContainer title="Rendez-vous">
      {['ADMIN', 'INFERMIERE', 'ASSISTANTE'].includes(user.role) && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <select
            value={form.patientId}
            onChange={(e) => setForm({ ...form, patientId: e.target.value })}
            className="p-2 border rounded"
            required
          >
            <option value="">Sélectionner le patient</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
            ))}
          </select>
          <select
            value={form.doctorId}
            onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
            className="p-2 border rounded"
            required
          >
            <option value="">Sélectionner le médecin</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>
            ))}
          </select>
          <select
            value={form.roomId}
            onChange={(e) => setForm({ ...form, roomId: e.target.value })}
            className="p-2 border rounded"
            required
          >
            <option value="">Sélectionner la salle</option>
            {rooms.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="programmé">Programmé</option>
            <option value="effectué">Effectué</option>
            <option value="annulé">Annulé</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">Ajouter</button>
        </form>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Patient</th>
            <th className="border p-2">Médecin</th>
            <th className="border p-2">Salle</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Heure</th>
            <th className="border p-2">Statut</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((app) => (
            <tr key={app.id}>
              <td className="border p-2">{app.patientId}</td>
              <td className="border p-2">{app.doctorId}</td>
              <td className="border p-2">{app.roomId}</td>
              <td className="border p-2">{app.date}</td>
              <td className="border p-2">{app.time}</td>
              <td className="border p-2">{app.status}</td>
              <td className="border p-2">
                {['ADMIN', 'INFERMIERE'].includes(user.role) && (
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    Supprimer
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageContainer>
  );
}

export default AppointmentsPage;