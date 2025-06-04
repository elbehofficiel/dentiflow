import { useState } from 'react';

function DocumentForm({ onSave, document, types }) {
  const [name, setName] = useState(document?.name || '');
  const [typeId, setTypeId] = useState(document?.typeId || '');
  const [nature, setNature] = useState(document?.nature || 'pdf');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && typeId && nature) {
      onSave({ id: document?.id, name, typeId: Number(typeId), nature });
      if (!document) {
        setName('');
        setTypeId('');
        setNature('pdf');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-control mb-6 p-4 bg-base-100 shadow-md rounded-lg">
      <div className="grid gap-4">
        <label className="label">
          <span className="label-text">Nom du document</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Entrez le nom"
          className="input input-bordered w-full"
          required
        />
        <label className="label">
          <span className="label-text">Type de document</span>
        </label>
        <select
          value={typeId}
          onChange={(e) => setTypeId(e.target.value)}
          className="select select-bordered w-full"
          required
        >
          <option value="">Choisir un type</option>
          {types.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <label className="label">
          <span className="label-text">Nature</span>
        </label>
        <select
          value={nature}
          onChange={(e) => setNature(e.target.value)}
          className="select select-bordered w-full"
          required
        >
          <option value="pdf">PDF</option>
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
        </select>
        <button type="submit" className="btn btn-primary">
          {document ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
}

export default DocumentForm;
