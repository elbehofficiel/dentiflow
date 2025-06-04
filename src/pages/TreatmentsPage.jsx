import React, { useState, useEffect, useCallback } from 'react';
import PageContainer from '../components/PageContainer.jsx';
import { fetchSoins, createSoin, updateSoin, deleteSoin } from '../api.js';
import { FiPlus, FiEdit, FiTrash2, FiSave, FiXCircle } from 'react-icons/fi';

function TreatmentsPage() {
  const [soins, setSoins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null); // Stores the id of the item being edited
  const [currentSoin, setCurrentSoin] = useState({ label: '', price: '', description: '' });

  const loadSoins = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchSoins();
      setSoins(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch soins');
      setSoins([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSoins();
  }, [loadSoins]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSoin(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSoin = async (e) => {
    e.preventDefault();
    if (!currentSoin.label || !currentSoin.price) {
      alert('Le libellé et le prix sont requis.');
      return;
    }
    try {
      await createSoin({ ...currentSoin, price: parseFloat(currentSoin.price) });
      setCurrentSoin({ label: '', price: '', description: '' });
      setIsAdding(false);
      loadSoins();
    } catch (err) {
      setError(err.message || 'Failed to create soin');
    }
  };

  const handleEditSoin = (soin) => {
    setIsEditing(soin.id);
    setCurrentSoin({ label: soin.label, price: soin.price.toString(), description: soin.description || '' });
    setIsAdding(false); // Close add form if open
  };

  const handleUpdateSoin = async (e) => {
    e.preventDefault();
    if (!currentSoin.label || !currentSoin.price) {
      alert('Le libellé et le prix sont requis.');
      return;
    }
    try {
      await updateSoin(isEditing, { ...currentSoin, price: parseFloat(currentSoin.price) });
      setCurrentSoin({ label: '', price: '', description: '' });
      setIsEditing(null);
      loadSoins();
    } catch (err) {
      setError(err.message || 'Failed to update soin');
    }
  };

  const handleDeleteSoin = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce soin ?')) {
      try {
        await deleteSoin(id);
        loadSoins();
      } catch (err) {
        setError(err.message || 'Failed to delete soin');
      }
    }
  };

  const cancelEditOrAdd = () => {
    setIsAdding(false);
    setIsEditing(null);
    setCurrentSoin({ label: '', price: '', description: '' });
  };

  return (
    <PageContainer title="Gestion des Soins">
      {error && <div className="alert alert-error shadow-lg"><div><span>Erreur: {error}</span></div></div>}

      {isAdding || isEditing !== null ? (
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title">{isEditing ? 'Modifier le Soin' : 'Ajouter un Soin'}</h2>
            <form onSubmit={isEditing ? handleUpdateSoin : handleAddSoin} className="space-y-4">
              <div>
                <label htmlFor="label" className="label"><span className="label-text">Libellé du soin</span></label>
                <input type="text" id="label" name="label" value={currentSoin.label} onChange={handleInputChange} className="input input-bordered w-full" required />
              </div>
              <div>
                <label htmlFor="price" className="label"><span className="label-text">Prix (€)</span></label>
                <input type="number" id="price" name="price" value={currentSoin.price} onChange={handleInputChange} className="input input-bordered w-full" step="0.01" required />
              </div>
              <div>
                <label htmlFor="description" className="label"><span className="label-text">Description (Optionnel)</span></label>
                <textarea id="description" name="description" value={currentSoin.description} onChange={handleInputChange} className="textarea textarea-bordered w-full"></textarea>
              </div>
              <div className="card-actions justify-end">
                <button type="button" onClick={cancelEditOrAdd} className="btn btn-ghost">
                  <FiXCircle className="mr-2" /> Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  <FiSave className="mr-2" /> {isEditing ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <button onClick={() => { setIsAdding(true); setCurrentSoin({ label: '', price: '', description: '' }); setIsEditing(null); }} className="btn btn-primary">
            <FiPlus className="mr-2" /> Ajouter un Soin
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64"><span className="loading loading-spinner loading-lg"></span></div>
      ) : soins.length === 0 && !isAdding ? (
        <p>Aucun soin trouvé. Commencez par en ajouter un.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Libellé</th>
                <th>Prix (€)</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {soins.map((soin) => (
                <tr key={soin.id}>
                  <td>{soin.label}</td>
                  <td>{soin.price.toFixed(2)}</td>
                  <td>{soin.description}</td>
                  <td className="space-x-2">
                    <button onClick={() => handleEditSoin(soin)} className="btn btn-sm btn-outline btn-info"><FiEdit /></button>
                    <button onClick={() => handleDeleteSoin(soin.id)} className="btn btn-sm btn-outline btn-error"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageContainer>
  );
}

export default TreatmentsPage;
