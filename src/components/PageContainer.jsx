import React from 'react';

export default function PageContainer({ title, children }) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body space-y-4">
        {title && <h2 className="card-title text-primary text-2xl">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
