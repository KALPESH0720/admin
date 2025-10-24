import React from 'react';
import { View } from '../../types';

interface HeaderProps {
  currentView: View | string;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onLogout }) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 shadow-sm p-4 flex justify-between items-center">
      <h2 className="text-2xl font-bold text-white">{currentView}</h2>
      {onLogout && (
         <button onClick={onLogout} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors">
            Logout
        </button>
      )}
    </header>
  );
};

export default Header;