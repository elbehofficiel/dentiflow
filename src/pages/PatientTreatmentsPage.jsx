import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  fetchPatientById,
  fetchTreatmentRecordsByPatientId,
  fetchAppointments,
  fetchSoins,
  fetchDoctors,
  createTreatmentRecord,
  generateInvoiceFromTreatments,
  updateTreatmentRecord
} from '../api';
import PageContainer from '../components/PageContainer.jsx';
import ToothChart from '../components/ToothChart.jsx';

function PatientTreatmentsPage() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [treatmentRecords, setTreatmentRecords] = useState([]);
  const [appointmentsData, setAppointmentsData] = useState({});
  const [soinsData, setSoinsData] = useState({});
  const [doctorsData, setDoctorsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddSoinForm, setShowAddSoinForm] = useState(false);
  const [newSoinForm, setNewSoinForm] = useState({
    appointmentId: '',
    soinId: '',
    doctorId: '',
    price: '',
    notes: '',
    toothNumber: ''
  });
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [selectedPendingRecords, setSelectedPendingRecords] = useState(new Set());
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoicePaymentDetails, setInvoicePaymentDetails] = useState({ paidAmount: '', paymentMethod: 'Cash' });
  const [showEditSoinModal, setShowEditSoinModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [showToothChartModal, setShowToothChartModal] = useState(false);
  const [toothChartInitialValue, setToothChartInitialValue] = useState('');
  const [toothChartTarget, setToothChartTarget] = useState(null); // 'new' or 'edit'

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        const patientDetails = await fetchPatientById(patientId);
        setPatient(patientDetails);

        if (!patientDetails) {
            setError('Patient non trouvé.');
            setLoading(false);
            return;
        }

        const records = await fetchTreatmentRecordsByPatientId(patientId);
        
        const allAppointments = await fetchAppointments();
        const appointmentsLookup = allAppointments.reduce((acc, app) => {
          acc[app.id] = app;
          return acc;
        }, {});
        setAppointmentsData(appointmentsLookup);

        const allSoins = await fetchSoins();
        const soinsLookup = allSoins.reduce((acc, soin) => {
          acc[soin.id] = soin;
          return acc;
        }, {});
        setSoinsData(soinsLookup);

        const allDoctors = await fetchDoctors();
        const doctorsLookup = allDoctors.reduce((acc, doc) => {
            acc[doc.id] = doc;
            return acc;
        }, {});
        setDoctorsData(doctorsLookup);

        const sortedRecords = records.sort((a, b) => {
            const dateA = appointmentsLookup[a.appointmentId]?.date ? new Date(appointmentsLookup[a.appointmentId].date) : 0;
            const dateB = appointmentsLookup[b.appointmentId]?.date ? new Date(appointmentsLookup[b.appointmentId].date) : 0;
            return dateB - dateA; // Descending, most recent first
        });
        setTreatmentRecords(sortedRecords);

      } catch (err) {
        console.error("Error loading patient treatments page:", err);
        setError('Erreur lors du chargement des données des soins du patient.');
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      loadData();
    }
  }, [patientId]);

  useEffect(() => {
    // Filter appointments for the current patient once appointmentsData is loaded
    if (patient && Object.keys(appointmentsData).length > 0) {
      const filteredAppts = Object.values(appointmentsData).filter(app => app.patientId === parseInt(patientId));
      setPatientAppointments(filteredAppts.sort((a,b) => new Date(b.date) - new Date(a.date))); // Sort by date desc
    }
  }, [patient, appointmentsData, patientId]);

  // Handle form input changes
  const handleNewSoinChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    let updatedForm = { ...newSoinForm, [name]: finalValue };

    if (name === 'soinId') {
      if (value && soinsData) { // Check if a value is selected and soinsData is available
        const selectedSoin = soinsData[parseInt(value)];
        if (selectedSoin) {
          updatedForm.price = selectedSoin.price.toFixed(2);
        } else {
          // If selectedSoin is not found (e.g., invalid ID or soinsData not fully loaded), keep current price or set to 0
          updatedForm.price = newSoinForm.price || "0.00"; 
        }
      } else { // Handle case where "Sélectionner un type de soin" is chosen or soinsData is not ready
         updatedForm.price = "0.00"; 
      }
    }
    setNewSoinForm(updatedForm);
  };

  // Handle form submission
  const handleAddSoinSubmit = async (e) => {
    e.preventDefault();
    if (!newSoinForm.appointmentId || !newSoinForm.soinId || !newSoinForm.price) {
      alert('Veuillez remplir les champs obligatoires: Rendez-vous, Type de soin, et Prix.');
      return;
    }
    try {
      const recordData = {
        ...newSoinForm,
        appointmentId: parseInt(newSoinForm.appointmentId),
        soinId: parseInt(newSoinForm.soinId),
        doctorId: newSoinForm.doctorId ? parseInt(newSoinForm.doctorId) : null,
        price: parseFloat(newSoinForm.price),
      };
      const createdRecord = await createTreatmentRecord(recordData);
      setTreatmentRecords(prevRecords => [createdRecord, ...prevRecords].sort((a,b) => new Date(appointmentsData[b.appointmentId]?.date) - new Date(appointmentsData[a.appointmentId]?.date) ));
      setShowAddSoinForm(false);
      setNewSoinForm({ appointmentId: '', soinId: '', doctorId: '', price: '', notes: '', toothNumber: '' });
    } catch (err) {
      console.error("Error creating treatment record:", err);
      setError('Erreur lors de la création du soin.');
    }
  };

  // Handle selection of pending records for invoicing
  const handleSelectRecordForInvoicing = (recordId) => {
    setSelectedPendingRecords(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(recordId)) {
        newSelected.delete(recordId);
      } else {
        newSelected.add(recordId);
      }
      return newSelected;
    });
  };

  const calculateSelectedTotal = () => {
    let total = 0;
    selectedPendingRecords.forEach(recordId => {
      const record = treatmentRecords.find(r => r.id === recordId);
      if (record) {
        total += record.price;
      }
    });
    return total;
  };

  const handleOpenInvoiceModal = () => {
    if (selectedPendingRecords.size === 0) {
      alert("Veuillez sélectionner au moins un soin à facturer.");
      return;
    }
    const totalAmount = calculateSelectedTotal();
    setInvoicePaymentDetails({ paidAmount: totalAmount.toFixed(2), paymentMethod: 'Cash' });
    setShowInvoiceModal(true);
  };

  const handleInvoicePaymentChange = (e) => {
    const { name, value } = e.target;
    setInvoicePaymentDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateInvoice = async (e) => {
    e.preventDefault();
    if (selectedPendingRecords.size === 0) return;

    try {
      const newInvoice = await generateInvoiceFromTreatments(
        patientId,
        Array.from(selectedPendingRecords),
        {
          paidAmount: parseFloat(invoicePaymentDetails.paidAmount) || 0,
          paymentMethod: invoicePaymentDetails.paymentMethod
        }
      );
      if (newInvoice) {
        // Refresh treatment records to reflect new status and invoiceId
        const updatedRecords = await fetchTreatmentRecordsByPatientId(patientId);
        const sortedRecords = updatedRecords.sort((a, b) => {
            const dateA = appointmentsData[a.appointmentId]?.date ? new Date(appointmentsData[a.appointmentId].date) : 0;
            const dateB = appointmentsData[b.appointmentId]?.date ? new Date(appointmentsData[b.appointmentId].date) : 0;
            return dateB - dateA;
        });
        setTreatmentRecords(sortedRecords);
        setSelectedPendingRecords(new Set());
        setShowInvoiceModal(false);
        alert(`Facture #${newInvoice.id} générée avec succès !`);
      } else {
        setError('Erreur lors de la génération de la facture: aucun soin valide sélectionné ou autre problème API.');
      }
    } catch (err) {
      console.error("Error generating invoice:", err);
      setError('Erreur lors de la génération de la facture.');
    }
  };

  const handleOpenEditSoinModal = (record) => {
    setEditingRecord({
        ...record,
        appointmentId: record.appointmentId.toString(),
        soinId: record.soinId.toString(),
        doctorId: record.doctorId ? record.doctorId.toString() : '',
        price: record.price.toFixed(2),
        toothNumber: record.toothNumber || '',
        notes: record.notes || ''
    });
    setShowEditSoinModal(true);
  };

  const handleEditSoinChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    let updatedRecord = { ...editingRecord, [name]: finalValue };

    if (name === 'soinId') {
      if (value) { // if a soin is selected
        const selectedSoin = soinsData[parseInt(value)]; 
        if (selectedSoin) {
          updatedRecord.price = selectedSoin.price.toFixed(2);
        }
      } else { // if "Sélectionner un type de soin" is chosen
        updatedRecord.price = "0.00"; 
      }
    }
    setEditingRecord(updatedRecord);
  };

  const handleEditSoinSubmit = async (e) => {
    e.preventDefault();
    if (!editingRecord || !editingRecord.appointmentId || !editingRecord.soinId || !editingRecord.price) {
      alert('Veuillez remplir les champs obligatoires: Rendez-vous, Type de soin, et Prix.');
      return;
    }
    try {
      const recordToUpdate = {
        appointmentId: parseInt(editingRecord.appointmentId),
        soinId: parseInt(editingRecord.soinId),
        doctorId: editingRecord.doctorId ? parseInt(editingRecord.doctorId) : null,
        price: parseFloat(editingRecord.price),
        toothNumber: editingRecord.toothNumber || '',
        notes: editingRecord.notes || ''
      };
      await updateTreatmentRecord(editingRecord.id, recordToUpdate);
      
      const updatedRecords = await fetchTreatmentRecordsByPatientId(patientId);
      const sortedRecords = updatedRecords.sort((a, b) => {
          const dateA = appointmentsData[a.appointmentId]?.date ? new Date(appointmentsData[a.appointmentId].date) : 0;
          const dateB = appointmentsData[b.appointmentId]?.date ? new Date(appointmentsData[b.appointmentId].date) : 0;
          return dateB - dateA;
      });
      setTreatmentRecords(sortedRecords);
      setShowEditSoinModal(false);
      setEditingRecord(null);
      alert('Soin modifié avec succès !');
    } catch (err) {
      console.error("Error updating treatment record:", err);
      setError('Erreur lors de la modification du soin.');
    }
  };

  const handleOpenToothChart = (currentTeethValue, target) => {
    setToothChartInitialValue(currentTeethValue || '');
    setToothChartTarget(target);
    setShowToothChartModal(true);
  };

  const handleSaveToothSelection = (selectedTeethString) => {
    if (toothChartTarget === 'new') {
      setNewSoinForm(prev => ({ ...prev, toothNumber: selectedTeethString }));
    } else if (toothChartTarget === 'edit') {
      setEditingRecord(prev => ({ ...prev, toothNumber: selectedTeethString }));
    }
    setShowToothChartModal(false);
    setToothChartTarget(null);
  };

  const handleCancelToothSelection = () => {
    setShowToothChartModal(false);
    setToothChartTarget(null);
  };

  if (loading) return <PageContainer title="Chargement..."><p>Chargement des informations...</p></PageContainer>;
  if (error) return <PageContainer title="Erreur"><p>{error}</p></PageContainer>;
  if (!patient) return <PageContainer title="Patient non trouvé"><p>Aucun patient trouvé avec cet ID.</p></PageContainer>;

  const getAppointmentDate = (appointmentId) => appointmentsData[appointmentId]?.date ? new Date(appointmentsData[appointmentId].date).toLocaleDateString() : 'N/A';
  const getSoinLabel = (soinId) => soinsData[soinId]?.label || 'Soin inconnu';
  const getDoctorName = (doctorId) => {
    if (!doctorId) return 'N/A';
    const doctor = doctorsData[doctorId];
    return doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Médecin inconnu';
  };

  return (
    <>
    <PageContainer title={`Soins pour ${patient.firstName} ${patient.lastName}`}>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-700">Historique des Soins</h2>
        <div>
          <button 
            onClick={() => setShowAddSoinForm(!showAddSoinForm)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2">
            {showAddSoinForm ? 'Annuler Ajout' : 'Ajouter un Soin'}
          </button>
          <button 
            onClick={handleOpenInvoiceModal}
            disabled={selectedPendingRecords.size === 0}
            className={`font-bold py-2 px-4 rounded ${selectedPendingRecords.size === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}>
            Générer Facture ({selectedPendingRecords.size} soin(s) - €{calculateSelectedTotal().toFixed(2)})
          </button>
        </div>
      </div>

      {/* Formulaire d'ajout de soin */}
      {showAddSoinForm && (
        <div className="mb-6 p-4 bg-gray-50 shadow-md rounded-lg">
          <h3 class="text-xl font-semibold mb-4 text-gray-700">Ajouter un nouveau soin</h3>
          <form onSubmit={handleAddSoinSubmit} className="space-y-4">
            <div>
              <label htmlFor="appointmentId" className="block text-sm font-medium text-gray-700">Rendez-vous *</label>
              <select
                id="appointmentId"
                name="appointmentId"
                value={newSoinForm.appointmentId}
                onChange={handleNewSoinChange}
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Sélectionner un rendez-vous</option>
                {patientAppointments.map(app => (
                  <option key={app.id} value={app.id}>
                    {new Date(app.date).toLocaleDateString()} {app.time} - {doctorsData[app.doctorId] ? `${doctorsData[app.doctorId].firstName} ${doctorsData[app.doctorId].lastName}` : 'Médecin inconnu'}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="soinId" className="block text-sm font-medium text-gray-700">Type de Soin *</label>
                <select
                  id="soinId"
                  name="soinId"
                  value={newSoinForm.soinId}
                  onChange={handleNewSoinChange}
                  required
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Sélectionner un type de soin</option>
                  {Object.values(soinsData).map(soin => (
                    <option key={soin.id} value={soin.id}>{soin.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Prix (€) *</label>
                <input
                  type="number"
                  step="0.01"
                  id="price"
                  name="price"
                  value={newSoinForm.price}
                  onChange={handleNewSoinChange}
                  required
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">Médecin concerné</label>
                <select
                  id="doctorId"
                  name="doctorId"
                  value={newSoinForm.doctorId}
                  onChange={handleNewSoinChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Sélectionner un médecin (optionnel)</option>
                  {Object.values(doctorsData).map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.firstName} {doc.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="toothNumber" className="block text-sm font-medium text-gray-700">Numéro de dent(s)</label>
                <input
                  type="text"
                  id="toothNumber"
                  name="toothNumber"
                  value={newSoinForm.toothNumber}
                  onChange={handleNewSoinChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Ex: 11, 12, 24-27"
                />
                <button 
                  type="button"
                  onClick={() => handleOpenToothChart(newSoinForm.toothNumber, 'new')}
                  className="mt-1 text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 w-full sm:w-auto"
                >
                  Sélectionner Dents Graphiquement
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Description/Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={newSoinForm.notes}
                onChange={handleNewSoinChange}
                rows="3"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddSoinForm(false)}
                className="mr-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Ajouter le Soin
              </button>
            </div>
          </form>
        </div>
      )}

      {treatmentRecords.length === 0 ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
            <p className="font-bold">Information</p>
            <p>Aucun soin n'a encore été enregistré pour ce patient.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                <th className="py-3 px-5 text-left">Date</th>
                <th className="py-3 px-5 text-left">Dent(s)</th>
                <th className="py-3 px-5 text-left">Type de Soin</th>
                <th className="py-3 px-5 text-left">Médecin</th>
                <th className="py-3 px-5 text-right">Prix</th>
                <th className="py-3 px-5 text-center">Statut</th>
                <th className="py-3 px-5 text-center">Facturer</th>
                <th className="py-3 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {treatmentRecords.map(record => (
                <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-5 text-left whitespace-nowrap">{getAppointmentDate(record.appointmentId)}</td>
                  <td className="py-3 px-5 text-left">{record.toothNumber || '-'}</td>
                  <td className="py-3 px-5 text-left">{getSoinLabel(record.soinId)}</td>
                  <td className="py-3 px-5 text-left">{getDoctorName(record.doctorId)}</td>
                  <td className="py-3 px-5 text-right">€{record.price.toFixed(2)}</td>
                  <td className="py-3 px-5 text-center">
                    {record.status === 'invoiced' ? (
                      <span className="bg-green-200 text-green-700 py-1 px-3 rounded-full text-xs font-semibold">Facturé</span>
                    ) : (
                      <span className="bg-yellow-200 text-yellow-700 py-1 px-3 rounded-full text-xs font-semibold">En attente</span>
                    )}
                  </td>
                  <td className="py-3 px-5 text-center">
                    {record.status === 'pending_invoice' ? (
                      <input 
                        type="checkbox"
                        checked={selectedPendingRecords.has(record.id)}
                        onChange={() => handleSelectRecordForInvoicing(record.id)}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td className="py-3 px-5 text-center">
                    {record.status === 'pending_invoice' && (
                       <button 
                        onClick={() => handleOpenEditSoinModal(record)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2 text-sm">
                          Modifier
                        </button>
                    )}
                     <Link to={`/appointments/${record.appointmentId}/records`} className="text-gray-600 hover:text-gray-900 text-sm">Détails RDV</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageContainer>

    {/* Invoice Modal */}
    {showInvoiceModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Générer la Facture</h3>
                    <form onSubmit={handleGenerateInvoice} className="space-y-4">
                        <p className="text-sm text-gray-700">
                            Total des soins sélectionnés: <span className="font-semibold">€{calculateSelectedTotal().toFixed(2)}</span>
                        </p>
                        <div>
                            <label htmlFor="paidAmount" className="block text-sm font-medium text-gray-700 text-left">Montant Payé (€) *</label>
                            <input
                                type="number"
                                step="0.01"
                                id="paidAmount"
                                name="paidAmount"
                                value={invoicePaymentDetails.paidAmount}
                                onChange={handleInvoicePaymentChange}
                                required
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 text-left">Mode de Paiement *</label>
                            <select
                                id="paymentMethod"
                                name="paymentMethod"
                                value={invoicePaymentDetails.paymentMethod}
                                onChange={handleInvoicePaymentChange}
                                required
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="Cash">Espèces</option>
                                <option value="Card">Carte Bancaire</option>
                                <option value="Check">Chèque</option>
                                <option value="Transfer">Virement</option>
                                <option value="Other">Autre</option>
                            </select>
                        </div>
                        <div className="items-center gap-2 pt-4 sm:flex">
                            <button
                                type="button"
                                onClick={() => setShowInvoiceModal(false)}
                                className="w-full sm:w-auto mb-2 sm:mb-0 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Valider la Facture
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )}

    {/* Edit Soin Modal */}
    {showEditSoinModal && editingRecord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="relative mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 text-center">Modifier le Soin</h3>
                    <form onSubmit={handleEditSoinSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="edit-appointmentId" className="block text-sm font-medium text-gray-700">Rendez-vous *</label>
                          <select
                            id="edit-appointmentId"
                            name="appointmentId"
                            value={editingRecord.appointmentId}
                            onChange={handleEditSoinChange}
                            required
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="">Sélectionner un rendez-vous</option>
                            {patientAppointments.map(app => (
                              <option key={app.id} value={app.id.toString()}>
                                {new Date(app.date).toLocaleDateString()} {app.time} - {doctorsData[app.doctorId] ? `${doctorsData[app.doctorId].firstName} ${doctorsData[app.doctorId].lastName}` : 'Médecin inconnu'}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="edit-soinId" className="block text-sm font-medium text-gray-700">Type de Soin *</label>
                            <select
                              id="edit-soinId"
                              name="soinId"
                              value={editingRecord.soinId}
                              onChange={handleEditSoinChange}
                              required
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              <option value="">Sélectionner un type de soin</option>
                              {Object.values(soinsData).map(soin => (
                                <option key={soin.id} value={soin.id.toString()}>{soin.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700">Prix (€) *</label>
                            <input
                              type="number"
                              step="0.01"
                              id="edit-price"
                              name="price"
                              value={editingRecord.price}
                              onChange={handleEditSoinChange}
                              required
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="edit-doctorId" className="block text-sm font-medium text-gray-700">Médecin concerné</label>
                            <select
                              id="edit-doctorId"
                              name="doctorId"
                              value={editingRecord.doctorId}
                              onChange={handleEditSoinChange}
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              <option value="">Sélectionner un médecin (optionnel)</option>
                              {Object.values(doctorsData).map(doc => (
                                <option key={doc.id} value={doc.id.toString()}>{doc.firstName} {doc.lastName}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="edit-toothNumber" className="block text-sm font-medium text-gray-700">Numéro de dent(s)</label>
                            <input
                              type="text"
                              id="edit-toothNumber"
                              name="toothNumber"
                              value={editingRecord.toothNumber}
                              onChange={handleEditSoinChange}
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="Ex: 11, 12, 24-27"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="edit-notes" className="block text-sm font-medium text-gray-700">Description/Notes</label>
                          <textarea
                            id="edit-notes"
                            name="notes"
                            value={editingRecord.notes}
                            onChange={handleEditSoinChange}
                            rows="3"
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          ></textarea>
                        </div>

                        <div className="items-center gap-2 pt-4 sm:flex">
                            <button
                                type="button"
                                onClick={() => { setShowEditSoinModal(false); setEditingRecord(null); }}
                                className="w-full sm:w-auto mb-2 sm:mb-0 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Enregistrer les Modifications
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )}

    {/* Edit Soin Modal */}
    {showEditSoinModal && editingRecord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="relative mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 text-center">Modifier le Soin</h3>
                    <form onSubmit={handleEditSoinSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="edit-appointmentId" className="block text-sm font-medium text-gray-700">Rendez-vous *</label>
                          <select
                            id="edit-appointmentId"
                            name="appointmentId"
                            value={editingRecord.appointmentId}
                            onChange={handleEditSoinChange}
                            required
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="">Sélectionner un rendez-vous</option>
                            {patientAppointments.map(app => (
                              <option key={app.id} value={app.id.toString()}>
                                {new Date(app.date).toLocaleDateString()} {app.time} - {doctorsData[app.doctorId] ? `${doctorsData[app.doctorId].firstName} ${doctorsData[app.doctorId].lastName}` : 'Médecin inconnu'}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="edit-soinId" className="block text-sm font-medium text-gray-700">Type de Soin *</label>
                            <select
                              id="edit-soinId"
                              name="soinId"
                              value={editingRecord.soinId}
                              onChange={handleEditSoinChange}
                              required
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              <option value="">Sélectionner un type de soin</option>
                              {Object.values(soinsData).map(soin => (
                                <option key={soin.id} value={soin.id.toString()}>{soin.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700">Prix (€) *</label>
                            <input
                              type="number"
                              step="0.01"
                              id="edit-price"
                              name="price"
                              value={editingRecord.price}
                              onChange={handleEditSoinChange}
                              required
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="edit-doctorId" className="block text-sm font-medium text-gray-700">Médecin concerné</label>
                            <select
                              id="edit-doctorId"
                              name="doctorId"
                              value={editingRecord.doctorId}
                              onChange={handleEditSoinChange}
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              <option value="">Sélectionner un médecin (optionnel)</option>
                              {Object.values(doctorsData).map(doc => (
                                <option key={doc.id} value={doc.id.toString()}>{doc.firstName} {doc.lastName}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="edit-toothNumber" className="block text-sm font-medium text-gray-700">Numéro de dent(s)</label>
                            <input
                              type="text"
                              id="edit-toothNumber"
                              name="toothNumber"
                              value={editingRecord.toothNumber}
                              onChange={handleEditSoinChange}
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="Ex: 11, 12, 24-27"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="edit-notes" className="block text-sm font-medium text-gray-700">Description/Notes</label>
                          <textarea
                            id="edit-notes"
                            name="notes"
                            value={editingRecord.notes}
                            onChange={handleEditSoinChange}
                            rows="3"
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          ></textarea>
                        </div>

                        <div className="items-center gap-2 pt-4 sm:flex">
                            <button
                                type="button"
                                onClick={() => { setShowEditSoinModal(false); setEditingRecord(null); }}
                                className="w-full sm:w-auto mb-2 sm:mb-0 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Enregistrer les Modifications
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )}

    {/* ToothChart Modal */}
    {showToothChartModal && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-[60] flex justify-center items-center p-4">
        <ToothChart 
          initialSelectedTeeth={toothChartInitialValue}
          onSaveSelection={handleSaveToothSelection}
          onCancel={handleCancelToothSelection}
        />
      </div>
    )}
    </>
  );
}

export default PatientTreatmentsPage;
