import { useState, useEffect } from 'react'
import PatientForm from './PatientForm.jsx'

function PatientList({ patients, onAddPatient, onDeletePatient }) {
  const [editingPatient, setEditingPatient] = useState(null)
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    const storedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]')
    setAppointments(storedAppointments)
  }, [])

  const canDeletePatient = (patientId) => {
    return !appointments.some(appointment => appointment.patientId === patientId)
  }

  return (
    <div className="space-y-4">
      {editingPatient && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Modifier le patient</h3>
          <PatientForm
            patient={editingPatient}
            onAddPatient={(updatedPatient) => {
              onAddPatient(updatedPatient)
              setEditingPatient(null)
            }}
          />
        </div>
      )}
      {patients.length === 0 ? (
        <p className="text-gray-500">Aucun patient ajouté.</p>
      ) : (
        <ul className="space-y-2">
          {patients.map((patient) => (
            <li key={patient.id} className="flex justify-between items-center bg-white p-3 rounded shadow">
              <span>
                {patient.firstName} {patient.lastName} 
                {patient.email && ` (${patient.email})`}
                {patient.gender && `, ${patient.gender === 'male' ? 'Homme' : 'Femme'}`}
                {patient.age && `, ${patient.age} ans`}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => setEditingPatient(patient)}
                  className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                >
                  Modifier
                </button>
                <button
                  onClick={() => canDeletePatient(patient.id) ? onDeletePatient(patient.id) : alert('Impossible de supprimer : le patient a des rendez-vous.')}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  disabled={!canDeletePatient(patient.id)}
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PatientList