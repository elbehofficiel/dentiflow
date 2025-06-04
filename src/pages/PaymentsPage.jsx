import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchPayments, createPayment, deletePayment, fetchInvoices } from '../api.js';
import PageContainer from '../components/PageContainer.jsx';

export default function PaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [form, setForm] = useState({ invoiceId: '', mode: '', amount: '' });

  useEffect(() => {
    async function load() {
      const [pays, invs] = await Promise.all([fetchPayments(), fetchInvoices()]);
      setPayments(pays);
      setInvoices(invs);
    }
    load();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!['ADMIN','INFIRMIERE'].includes(user.role)) return;
    const newPay = await createPayment({ invoiceId: Number(form.invoiceId), mode: form.mode, amount: Number(form.amount) });
    setPayments(prev => [...prev, newPay]);
    setForm({ invoiceId: '', mode: '', amount: '' });
  };

  const handleDelete = async id => {
    if (!['ADMIN','INFIRMIERE'].includes(user.role)) return;
    await deletePayment(id);
    setPayments(prev => prev.filter(p => p.id !== id));
  };

  return (
    <PageContainer title="Paiements">
      {['ADMIN','INFIRMIERE'].includes(user.role) && (
        <form onSubmit={handleSubmit} className="mb-4 flex space-x-2">
          <select name="invoiceId" value={form.invoiceId} onChange={handleChange} required className="border p-2 rounded">
            <option value="">Sélectionner facture</option>
            {invoices.map(inv => (
              <option key={inv.id} value={inv.id}>{inv.id} - {inv.client || inv.patientId}</option>
            ))}
          </select>
          <input name="mode" value={form.mode} onChange={handleChange} placeholder="Mode" className="border p-2 rounded" required />
          <input name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="Montant" className="border p-2 rounded" required />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">Ajouter</button>
        </form>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Facture</th>
            <th className="border p-2">Mode</th>
            <th className="border p-2">Montant</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id}>
              <td className="border p-2">{p.id}</td>
              <td className="border p-2">{p.invoiceId}</td>
              <td className="border p-2">{p.mode}</td>
              <td className="border p-2">{p.amount} €</td>
              <td className="border p-2">
                {['ADMIN','INFIRMIERE'].includes(user.role) && (
                  <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white p-1 rounded">Supprimer</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageContainer>
  );
}
