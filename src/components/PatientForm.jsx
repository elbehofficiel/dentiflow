import { useState, useEffect } from 'react'
import PatientForm from '../components/PatientForm.jsx'
import PatientList from '../components/PatientList.jsx'

function PatientsPage() {
  const [patients, setPatients] = useState([])

  useEffect(() => {
    const storedPatients = JSON.parse(localStorage.getItem('patients') || '[]')
    setPatients(storedPatients)
  }, [])

  const addPatient = (patient) => {
    const updatedPatients = patient.id
      ? patients.map(p => p.id === patient.id ? patient : p)
      : [...patients, patient]
    setPatients(updatedPatients)
    localStorage.setItem('patients', JSON.stringify(updatedPatients))
  }

  const deletePatient = (id) => {
    const updatedPatients = patients.filter((patient) => patient.id !== id)
    setPatients(updatedPatients)
    localStorage.setItem('patients', JSON.stringify(updatedPatients))
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Gestion des patients</h2>
      <PatientForm onAddPatient={addPatient} />
      <PatientList patients={patients} onAddPatient={addPatient} onDeletePatient={deletePatient} />
    </div>
  )
}

export default PatientsPage