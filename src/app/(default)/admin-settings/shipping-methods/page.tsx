"use client";

import { useState, useEffect } from "react";
import { Box, Button, Card, Flex, Text, TextField, TextArea, Grid, Table, Dialog, IconButton } from "@radix-ui/themes";
import { PageHeading } from "@/components/common/PageHeading";
import { API_BASE_URL } from "@/utilities/constants";
import NProgress from "nprogress";
import { toast } from "sonner";
import { Save, Loader2, Plus, Edit, Eye, Truck } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

interface ShippingMethod {
  id: number;
  name: string;
  description?: string;
  cost?: number;
  delivery_time?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export default function ShippingMethodsPage() {
  usePageTitle('Shipping Methods');
  
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cost: '',
    delivery_time: '',
    is_active: true,
  });

  const fetchShippingMethods = async () => {
    setLoading(true);
    NProgress.start();
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/shipping`, {
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
      setShippingMethods(json?.data || []);
    } catch (e: any) {
      toast.error(e.message || 'Failed to load shipping methods');
    } finally {
      setLoading(false);
      NProgress.done();
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Shipping method name is required');
      return;
    }

    setSaving(true);
    NProgress.start();
    
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const url = editingMethod 
        ? `${API_BASE_URL}/api/admin/shipping/${editingMethod.id}`
        : `${API_BASE_URL}/api/admin/shipping`;
      const method = editingMethod ? 'PUT' : 'POST';

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        cost: formData.cost ? parseFloat(formData.cost) : null,
        delivery_time: formData.delivery_time.trim(),
        is_active: formData.is_active,
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
          toast.error(json?.message || 'Failed to save shipping method');
        }
        return;
      }

      toast.success(json?.message || `Shipping method ${editingMethod ? 'updated' : 'created'} successfully`);
      resetForm();
      setDialogOpen(false);
      setViewMode('list');
      await fetchShippingMethods();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save shipping method');
    } finally {
      setSaving(false);
      NProgress.done();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      cost: '',
      delivery_time: '',
      is_active: true,
    });
    setEditingMethod(null);
  };

  const handleEdit = (method: ShippingMethod) => {
    setEditingMethod(method);
    setFormData({
      name: method.name || '',
      description: method.description || '',
      cost: method.cost?.toString() || '',
      delivery_time: method.delivery_time || '',
      is_active: method.is_active ?? true,
    });
    setDialogOpen(true);
  };

  const handleAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  useEffect(() => {
    fetchShippingMethods();
  }, []);

  if (loading && shippingMethods.length === 0) {
    return (
      <Box className="w-full">
        <PageHeading title="Shipping Methods" description="Manage shipping methods and delivery options" />
        <Card size="3" className="p-8 text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={32} />
          <Text>Loading shipping methods...</Text>
        </Card>
      </Box>
    );
  }

  return (
    <Box className="w-full">
      <PageHeading title="Shipping Methods" description="Manage shipping methods and delivery options" />
      
      <Flex justify="between" align="center" mb="4">
        <Text size="4" weight="bold">Shipping Methods</Text>
        <Button onClick={handleAdd}>
          <Plus size={16} />
          Add Shipping Method
        </Button>
      </Flex>

      {shippingMethods.length === 0 ? (
        <Card size="3" className="p-8 text-center">
          <Truck size={48} className="mx-auto mb-4 text-gray-400" />
          <Text size="4" weight="bold" mb="2">No shipping methods found</Text>
          <Text size="2" color="gray" mb="4">Create your first shipping method to get started</Text>
          <Button onClick={handleAdd}>
            <Plus size={16} />
            Add Shipping Method
          </Button>
        </Card>
      ) : (
        <Card>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Delivery Time</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="right">Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {shippingMethods.map((method) => (
                <Table.Row key={method.id}>
                  <Table.Cell>
                    <Text weight="medium">{method.name}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" color="gray">
                      {method.description || 'No description'}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    {method.cost ? `$${method.cost.toFixed(2)}` : 'Free'}
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2">{method.delivery_time || 'Not specified'}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text 
                      size="2" 
                      color={method.is_active ? 'green' : 'red'}
                      weight="medium"
                    >
                      {method.is_active ? 'Active' : 'Inactive'}
                    </Text>
                  </Table.Cell>
                  <Table.Cell align="right">
                    <Flex gap="2" justify="end">
                      <IconButton 
                        variant="soft" 
                        color="blue" 
                        onClick={() => handleEdit(method)}
                        title="Edit shipping method"
                      >
                        <Edit size={14} />
                      </IconButton>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Content style={{ maxWidth: 500 }}>
          <Dialog.Title>
            {editingMethod ? 'Edit Shipping Method' : 'Add Shipping Method'}
          </Dialog.Title>
          <Dialog.Description size="2" mb="4">
            {editingMethod ? 'Update the shipping method details' : 'Create a new shipping method'}
          </Dialog.Description>

          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <Grid gap="4">
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Name *</Text>
                <TextField.Root 
                  value={formData.name} 
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} 
                  placeholder="e.g., Standard Shipping"
                />
              </Flex>

              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Description</Text>
                <TextArea 
                  value={formData.description} 
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} 
                  placeholder="Brief description of the shipping method"
                  rows={3}
                />
              </Flex>

              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Cost ($)</Text>
                <TextField.Root 
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost} 
                  onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))} 
                  placeholder="0.00"
                />
              </Flex>

              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Delivery Time</Text>
                <TextField.Root 
                  value={formData.delivery_time} 
                  onChange={(e) => setFormData(prev => ({ ...prev, delivery_time: e.target.value }))} 
                  placeholder="e.g., 3-5 business days"
                />
              </Flex>

              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Status</Text>
                <select 
                  value={formData.is_active ? 'true' : 'false'}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </Flex>
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
    </Box>
  );
}
