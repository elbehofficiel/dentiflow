import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import PageContainer from '../components/PageContainer.jsx';
import DocumentForm from '../components/DocumentForm.jsx';
import DocumentTypeList from '../components/DocumentTypeList.jsx';
import { fetchDocuments, createDocument, deleteDocument, updateDocument, fetchDocumentTypes, createDocumentType, deleteDocumentType, updateDocumentType } from '../api.js';

function DocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    async function load() {
      const [docsData, typesData] = await Promise.all([
        fetchDocuments(),
        fetchDocumentTypes()
      ]);
      setDocuments(docsData);
      setTypes(typesData);
    }
    load();
  }, []);

  const handleSaveDocument = async (doc) => {
    if (!['ADMIN', 'INFERMIERE'].includes(user.role)) return;
    if (doc.id) {
      await updateDocument(doc.id, { name: doc.name, typeId: doc.typeId, nature: doc.nature });
      setDocuments(prev => prev.map(d => d.id === doc.id ? doc : d));
    } else {
      const newDoc = await createDocument(doc);
      setDocuments(prev => [...prev, newDoc]);
    }
  };

  const handleDeleteDocument = async (id) => {
    if (!['ADMIN', 'INFERMIERE'].includes(user.role)) return;
    await deleteDocument(id);
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const handleAddType = async (type) => {
    if (!['ADMIN', 'INFERMIERE'].includes(user.role)) return;
    if (type.id) {
      await updateDocumentType(type.id, { name: type.name });
      setTypes(prev => prev.map(t => t.id === type.id ? type : t));
    } else {
      const newType = await createDocumentType({ name: type.name });
      setTypes(prev => [...prev, newType]);
    }
  };

  const handleDeleteType = async (id) => {
    if (!['ADMIN', 'INFERMIERE'].includes(user.role)) return;
    await deleteDocumentType(id);
    setTypes(prev => prev.filter(t => t.id !== id));
  };

  return (
    <PageContainer title="Documents">
      {['ADMIN', 'INFERMIERE'].includes(user.role) && (
        <>
          <DocumentForm onSave={handleSaveDocument} types={types} />
          <DocumentTypeList types={types} onAddType={handleAddType} onDeleteType={handleDeleteType} />
        </>
      )}
      <div className="overflow-x-auto mt-6">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Type</th>
              <th>Nature</th>
              {['ADMIN', 'INFERMIERE'].includes(user.role) && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {documents.map((d) => (
              <tr key={d.id}>
                <td>{d.name}</td>
                <td>{types.find(t => t.id === d.typeId)?.name}</td>
                <td>{d.nature.toUpperCase()}</td>
                {['ADMIN', 'INFERMIERE'].includes(user.role) && (
                  <td className="space-x-2">
                    <button onClick={() => handleSaveDocument(d)} className="btn btn-sm btn-warning">Modifier</button>
                    <button onClick={() => handleDeleteDocument(d.id)} className="btn btn-sm btn-error">Supprimer</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}

export default DocumentsPage;
