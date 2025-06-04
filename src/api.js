// src/api.js
// Mock API with static data for testing

// Initial static data
let patients = [
  { id: 1, firstName: 'Jean', lastName: 'Dupont', sex: 'Homme', age: 30, phone: '0123456789', email: 'jean.dupont@example.com', maritalStatus: 'célibataire', children: 0, cnss: '123456' }
];
let rooms = [
  { id: 1, name: 'Salle A', typeId: 1, status: 'disponible' }
];
let accounts = [
  { id: 1, email: 'admin@example.com', password: 'admin', role: 'ADMIN', state: 'activé' }
];
let appointments = [
  { id: 1, patientId: 1, doctorId: 1, date: '2025-05-20T10:00:00', soins: [ { id: 1, label: 'Consultation' } ] }
];
let invoices = []; // Structure: { id, patientId, treatmentRecordIds, amount, paidAmount, paymentMethod, date, status }
let specialties = [
  { id: 1, name: 'Dentisterie générale' }
];
let roomTypes = [
  { id: 1, name: 'Salle de médecins' },
  { id: 2, name: "Salle d'attente" },
  { id: 3, name: 'Salle de soins' },
  { id: 4, name: 'Salle de chirurgie' },
  { id: 5, name: 'Salle de radiologie' }
];
let documentTypes = [
  { id: 1, name: 'Radiographie' },
  { id: 2, name: 'Prescription' }
];
let documents = [
  { id: 1, name: 'Radio_janvier', typeId: 1, nature: 'pdf' }
];
let payments = [
  { id: 1, invoiceId: 1, mode: 'carte bancaire', amount: 100 }
];
let soins = [
  { id: 1, label: 'Consultation', price: 50.0, description: 'Examen général' },
  { id: 2, label: 'Détartrage', price: 70.0, description: 'Nettoyage et polissage des dents' },
  { id: 3, label: 'Extraction simple', price: 100.0, description: 'Retrait d\'une dent' }
];

let treatmentRecords = [];

let doctors = [
  { id: 1, firstName: 'Alice', lastName: 'Martin', email: 'alice.martin@example.com', specialtyId: 1, age: 45, salary: 2000, sex: 'Femme', phone: '0987654321', roomId: 1 }
];

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// Patients
export async function fetchPatients() {
  await delay(200);
  return [...patients];
}
export async function createPatient(data) {
  await delay(200);
  const newItem = { id: Date.now(), ...data };
  patients.push(newItem);
  return newItem;
}
export async function deletePatient(id) {
  await delay(200);
  patients = patients.filter(p => p.id !== id);
  return true;
}

export async function fetchPatientById(id) {
  await delay(200);
  // Ensure id is treated as a number for comparison if patient IDs are numbers
  const patientId = parseInt(id);
  const patient = patients.find(p => p.id === patientId);
  return patient ? { ...patient } : null; // Return a copy or null if not found
}

// Rooms
export async function fetchRooms() {
  await delay(200);
  return [...rooms];
}
export async function createRoom(data) {
  await delay(200);
  const newItem = { id: Date.now(), ...data };
  rooms.push(newItem);
  return newItem;
}
export async function deleteRoom(id) {
  await delay(200);
  rooms = rooms.filter(r => r.id !== id);
  return true;
}

// Accounts
export async function fetchAccounts() {
  await delay(200);
  return [...accounts];
}
export async function updateAccountRole(id, newRole) {
  await delay(200);
  accounts = accounts.map(a => a.id === id ? { ...a, role: newRole } : a);
  return true;
}
export async function toggleAccountState(id) {
  await delay(200);
  accounts = accounts.map(a => a.id === id ? { ...a, state: a.state === 'activé' ? 'désactivé' : 'activé' } : a);
  return true;
}
export async function deleteAccount(id) {
  await delay(200);
  accounts = accounts.filter(a => a.id !== id);
  return true;
}
export async function createAccount(data) {
  await delay(200);
  const newItem = { id: Date.now(), ...data };
  accounts.push(newItem);
  return newItem;
}

// Appointments
export async function fetchAppointments() {
  await delay(200);
  return [...appointments];
}
export async function createAppointment(data) {
  await delay(200);
  const newItem = { id: Date.now(), ...data };
  appointments.push(newItem);
  return newItem;
}
export async function deleteAppointment(id) {
  await delay(200);
  appointments = appointments.filter(a => a.id !== id);
  return true;
}

// Invoices
export async function fetchInvoices() {
  await delay(200);
  return [...invoices];
}

