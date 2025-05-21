import { useState, useEffect } from 'react'

function DoctorForm({ onAddDoctor, doctor }) {
  const [firstName, setFirstName] = useState(doctor?.firstName || '')
  const [lastName, setLastName] = useState(doctor?.lastName || '')
  const [email, setEmail] = useState(doctor?.email || '')
  const [specialtyId, setSpecialtyId] = useState(doctor?.specialtyId || '')
  const [age, setAge] = useState(doctor?.age || '')
  const [salary, setSalary] = useState(doctor?.salary || '')
  const [gender, setGender] = useState(doctor?.gender || '')
  const [phone, setPhone] = useState(doctor?.phone || '')
  const [roomId, setRoomId] = useState(doctor?.roomId || '')
  const [specialties, setSpecialties] = useState([])
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    const storedSpecialties = JSON.parse(localStorage.getItem('specialties') || '[]')
    const storedRooms = JSON.parse(localStorage.getItem('rooms') || '[]')
    setSpecialties(storedSpecialties)
    setRooms(storedRooms)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (firstName.trim() && lastName.trim() && specialtyId && roomId) {
      onAddDoctor({
        id: doctor?.id || Date.now(),
        firstName,
        lastName,
        email,
        specialtyId,
        age: parseInt(age) || 0,
        salary: parseFloat(salary) || 0,
        gender,
        phone,
        roomId,
      })
      if (!doctor) {
        setFirstName('')
        setLastName('')
        setEmail('')
        setSpecialtyId('')
        setAge('')
        setSalary('')
        setGender('')
        setPhone('')
        setRoomId('')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="text-lg font-medium">Prénom</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez le prénom"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="text-lg font-medium">Nom</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez le nom"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-lg font-medium">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez l'email"
          />
        </div>
        <div>
          <label htmlFor="specialty" className="text-lg font-medium">Spécialité</label>
          <select
            id="specialty"
            value={specialtyId}
            onChange={(e) => setSpecialtyId(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionnez une spécialité</option>
            {specialties.map(specialty => (
              <option key={specialty.id} value={specialty.id}>{specialty.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="age" className="text-lg font-medium">Âge</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez l'âge"
          />
        </div>
        <div>
          <label htmlFor="salary" className="text-lg font-medium">Salaire</label>
          <input
            type="number"
            id="salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez le salaire"
          />
        </div>
        <div>
          <label htmlFor="gender" className="text-lg font-medium">Sexe</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionnez</option>
            <option value="male">Homme</option>
            <option value="female">Femme</option>
          </select>
        </div>
        <div>
          <label htmlFor="phone" className="text-lg font-medium">Téléphone</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez le téléphone"
          />
        </div>
        <div>
          <label htmlFor="room" className="text-lg font-medium">Salle</label>
          <select
            id="room"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionnez une salle</option>
            {rooms.map(room => (
              <option key={room.id} value={room.id}>{room.name}</option>
            ))}
          </select>
        </div>
      </div>
      <button type="submit" className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        {doctor ? 'Modifier' : 'Ajouter'}
      </button>
    </form>
  )
}

export default DoctorForm