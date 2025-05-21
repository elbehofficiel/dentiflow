import { useState, useEffect } from 'react'
import DoctorForm from './DoctorForm.jsx'

function DoctorList({ doctors, onAddDoctor, onDeleteDoctor }) {
  const [editingDoctor, setEditingDoctor] = useState(null)
  const [specialties, setSpecialties] = useState([])
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    const storedSpecialties = JSON.parse(localStorage.getItem('specialties') || '[]')
    const storedRooms = JSON.parse(localStorage.getItem('rooms') || '[]')
    setSpecialties(storedSpecialties)
    setRooms(storedRooms)
  }, [])

  const getSpecialtyName = (specialtyId) => {
    const specialty = specialties.find(s => s.id === specialtyId)
    return specialty ? specialty.name : 'Inconnu'
  }

  const getRoomName = (roomId) => {
    const room = rooms.find(r => r.id === roomId)
    return room ? room.name : 'Inconnu'
  }

  return (
    <div className="space-y-4">
      {editingDoctor && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Modifier le médecin</h3>
          <DoctorForm
            doctor={editingDoctor}
            onAddDoctor={(updatedDoctor) => {
              onAddDoctor(updatedDoctor)
              setEditingDoctor(null)
            }}
          />
        </div>
      )}
      {doctors.length === 0 ? (
        <p className="text-gray-500">Aucun médecin ajouté.</p>
      ) : (
        <ul className="space-y-2">
          {doctors.map((doctor) => (
            <li key={doctor.id} className="flex justify-between items-center bg-white p-3 rounded shadow">
              <span>
                {doctor.firstName} {doctor.lastName} 
                {doctor.email && ` (${doctor.email})`}
                {`, Spécialité: ${getSpecialtyName(doctor.specialtyId)}`}
                {`, Salle: ${getRoomName(doctor.roomId)}`}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => setEditingDoctor(doctor)}
                  className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                >
                  Modifier
                </button>
                <button
                  onClick={() => onDeleteDoctor(doctor.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
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

export default DoctorList