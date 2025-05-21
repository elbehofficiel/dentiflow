import { useState, useEffect } from 'react';

function AppointmentForm({ onAddAppointment, appointment }) {
  const [patientId, setPatientId] = useState(appointment?.patientId || '');
  const [doctorId, setDoctorId] = useState(appointment?.doctorId || '');
  const [roomId, setRoomId] = useState(appointment?.roomId || '');
  const [date, setDate] = useState(appointment?.date || '');
  const [time, setTime] = useState(appointment?.time || '');
  const [status, setStatus] = useState(appointment?.status || 'programmé');
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    setPatients(JSON.parse(localStorage.getItem('patients') || '[]'));
    setDoctors(JSON.parse(localStorage.getItem('doctors') || '[]'));
    setRooms(JSON.parse(localStorage.getItem('rooms') || '[]'));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (patientId && doctorId && roomId && date && time) {
      onAddAppointment({
        id: appointment?.id || Date.now(),
        patientId,
        doctorId,
        roomId,
        date,
        time,
        status,
      });
      if (!appointment) {
        setPatientId('');
        setDoctorId('');
        setRoomId('');
        setDate('');
        setTime('');
        setStatus('programmé');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="patient" className="text-lg font-medium">Patient</label>
          <select
            id="patient"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionnez un patient</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.firstName} {patient.lastName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="doctor" className="text-lg font-medium">Médecin</label>
          <select
            id="doctor"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionnez un médecin</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.firstName} {doctor.lastName}
              </option>
            ))}
          </select>
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
        <div>
          <label htmlFor="date" className="text-lg font-medium">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="time" className="text-lg font-medium">Heure</label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="status" className="text-lg font-medium">État</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="programmé">Programmé</option>
            <option value="effectué">Effectué</option>
            <option value="annulé">Annulé</option>
          </select>
        </div>
      </div>
      <button type="submit" className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        {appointment ? 'Modifier' : 'Ajouter'}
      </button>
    </form>
  );
}

export default AppointmentForm;