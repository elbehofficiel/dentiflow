import React from 'react';
import { useLocation } from 'react-router-dom';

const titles = {
  '/appointments': 'Rendez-vous',
  '/patients': 'Patients',
  '/doctors': 'Médecins',
  '/rooms': 'Salles',
  '/room-types': 'Types de salles',
  '/specialties': 'Spécialités',
  '/invoices': 'Factures',
  '/accounts': 'Comptes',
  '/dashboard': 'Tableau de bord',
};

export default function Header() {
  const { pathname } = useLocation();
  const title = titles[pathname] || '';
  return (
    <div className="mb-6">
      {title && <h1 className="text-3xl font-bold text-primary">{title}</h1>}
    </div>
  );
}
