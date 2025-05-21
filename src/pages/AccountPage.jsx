import { useAuth } from '../context/AuthContext.jsx';
import { useState, useEffect } from 'react';
import { fetchAccounts, updateAccountRole, toggleAccountState, deleteAccount as apiDeleteAccount } from '../api.js';
import PageContainer from '../components/PageContainer.jsx';

function AccountsPage() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  useEffect(() => { async function load(){ const data = await fetchAccounts(); setAccounts(data);} load(); }, []);

  if (user?.role !== 'ADMIN') {
    return <div>Accès refusé</div>;
  }

  const handleRole = async (id, role) => { await updateAccountRole(id, role==='USER'?'ADMIN':'USER'); setAccounts(await fetchAccounts()); };
  const handleState = async (id) => { await toggleAccountState(id); setAccounts(await fetchAccounts()); };
  const handleDelete = async (id) => { await apiDeleteAccount(id); setAccounts(await fetchAccounts()); };

  return (
    <PageContainer title="Gestion des comptes">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Email</th>
            <th className="border p-2">Rôle</th>
            <th className="border p-2">État</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td className="border p-2">{account.email}</td>
              <td className="border p-2">{account.role}</td>
              <td className="border p-2">{account.state}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleRole(account.id, account.role)}
                  className="bg-blue-500 text-white p-1 rounded mr-2"
                >
                  Changer rôle
                </button>
                <button
                  onClick={() => handleState(account.id)}
                  className="bg-yellow-500 text-white p-1 rounded mr-2"
                >
                  {account.state === 'activé' ? 'Désactiver' : 'Activer'}
                </button>
                <button
                  onClick={() => handleDelete(account.id)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageContainer>
  );
}

export default AccountsPage;