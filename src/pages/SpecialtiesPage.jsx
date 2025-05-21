import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchSpecialties, createSpecialty, updateSpecialty, deleteSpecialty } from '../api.js';
import PageContainer from '../components/PageContainer.jsx';

function SpecialtiesPage() {
  const { user } = useAuth();
  const [specialties, setSpecialties] = useState([]);
  const [formData, setFormData] = useState({ id: null, name: '' });

  useEffect(() => {
    async function load() {
      const data = await fetchSpecialties();
      setSpecialties(data);
    }
    load();
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name) {
      if (formData.id) {
        await updateSpecialty(formData.id, { name: formData.name });
      } else {
        await createSpecialty({ name: formData.name });
      }
      const data = await fetchSpecialties();
      setSpecialties(data);
      setFormData({ id: null, name: '' });
    }
  };

  const handleEdit = (specialty) => {
    setFormData(specialty);
  };

  const handleDelete = async (id) => {
    await deleteSpecialty(id);
    setSpecialties(await fetchSpecialties());
  };

  if (!user) return <Navigate to="/auth" />;

  return (
    <PageContainer title="Gestion des spécialités">
      {['ADMIN'].includes(user.role) && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div>
            <label htmlFor="name" className="text-lg font-medium">Nom de la spécialité</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            {formData.id ? 'Modifier' : 'Ajouter'}
          </button>
        </form>
      )}
      <div className="space-y-4">
        {specialties.length === 0 ? (
          <p className="text-gray-500">Aucune spécialité ajoutée.</p>
        ) : (
          <ul className="space-y-2">
            {specialties.map(specialty => (
              <li key={specialty.id} className="flex justify-between items-center bg-white p-3 rounded shadow">
                <span>{specialty.name}</span>
                {['ADMIN'].includes(user.role) && (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(specialty)}
                      className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(specialty.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageContainer>
  );
}

export default SpecialtiesPage;