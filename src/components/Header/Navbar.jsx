import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileMenu from './MobileMenu';
import Button from '../UI/Button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#contact', label: 'Contact' }
  ];

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <>
      <div className="flex justify-between h-16">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-blue-600">🔄</span>
            <span className="ml-2 text-xl font-bold text-gray-900">Smart Habit Tracker</span>
          </div>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition duration-300"
            >
              {link.label}
            </a>
          ))}
          <Button variant="primary" onClick={handleSignUp}>
            Sign Up Free
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        links={navLinks} 
        onClose={() => setIsMenuOpen(false)}
        onSignUp={handleSignUp}
      />
    </>
  );
};

export default Navbar;