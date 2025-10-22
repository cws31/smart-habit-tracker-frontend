import React from 'react';

const AuthCard = ({ children, className = '' }) => {
  return (
    <div className={`
      bg-white rounded-2xl shadow-xl border border-blue-100 
      w-full max-w-md mx-auto p-8
      ${className}
    `}>
      {children}
    </div>
  );
};

export default AuthCard;