export async function generateInvoiceFromTreatments(patientId, treatmentRecordIds, paymentDetails) {
  await delay(200);
  let totalAmount = 0;
  const recordsToInvoice = treatmentRecords.filter(tr => treatmentRecordIds.includes(tr.id) && tr.status === 'pending_invoice');

  if (recordsToInvoice.length === 0 && treatmentRecordIds.length > 0) {
    console.warn("No treatment records found in 'pending_invoice' state for the provided IDs.");
    // throw new Error("No treatment records found in 'pending_invoice' state for the provided IDs."); // Alternative plus stricte
    return null; // Ou gérer l'erreur comme approprié
  }
  
  recordsToInvoice.forEach(tr => {
    totalAmount += tr.price;
  });

  const newInvoice = {
    id: Date.now(),
    patientId: parseInt(patientId),
    treatmentRecordIds: recordsToInvoice.map(tr => tr.id),
    amount: totalAmount,
    paidAmount: parseFloat(paymentDetails.paidAmount) || 0,
    paymentMethod: paymentDetails.paymentMethod || 'Cash',
    date: new Date().toISOString().split('T')[0],
    status: (parseFloat(paymentDetails.paidAmount) || 0) >= totalAmount && totalAmount > 0 ? 'paid' : ((parseFloat(paymentDetails.paidAmount) || 0) > 0 ? 'partially_paid' : 'generated')
  };
  invoices.push(newInvoice);

  recordsToInvoice.forEach(tr => {
    const recordIndex = treatmentRecords.findIndex(r => r.id === tr.id);
    if (recordIndex !== -1) {
      treatmentRecords[recordIndex] = {
        ...treatmentRecords[recordIndex],
        status: 'invoiced',
        invoiceId: newInvoice.id
      };
    }
  });
  return newInvoice;
}

export async function updateInvoicePayment(id, paymentUpdate) { // paymentUpdate: { paidAmount, paymentMethod }
    await delay(200);
    const invoiceIndex = invoices.findIndex(inv => inv.id === id);
    if (invoiceIndex === -1) throw new Error("Invoice not found");

    const invoice = invoices[invoiceIndex];
    const newPaidAmount = (invoice.paidAmount || 0) + (parseFloat(paymentUpdate.paidAmount) || 0);
    
    invoices[invoiceIndex] = {
        ...invoice,
        paidAmount: newPaidAmount,
        paymentMethod: paymentUpdate.paymentMethod || invoice.paymentMethod, 
        status: newPaidAmount >= invoice.amount ? 'paid' : (newPaidAmount > 0 ? 'partially_paid' : invoice.status)
    };
    return invoices[invoiceIndex];
}

export async function cancelInvoice(id) {
  await delay(200);
  const invoiceIndex = invoices.findIndex(inv => inv.id === id);
  if (invoiceIndex === -1) return false;

  const cancelledInvoice = invoices[invoiceIndex];
  cancelledInvoice.treatmentRecordIds.forEach(recordId => {
    const trIndex = treatmentRecords.findIndex(tr => tr.id === recordId && tr.invoiceId === id);
    if (trIndex !== -1) {
      treatmentRecords[trIndex] = {
        ...treatmentRecords[trIndex],
        status: 'pending_invoice',
        invoiceId: null
      };
    }
  });
  
  invoices[invoiceIndex].status = 'cancelled';
  return true;
}

// Specialties
export async function fetchSpecialties() {
  await delay(200);
  return [...specialties];
}
export async function createSpecialty(data) {
  await delay(200);
  const newItem = { id: Date.now(), ...data };
  specialties.push(newItem);
  return newItem;
}
export async function updateSpecialty(id, data) {
  await delay(200);
  specialties = specialties.map(s => s.id === id ? { ...s, ...data } : s);
  return true;
}
export async function deleteSpecialty(id) {
  await delay(200);
  specialties = specialties.filter(s => s.id !== id);
  return true;
}

// Room Types
export async function fetchRoomTypes() {
  await delay(200);
  return [...roomTypes];
}
export async function createRoomType(data) {
  await delay(200);
  const newItem = { id: Date.now(), ...data };
  roomTypes.push(newItem);
  return newItem;
}
export async function deleteRoomType(id) {
  await delay(200);
  roomTypes = roomTypes.filter(rt => rt.id !== id);
  return true;
}

// Document Types
export async function fetchDocumentTypes() {
  await delay(200);
  return [...documentTypes];
}
export async function createDocumentType(data) {
  await delay(200);
  const newItem = { id: Date.now(), ...data };
  documentTypes.push(newItem);
  return newItem;
}
export async function deleteDocumentType(id) {
  await delay(200);
  documentTypes = documentTypes.filter(dt => dt.id !== id);
  return true;
}
export async function updateDocumentType(id, newFields) {
  await delay(200);
  documentTypes = documentTypes.map(dt => dt.id === id ? { ...dt, ...newFields } : dt);
  return true;
}

