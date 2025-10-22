
import React, { useEffect, useState } from 'react';
import { authAPI } from '../../../api';
import SidebarItem from './SidebarItem';
import useMobile from '../../../hooks/useMobile';

const Sidebar = ({ isOpen, onClose, activeContent, setActiveContent }) => {
  const [user, setUser] = useState({});
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isMobile = useMobile();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, []);

  const menuItems = [
    { 
      icon: '📊', 
      label: 'Dashboard', 
      id: 'dashboard', 
      active: activeContent === 'dashboard' 
    },
    { 
      icon: '🔄', 
      label: 'My Habits', 
      id: 'habits', 
      active: activeContent === 'habits' 
    },
    { 
      icon: '📈', 
      label: 'Progress', 
      id: 'progress', 
      active: activeContent === 'progress' 
    },
    { 
      icon: '🏆',
      label: 'Achievements', 
      id: 'achievements', 
      active: activeContent === 'achievements' 
    },
    { 
      icon: isLoggingOut ? '⏳' : '🚪', 
      label: isLoggingOut ? 'Logging out...' : 'Logout', 
      id: 'logout', 
      isLogout: true 
    }
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Use centralized API for logout
      await authAPI.logout();
      
      console.log('✅ Logout successful');
      clearLocalStorageAndRedirect();

    } catch (error) {
      console.error('❌ Logout error:', error);
      
      // Even if API call fails, clear local storage and redirect
      clearLocalStorageAndRedirect();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const clearLocalStorageAndRedirect = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleItemClick = (itemId) => {
    if (itemId === 'logout') {
      handleLogout();
      return;
    }
    
    setActiveContent(itemId);
    if (isMobile) {
      onClose();
    }
  };

  return (
    <>
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />
      )}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">🔄</span>
            <span className="ml-2 text-xl font-bold text-gray-900">Habit Tracker</span>
          </div>
          {isMobile && <button onClick={onClose} className="p-2 rounded-md text-gray-400 hover:text-gray-600">✕</button>}
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <SidebarItem
                key={index}
                icon={item.icon}
                label={item.label}
                id={item.id}
                active={item.active}
                isLogout={item.isLogout}
                disabled={item.id === 'logout' && isLoggingOut}
                onClick={() => handleItemClick(item.id)}
              />
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;