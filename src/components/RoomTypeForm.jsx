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
    <form onSubmit={handleSubmit} className="form-control mb-6 p-4 bg-base-100 shadow-md rounded-lg">
      <div className="grid gap-4">
        <label htmlFor="roomTypeName" className="label">
          <span className="label-text text-lg font-medium">Nom du type de salle</span>
        </label>
        <input
          type="text"
          id="roomTypeName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered w-full"
          placeholder="Entrez le nom du type"
        />
        <button type="submit" className="btn btn-primary">
          {roomType ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  )
}

export default RoomTypeForm