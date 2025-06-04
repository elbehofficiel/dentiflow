import { useState } from 'react';
import DocumentTypeForm from './DocumentTypeForm.jsx';

function DocumentTypeList({ types, onAddType, onDeleteType }) {
  const [editingType, setEditingType] = useState(null);

  return (
    <div className="card bg-base-100 p-4 shadow-md rounded-lg space-y-4">
      <h3 className="text-xl font-semibold text-primary">Liste des types de documents</h3>
      {editingType && (
        <DocumentTypeForm
          type={editingType}
          onAddType={(updated) => { onAddType(updated); setEditingType(null); }}
        />
      )}
      {types.length === 0 ? (
        <p className="text-gray-500">Aucun type de document ajouté.</p>
      ) : (
        <ul className="space-y-2">
          {types.map((t) => (
            <li key={t.id} className="flex justify-between items-center bg-white p-3 rounded shadow">
              <span>{t.name}</span>
              <div className="space-x-2">
                <button onClick={() => setEditingType(t)} className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700">Modifier</button>
                <button onClick={() => onDeleteType(t.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DocumentTypeList;
