import React from 'react';
import { ProductField, ProductAction, PRODUCT_FIELDS, PRODUCT_ACTIONS, ProductPermission } from '../../types';

interface PermissionMatrixProps {
  permissions: ProductPermission[];
  onChange: (permissions: ProductPermission[]) => void;
}

const PermissionMatrix: React.FC<PermissionMatrixProps> = ({ permissions, onChange }) => {
  const hasPermission = (field: ProductField, action: ProductAction) => {
    const permission = permissions.find(p => p.field === field);
    return permission?.actions.includes(action) || false;
  };

  const togglePermission = (field: ProductField, action: ProductAction) => {
    let newPermissions = [...permissions];
    const permissionIndex = newPermissions.findIndex(p => p.field === field);

    if (permissionIndex === -1) {
      // Add new permission
      newPermissions.push({ field, actions: [action] });
    } else {
      const permission = { ...newPermissions[permissionIndex] };
      const actionIndex = permission.actions.indexOf(action);

      if (actionIndex === -1) {
        // Add action to existing permission
        permission.actions = [...permission.actions, action];
      } else {
        // Remove action
        permission.actions = permission.actions.filter(a => a !== action);
      }

      if (permission.actions.length === 0) {
        // Remove permission if no actions left
        newPermissions = newPermissions.filter(p => p.field !== field);
      } else {
        newPermissions[permissionIndex] = permission;
      }
    }

    onChange(newPermissions);
  };

  const toggleAllForField = (field: ProductField, enabled: boolean) => {
    let newPermissions = [...permissions];
    const permissionIndex = newPermissions.findIndex(p => p.field === field);

    if (enabled) {
      if (permissionIndex === -1) {
        newPermissions.push({ field, actions: [...PRODUCT_ACTIONS] });
      } else {
        newPermissions[permissionIndex] = { field, actions: [...PRODUCT_ACTIONS] };
      }
    } else {
      newPermissions = newPermissions.filter(p => p.field !== field);
    }

    onChange(newPermissions);
  };

  const toggleAllForAction = (action: ProductAction, enabled: boolean) => {
    let newPermissions = [...permissions];

    PRODUCT_FIELDS.forEach(field => {
      const permissionIndex = newPermissions.findIndex(p => p.field === field);
      
      if (enabled) {
        if (permissionIndex === -1) {
          newPermissions.push({ field, actions: [action] });
        } else {
          const currentActions = newPermissions[permissionIndex].actions;
          if (!currentActions.includes(action)) {
            newPermissions[permissionIndex] = {
              ...newPermissions[permissionIndex],
              actions: [...currentActions, action],
            };
          }
        }
      } else {
        if (permissionIndex !== -1) {
          const newActions = newPermissions[permissionIndex].actions.filter(a => a !== action);
          if (newActions.length === 0) {
            newPermissions = newPermissions.filter(p => p.field !== field);
          } else {
            newPermissions[permissionIndex] = {
              ...newPermissions[permissionIndex],
              actions: newActions,
            };
          }
        }
      }
    });

    onChange(newPermissions);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
              Field
            </th>
            {PRODUCT_ACTIONS.map(action => (
              <th key={action} className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                <div className="flex flex-col items-center">
                  <span className="capitalize mb-2">{action}</span>
                  <input
                    type="checkbox"
                    checked={PRODUCT_FIELDS.every(field => hasPermission(field, action))}
                    onChange={(e) => toggleAllForAction(action, e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {PRODUCT_FIELDS.map(field => (
            <tr key={field}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white capitalize">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={PRODUCT_ACTIONS.every(action => hasPermission(field, action))}
                    onChange={(e) => toggleAllForField(field, e.target.checked)}
                    className="mr-2 rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  />
                  {field}
                </div>
              </td>
              {PRODUCT_ACTIONS.map(action => (
                <td key={`${field}-${action}`} className="px-6 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={hasPermission(field, action)}
                    onChange={() => togglePermission(field, action)}
                    className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionMatrix;