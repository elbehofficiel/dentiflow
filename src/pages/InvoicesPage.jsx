import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import PageContainer from '../components/PageContainer.jsx';

function InvoicesPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [form, setForm] = useState({ treatmentIds: [], patientId: '', amount: 0, status: 'généré' });
  const [settings, setSettings] = useState({ prefix: 'INV-', counter: 1 });

  useEffect(() => {
    const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const storedTreatments = JSON.parse(localStorage.getItem('treatments') || '[]');
    const storedSettings = JSON.parse(localStorage.getItem('invoiceSettings') || '{}');
    setInvoices(storedInvoices);
    setTreatments(storedTreatments);
    setSettings({ prefix: storedSettings.prefix || 'INV-', counter: storedSettings.counter || 1 });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!['ADMIN', 'INFERMIERE'].includes(user.role)) return;
    const selectedTreatments = treatments.filter((t) => form.treatmentIds.includes(t.id));
    const totalAmount = selectedTreatments.reduce((sum, t) => sum + (t.price || 0), 0);
    const newInvoice = { id: Date.now(), ...form, amount: totalAmount, date: new Date().toISOString() };
    const updatedInvoices = [...invoices, newInvoice];
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    setForm({ treatmentIds: [], patientId: '', amount: 0, status: 'généré' });
  };

  const confirmInvoice = (id) => {
    if (!['ADMIN', 'INFERMIERE'].includes(user.role)) return;
    const updatedInvoices = invoices.map((inv) =>
      inv.id === id && inv.status === 'généré'
        ? { ...inv, status: 'confirmé', reference: `${settings.prefix}${settings.counter.toString().padStart(4, '0')}` }
        : inv
    );
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    setSettings((prev) => {
      const newSettings = { ...prev, counter: prev.counter + 1 };
      localStorage.setItem('invoiceSettings', JSON.stringify(newSettings));
      return newSettings;
    });
  };

  const cancelInvoice = (id) => {
    if (!['ADMIN', 'INFERMIERE'].includes(user.role)) return;
    const updatedInvoices = invoices.map((inv) =>
      inv.id === id && inv.status === 'confirmé' ? { ...inv, status: 'annulé' } : inv
    );
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
  };

  const updateSettings = (e) => {
    e.preventDefault();
    if (user.role !== 'ADMIN') return;
    localStorage.setItem('invoiceSettings', JSON.stringify(settings));
  };

  return (
    <PageContainer title="Factures">
      {['ADMIN', 'INFERMIERE'].includes(user.role) && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <input
            type="number"
            placeholder="ID Patient"
            value={form.patientId}
            onChange={(e) => setForm({ ...form, patientId: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <select
            multiple
            value={form.treatmentIds}
            onChange={(e) => setForm({ ...form, treatmentIds: Array.from(e.target.selectedOptions, (option) => option.value) })}
            className="p-2 border rounded"
          >
            {treatments.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nature} (Dent {t.toothNumber}) - {t.price} €
              </option>
            ))}
          </select>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">Créer Facture</button>
        </form>
      )}
      {user.role === 'ADMIN' && (
        <form onSubmit={updateSettings} className="mb-6 space-y-4">
          <input
            placeholder="Préfixe"
            value={settings.prefix}
            onChange={(e) => setSettings({ ...settings, prefix: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Compteur"
            value={settings.counter}
            onChange={(e) => setSettings({ ...settings, counter: Number(e.target.value) })}
            className="p-2 border rounded"
            required
          />
          <button type="submit" className="bg-green-600 text-white p-2 rounded">Mettre à jour</button>
        </form>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Référence</th>
            <th className="border p-2">Patient</th>
            <th className="border p-2">Montant</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Statut</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td className="border p-2">{inv.reference || '-'}</td>
              <td className="border p-2">{inv.patientId}</td>
              <td className="border p-2">{inv.amount} €</td>
              <td className="border p-2">{new Date(inv.date).toLocaleDateString()}</td>
              <td className="border p-2">{inv.status}</td>
              <td className="border p-2">
                {['ADMIN', 'INFERMIERE'].includes(user.role) && inv.status === 'généré' && (
                  <button
                    onClick={() => confirmInvoice(inv.id)}
                    className="bg-green-500 text-white p-1 rounded mr-2"
                  >
                    Confirmer
                  </button>
                )}
                {['ADMIN', 'INFERMIERE'].includes(user.role) && inv.status === 'confirmé' && (
                  <button
                    onClick={() => cancelInvoice(inv.id)}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    Annuler
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageContainer>
  );
}

export default InvoicesPage;