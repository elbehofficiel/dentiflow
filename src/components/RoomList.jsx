import { useState, useEffect } from 'react'
import RoomForm from './RoomForm.jsx'

function RoomList({ rooms, onAddRoom, onDeleteRoom }) {
  const [editingRoom, setEditingRoom] = useState(null)
  const [roomTypes, setRoomTypes] = useState([])

  useEffect(() => {
    const storedRoomTypes = JSON.parse(localStorage.getItem('roomTypes') || '[]')
    setRoomTypes(storedRoomTypes)
  }, [])

  const getRoomTypeName = (typeId) => {
    const type = roomTypes.find(t => t.id === typeId)
    return type ? type.name : 'Inconnu'
  }

  return (
    <div className="space-y-4">
      {editingRoom && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Modifier la salle</h3>
          <RoomForm
            room={editingRoom}
            onAddRoom={(updatedRoom) => {
              onAddRoom(updatedRoom)
              setEditingRoom(null)
            }}
          />
        </div>
      )}
      {rooms.length === 0 ? (
        <p className="text-gray-500">Aucune salle ajoutée.</p>
      ) : (
        <ul className="space-y-2">
          {rooms.map((room) => (
            <li key={room.id} className="flex justify-between items-center bg-white p-3 rounded shadow">
              <span>
                {room.name} (Type: {getRoomTypeName(room.typeId)}, État: {room.status === 'available' ? 'Disponible' : 'Hors service'})
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => setEditingRoom(room)}
                  className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                >
                  Modifier
                </button>
                <button
                  onClick={() => onDeleteRoom(room.id)}
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

export default RoomList