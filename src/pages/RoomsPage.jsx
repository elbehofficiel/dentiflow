import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchRooms, createRoom, deleteRoom } from '../api.js';
import PageContainer from '../components/PageContainer.jsx';

function RoomsPage() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ name: '', typeId: '', status: 'disponible' });

  useEffect(() => {
    async function load() {
      const data = await fetchRooms();
      setRooms(data);
    }
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!['ADMIN', 'INFERMIERE'].includes(user.role)) return;
    const newRoom = await createRoom(form);
    setRooms((prev) => [...prev, newRoom]);
    setForm({ name: '', typeId: '', status: 'disponible' });
  };

  const handleDelete = async (id) => {
    if (!['ADMIN', 'INFERMIERE'].includes(user.role)) return;
    await deleteRoom(id);
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <PageContainer title="Salles">
      {['ADMIN', 'INFERMIERE'].includes(user.role) && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <input placeholder="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="p-2 border rounded" required />
          <input type="number" placeholder="ID Type" value={form.typeId} onChange={(e) => setForm({ ...form, typeId: e.target.value })} className="p-2 border rounded" required />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="p-2 border rounded" required>
            <option value="disponible">Disponible</option>
            <option value="hors service">Hors service</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">Ajouter</button>
        </form>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Nom</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Statut</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((r) => (
            <tr key={r.id}>
              <td className="border p-2">{r.name}</td>
              <td className="border p-2">{r.typeId}</td>
              <td className="border p-2">{r.status}</td>
              <td className="border p-2">
                {['ADMIN', 'INFERMIERE'].includes(user.role) && (
                  <button
                    onClick={() => handleDelete(r.id)}
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

export default RoomsPage;