import { ProductField, ProductAction } from '../types';
import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (field: ProductField, action: ProductAction): boolean => {
    if (user?.role === 'admin') return true;
    
    const permission = user?.permissions?.find(p => p.field === field);
    return permission?.actions.includes(action) || false;
  };

  const canAddProducts = (): boolean => {
    return user?.role === 'admin';
  };

  const canManageUsers = (): boolean => {
    return user?.role === 'admin';
  };

  return {
    hasPermission,
    canAddProducts,
    canManageUsers,
  };
};