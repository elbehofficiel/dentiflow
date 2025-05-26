import { useState } from 'react'
import RoomTypeForm from './RoomTypeForm.jsx'

function RoomTypeList({ roomTypes, onAddRoomType, onDeleteRoomType }) {
  const [editingRoomType, setEditingRoomType] = useState(null)

  return (
    <div className="card bg-base-100 p-4 shadow-md rounded-lg space-y-4">
      <h3 className="text-xl font-semibold text-primary">Liste des types de salles</h3>
      {editingRoomType && (
        <RoomTypeForm
          roomType={editingRoomType}
          onAddRoomType={(updated) => {
            onAddRoomType(updated)
            setEditingRoomType(null)
          }}
        />
      )}
      {roomTypes.length === 0 ? (
        <p className="text-gray-500">Aucun type de salle ajouté.</p>
      ) : (
        <ul className="space-y-2">
          {roomTypes.map((type) => (
            <li
              key={type.id}
              className="flex justify-between items-center bg-white p-3 rounded shadow"
            >
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
