import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Bell, User } from 'lucide-react';

const Header: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-maroon-600 hover:bg-maroon-50 rounded-lg transition-colors duration-200">
            <Bell size={20} />
          </button>
          
          <div className="flex items-center space-x-3 bg-maroon-50 px-4 py-2 rounded-lg">
            <div className="w-8 h-8 bg-maroon-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium text-maroon-800">Admin</span>
          </div>
          
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;