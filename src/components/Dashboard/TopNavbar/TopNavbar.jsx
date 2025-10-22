import React, { useEffect, useState } from 'react';
import DropDownMenu from "../../UI/DropDownMenu.jsx";

const TopNavbar = ({ onMenuClick }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 lg:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="ml-4 text-xl font-semibold text-gray-900 lg:ml-0">
            Let’s level up,{user?.name || 'User'}! 🚀
          </h1>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
