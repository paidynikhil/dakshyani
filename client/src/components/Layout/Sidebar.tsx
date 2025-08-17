import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Shirt, 
  Crown, 
  Sparkles, 
  Users, 
  MessageSquare, 
  Package,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/sarees', icon: Shirt, label: 'Sarees' },
    { path: '/lehengas', icon: Crown, label: 'Lehengas' },
    { path: '/new-arrivals', icon: Sparkles, label: 'New Arrivals' },
    { path: '/users', icon: Users, label: 'Users' },
    { path: '/reviews', icon: MessageSquare, label: 'Reviews' },
    { path: '/orders', icon: Package, label: 'Orders' },
  ];

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-16' : 'w-64'
    } min-h-screen border-r border-gray-200`}>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-2xl font-serif font-bold text-maroon-800">Dakshyani</h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-maroon-50 text-maroon-600 transition-colors duration-200"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <nav className="mt-8">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-maroon-100 text-maroon-800 border-r-4 border-maroon-600' 
                  : 'text-gray-600 hover:bg-maroon-50 hover:text-maroon-700'
              }`}
            >
              <Icon size={20} className={`${isCollapsed ? 'mx-auto' : 'mr-3'} transition-transform duration-200 group-hover:scale-110`} />
              {!isCollapsed && (
                <span className="font-medium transition-all duration-200">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;