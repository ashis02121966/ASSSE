import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { menuItems } from '../../data/mockData';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (path: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar
          menuItems={menuItems}
          currentPath={currentPage}
          onNavigate={onNavigate}
        />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;