import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import RoomForm from '../components/RoomForm'
import RoomList from '../components/RoomList'

function RoomsPage() {
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    const storedRooms = localStorage.getItem('rooms')
    if (storedRooms) {
      setRooms(JSON.parse(storedRooms))
    }
  }, [])

  const addRoom = (room) => {
    const updatedRooms = [...rooms, room]
    setRooms(updatedRooms)
    localStorage.setItem('rooms', JSON.stringify(updatedRooms))
  }

  const deleteRoom = (id) => {
    const updatedRooms = rooms.filter((room) => room.id !== id)
    setRooms(updatedRooms)
    localStorage.setItem('rooms', JSON.stringify(updatedRooms))
  }

  return (
    <div>
      <Navbar />
      <div className="py-16 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Gestion des Salles</h2>
          <RoomForm addRoom={addRoom} />
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-center mb-6">Liste des Salles</h3>
            <RoomList rooms={rooms} deleteRoom={deleteRoom} />
          </div>
        </div>
      </div>
      <footer className="bg-blue-600 text-white py-6">
        <div className="container mx-auto text-center">
          <p>© 2025 Dentiflow. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}

export default RoomsPage