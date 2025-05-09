import { useState } from 'react'

function RoomForm({ addRoom }) {
  const [name, setName] = useState('')
  const [capacity, setCapacity] = useState('')
  const [equipment, setEquipment] = useState('')

  const handleSubmit = () => {
    if (name && capacity && equipment) {
      addRoom({ id: Date.now(), name, capacity: parseInt(capacity), equipment })
      setName('')
      setCapacity('')
      setEquipment('')
    } else {
      alert('Veuillez remplir tous les champs.')
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Ajouter une Salle</h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="name">Nom de la salle</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded-lg"
          placeholder="Ex: Salle 1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="capacity">Capacité (patients)</label>
        <input
          type="number"
          id="capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className="w-full p-3 border rounded-lg"
          placeholder="Ex: 2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="equipment">Équipement</label>
        <input
          type="text"
          id="equipment"
          value={equipment}
          onChange={(e) => setEquipment(e.target.value)}
          className="w-full p-3 border rounded-lg"
          placeholder="Ex: Fauteuil dentaire, Radiographie"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
      >
        Ajouter
      </button>
    </div>
  )
}

export default RoomForm