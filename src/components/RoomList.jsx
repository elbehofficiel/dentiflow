function RoomList({ rooms, deleteRoom }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.length === 0 ? (
        <p className="text-center col-span-full text-gray-600">Aucune salle enregistrée.</p>
      ) : (
        rooms.map((room) => (
          <div key={room.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">{room.name}</h3>
            <p className="text-gray-600 mb-1">Capacité: {room.capacity} patients</p>
            <p className="text-gray-600 mb-4">Équipement: {room.equipment}</p>
            <button
              onClick={() => deleteRoom(room.id)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Supprimer
            </button>
          </div>
        ))
      )}
    </div>
  )
}

export default RoomList