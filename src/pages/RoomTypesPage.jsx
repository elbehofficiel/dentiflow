import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import PageContainer from '../components/PageContainer.jsx';

function RoomTypesPage() {
  const { user } = useAuth();
  const [roomTypes, setRoomTypes] = useState([]);
  const [form, setForm] = useState({ name: '' });

  useEffect(() => {
    const storedRoomTypes = JSON.parse(localStorage.getItem('roomTypes') || '[]');
    setRoomTypes(storedRoomTypes);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!['ADMIN', 'INFERMIERE'].includes(user.role)) return;
    const newRoomType = { id: Date.now(), ...form };
    const updatedRoomTypes = [...roomTypes, newRoomType];
    setRoomTypes(updatedRoomTypes);
    localStorage.setItem('roomTypes', JSON.stringify(updatedRoomTypes));
    setForm({ name: '' });
  };

  const handleDelete = (id) => {
    if (!['ADMIN', 'INFERMIERE'].includes(user.role)) return;
    const updatedRoomTypes = roomTypes.filter((rt) => rt.id !== id);
    setRoomTypes(updatedRoomTypes);
    localStorage.setItem('roomTypes', JSON.stringify(updatedRoomTypes));
  };

  return (
    <PageContainer title="Types de salles">
      {['ADMIN', 'INFERMIERE'].includes(user.role) && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <input placeholder="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="p-2 border rounded" required />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">Ajouter</button>
        </form>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Nom</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roomTypes.map((rt) => (
            <tr key={rt.id}>
              <td className="border p-2">{rt.name}</td>
              <td className="border p-2">
                {['ADMIN', 'INFERMIERE'].includes(user.role) && (
                  <button
                    onClick={() => handleDelete(rt.id)}
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

export default RoomTypesPage;