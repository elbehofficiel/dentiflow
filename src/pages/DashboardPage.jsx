import { useState, useEffect } from 'react';
import { fetchPatients, fetchDoctors, fetchAppointments, fetchRooms, fetchInvoices, fetchPayments } from '../api.js';
import PageContainer from '../components/PageContainer.jsx';

function DashboardPage() {
  const [stats, setStats] = useState({ patients:0, doctors:0, appointments:0, rooms:0, invoices:0 });
  const [paidCount, setPaidCount] = useState(0);
  const [unpaidCount, setUnpaidCount] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [annualRevenue, setAnnualRevenue] = useState(0);
  const [quarterlyVAT, setQuarterlyVAT] = useState(0);
  const [patientsBySex, setPatientsBySex] = useState({});
  const [patientsPerDoctor, setPatientsPerDoctor] = useState({});
  const [doctorsBySex, setDoctorsBySex] = useState({});

  useEffect(() => {
    async function loadStats() {
      const [pats, docs, apps, rms, invs, pays] = await Promise.all([
        fetchPatients(),
        fetchDoctors(),
        fetchAppointments(),
        fetchRooms(),
        fetchInvoices(),
        fetchPayments()
      ]);
      setStats({
        patients: pats.length,
        doctors: docs.length,
        appointments: apps.length,
        rooms: rms.length,
        invoices: invs.length
      });
      // group patients by sex
      const bySex = pats.reduce((acc,p) => { acc[p.sex] = (acc[p.sex]||0)+1; return acc; },{});
      // patients per doctor
      const perDoc = {};
      docs.forEach(d=> { perDoc[`${d.firstName} ${d.lastName}`] = apps.filter(a=>a.doctorId===d.id).length; });
      // doctors by sex
      const docBySex = docs.reduce((acc,d)=>{ acc[d.sex] = (acc[d.sex]||0)+1; return acc; },{});
      setDoctorsBySex(docBySex);
      setPatientsBySex(bySex);
      setPatientsPerDoctor(perDoc);
      // invoices paid/unpaid
      setPaidCount(pays.length);
      setUnpaidCount(invs.length - pays.length);
      // revenues
      const now = new Date(), year = now.getFullYear(), month = now.getMonth();
      const monthlySum = invs.filter(i=>{ const d=new Date(i.date); return d.getFullYear()===year && d.getMonth()===month; }).reduce((a,i)=>a+i.amount,0);
      const annualSum = invs.filter(i=>new Date(i.date).getFullYear()===year).reduce((a,i)=>a+i.amount,0);
      const qIdx = Math.floor(month/3);
      const quarterSum = invs.filter(i=>{ const d=new Date(i.date); return d.getFullYear()===year && d.getMonth()>=qIdx*3 && d.getMonth()<qIdx*3+3; }).reduce((a,i)=>a+i.amount,0);
      setMonthlyRevenue(monthlySum);
      setAnnualRevenue(annualSum);
      setQuarterlyVAT(quarterSum * 0.2);
    }
    loadStats();
  }, []);

  return (
    <PageContainer title="Tableau de bord">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Patients</h3>
          <p className="text-2xl">{stats.patients}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Médecins</h3>
          <p className="text-2xl">{stats.doctors}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Rendez-vous</h3>
          <p className="text-2xl">{stats.appointments}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Salles</h3>
          <p className="text-2xl">{stats.rooms}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Factures</h3>
          <p className="text-2xl">{stats.invoices}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Payées</h3>
          <p className="text-2xl">{paidCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Non payées</h3>
          <p className="text-2xl">{unpaidCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">CA mensuel</h3>
          <p className="text-2xl">{monthlyRevenue} €</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">CA annuel</h3>
          <p className="text-2xl">{annualRevenue} €</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">TVA trimestrielle</h3>
          <p className="text-2xl">{quarterlyVAT.toFixed(2)} €</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Patients par sexe</h3>
          <ul className="list-disc list-inside">
            {Object.entries(patientsBySex).map(([sex,count])=><li key={sex}>{sex}: {count}</li>)}
          </ul>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Patients par médecin</h3>
          <ul className="list-disc list-inside">
            {Object.entries(patientsPerDoctor).map(([doc,count])=><li key={doc}>{doc}: {count}</li>)}
          </ul>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow mt-6">
        <h3 className="text-lg font-semibold mb-2">Personnel par sexe</h3>
        <ul className="list-disc list-inside">
          {Object.entries(doctorsBySex).map(([sex,count])=><li key={sex}>{sex}: {count}</li>)}
        </ul>
      </div>
    </PageContainer>
  );
}

export default DashboardPage;
