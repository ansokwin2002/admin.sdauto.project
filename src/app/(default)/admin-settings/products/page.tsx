"use client";

import { useState, useEffect } from "react";
import { Box, Button, Card, Flex, Text, TextField, TextArea, Grid, Table, Dialog, IconButton, Badge, Tabs } from "@radix-ui/themes";
import { PageHeading } from "@/components/common/PageHeading";
import { API_BASE_URL } from "@/utilities/constants";
import NProgress from "nprogress";
import { toast } from "sonner";
import { Save, Loader2, Plus, Edit, Eye, Trash2, Package, TrendingUp, DollarSign, Archive } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock_quantity?: number;
  sku?: string;
  category?: string;
  status?: 'active' | 'inactive' | 'draft';
  discount_percentage?: number;
  images?: string[];
  videos?: string[];
  created_at?: string;
  updated_at?: string;
}

interface ProductStats {
  total_products: number;
  active_products: number;
  inactive_products: number;
  low_stock_products: number;
  total_value: number;
  average_price: number;
}

export default function AdminProductsPage() {
  usePageTitle('Product Management');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    sku: '',
    category: '',
    status: 'active' as Product['status'],
    discount_percentage: '',
  });

  // Bulk operation state
  const [bulkOperation, setBulkOperation] = useState<'delete' | 'activate' | 'deactivate' | 'discount'>('delete');
  const [bulkDiscountValue, setBulkDiscountValue] = useState('');

  const fetchStats = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/products/stats`, {
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      if (res.ok) {
        const json = await res.json();
        setStats(json?.data || null);
      }
    } catch (e: any) {
      console.error('Failed to load stats:', e.message);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    NProgress.start();
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/products`, {
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      setProducts(json?.data || []);
    } catch (e: any) {
      toast.error(e.message || 'Failed to load products');
    } finally {
      setLoading(false);
      NProgress.done();
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.price) {
      toast.error('Name and price are required');
      return;
    }

    setSaving(true);
    NProgress.start();
    
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const url = editingProduct 
        ? `${API_BASE_URL}/api/admin/products/${editingProduct.id}`
        : `${API_BASE_URL}/api/admin/products`;
      const method = editingProduct ? 'PUT' : 'POST';

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : null,
        sku: formData.sku.trim(),
        category: formData.category.trim(),
        status: formData.status,
        discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : null,
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        if (res.status === 422 && json?.errors) {
          const messages = Object.values(json.errors).flat().join('\n');
          toast.error(messages);
        } else {
          toast.error(json?.message || 'Failed to save product');
        }
        return;
      }

      toast.success(json?.message || `Product ${editingProduct ? 'updated' : 'created'} successfully`);
      resetForm();
      setDialogOpen(false);
      await fetchProducts();
      await fetchStats();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save product');
    } finally {
      setSaving(false);
      NProgress.done();
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    setDeleting(product.id);
    NProgress.start();
    
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/products/${product.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.message || 'Failed to delete product');
        return;
      }

      toast.success(json?.message || 'Product deleted successfully');
      await fetchProducts();
      await fetchStats();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete product');
    } finally {
      setDeleting(null);
      NProgress.done();
    }
  };

  const handleBulkOperation = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products first');
      return;
    }

    setSaving(true);
    NProgress.start();
    
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const payload: any = {
        product_ids: selectedProducts,
        operation: bulkOperation,
      };

      if (bulkOperation === 'discount' && bulkDiscountValue) {
        payload.discount_percentage = parseFloat(bulkDiscountValue);
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/products/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.message || 'Bulk operation failed');
        return;
      }

      toast.success(json?.message || 'Bulk operation completed successfully');
      setSelectedProducts([]);
      setBulkDialogOpen(false);
      setBulkDiscountValue('');
      await fetchProducts();
      await fetchStats();
    } catch (err: any) {
      toast.error(err?.message || 'Bulk operation failed');
    } finally {
      setSaving(false);
      NProgress.done();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock_quantity: '',
      sku: '',
      category: '',
      status: 'active',
      discount_percentage: '',
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      stock_quantity: product.stock_quantity?.toString() || '',
      sku: product.sku || '',
      category: product.category || '',
      status: product.status || 'active',
      discount_percentage: product.discount_percentage?.toString() || '',
    });
    setDialogOpen(true);
  };

  const handleView = (product: Product) => {
    setViewingProduct(product);
    setViewDialogOpen(true);
  };

  const handleAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'draft': return 'yellow';
      default: return 'gray';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  if (loading && products.length === 0) {
    return (
      <Box className="w-full">
        <PageHeading title="Product Management" description="Manage your product catalog" />
        <Card size="3" className="p-8 text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={32} />
          <Text>Loading products...</Text>
        </Card>
      </Box>
    );
  }

  return (
    <Box className="w-full">
      <PageHeading title="Product Management" description="Manage your product catalog" />
      
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Trigger value="overview">
            <TrendingUp size={16} />
            Overview
          </Tabs.Trigger>
          <Tabs.Trigger value="products">
            <Package size={16} />
            Products
          </Tabs.Trigger>
        </Tabs.List>

        <Box mt="4">
          <Tabs.Content value="overview">
            {stats && (
              <Grid columns={{ initial: '1', sm: '2', lg: '3' }} gap="4" mb="6">
                <Card>
                  <Flex align="center" gap="3" p="4">
                    <Box className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Package size={24} className="text-blue-600 dark:text-blue-400" />
                    </Box>
                    <Box>
                      <Text size="2" color="gray">Total Products</Text>
                      <Text size="6" weight="bold">{stats.total_products}</Text>
                    </Box>
                  </Flex>
                </Card>

                <Card>
                  <Flex align="center" gap="3" p="4">
                    <Box className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <TrendingUp size={24} className="text-green-600 dark:text-green-400" />
                    </Box>
                    <Box>
                      <Text size="2" color="gray">Active Products</Text>
                      <Text size="6" weight="bold">{stats.active_products}</Text>
                    </Box>
                  </Flex>
                </Card>

                <Card>
                  <Flex align="center" gap="3" p="4">
                    <Box className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                      <Archive size={24} className="text-yellow-600 dark:text-yellow-400" />
                    </Box>
                    <Box>
                      <Text size="2" color="gray">Low Stock</Text>
                      <Text size="6" weight="bold">{stats.low_stock_products}</Text>
                    </Box>
                  </Flex>
                </Card>

                <Card>
                  <Flex align="center" gap="3" p="4">
                    <Box className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <DollarSign size={24} className="text-purple-600 dark:text-purple-400" />
                    </Box>
                    <Box>
                      <Text size="2" color="gray">Total Value</Text>
                      <Text size="6" weight="bold">{formatPrice(stats.total_value)}</Text>
                    </Box>
                  </Flex>
                </Card>

                <Card>
                  <Flex align="center" gap="3" p="4">
                    <Box className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                      <DollarSign size={24} className="text-indigo-600 dark:text-indigo-400" />
                    </Box>
                    <Box>
                      <Text size="2" color="gray">Average Price</Text>
                      <Text size="6" weight="bold">{formatPrice(stats.average_price)}</Text>
                    </Box>
                  </Flex>
                </Card>

                <Card>
                  <Flex align="center" gap="3" p="4">
                    <Box className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                      <Archive size={24} className="text-red-600 dark:text-red-400" />
                    </Box>
                    <Box>
                      <Text size="2" color="gray">Inactive Products</Text>
                      <Text size="6" weight="bold">{stats.inactive_products}</Text>
                    </Box>
                  </Flex>
                </Card>
              </Grid>
            )}
          </Tabs.Content>

          <Tabs.Content value="products">
            <Flex justify="between" align="center" mb="4">
              <Text size="4" weight="bold">Product Catalog</Text>
              <Flex gap="2">
                {selectedProducts.length > 0 && (
                  <Button variant="soft" color="orange" onClick={() => setBulkDialogOpen(true)}>
                    Bulk Actions ({selectedProducts.length})
                  </Button>
                )}
                <Button onClick={handleAdd}>
                  <Plus size={16} />
                  Add Product
                </Button>
              </Flex>
            </Flex>

            {products.length === 0 ? (
              <Card size="3" className="p-8 text-center">
                <Package size={48} className="mx-auto mb-4 text-gray-400" />
                <Text size="4" weight="bold" mb="2">No products found</Text>
                <Text size="2" color="gray" mb="4">Create your first product to get started</Text>
                <Button onClick={handleAdd}>
                  <Plus size={16} />
                  Add Product
                </Button>
              </Card>
            ) : (
              <Card>
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell style={{ width: 40 }}>
                        <input
                          type="checkbox"
                          checked={selectedProducts.length === products.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts(products.map(p => p.id));
                            } else {
                              setSelectedProducts([]);
                            }
                          }}
                        />
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Product</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>SKU</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Stock</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Discount</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell align="right">Actions</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {products.map((product) => (
                      <Table.Row key={product.id}>
                        <Table.Cell>
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProducts(prev => [...prev, product.id]);
                              } else {
                                setSelectedProducts(prev => prev.filter(id => id !== product.id));
                              }
                            }}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <Box>
                            <Text weight="medium">{product.name}</Text>
                            {product.category && (
                              <Text size="2" color="gray">{product.category}</Text>
                            )}
                          </Box>
                        </Table.Cell>
                        <Table.Cell>
                          <Text size="2" color="gray">
                            {product.sku || 'No SKU'}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text weight="medium">{formatPrice(product.price)}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text size="2" color={product.stock_quantity && product.stock_quantity < 10 ? 'red' : 'gray'}>
                            {product.stock_quantity ?? 'N/A'}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge color={getStatusColor(product.status)} variant="soft">
                            {product.status || 'active'}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          {product.discount_percentage ? (
                            <Badge color="orange" variant="soft">
                              {product.discount_percentage}% off
                            </Badge>
                          ) : (
                            <Text size="2" color="gray">No discount</Text>
                          )}
                        </Table.Cell>
                        <Table.Cell align="right">
                          <Flex gap="2" justify="end">
                            <IconButton
                              variant="soft"
                              color="gray"
                              onClick={() => handleView(product)}
                              title="View product"
                            >
                              <Eye size={14} />
                            </IconButton>
                            <IconButton
                              variant="soft"
                              color="blue"
                              onClick={() => handleEdit(product)}
                              title="Edit product"
                            >
                              <Edit size={14} />
                            </IconButton>
                            <IconButton
                              variant="soft"
                              color="red"
                              onClick={() => handleDelete(product)}
                              title="Delete product"
                              disabled={deleting === product.id}
                            >
                              {deleting === product.id ? (
                                <Loader2 className="animate-spin" size={14} />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </IconButton>
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Card>
            )}
          </Tabs.Content>
        </Box>
      </Tabs.Root>

      {/* Add/Edit Product Dialog */}
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Content style={{ maxWidth: 700 }}>
          <Dialog.Title>
            {editingProduct ? 'Edit Product' : 'Add Product'}
          </Dialog.Title>
          <Dialog.Description size="2" mb="4">
            {editingProduct ? 'Update the product details' : 'Create a new product'}
          </Dialog.Description>

          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <Grid gap="4">
              <Grid columns="2" gap="4">
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Product Name *</Text>
                  <TextField.Root
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter product name"
                  />
                </Flex>

                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">SKU</Text>
                  <TextField.Root
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    placeholder="Product SKU"
                  />
                </Flex>
              </Grid>

              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Description</Text>
                <TextArea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Product description"
                  rows={3}
                />
              </Flex>

              <Grid columns="3" gap="4">
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Price *</Text>
                  <TextField.Root
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                  />
                </Flex>

                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Stock Quantity</Text>
                  <TextField.Root
                    type="number"
                    min="0"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                    placeholder="0"
                  />
                </Flex>

                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Discount %</Text>
                  <TextField.Root
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, discount_percentage: e.target.value }))}
                    placeholder="0"
                  />
                </Flex>
              </Grid>

              <Grid columns="2" gap="4">
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Category</Text>
                  <TextField.Root
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Product category"
                  />
                </Flex>

                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Status</Text>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Product['status'] }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </Flex>
              </Grid>
            </Grid>

            <Flex justify="end" gap="2" mt="6">
              <Dialog.Close>
                <Button variant="soft" color="gray" type="button">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button color="green" type="submit" disabled={saving}>
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </Flex>
          </form>
        </Dialog.Content>
      </Dialog.Root>

      {/* Bulk Operations Dialog */}
      <Dialog.Root open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
        <Dialog.Content style={{ maxWidth: 500 }}>
          <Dialog.Title>Bulk Operations</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Perform bulk operations on {selectedProducts.length} selected products
          </Dialog.Description>

          <Grid gap="4">
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Operation</Text>
              <select
                value={bulkOperation}
                onChange={(e) => setBulkOperation(e.target.value as typeof bulkOperation)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="delete">Delete Products</option>
                <option value="activate">Activate Products</option>
                <option value="deactivate">Deactivate Products</option>
                <option value="discount">Apply Discount</option>
              </select>
            </Flex>

            {bulkOperation === 'discount' && (
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Discount Percentage</Text>
                <TextField.Root
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={bulkDiscountValue}
                  onChange={(e) => setBulkDiscountValue(e.target.value)}
                  placeholder="Enter discount percentage"
                />
              </Flex>
            )}

            <Box className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
              <Text size="2" color="orange">
                {bulkOperation === 'delete' && 'This will permanently delete the selected products.'}
                {bulkOperation === 'activate' && 'This will activate the selected products.'}
                {bulkOperation === 'deactivate' && 'This will deactivate the selected products.'}
                {bulkOperation === 'discount' && 'This will apply the discount to the selected products.'}
              </Text>
            </Box>
          </Grid>

          <Flex justify="end" gap="2" mt="6">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              color={bulkOperation === 'delete' ? 'red' : 'blue'}
              onClick={handleBulkOperation}
              disabled={saving || (bulkOperation === 'discount' && !bulkDiscountValue)}
            >
              {saving ? <Loader2 className="animate-spin" size={16} /> : null}
              {saving ? 'Processing...' : 'Apply'}
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* View Product Dialog */}
      <Dialog.Root open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <Dialog.Content style={{ maxWidth: 600 }}>
          <Dialog.Title>Product Details</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            View product information
          </Dialog.Description>

          {viewingProduct && (
            <Grid gap="4">
              <Grid columns="2" gap="4">
                <Box>
                  <Text size="2" weight="medium" color="gray">Product Name</Text>
                  <Text size="3">{viewingProduct.name}</Text>
                </Box>
                <Box>
                  <Text size="2" weight="medium" color="gray">SKU</Text>
                  <Text size="3">{viewingProduct.sku || 'No SKU'}</Text>
                </Box>
              </Grid>

              <Box>
                <Text size="2" weight="medium" color="gray">Description</Text>
                <Box className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                  <Text size="2">{viewingProduct.description || 'No description'}</Text>
                </Box>
              </Box>

              <Grid columns="3" gap="4">
                <Box>
                  <Text size="2" weight="medium" color="gray">Price</Text>
                  <Text size="3" weight="bold">{formatPrice(viewingProduct.price)}</Text>
                </Box>
                <Box>
                  <Text size="2" weight="medium" color="gray">Stock</Text>
                  <Text size="3">{viewingProduct.stock_quantity ?? 'N/A'}</Text>
                </Box>
                <Box>
                  <Text size="2" weight="medium" color="gray">Discount</Text>
                  <Text size="3">{viewingProduct.discount_percentage ? `${viewingProduct.discount_percentage}%` : 'None'}</Text>
                </Box>
              </Grid>

              <Grid columns="2" gap="4">
                <Box>
                  <Text size="2" weight="medium" color="gray">Category</Text>
                  <Text size="3">{viewingProduct.category || 'Uncategorized'}</Text>
                </Box>
                <Box>
                  <Text size="2" weight="medium" color="gray">Status</Text>
                  <Badge color={getStatusColor(viewingProduct.status)} variant="soft">
                    {viewingProduct.status || 'active'}
                  </Badge>
                </Box>
              </Grid>

              <Grid columns="2" gap="4">
                <Box>
                  <Text size="2" weight="medium" color="gray">Created</Text>
                  <Text size="2">{formatDate(viewingProduct.created_at)}</Text>
                </Box>
                <Box>
                  <Text size="2" weight="medium" color="gray">Updated</Text>
                  <Text size="2">{formatDate(viewingProduct.updated_at)}</Text>
                </Box>
              </Grid>
            </Grid>
          )}

          <Flex justify="end" gap="2" mt="6">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Close
              </Button>
            </Dialog.Close>
            {viewingProduct && (
              <Button
                color="blue"
                onClick={() => {
                  setViewDialogOpen(false);
                  handleEdit(viewingProduct);
                }}
              >
                <Edit size={16} />
                Edit
              </Button>
            )}
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
}
