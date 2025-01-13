"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Save, ChevronDown, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Plus, FileText, HelpCircle, Copy, Scissors, Clipboard, X, Equal, ArrowUp, ArrowDown, Hash, ArrowUpCircle, ArrowDownCircle, Replace } from 'lucide-react';
import * as XLSX from 'xlsx';



export default function Home() {
  
  const [gridData, setGridData] = useState({});
  const [activeCell, setActiveCell] = useState("A1");
  const [editValue, setEditValue] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);
  const [clipboardData, setClipboardData] = useState(null);
  const [numColumns, setNumColumns] = useState(26);
  const [numRows, setNumRows] = useState(100);
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);

  const gridRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleMouseDown = (rowIndex, colIndex, e) => {
    const cellRef = getCellReference(rowIndex, colIndex);

    if (isCtrlPressed) {
      // Toggle individual cell selection with Ctrl
      setSelectedCells(prev => {
        const newSelection = new Set(prev);
        if (newSelection.has(cellRef)) {
          newSelection.delete(cellRef);
        } else {
          newSelection.add(cellRef);
        }
        return newSelection;
      });
    } else {
      // Start new drag selection
      setIsDragging(true);
      setDragStart({ row: rowIndex, col: colIndex });
      setDragEnd({ row: rowIndex, col: colIndex });
      if (!isCtrlPressed) {
        setSelectedCells(new Set([cellRef]));
      }
    }
    setActiveCell(cellRef);
  };

  const handleMouseMove = (rowIndex, colIndex) => {
    if (isDragging) {
      setDragEnd({ row: rowIndex, col: colIndex });
      
      // Calculate selected range
      const startRow = Math.min(dragStart.row, rowIndex);
      const endRow = Math.max(dragStart.row, rowIndex);
      const startCol = Math.min(dragStart.col, colIndex);
      const endCol = Math.max(dragStart.col, colIndex);

      // Update selected cells
      const newSelection = new Set();
      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          newSelection.add(getCellReference(r, c));
        }
      }
      setSelectedCells(newSelection);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };


  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);
  
  const getColumnLetter = (index) => {
    let column = '';
    while (index >= 0) {
      column = String.fromCharCode((index % 26) + 65) + column;
      index = Math.floor(index / 26) - 1;
    }
    return column;
  };
  const getCellReference = (row, col) => `${getColumnLetter(col)}${row + 1}`;

  
  const handleCellClick = (row, col) => {
    const cellRef = getCellReference(row, col);
    setActiveCell(cellRef);
    setEditValue(gridData[cellRef] || '');
  };

  
  // At the top of your component, add a console log in handleCellChange
  const handleCellChange = (row, col, value) => {
    console.log('Cell change:', row, col, value); // Add this line
    const cellRef = getCellReference(row, col);
    setGridData(prev => ({
      ...prev,
      [cellRef]: value
    }));
  };


  const handleFormulaBarChange = (value) => {
    setEditValue(value);
    if (activeCell) {
      setGridData(prev => ({
        ...prev,
        [activeCell]: value
      }));
    }
  };
  

  const handleMenuClick = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const closeAllMenus = () => {
    setActiveMenu(null);
  };

  const handleCut = () => {
    if (activeCell) {
      setClipboardData(gridData[activeCell]);
      setGridData(prev => ({
        ...prev,
        [activeCell]: ''
      }));
      setEditValue('');
    }
  };

  const handleCopy = () => {
    if (activeCell) {
      setClipboardData(gridData[activeCell]);
    }
  };

  const handlePaste = () => {
    if (activeCell && clipboardData !== null) {
      setGridData(prev => ({
        ...prev,
        [activeCell]: clipboardData
      }));
      setEditValue(clipboardData);
    }
  };

  
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const data = [];
    const maxRow = Math.max(...Object.keys(gridData).map(ref => parseInt(ref.match(/\d+/))));
    const maxCol = Math.max(...Object.keys(gridData).map(ref => ref.charCodeAt(0) - 65));
    
    for (let row = 0; row <= maxRow; row++) {
      const rowData = [];
      for (let col = 0; col <= maxCol; col++) {
        const cellRef = getCellReference(row, col);
        rowData.push(gridData[cellRef] || '');
      }
      data.push(rowData);
    }
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "spreadsheet.xlsx");
  };

  const getSelectedText = () => {
    if (selectedCells.size === 0) {
      alert("Please select cells to perform operations");
      return null;
    }
  
    const textValues = [];
    selectedCells.forEach(cellRef => {
      const value = gridData[cellRef];
      if (value !== undefined && value !== null) {
        textValues.push({ cellRef, value: String(value) });
      }
    });
  
    return textValues;
  };

  const applyDataQuality = (operation) => {
    const cells = getSelectedText();
    if (!cells || cells.length === 0) return;
  
    const updatedData = { ...gridData };
    
    switch (operation) {
      case 'TRIM':
        cells.forEach(({ cellRef, value }) => {
          updatedData[cellRef] = value.trim();
        });
        break;
        
      case 'UPPER':
        cells.forEach(({ cellRef, value }) => {
          updatedData[cellRef] = value.toUpperCase();
        });
        break;
        
      case 'LOWER':
        cells.forEach(({ cellRef, value }) => {
          updatedData[cellRef] = value.toLowerCase();
        });
        break;
        
      case 'REMOVE_DUPLICATES':
        const uniqueValues = new Set(cells.map(({ value }) => value));
        const duplicates = cells.filter(({ value }) => 
          cells.filter(cell => cell.value === value).length > 1
        );
        duplicates.forEach(({ cellRef }) => {
          updatedData[cellRef] = '';
        });
        alert(`Removed ${duplicates.length} duplicate values`);
        break;
        
      case 'FIND_AND_REPLACE':
        const findText = prompt('Enter text to find:');
        if (!findText) return;
        
        const replaceText = prompt('Enter replacement text:');
        if (replaceText === null) return;
        
        let replacements = 0;
        cells.forEach(({ cellRef, value }) => {
          if (value.includes(findText)) {
            updatedData[cellRef] = value.replaceAll(findText, replaceText);
            replacements++;
          }
        });
        alert(`Replaced ${replacements} occurrences`);
        break;
        
      default:
        return;
    }
    
    setGridData(updatedData);
  };

  
  const menus = {
    file: {
      items: [
        { label: 'New', icon: <FileText />, onClick: () => setGridData({}) },
        { label: 'Save as Excel', icon: <Save />, onClick: exportToExcel },
      ]
    },
    edit: {
      items: [
        { 
          label: 'Cut', 
          icon: <Scissors />, 
          onClick: handleCut,
          disabled: !activeCell
        },
        { 
          label: 'Copy', 
          icon: <Copy />, 
          onClick: handleCopy,
          disabled: !activeCell
        },
        { 
          label: 'Paste', 
          icon: <Clipboard />, 
          onClick: handlePaste,
          disabled: !activeCell || clipboardData === null
        },
      ]
    },
    formula: {
      items: [
        { 
          label: 'Sum',
          icon: <Plus />,
          onClick: () => calculateFormula('SUM'),
          disabled: selectedCells.size === 0
        },
        { 
          label: 'Average',
          icon: <Equal />,
          onClick: () => calculateFormula('AVERAGE'),
          disabled: selectedCells.size === 0
        },
        { 
          label: 'Max',
          icon: <ArrowUp />,
          onClick: () => calculateFormula('MAX'),
          disabled: selectedCells.size === 0
        },
        { 
          label: 'Min',
          icon: <ArrowDown />,
          onClick: () => calculateFormula('MIN'),
          disabled: selectedCells.size === 0
        },
        { 
          label: 'Count',
          icon: <Hash />,
          onClick: () => calculateFormula('COUNT'),
          disabled: selectedCells.size === 0
        }
      ]
    },
    
    dataQuality: {
      items: [
        {
          label: 'Trim Whitespace',
          icon: <Scissors />,
          onClick: () => applyDataQuality('TRIM'),
          disabled: selectedCells.size === 0
        },
        {
          label: 'To Uppercase',
          icon: <ArrowUpCircle />,
          onClick: () => applyDataQuality('UPPER'),
          disabled: selectedCells.size === 0
        },
        {
          label: 'To Lowercase',
          icon: <ArrowDownCircle />,
          onClick: () => applyDataQuality('LOWER'),
          disabled: selectedCells.size === 0
        },
        {
          label: 'Remove Duplicates',
          icon: <Copy />,
          onClick: () => applyDataQuality('REMOVE_DUPLICATES'),
          disabled: selectedCells.size === 0
        },
        {
          label: 'Find and Replace',
          icon: <Replace />,
          onClick: () => applyDataQuality('FIND_AND_REPLACE'),
          disabled: selectedCells.size === 0
        }
      ]
    },
    help: {
      items: [
        { label: 'About', icon: <HelpCircle />, onClick: () => alert("This app is created as part of the Zeotap internship assignment by Karthik R.") },
      ]
    },
  };

  const getSelectedValues = () => {
    if (selectedCells.size === 0) {
      alert("Please select cells to perform calculations");
      return null;
    }
  
    const values = [];
    let hasVarchar = false;
  
    selectedCells.forEach(cellRef => {
      const value = gridData[cellRef];
      if (value) {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          values.push(numValue);
        } else {
          hasVarchar = true;
        }
      }
    });
  
    if (hasVarchar) {
      alert("The selected cells have varchar and it has been ignored");
    }
  
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
  
    alert(`${formula} Result: ${result.toFixed(2)}`);
  };
  
  const DropdownMenu = ({ isOpen, items, onClose }) => {
    if (!isOpen) return null;
    
    return (
      <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md border z-50 min-w-[200px]">
        {items.map((item, index) => (
          <button
            key={index}
            className={`w-full text-left px-4 py-2 flex items-center space-x-2 
              ${item.disabled 
                ? 'opacity-50 cursor-not-allowed bg-gray-50' 
                : 'hover:bg-gray-100 cursor-pointer'}`}
            onClick={() => {
              if (!item.disabled) {
                item.onClick();
                onClose();
              }
            }}
          >
            {item.icon && <span className="w-5 h-5">{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    );
  };

  const insertRow = (afterIndex) => {
    const newGridData = {};
    
    // Move all existing cell data below the insertion point down by one row
    Object.entries(gridData).forEach(([cellRef, value]) => {
      const col = cellRef.match(/[A-Z]+/)[0];
      const row = parseInt(cellRef.match(/\d+/)[0]);
      
      if (row > afterIndex + 1) {
        const newCellRef = `${col}${row + 1}`;
        newGridData[newCellRef] = value;
      } else {
        newGridData[cellRef] = value;
      }
    });
    
    setGridData(newGridData);
    setNumRows(prev => prev + 1);
  };

  const insertColumn = (afterIndex) => {
    const newGridData = {};
    
    // Move all existing cell data to the right of the insertion point over by one column
    Object.entries(gridData).forEach(([cellRef, value]) => {
      const colMatch = cellRef.match(/[A-Z]+/)[0];
      const col = colMatch.split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0) - 1;
      const row = parseInt(cellRef.match(/\d+/)[0]);
      
      if (col > afterIndex) {
        const newCol = getColumnLetter(col + 1);
        const newCellRef = `${newCol}${row}`;
        newGridData[newCellRef] = value;
      } else {
        newGridData[cellRef] = value;
      }
    });
    
    setGridData(newGridData);
    setNumColumns(prev => prev + 1);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100" onClick={() => closeAllMenus()}>
      <header className="bg-white border-b">
        <div className="flex items-center space-x-4 p-1 bg-[#107c41] border-b relative">
          {Object.entries(menus).map(([menuName, menuConfig]) => (
            <div key={menuName} className="relative">
              <button 
                className="hover:bg-green-800 px-3 py-1 flex items-center text-white text-sm capitalize"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuClick(menuName);
                }}
              >
                {menuName} <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              <DropdownMenu
                isOpen={activeMenu === menuName}
                items={menuConfig.items}
                onClose={closeAllMenus}
              />
            </div>
          ))}
        </div>

        {/* Command Toolbar */}
        <div className="flex items-center space-x-6 p-1">
          <div className="border-r pr-4">
            <button className="p-2 hover:bg-gray-100 rounded" onClick={()=>exportToExcel()} >
              <Save className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2 border-r pr-4">
            <select className="border rounded px-2 py-1 text-sm">
              <option>Calibri</option>
              <option>Arial</option>
            </select>
            <select className="border rounded px-2 py-1 text-sm w-16">
              <option>11</option>
              <option>12</option>
            </select>
            <div className="flex space-x-1">
              <button className="p-1 hover:bg-gray-100 rounded">
                <Bold className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Italic className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Underline className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-1 border-r pr-4">
            <button className="p-1 hover:bg-gray-100 rounded">
              <AlignLeft className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <AlignCenter className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <AlignRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Formula Bar */}
      <div className="flex items-center space-x-2 p-1 bg-white border-b">
        <div className="border rounded px-2 py-1 w-32 text-sm bg-gray-50">
          {activeCell || ''}
        </div>
        <div className="border rounded px-2 py-1 flex-grow text-sm">
          <input
            type="text"
            className="w-full focus:outline-none"
            placeholder="fx"
            value={editValue}
            onChange={(e) => handleFormulaBarChange(e.target.value)}
          />
        </div>
      </div>

      {/* Spreadsheet Grid */}
      <main className="flex-grow overflow-auto">
      <div className="relative" ref={gridRef}>
        {/* Column Headers */}
        <div className="flex border-b bg-gray-50 sticky top-0">
          <div className="w-10 border-r p-1"></div>
          {Array.from({ length: numColumns }, (_, i) => (
            <div key={i} className="relative group w-24 border-r p-1 text-center text-sm">
              <div>{getColumnLetter(i)}</div>
              <button
                className="absolute hidden group-hover:block right-0 top-0 h-full w-1 bg-green-500 hover:w-3 transition-all cursor-col-resize"
                onClick={(e) => {
                  e.stopPropagation();
                  insertColumn(i);
                }}
              />
            </div>
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: numRows }, (_, rowIndex) => (
          <div key={rowIndex} className="flex border-b group">
            <div className="relative w-10 border-r bg-gray-50 p-1 text-sm text-center">
              {rowIndex + 1}
              <button
                className="absolute hidden group-hover:block left-0 bottom-0 h-1 w-full bg-green-500 hover:h-3 transition-all cursor-row-resize"
                onClick={(e) => {
                  e.stopPropagation();
                  insertRow(rowIndex);
                }}
              />
            </div>
            {Array.from({ length: numColumns }, (_, colIndex) => {
              const cellRef = getCellReference(rowIndex, colIndex);
              return (
                <div
                  key={colIndex}
                  className={`w-24 border-r p-1 cursor-text ${
                    selectedCells.has(cellRef) ? 'bg-blue-100' : ''
                  } ${activeCell === cellRef ? 'outline outline-1 outline-blue-500' : 'hover:bg-gray-50'}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onMouseDown={(e) => handleMouseDown(rowIndex, colIndex, e)}
                  onMouseMove={() => handleMouseMove(rowIndex, colIndex)}
                >
                  <input
                    type="text"
                    className="w-full h-full focus:outline-none bg-transparent"
                    value={gridData[cellRef] || ''}
                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </main>


      {/* Status Bar */}
      <footer className="bg-gray-100 border-t p-1 flex items-center text-sm">
        <div className="flex-grow">Ready</div>
        <div className="flex items-center space-x-4">
          <button className="hover:bg-gray-200 px-2 py-1 rounded flex items-center">
            100% <ChevronDown className="w-4 h-4 ml-1" />
          </button>
          <button className="hover:bg-gray-200 px-2 py-1 rounded">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}