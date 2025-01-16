import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavigationItem } from './NavigationItem';
import { navigationItems } from './navigationConfig';

export const Sidebar = () => {
  const { user } = useAuth();
  
  const filteredNavigation = navigationItems.filter(
    item => item.showAlways || (item.requiresAdmin && user?.role === 'admin')
  );

  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-[calc(100vh-4rem)] shadow-sm">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {filteredNavigation.map((item) => (
            <NavigationItem
              key={item.name}
              name={item.name}
              href={item.href}
              icon={item.icon}
            />
          ))}
        </div>
      </nav>
    </div>
  );
};