import React from 'react';

const SidebarItem = ({ icon, label, id, active, isLogout, disabled, onClick }) => {
  const getItemClasses = () => {
    const baseClasses = "w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group";
    
    if (disabled) {
      return `${baseClasses} opacity-50 cursor-not-allowed text-gray-400`;
    }
    
    if (active) {
      return `${baseClasses} bg-blue-50 text-blue-700 border border-blue-200 shadow-sm cursor-pointer`;
    }
    
    if (isLogout) {
      return `${baseClasses} text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 border border-transparent cursor-pointer`;
    }
    
    return `${baseClasses} text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm border border-transparent cursor-pointer`;
  };

  const getIconClasses = () => {
    if (disabled) return "text-gray-400";
    if (active) return "text-blue-600";
    if (isLogout) return "text-red-500 group-hover:text-red-600";
    return "text-gray-500 group-hover:text-gray-700";
  };

  const getLabelClasses = () => {
    if (disabled) return "text-gray-400";
    if (active) return "text-blue-700 font-semibold";
    if (isLogout) return "text-red-600 group-hover:text-red-700";
    return "text-gray-700 group-hover:text-gray-900";
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={getItemClasses()}
    >
      <span className={`text-lg mr-3 transition-colors duration-200 ${getIconClasses()}`}>
        {icon}
      </span>
      
      <span className={`flex-1 text-left transition-colors duration-200 ${getLabelClasses()}`}>
        {label}
      </span>
      
      {active && !isLogout && (
        <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
      )}
      
      {isLogout && !active && (
        <span className="ml-2 w-2 h-2 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
      )}
    </button>
  );
};

export default SidebarItem;