import { useState } from 'react'
import RoomTypeForm from './RoomTypeForm.jsx'

function RoomTypeList({ roomTypes, onAddRoomType, onDeleteRoomType }) {
  const [editingRoomType, setEditingRoomType] = useState(null)

  return (
    <div className="space-y-4">
      {editingRoomType && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Modifier le type de salle</h3>
          <RoomTypeForm
            roomType={editingRoomType}
            onAddRoomType={(updatedRoomType) => {
              onAddRoomType(updatedRoomType)
              setEditingRoomType(null)
            }}
          />
        </div>
      )}
      {roomTypes.length === 0 ? (
        <p className="text-gray-500">Aucun type de salle ajouté.</p>
      ) : (
        <ul className="space-y-2">
          {roomTypes.map((type) => (
            <li key={type.id} className="flex justify-between items-center bg-white p-3 rounded shadow">
              <span>{type.name}</span>
              <div className="space-x-2">
                <button
                  onClick={() => setEditingRoomType(type)}
                  className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                >
                  Modifier
                </button>
                <button
                  onClick={() => onDeleteRoomType(type.id)}
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

export default RoomTypeList