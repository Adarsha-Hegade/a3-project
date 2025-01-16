import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { api } from '../../services/api';
import { User, ProductPermission } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import PermissionMatrix from './PermissionMatrix';

interface UserFormProps {
  user?: User | null;
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'user',
    permissions: user?.permissions || [],
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const url = user ? `/users/${user._id}` : '/users';
      const method = user ? 'put' : 'post';
      return api[method](url, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onClose();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutation.mutateAsync(formData);
  };

  const handlePermissionsChange = (permissions: ProductPermission[]) => {
    setFormData(prev => ({ ...prev, permissions }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {user ? 'Edit User' : 'Add User'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username*
              </label>
              <Input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email*
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            {!user && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password*
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!user}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Product Permissions
            </h3>
            <PermissionMatrix
              permissions={formData.permissions}
              onChange={handlePermissionsChange}
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              {user ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;