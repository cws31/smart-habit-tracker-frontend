import React from 'react';

const AuthButton = ({ 
  children, 
  type = 'button', 
  onClick, 
  disabled = false,
  className = '' 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex justify-center py-3 px-4 
        border border-transparent rounded-lg 
        text-sm font-medium text-white 
        bg-blue-600 hover:bg-blue-700 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
        transition duration-300 transform hover:scale-[1.02]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default AuthButton;