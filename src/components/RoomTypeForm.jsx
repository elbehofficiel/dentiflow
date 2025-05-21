import { useState } from 'react'

function RoomTypeForm({ onAddRoomType, roomType }) {
  const [name, setName] = useState(roomType?.name || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      onAddRoomType({ id: roomType?.id || Date.now(), name })
      if (!roomType) setName('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col space-y-2">
        <label htmlFor="roomTypeName" className="text-lg font-medium">Nom du type de salle</label>
        <input
          type="text"
          id="roomTypeName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Entrez le nom du type"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {roomType ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  )
}

export default RoomTypeForm