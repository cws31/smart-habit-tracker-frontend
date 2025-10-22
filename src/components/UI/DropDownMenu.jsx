import React, { useState, useRef, useEffect } from 'react';

const DropdownMenu = ({ trigger, children, align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignmentClasses = {
    right: 'right-0',
    left: 'left-0'
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none"
      >
        {trigger}
      </button>

      {isOpen && (
        <div className={`absolute ${alignmentClasses[align]} mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50`}>
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;