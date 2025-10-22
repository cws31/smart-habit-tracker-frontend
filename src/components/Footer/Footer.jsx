import React from 'react';

const Footer = () => {
  const socialLinks = [
    { name: 'Twitter', icon: '🐦', url: '#' },
    { name: 'Facebook', icon: '📘', url: '#' },
    { name: 'Instagram', icon: '📷', url: '#' },
    { name: 'LinkedIn', icon: '💼', url: '#' }
  ];

  const quickLinks = [
    { href: '#home', label: 'Home' },
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#contact', label: 'Contact' }
  ];

  const legalLinks = [
    { href: '#', label: 'Privacy Policy' },
    { href: '#', label: 'Terms of Service' },
    { href: '#', label: 'Cookie Policy' }
  ];

  return (
    <footer className="w-full bg-gray-900 text-white py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
          <FooterBrand />
          <FooterLinks title="Quick Links" links={quickLinks} />
          <FooterLinks title="Legal" links={legalLinks} />
          <FooterSocial socialLinks={socialLinks} />
        </div>
        <FooterCopyright />
      </div>
    </footer>
  );
};

const FooterBrand = () => (
  <div className="w-full">
    <div className="flex items-center mb-4">
      <span className="text-2xl font-bold text-blue-400">🔄</span>
      <span className="ml-2 text-xl font-bold">Smart Habit Tracker</span>
    </div>
    <p className="text-gray-400 text-sm sm:text-base">
      Building better habits for a better future, one day at a time.
    </p>
  </div>
);

const FooterLinks = ({ title, links }) => (
  <div className="w-full">
    <h4 className="font-semibold mb-4 text-base sm:text-lg">{title}</h4>
    <ul className="space-y-2 text-gray-400">
      {links.map((link) => (
        <li key={link.href}>
          <a href={link.href} className="hover:text-white transition duration-300 text-sm sm:text-base">
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const FooterSocial = ({ socialLinks }) => (
  <div className="w-full">
    <h4 className="font-semibold mb-4 text-base sm:text-lg">Connect With Us</h4>
    <div className="flex space-x-4">
      {socialLinks.map((social) => (
        <a 
          key={social.name} 
          href={social.url} 
          className="text-2xl hover:text-blue-400 transition duration-300" 
          title={social.name}
        >
          {social.icon}
        </a>
      ))}
    </div>
  </div>
);

const FooterCopyright = () => (
  <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 w-full">
    <p className="text-sm sm:text-base">&copy; 2024 Smart Habit Tracker. All rights reserved.</p>
  </div>
);

export default Footer;