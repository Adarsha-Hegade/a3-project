import { LayoutDashboard, Package, Users } from 'lucide-react';

export const navigationItems = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: LayoutDashboard, 
    showAlways: true 
  },
  { 
    name: 'Products', 
    href: '/products', 
    icon: Package, 
    showAlways: true 
  },
  { 
    name: 'Users', 
    href: '/users', 
    icon: Users, 
    requiresAdmin: true 
  },
];