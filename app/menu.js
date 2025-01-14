import { ChevronDown } from 'lucide-react'

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

const MenuBar = ({ menus, activeMenu, handleMenuClick, closeAllMenus }) => {
  return (
    <div className="flex items-center space-x-4 p-1 bg-green-700 border-b relative">
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
  )
}

export default MenuBar