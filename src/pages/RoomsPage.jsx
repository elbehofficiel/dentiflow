import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchRooms, createRoom, deleteRoom, fetchRoomTypes } from '../api.js';
import PageContainer from '../components/PageContainer.jsx';
import { FiHome, FiTrash2, FiEdit2 } from 'react-icons/fi';

function RoomsPage() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [roomTypesList, setRoomTypesList] = useState([]);
  const [form, setForm] = useState({ name: '', typeId: '', status: 'disponible' });

  useEffect(() => {
    async function load() {
      const [roomsData, typesData] = await Promise.all([
        fetchRooms(),
        fetchRoomTypes()
      ]);
      setRooms(roomsData);
      setRoomTypesList(typesData);
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

  // Palettes colorées pour cartes
  const palettes = [
    { bg: 'bg-primary/20', border: 'border-primary/50', badge: 'bg-primary/80 text-white' },
    { bg: 'bg-secondary/20', border: 'border-secondary/50', badge: 'bg-secondary/80 text-white' },
    { bg: 'bg-accent/20', border: 'border-accent/50', badge: 'bg-accent/80 text-white' },
    { bg: 'bg-info/20', border: 'border-info/50', badge: 'bg-info/80 text-white' },
    { bg: 'bg-success/20', border: 'border-success/50', badge: 'bg-success/80 text-white' },
    { bg: 'bg-warning/20', border: 'border-warning/50', badge: 'bg-warning/80 text-white' },
  ];

  return (
    <PageContainer title="Salles">
      {['ADMIN', 'INFERMIERE'].includes(user.role) && (
        <div className="card bg-base-100 shadow-md rounded-lg p-4 mb-6">
          <div className="card-body space-y-4">
            <h2 className="text-xl font-semibold text-primary">Ajouter une salle</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Nom</span></label>
                  <input
                    type="text"
                    placeholder="Nom de la salle"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Type</span></label>
                  <select
                    value={form.typeId}
                    onChange={(e) => setForm({ ...form, typeId: e.target.value })}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="">Choisir un type</option>
                    {roomTypesList.map((type) => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Statut</span></label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="disponible">Disponible</option>
                    <option value="hors service">Hors service</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary">Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Section Salles avec design moderne */}
      <section className="py-6 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6">
        <h2 className="text-2xl font-bold text-primary mb-4">Nos Salles </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((r, idx) => {
            const p = palettes[idx % palettes.length];
            return (
            <div key={r.id} className={`${p.bg} border ${p.border} rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 p-6 group relative`}>
              <span className={`absolute top-4 right-4 px-3 py-1 text-sm font-medium rounded-full ${p.badge}`}>{r.status}</span>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary/20 text-primary flex items-center justify-center rounded-full mr-3">
                  <FiHome size={20} />
                </div>
                <h3 className="text-lg font-semibold">{r.name}</h3>
              </div>
              <p className="text-gray-600 mb-4">{roomTypesList.find((t) => t.id === r.typeId)?.name}</p>
              {['ADMIN', 'INFERMIERE'].includes(user.role) && (
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 flex space-x-2 transition">
                  <button onClick={() => {/* à implémenter édition */}} className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center hover:bg-primary/40 transition">
                    <FiEdit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(r.id)} className="w-8 h-8 bg-error/20 text-error rounded-full flex items-center justify-center hover:bg-error/40 transition">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              )}
            </div>
            );
          })}
        </div>
      </section>
    </PageContainer>
  );
}

export default RoomsPage;