import React from 'react';
import AuthCard from '../UI/AuthCard';

const AuthLayout = ({ 
  children, 
  title, 
  subtitle, 
  footerText, 
  footerLinkText, 
  onFooterLinkClick 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center mb-4">
            <span className="text-3xl font-bold text-blue-600">🔄</span>
            <span className="ml-2 text-2xl font-bold text-gray-900">Smart Habit Tracker</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
        </div>

        {/* Auth Card */}
        <AuthCard>
          {children}
        </AuthCard>

        {/* Footer Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {footerText}{' '}
            <button
              onClick={onFooterLinkClick}
              className="font-medium text-blue-600 hover:text-blue-500 transition duration-300"
            >
              {footerLinkText}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;