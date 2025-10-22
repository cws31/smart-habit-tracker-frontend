import React, { useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import TopNavbar from './TopNavbar/TopNavbar';
import MyHabits from './MyHabits/MyHabits';
import DashboardOverview from './DashboardOverview';
import ProgressOverview from './ProgressChart/ProgressOverview';
import CertificateDisplay from './CertificateDisplay'

const DashboardLayout = ({ children, user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeContent, setActiveContent] = useState('dashboard'); // Default to dashboard
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        activeContent={activeContent}
        setActiveContent={setActiveContent}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar 
          user={user} 
          onMenuClick={() => setSidebarOpen(true)} 
        />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children || <DashboardContent activeContent={activeContent} />}
        </main>
      </div>
    </div>
  );
};

// Component to render based on active content
const DashboardContent = ({ activeContent }) => {
  switch (activeContent) {
    case 'habits':
      return <MyHabits />;
    case 'progress':
      return <ProgressOverview />;
    case 'achievements': // Add this case
      return <CertificateDisplay />;
    case 'dashboard':
    default:
      return <DashboardOverview />;
  }
};

export default DashboardLayout;