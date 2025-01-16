import React from 'react';
import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface NavigationItemProps {
  name: string;
  href: string;
  icon: LucideIcon;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({ name, href, icon: Icon }) => {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
          isActive
            ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
        }`
      }
    >
      <Icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
      {name}
    </NavLink>
  );
};