import { useState } from 'react';

function DocumentTypeForm({ onAddType, type }) {
  const [name, setName] = useState(type?.name || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onAddType({ id: type?.id || Date.now(), name });
      if (!type) setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-control mb-6 p-4 bg-base-100 shadow-md rounded-lg">
      <label className="label">
        <span className="label-text">Nom du type de document</span>
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input input-bordered w-full"
        placeholder="Entrez le nom du type"
        required
      />
      <button type="submit" className="btn btn-primary mt-2">
        {type ? 'Modifier' : 'Ajouter'}
      </button>
    </form>
  );
}

export default DocumentTypeForm;
