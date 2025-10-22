import React from 'react';

const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={`
      bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-sm border border-blue-100 
      ${hover ? 'hover:shadow-lg transition duration-300' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;