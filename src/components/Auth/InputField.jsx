import React from 'react';

const InputField = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  error,      // error message from backend
  className = '' 
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 border rounded-lg 
          border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          transition duration-300 placeholder-gray-400
          hover:border-gray-400
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
