import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="container mx-auto p-6 text-center">
      <h2 className="text-3xl font-bold mb-4">Page non trouvée</h2>
      <p className="text-gray-600 mb-6">Désolé, la page que vous cherchez n'existe pas.</p>
      <Link to="/" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        Retour à l'accueil
      </Link>
    </div>
  );
}

export default NotFoundPage;