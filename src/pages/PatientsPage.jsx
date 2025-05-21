import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchPatients, createPatient, deletePatient } from '../api.js';
import PageContainer from '../components/PageContainer.jsx';

function PatientsPage() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    firstName: '', lastName: '', sex: '', age: '', phone: '', email: '', maritalStatus: '', children: '', cnss: ''
  });

  useEffect(() => {
    async function load() {
      const data = await fetchPatients();
      setPatients(data);
    }
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!['ADMIN', 'INFERMIERE'].includes(user.role)) return;
    const newPatient = await createPatient(form);
    setPatients((prev) => [...prev, newPatient]);
    setForm({ firstName: '', lastName: '', sex: '', age: '', phone: '', email: '', maritalStatus: '', children: '', cnss: '' });
  };

  const handleDelete = async (id) => {
    if (!['ADMIN', 'INFERMIERE'].includes(user.role)) return;
    await deletePatient(id);
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <PageContainer title="Patients">
      {['ADMIN', 'INFERMIERE'].includes(user.role) && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <input placeholder="Prénom" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="p-2 border rounded" required />
          <input placeholder="Nom" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="p-2 border rounded" required />
          <select value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value })} className="p-2 border rounded" required>
            <option value="">Sexe</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
          </select>
          <input type="number" placeholder="Âge" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="p-2 border rounded" required />
          <input placeholder="Téléphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="p-2 border rounded" required />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="p-2 border rounded" required />
          <select value={form.maritalStatus} onChange={(e) => setForm({ ...form, maritalStatus: e.target.value })} className="p-2 border rounded" required>
            <option value="">État civil</option>
            <option value="célibataire">Célibataire</option>
            <option value="marié">Marié</option>
            <option value="divorcé">Divorcé</option>
            <option value="veuf">Veuf</option>
          </select>
          <input type="number" placeholder="Nombre d'enfants" value={form.children} onChange={(e) => setForm({ ...form, children: e.target.value })} className="p-2 border rounded" required />
          <input placeholder="Numéro CNSS" value={form.cnss} onChange={(e) => setForm({ ...form, cnss: e.target.value })} className="p-2 border rounded" required />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">Ajouter</button>
        </form>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Prénom</th>
            <th className="border p-2">Nom</th>
            <th className="border p-2">Sexe</th>
            <th className="border p-2">Âge</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td className="border p-2">{p.firstName}</td>
              <td className="border p-2">{p.lastName}</td>
              <td className="border p-2">{p.sex}</td>
              <td className="border p-2">{p.age}</td>
              <td className="border p-2">
                {['ADMIN', 'INFERMIERE'].includes(user.role) && (
                  <button
                    onClick={() => handleDelete(p.id)}
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

export default PatientsPage;