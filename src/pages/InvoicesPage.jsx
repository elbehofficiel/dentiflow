import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import PageContainer from '../components/PageContainer.jsx';

function InvoicesPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  // Traitements pour la facture en cours
  const [invoiceTreatments, setInvoiceTreatments] = useState([]);
  const [newTreatment, setNewTreatment] = useState({ nature: '', toothNumber: '', price: '' });
  const [form, setForm] = useState({ treatmentIds: [], patientId: '', amount: 0, paidAmount: 0, paymentMethod: 'Cash', status: 'généré' });
  const [settings, setSettings] = useState({ prefix: 'INV-', counter: 1 });

  useEffect(() => {
    const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const storedSettings = JSON.parse(localStorage.getItem('invoiceSettings') || '{}');
    setInvoices(storedInvoices);
    setSettings({ prefix: storedSettings.prefix || 'INV-', counter: storedSettings.counter || 1 });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!['ADMIN', 'INFERMIERE'].includes(user.role)) return;
    const selectedTreatments = invoiceTreatments;
    const totalAmount = selectedTreatments.reduce((sum, t) => sum + (t.price || 0), 0);
    const newInvoice = { id: Date.now(), ...form, amount: totalAmount, date: new Date().toISOString() };
    const updatedInvoices = [...invoices, newInvoice];
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    setForm({ treatmentIds: [], patientId: '', amount: 0, paidAmount: 0, paymentMethod: 'Cash', status: 'généré' });
    setInvoiceTreatments([]);
  };

  // Ajoute un soin à la facture courante
  const handleAddTreatment = (e) => {
    e.preventDefault();
    const t = { id: Date.now().toString(), nature: newTreatment.nature, toothNumber: newTreatment.toothNumber, price: Number(newTreatment.price) };
    setInvoiceTreatments(prev => [...prev, t]);
    setNewTreatment({ nature: '', toothNumber: '', price: '' });
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

  const regenerateInvoice = (id) => {
    if (!['ADMIN', 'INFERMIERE'].includes(user.role)) return;
    const updatedInvoices = invoices.map((inv) =>
      inv.id === id && inv.status === 'annulé'
        ? { ...inv, status: 'confirmé', reference: `${settings.prefix}${settings.counter.toString().padStart(4, '0')}`, date: new Date().toISOString() }
        : inv
    );
    setInvoices(updatedInvoices);
    const newSettings = { ...settings, counter: settings.counter + 1 };
    setSettings(newSettings);
    localStorage.setItem('invoiceSettings', JSON.stringify(newSettings));
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
        <div className="card bg-base-100 shadow-md rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Créer une facture</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Saisie des soins pour la facture */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input type="text" placeholder="Nature" value={newTreatment.nature} onChange={e => setNewTreatment({ ...newTreatment, nature: e.target.value })} className="input input-bordered w-full" required />
              <input type="text" placeholder="Numéro dent" value={newTreatment.toothNumber} onChange={e => setNewTreatment({ ...newTreatment, toothNumber: e.target.value })} className="input input-bordered w-full" required />
              <input type="number" placeholder="Prix €" value={newTreatment.price} onChange={e => setNewTreatment({ ...newTreatment, price: e.target.value })} className="input input-bordered w-full" required />
              <button type="button" onClick={handleAddTreatment} className="btn btn-accent">Ajouter soin</button>
            </div>
            {/* Liste des soins ajoutés */}
            <div className="space-y-1">
              <h4 className="font-medium">Traitements ajoutés :</h4>
              <ul className="list-disc list-inside ml-4">
                {invoiceTreatments.map(t => <li key={t.id}>{`${t.nature} (Dent ${t.toothNumber}) - ${t.price}€`}</li>)}
              </ul>
            </div>
            {/* Infos facture */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="form-control">
                <label className="label"><span className="label-text">ID Patient</span></label>
                <input
                  type="number"
                  placeholder="ID Patient"
                  value={form.patientId}
                  onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Montant payé</span></label>
                <input
                  type="number"
                  min="0"
                  max={form.amount}
                  placeholder="€"
                  value={form.paidAmount}
                  onChange={(e) => setForm({ ...form, paidAmount: Number(e.target.value) })}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Mode de paiement</span></label>
                <select
                  value={form.paymentMethod}
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                  className="select select-bordered w-full"
                >
                  {['Cash', 'Carte', 'Chèque', 'Virement'].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary w-full">Créer Facture</button>
              </div>
            </div>
          </form>
        </div>
      )}
      {user.role === 'ADMIN' && (
        <div className="card bg-base-100 shadow-md rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-secondary mb-4">Paramètres facture</h2>
          <form onSubmit={updateSettings} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="form-control">
              <label className="label"><span className="label-text">Préfixe</span></label>
              <input
                placeholder="Préfixe"
                value={settings.prefix}
                onChange={(e) => setSettings({ ...settings, prefix: e.target.value })}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Compteur</span></label>
              <input
                type="number"
                placeholder="Compteur"
                value={settings.counter}
                onChange={(e) => setSettings({ ...settings, counter: Number(e.target.value) })}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn btn-success w-full">Mettre à jour</button>
            </div>
          </form>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Réf.</th>
              <th>Patient</th>
              <th>Montant</th>
              <th>Payé</th>
              <th>Mode</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.reference || '-'}</td>
                <td>{inv.patientId}</td>
                <td>{inv.amount}€</td>
                <td>{inv.paidAmount || 0}€</td>
                <td>{inv.paymentMethod || '-'}</td>
                <td>{new Date(inv.date).toLocaleDateString()}</td>
                <td><span className={`badge ${inv.status==='généré'? 'badge-warning': inv.status==='confirmé'?'badge-success':'badge-error'}`}>{inv.status}</span></td>
                <td>
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
                      className="btn btn-error btn-sm"
                    >
                      Annuler
                    </button>
                  )}
                  {['ADMIN', 'INFERMIERE'].includes(user.role) && inv.status === 'annulé' && (
                    <button
                      onClick={() => regenerateInvoice(inv.id)}
                      className="btn btn-secondary btn-sm ml-2"
                    >
                      Régénérer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}

export default InvoicesPage;