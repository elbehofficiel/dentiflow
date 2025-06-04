import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer.jsx';
import { fetchTreatmentRecords, createTreatmentRecord, updateTreatmentRecord, deleteTreatmentRecord, fetchSoins, fetchAppointments } from '../api.js'; // Assuming fetchAppointments might be needed for context
import { FiPlus, FiEdit, FiTrash2, FiSave, FiXCircle, FiArrowLeft } from 'react-icons/fi';

function TreatmentRecordsPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [soinsList, setSoinsList] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null); // Stores the id of the record being edited
  const [currentRecord, setCurrentRecord] = useState({ soinId: '', toothNumber: '', notes: '', price: '' });

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [recordsData, soinsData, appointmentsData] = await Promise.all([
        fetchTreatmentRecords(appointmentId),
        fetchSoins(),
        fetchAppointments() // To find the current appointment details
      ]);
      setRecords(recordsData);
      setSoinsList(soinsData);
      const currentAppointment = appointmentsData.find(app => app.id === parseInt(appointmentId));
      setAppointment(currentAppointment);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      setRecords([]);
      setSoinsList([]);
    } finally {
      setIsLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'soinId') {
      const selectedSoin = soinsList.find(s => s.id === parseInt(value));
      setCurrentRecord(prev => ({ 
        ...prev, 
        soinId: value, 
        price: selectedSoin ? selectedSoin.price.toString() : '' 
      }));
    } else {
      setCurrentRecord(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentRecord.soinId || !currentRecord.price) {
      alert('Veuillez sélectionner un soin et vérifier le prix.');
      return;
    }
    const recordData = {
      ...currentRecord,
      appointmentId: parseInt(appointmentId),
      soinId: parseInt(currentRecord.soinId),
      price: parseFloat(currentRecord.price),
    };

    try {
      if (isEditing) {
        await updateTreatmentRecord(isEditing, recordData);
      } else {
        await createTreatmentRecord(recordData);
      }
      setCurrentRecord({ soinId: '', toothNumber: '', notes: '', price: '' });
      setIsAdding(false);
      setIsEditing(null);
      loadData(); // Refresh list
    } catch (err) {
      setError(err.message || 'Failed to save record');
    }
  };

  const handleEdit = (record) => {
    setIsEditing(record.id);
    setCurrentRecord({
      soinId: record.soinId.toString(),
      toothNumber: record.toothNumber || '',
      notes: record.notes || '',
      price: record.price.toString() || ''
    });
    setIsAdding(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement de soin ?')) {
      try {
        await deleteTreatmentRecord(id);
        loadData(); // Refresh list
      } catch (err) {
        setError(err.message || 'Failed to delete record');
      }
    }
  };

  const cancelForm = () => {
    setIsAdding(false);
    setIsEditing(null);
    setCurrentRecord({ soinId: '', toothNumber: '', notes: '', price: '' });
  };
  
  const getSoinLabel = (soinId) => {
    const soin = soinsList.find(s => s.id === soinId);
    return soin ? soin.label : 'Inconnu';
  };

  return (
    <PageContainer title={`Dossier de Soins (RDV #${appointmentId})`}>
      <button onClick={() => navigate(-1)} className="btn btn-ghost mb-4">
        <FiArrowLeft className="mr-2" /> Retour
      </button>

      {error && <div className="alert alert-error shadow-lg mb-4"><div><span>Erreur: {error}</span></div></div>}
      {appointment && <p className="mb-4 text-lg">Patient ID: {appointment.patientId} - Date: {new Date(appointment.date).toLocaleString()}</p>}

      {isAdding || isEditing !== null ? (
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title">{isEditing ? 'Modifier le Soin Effectué' : 'Ajouter un Soin Effectué'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="soinId" className="label"><span className="label-text">Type de Soin</span></label>
                <select id="soinId" name="soinId" value={currentRecord.soinId} onChange={handleInputChange} className="select select-bordered w-full" required>
                  <option value="" disabled>Sélectionner un soin</option>
                  {soinsList.map(soin => (
                    <option key={soin.id} value={soin.id}>{soin.label} - {soin.price.toFixed(2)}€</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="toothNumber" className="label"><span className="label-text">Numéro de Dent (Optionnel)</span></label>
                <input type="text" id="toothNumber" name="toothNumber" value={currentRecord.toothNumber} onChange={handleInputChange} className="input input-bordered w-full" />
              </div>
              <div>
                <label htmlFor="price" className="label"><span className="label-text">Prix (€)</span></label>
                <input type="number" id="price" name="price" value={currentRecord.price} onChange={handleInputChange} className="input input-bordered w-full" step="0.01" required />
              </div>
              <div>
                <label htmlFor="notes" className="label"><span className="label-text">Notes (Optionnel)</span></label>
                <textarea id="notes" name="notes" value={currentRecord.notes} onChange={handleInputChange} className="textarea textarea-bordered w-full"></textarea>
              </div>
              <div className="card-actions justify-end">
                <button type="button" onClick={cancelForm} className="btn btn-ghost">
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
          <button onClick={() => { setIsAdding(true); setIsEditing(null); setCurrentRecord({ soinId: '', toothNumber: '', notes: '', price: '' }); }} className="btn btn-primary">
            <FiPlus className="mr-2" /> Ajouter un Soin au Dossier
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64"><span className="loading loading-spinner loading-lg"></span></div>
      ) : records.length === 0 && !isAdding ? (
        <p>Aucun soin enregistré pour ce rendez-vous. Commencez par en ajouter un.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Type de Soin</th>
                <th>Numéro Dent</th>
                <th>Prix (€)</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{getSoinLabel(record.soinId)}</td>
                  <td>{record.toothNumber}</td>
                  <td>{record.price.toFixed(2)}</td>
                  <td>{record.notes}</td>
                  <td className="space-x-2">
                    <button onClick={() => handleEdit(record)} className="btn btn-sm btn-outline btn-info"><FiEdit /></button>
                    <button onClick={() => handleDelete(record.id)} className="btn btn-sm btn-outline btn-error"><FiTrash2 /></button>
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

export default TreatmentRecordsPage;