// Documents
export async function fetchDocuments() {
  await delay(200);
  return [...documents];
}
export async function createDocument(data) {
  await delay(200);
  const newItem = { id: Date.now(), ...data };
  documents.push(newItem);
  return newItem;
}
export async function deleteDocument(id) {
  await delay(200);
  documents = documents.filter(d => d.id !== id);
  return true;
}
export async function updateDocument(id, newFields) {
  await delay(200);
  documents = documents.map(d => d.id === id ? { ...d, ...newFields } : d);
  return true;
}

// Payments
export async function fetchPayments() {
  await delay(200);
  return [...payments];
}
export async function createPayment(data) {
  await delay(200);
  const newItem = { id: Date.now(), ...data };
  payments.push(newItem);
  return newItem;
}
export async function deletePayment(id) {
  await delay(200);
  payments = payments.filter(p => p.id !== id);
  return true;
}

// Soins (Treatments)
export async function fetchSoins() {
  await delay(200);
  return [...soins];
}
export async function createSoin(data) {
  await delay(200);
  const newItem = { id: Date.now(), ...data };
  soins.push(newItem);
  return newItem;
}
export async function updateSoin(id, data) {
  await delay(200);
  soins = soins.map(s => s.id === id ? { ...s, ...data } : s);
  return soins.find(s => s.id === id);
}
export async function deleteSoin(id) {
  await delay(200);
  soins = soins.filter(s => s.id !== id);
  return true;
}

// Treatment Records
export async function fetchTreatmentRecords(appointmentId) {
  await delay(200);
  return treatmentRecords.filter(record => !appointmentId || record.appointmentId === Number(appointmentId));
}
export async function createTreatmentRecord(data) { // data: { appointmentId, soinId, doctorId, price, notes, toothNumber }
  await delay(200);
  const newRecord = {
    id: Date.now(),
    appointmentId: parseInt(data.appointmentId),
    soinId: parseInt(data.soinId),
    doctorId: data.doctorId ? parseInt(data.doctorId) : null, // Gère doctorId optionnel
    price: parseFloat(data.price),
    toothNumber: data.toothNumber || '',
    notes: data.notes || '',
    status: 'pending_invoice', // Statut par défaut
    invoiceId: null,           // invoiceId par défaut
    createdAt: new Date().toISOString()
  };
  treatmentRecords.push(newRecord);
  return newRecord;
}
export async function updateTreatmentRecord(id, updates) {
  await delay(200);
  const recordIndex = treatmentRecords.findIndex(record => record.id === id);
  if (recordIndex === -1) {
    console.error(`Treatment record with id ${id} not found for update.`);
    throw new Error(`Treatment record with id ${id} not found.`);
  }
  // Ensure status and invoiceId are not accidentally overwritten if not in updates
  // and that we only update editable fields for a 'pending_invoice' record.
  if (treatmentRecords[recordIndex].status !== 'pending_invoice') {
    console.warn(`Attempted to update a treatment record (id: ${id}) that is not pending_invoice. Status: ${treatmentRecords[recordIndex].status}`);
    // Depending on strictness, you might throw an error or just return the original record
    // For now, let's prevent modification of invoiced/cancelled records through this general update function.
    // Specific functions should handle status changes (e.g., invoicing, cancellation).
    return treatmentRecords[recordIndex]; 
  }

  treatmentRecords[recordIndex] = {
    ...treatmentRecords[recordIndex],
    ...updates // Apply all updates passed from the form
  };
  console.log(`Updated treatment record ${id}:`, treatmentRecords[recordIndex]);
  return { ...treatmentRecords[recordIndex] };
}
export async function fetchTreatmentRecordsByPatientId(patientId) {
  await delay(200);
  // First, find all appointments for this patient
  const patientAppointments = appointments.filter(app => app.patientId === parseInt(patientId));
  const patientAppointmentIds = patientAppointments.map(app => app.id);

  // Then, filter treatment records based on these appointment IDs
  const patientTreatmentRecords = treatmentRecords.filter(record =>
    patientAppointmentIds.includes(record.appointmentId)
  );
  return [...patientTreatmentRecords];
}

export async function getTreatmentRecordById(id) {
  await delay(200);
  const record = treatmentRecords.find(record => record.id === Number(id));
  return record ? { ...record } : null;
}

export async function deleteTreatmentRecord(id) {
  await delay(200);
  treatmentRecords = treatmentRecords.filter(record => record.id !== id);
  return true;
}

// Doctors
export async function fetchDoctors() {
  await delay(200);
  return [...doctors];
}
export async function createDoctor(data) {
  await delay(200);
  const newItem = { id: Date.now(), ...data };
  doctors.push(newItem);
  return newItem;
}
export async function deleteDoctor(id) {
  await delay(200);
  doctors = doctors.filter(d => d.id !== id);
  return true;
}
