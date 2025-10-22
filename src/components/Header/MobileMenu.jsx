import React from 'react';
import Button from '../UI/Button';

const MobileMenu = ({ isOpen, links, onClose, onSignUp }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium"
            onClick={onClose}
          >
            {link.label}
          </a>
        ))}
        <Button variant="primary" className="w-full mt-2" onClick={onSignUp}>
          Sign Up Free
        </Button>
      </div>
    </div>
  );
};

export default MobileMenu;