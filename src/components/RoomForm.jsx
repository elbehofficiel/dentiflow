import { useState, useEffect } from 'react'

function RoomForm({ onAddRoom, room }) {
  const [name, setName] = useState(room?.name || '')
  const [typeId, setTypeId] = useState(room?.typeId || '')
  const [status, setStatus] = useState(room?.status || 'available')
  const [roomTypes, setRoomTypes] = useState([])

  useEffect(() => {
    const storedRoomTypes = JSON.parse(localStorage.getItem('roomTypes') || '[]')
    setRoomTypes(storedRoomTypes)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim() && typeId) {
      onAddRoom({ id: room?.id || Date.now(), name, typeId, status })
      if (!room) {
        setName('')
        setTypeId('')
        setStatus('available')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col space-y-2">
        <label htmlFor="roomName" className="text-lg font-medium">Nom de la salle</label>
        <input
          type="text"
          id="roomName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Entrez le nom de la salle"
        />
        <label htmlFor="roomType" className="text-lg font-medium">Type de salle</label>
        <select
          id="roomType"
          value={typeId}
          onChange={(e) => setTypeId(e.target.value)}
          className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sélectionnez un type</option>
          {roomTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
        <label htmlFor="roomStatus" className="text-lg font-medium">État</label>
        <select
          id="roomStatus"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="available">Disponible</option>
          <option value="out-of-service">Hors service</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {room ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  )
}

export default RoomForm