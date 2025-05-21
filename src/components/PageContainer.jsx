import React from 'react';

export default function PageContainer({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      {title && <h2 className="text-2xl font-semibold text-primary">{title}</h2>}
      {children}
    </div>
  );
}
