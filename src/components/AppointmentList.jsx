import { useState } from 'react';
import AppointmentForm from './AppointmentForm.jsx';

function AppointmentList({ appointments, onAddAppointment, onDeleteAppointment }) {
  const [editingAppointment, setEditingAppointment] = useState(null);

  return (
    <div className="space-y-4">
      {editingAppointment && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Modifier le rendez-vous</h3>
          <AppointmentForm
            appointment={editingAppointment}
            onAddAppointment={(updatedAppointment) => {
              onAddAppointment(updatedAppointment);
              setEditingAppointment(null);
            }}
          />
        </div>
      )}
      {appointments.length === 0 ? (
        <p className="text-gray-500">Aucun rendez-vous ajouté.</p>
      ) : (
        <ul className="space-y-2">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="flex justify-between items-center bg-white p-3 rounded shadow">
              <span>
                {appointment.date} à {appointment.time} - Patient ID: {appointment.patientId}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => setEditingAppointment(appointment)}
                  className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                >
                  Modifier
                </button>
                <button
                  onClick={() => onDeleteAppointment(appointment.id)}
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
  );
}

export default AppointmentList;