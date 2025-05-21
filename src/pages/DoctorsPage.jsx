import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchDoctors, createDoctor, deleteDoctor } from '../api.js';
import PageContainer from '../components/PageContainer.jsx';

function DoctorsPage() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', specialtyId: '', age: '', salary: '', sex: '', phone: '', roomId: ''
  });

  useEffect(() => {
    async function load() { const data = await fetchDoctors(); setDoctors(data); }
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!['ADMIN', 'INFERMIERE'].includes(user.role)) return;
    const newDoc = await createDoctor(form);
    setDoctors((prev) => [...prev, newDoc]);
    setForm({ firstName: '', lastName: '', email: '', specialtyId: '', age: '', salary: '', sex: '', phone: '', roomId: '' });
  };

  const handleDelete = async (id) => {
    if (!['ADMIN', 'INFERMIERE'].includes(user.role)) return;
    await deleteDoctor(id);
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <PageContainer title="Médecins">
      {['ADMIN', 'INFERMIERE'].includes(user.role) && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <input placeholder="Prénom" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="p-2 border rounded" required />
          <input placeholder="Nom" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="p-2 border rounded" required />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="p-2 border rounded" required />
          <input type="number" placeholder="ID Spécialité" value={form.specialtyId} onChange={(e) => setForm({ ...form, specialtyId: e.target.value })} className="p-2 border rounded" required />
          <input type="number" placeholder="Âge" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="p-2 border rounded" required />
          <input type="number" placeholder="Salaire" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} className="p-2 border rounded" required />
          <select value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value })} className="p-2 border rounded" required>
            <option value="">Sexe</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
          </select>
          <input placeholder="Téléphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="p-2 border rounded" required />
          <input type="number" placeholder="ID Salle" value={form.roomId} onChange={(e) => setForm({ ...form, roomId: e.target.value })} className="p-2 border rounded" required />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">Ajouter</button>
        </form>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Prénom</th>
            <th className="border p-2">Nom</th>
            <th className="border p-2">Spécialité</th>
            <th className="border p-2">Salle</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((d) => (
            <tr key={d.id}>
              <td className="border p-2">{d.firstName}</td>
              <td className="border p-2">{d.lastName}</td>
              <td className="border p-2">{d.specialtyId}</td>
              <td className="border p-2">{d.roomId}</td>
              <td className="border p-2">
                {['ADMIN', 'INFERMIERE'].includes(user.role) && (
                  <button
                    onClick={() => handleDelete(d.id)}
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

export default DoctorsPage;