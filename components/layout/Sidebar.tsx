import React from 'react';
import { View } from '../../types';
import ActivityIcon from '../icons/ActivityIcon';
import MapIcon from '../icons/MapIcon';
import PillIcon from '../icons/PillIcon';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavItem: React.FC<{
  view: View;
  currentView: View;
  setCurrentView: (view: View) => void;
  icon: React.ReactNode;
  label: string;
}> = ({ view, currentView, setCurrentView, icon, label }) => {
  const isActive = view === currentView;
  return (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-green-600 text-white'
          : 'text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { view: View.Dashboard, icon: <ActivityIcon className="h-5 w-5" />, label: 'Dashboard' },
    { view: View.SymptomTracker, icon: <MapIcon className="h-5 w-5" />, label: 'Symptom Tracker' },
    { view: View.MedicineInventory, icon: <PillIcon className="h-5 w-5" />, label: 'Medicine Inventory' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 border-r border-gray-700 p-4 flex flex-col">
      <div className="flex items-center mb-8">
        <div className="bg-green-600 p-2 rounded-lg">
          <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"/>
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white ml-3">PharmaFriend</h1>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map(item => (
          <NavItem key={item.view} {...item} currentView={currentView} setCurrentView={setCurrentView} />
        ))}
      </nav>
      <div className="mt-auto text-center text-gray-500 text-xs">
        <p>&copy; 2024 PharmaFriend</p>
        <p>Admin Portal v1.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;