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
let invoices = [
  { id: 1, appointmentId: 1, amount: 100.0, date: '2025-05-20' }
];
let soins = [
  { id: 1, label: 'Consultation', price: 50.0 }
];
let specialties = [
  { id: 1, name: 'Dentisterie générale' }
];
let roomTypes = [
  { id: 1, name: 'Standard' }
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
export async function createInvoice(data) {
  await delay(200);
  const newItem = { id: Date.now(), ...data };
  invoices.push(newItem);
  return newItem;
}
export async function deleteInvoice(id) {
  await delay(200);
  invoices = invoices.filter(i => i.id !== id);
  return true;
}
export async function updateInvoice(id, newFields) {
  await delay(200);
  invoices = invoices.map(inv => inv.id === id ? { ...inv, ...newFields } : inv);
  return true;
}

// Soins
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
export async function deleteSoin(id) {
  await delay(200);
  soins = soins.filter(s => s.id !== id);
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
