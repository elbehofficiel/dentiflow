import { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer.jsx';
import { fetchSoins, createSoin, deleteSoin } from '../api.js';

export default function TreatmentsPage() {
  const [soins, setSoins] = useState([]);
  const [form, setForm] = useState({ label: '', price: '' });

  useEffect(() => {
    async function load() {
      setSoins(await fetchSoins());
    }
    load();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    const newItem = await createSoin({ nature: form.label, label: form.label, price: Number(form.price) });
    setSoins(prev => [...prev, newItem]);
    setForm({ label: '', price: '' });
  };

  const handleDelete = async id => {
    await deleteSoin(id);
    setSoins(prev => prev.filter(s => s.id !== id));
  };

  return (
    <PageContainer title="Soins">
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="Nature" className="border p-2 rounded w-full" required />
        <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Prix" className="border p-2 rounded w-full" required />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">Ajouter</button>
      </form>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Nature</th>
            <th className="border p-2">Prix</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {soins.map(s => (
            <tr key={s.id}>
              <td className="border p-2">{s.label}</td>
              <td className="border p-2">{s.price} €</td>
              <td className="border p-2">
                <button onClick={() => handleDelete(s.id)} className="bg-red-500 text-white p-1 rounded">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageContainer>
  );
}
