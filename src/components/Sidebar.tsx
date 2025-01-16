import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, showAlways: true },
    { name: 'Products', href: '/products', icon: Package, showAlways: true },
    { name: 'Users', href: '/users', icon: Users, requiresAdmin: true },
  ];

  const filteredNavigation = navigation.filter(
    item => item.showAlways || (item.requiresAdmin && user?.role === 'admin')
  );

  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-[calc(100vh-4rem)] shadow-sm">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {filteredNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                }`
              }
            >
              <item.icon
                className="mr-3 h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};