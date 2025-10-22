import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick, 
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition duration-300 transform hover:scale-105';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg',
    secondary: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
    white: 'bg-white text-blue-600 hover:bg-blue-50'
  };

  return (
    <button 
      type={type}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;