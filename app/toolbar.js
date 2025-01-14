// components/FormattingToolbar.jsx
import { Save, AlignLeft, AlignCenter, AlignRight, Palette, Bold, Italic, Underline } from 'lucide-react'
import { useState } from 'react'

const SpreadsheetToolbar = ({ onFormatChange, selectedCells, cellStyles }) => {
    // Check if all selected cells have the same formatting
    const isFormatActive = (format) => {
      if (selectedCells.size === 0) return false;
      return Array.from(selectedCells).every(cellRef => 
        cellStyles[cellRef]?.[format]
      );
    };
  
    const handleFormatClick = (format) => {
      // Toggle the format for all selected cells
      const isCurrentlyActive = isFormatActive(format);
      onFormatChange(format, !isCurrentlyActive);
    };
  
    return (
      <div className="flex space-x-1">
        <button 
          className={`p-1 rounded ${isFormatActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          onClick={() => handleFormatClick('bold')}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button 
          className={`p-1 rounded ${isFormatActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          onClick={() => handleFormatClick('italic')}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button 
          className={`p-1 rounded ${isFormatActive('underline') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          onClick={() => handleFormatClick('underline')}
        >
          <Underline className="w-4 h-4" />
        </button>
      </div>
    );
  };

const FontSection = () => (
  <div className="flex items-center space-x-2">
    <select className="border rounded px-2 py-1 text-sm">
      <option>Calibri</option>
    </select>
    <select className="border rounded px-2 py-1 text-sm w-16">
      <option>11</option>
    </select>
  </div>
)

const AlignmentSection = () => (
  <div className="flex items-center space-x-1">
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
)

const ColorPicker = ({ showColorPicker, setShowColorPicker, colors, handleColorSelect }) => (
  <div className="relative">
    <button 
      className="p-1 hover:bg-gray-100 rounded flex items-center space-x-1"
      onClick={() => setShowColorPicker(!showColorPicker)}
    >
      <Palette className="w-4 h-4" />
    </button>
    
    {showColorPicker && (
      <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-50 w-64" 
           onBlur={() => setShowColorPicker(false)}>
        <div className="grid grid-cols-8 gap-1 p-2">
          {colors.map((color) => (
            <button
              key={color}
              className="w-4 h-4 rounded hover:scale-110 transition-transform"
              style={{ backgroundColor: color, border: '1px solid #e2e8f0' }}
              onClick={() => handleColorSelect(color)}
            />
          ))}
        </div>
      </div>
    )}
  </div>
)

const FormattingToolbar = ({
  exportToExcel,
  handleFormatChange,
  selectedCells,
  cellStyles,
  colors,
  handleColorSelect
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <div className="flex items-center space-x-6 p-1">
      <div className="border-r pr-4">
        <button className="p-2 hover:bg-gray-100 rounded" onClick={exportToExcel}>
          <Save className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center space-x-2 border-r pr-4">
        <FontSection />
        <SpreadsheetToolbar 
          onFormatChange={handleFormatChange}
          selectedCells={selectedCells}
          cellStyles={cellStyles}
        />
      </div>

      <div className="border-r pr-4">
        <AlignmentSection />
      </div>

      <ColorPicker 
        showColorPicker={showColorPicker}
        setShowColorPicker={setShowColorPicker}
        colors={colors}
        handleColorSelect={handleColorSelect}
      />
    </div>
  )
}

export default FormattingToolbar