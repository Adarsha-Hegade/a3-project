import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { api } from '../services/api';
import { Product, ProductField, ProductAction } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import ProductForm from '../components/products/ProductForm';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get('/products');
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const hasPermission = (field: ProductField, action: ProductAction): boolean => {
    if (user?.role === 'admin') return true;
    const permission = user?.permissions.find(p => p.field === field);
    return permission?.actions.includes(action) || false;
  };

  const getVisibleFields = (): ProductField[] => {
    if (user?.role === 'admin') {
      return ['image', 'name', 'productCode', 'size', 'manufacturer', 'stock', 'badStock', 'bookings', 'availableStock'];
    }
    return ['image', 'name', 'productCode', 'size', 'manufacturer', 'stock', 'badStock', 'bookings', 'availableStock']
      .filter(field => hasPermission(field as ProductField, 'view'));
  };

  const filteredProducts = products?.filter((product: Product) =>
    product.name?.toLowerCase().includes(search.toLowerCase()) ||
    product.productCode.toLowerCase().includes(search.toLowerCase()) ||
    product.manufacturer.toLowerCase().includes(search.toLowerCase())
  );

  const visibleFields = getVisibleFields();

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
        {hasPermission('productCode', 'edit') && (
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {visibleFields.includes('image') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Product
                  </th>
                )}
                {visibleFields.includes('productCode') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Code
                  </th>
                )}
                {visibleFields.includes('size') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Size
                  </th>
                )}
                {visibleFields.includes('stock') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Stock
                  </th>
                )}
                {visibleFields.includes('availableStock') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Available
                  </th>
                )}
                {(hasPermission('productCode', 'edit') || hasPermission('productCode', 'delete')) && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts?.map((product: Product) => (
                <tr key={product._id}>
                  {visibleFields.includes('image') && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-10 w-10 rounded-full object-cover mr-3"
                          />
                        )}
                        <div>
                          {visibleFields.includes('name') && (
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {product.name || 'N/A'}
                            </div>
                          )}
                          {visibleFields.includes('manufacturer') && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {product.manufacturer}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  )}
                  {visibleFields.includes('productCode') && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {product.productCode}
                    </td>
                  )}
                  {visibleFields.includes('size') && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {product.size}
                    </td>
                  )}
                  {visibleFields.includes('stock') && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {product.stock}
                    </td>
                  )}
                  {visibleFields.includes('availableStock') && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.availableStock > 10
                          ? 'bg-green-100 text-green-800'
                          : product.availableStock > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.availableStock}
                      </span>
                    </td>
                  )}
                  {(hasPermission('productCode', 'edit') || hasPermission('productCode', 'delete')) && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {hasPermission('productCode', 'edit') && (
                        <Button
                          variant="secondary"
                          onClick={() => handleEdit(product)}
                          className="mr-2"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {hasPermission('productCode', 'delete') && (
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(product._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default Products;