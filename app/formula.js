import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

const FormulaPopup = ({ isOpen, onClose, result, ignoredVarchar }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 w-80 relative">
        <button 
          onClick={onClose}
          className="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded"
        >
          <X size={16} />
        </button>
        
        <div className="mt-2">
          <h3 className="text-lg font-semibold mb-2">Result</h3>
          <div className="text-2xl font-bold text-center py-3">
            {result}
          </div>
          {ignoredVarchar &&
            alert("Some text values were ignored in the calculation")
          }
        </div>
      </div>
    </div>
  );
};

const FormulaMenu = ({ gridData, selectedCells }) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [result, setResult] = useState(null);
  const [ignoredVarchar, setIgnoredVarchar] = useState(false);

  const getSelectedValues = () => {
    if (selectedCells.size === 0) {
      alert("Please select cells to perform calculations");
      return null;
    }

    const values = [];
    let hasIgnoredVarchar = false;

    selectedCells.forEach(cellRef => {
      const value = gridData[cellRef];
      if (value) {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          values.push(numValue);
        } else {
          hasIgnoredVarchar = true;
        }
      }
    });

    setIgnoredVarchar(hasIgnoredVarchar);
    return values;
  };

  const calculateFormula = (formula) => {
    const values = getSelectedValues();
    if (!values || values.length === 0) return;

    let result;
    switch (formula) {
      case 'SUM':
        result = values.reduce((sum, val) => sum + val, 0);
        break;
      case 'AVERAGE':
        result = values.reduce((sum, val) => sum + val, 0) / values.length;
        break;
      case 'MAX':
        result = Math.max(...values);
        break;
      case 'MIN':
        result = Math.min(...values);
        break;
      case 'COUNT':
        result = values.length;
        break;
      default:
        return;
    }

    setResult(result.toFixed(2));
    setPopupOpen(true);
  };

  return (
    <>
      <div className="relative group inline-block">
        <button 
          className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded"
          onClick={() => setPopupOpen(true)}
        >
          <HelpCircle size={16} />
          <span>Formula</span>
        </button>
        
        <div className="absolute hidden group-hover:block w-48 bg-white border rounded-lg shadow-lg mt-1 py-1">
          <button 
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => calculateFormula('SUM')}
          >
            SUM
          </button>
          <button 
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => calculateFormula('AVERAGE')}
          >
            AVERAGE
          </button>
          <button 
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => calculateFormula('MAX')}
          >
            MAX
          </button>
          <button 
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => calculateFormula('MIN')}
          >
            MIN
          </button>
          <button 
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => calculateFormula('COUNT')}
          >
            COUNT
          </button>
        </div>
      </div>

      <FormulaPopup
        isOpen={popupOpen}
        onClose={() => {
          setPopupOpen(false);
          setResult(null);
          setIgnoredVarchar(false);
        }}
        result={result}
        ignoredVarchar={ignoredVarchar}
      />
    </>
  );
};

export default FormulaMenu;