import React, { useState, useEffect } from 'react';

const ADULT_TEETH_SECTIONS = {
  UPPER_RIGHT: [18, 17, 16, 15, 14, 13, 12, 11],
  UPPER_LEFT: [21, 22, 23, 24, 25, 26, 27, 28],
  LOWER_LEFT: [31, 32, 33, 34, 35, 36, 37, 38],
  LOWER_RIGHT: [48, 47, 46, 45, 44, 43, 42, 41],
};

// Helper to parse input string like "11,12, 21-23" into a Set of numbers
const parseSelectedTeethString = (teethString) => {
  if (!teethString || typeof teethString !== 'string') return new Set();
  const selected = new Set();
  teethString.split(',').forEach(part => {
    part = part.trim();
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
          selected.add(i);
        }
      }
    } else {
      const num = Number(part);
      if (!isNaN(num)) {
        selected.add(num);
      }
    }
  });
  return selected;
};

// Helper to convert a Set of numbers back to a sorted, comma-separated string
const formatSelectedTeethSet = (teethSet) => {
  return Array.from(teethSet).sort((a, b) => a - b).join(', ');
};

const ToothChart = ({ initialSelectedTeeth = '', onSaveSelection, onCancel }) => {
  const [selectedTeeth, setSelectedTeeth] = useState(parseSelectedTeethString(initialSelectedTeeth));

  useEffect(() => {
    setSelectedTeeth(parseSelectedTeethString(initialSelectedTeeth));
  }, [initialSelectedTeeth]);

  const toggleTooth = (toothNumber) => {
    setSelectedTeeth(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(toothNumber)) {
        newSelected.delete(toothNumber);
      } else {
        newSelected.add(toothNumber);
      }
      return newSelected;
    });
  };

  const handleSave = () => {
    onSaveSelection(formatSelectedTeethSet(selectedTeeth));
  };

  const renderSection = (sectionTeeth, sectionName) => (
    <div className="mb-4">
      <h4 className="text-sm font-semibold text-gray-600 mb-1">{sectionName.replace('_', ' ')}</h4>
      <div className="grid grid-cols-8 gap-1">
        {sectionTeeth.map(toothNum => (
          <button
            key={toothNum}
            type="button"
            onClick={() => toggleTooth(toothNum)}
            className={`p-2 border rounded text-xs transition-colors
              ${selectedTeeth.has(toothNum) ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}
            `}
          >
            {toothNum}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">Sélectionner les dents</h3>
      
      {renderSection(ADULT_TEETH_SECTIONS.UPPER_RIGHT, 'SUPÉRIEUR DROIT')}
      {renderSection(ADULT_TEETH_SECTIONS.UPPER_LEFT, 'SUPÉRIEUR GAUCHE')}
      {renderSection(ADULT_TEETH_SECTIONS.LOWER_LEFT, 'INFÉRIEUR GAUCHE')}
      {renderSection(ADULT_TEETH_SECTIONS.LOWER_RIGHT, 'INFÉRIEUR DROIT')}

      <div className="mt-6">
        <p className="text-sm text-gray-700 mb-2">Sélection actuelle : 
          <span className="font-semibold ml-1">{formatSelectedTeethSet(selectedTeeth) || 'Aucune'}</span>
        </p>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Valider la sélection
        </button>
      </div>
    </div>
  );
};

export default ToothChart;
