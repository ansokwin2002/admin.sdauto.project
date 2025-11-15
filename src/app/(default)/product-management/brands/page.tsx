"use client";

import { useEffect, useState } from "react";
import { Box, Button, Card, Flex, IconButton, Table, Text, TextField, Dialog } from "@radix-ui/themes";
import { PageHeading } from "@/components/common/PageHeading";
import { API_BASE_URL } from "@/utilities/constants";
import NProgress from "nprogress";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Save, RefreshCcw, Package } from "lucide-react";
import { Brand } from "@/types/brand";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function BrandsPage() {
  usePageTitle("Brands");
  
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  // Form states
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      NProgress.start();
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/brands`, {
        credentials: 'include',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'Accept': 'application/json',
        },
      });
      
      let json: any = null;
      try { json = await res.json(); } catch {}
      
      if (!res.ok) {
        if (res.status === 401) {
          toast.error('Unauthorized. Please login again.');
        }
        if (json?.message) throw new Error(json.message);
        const text = await res.text();
        throw new Error(text || 'Failed to load brands');
      }
      
      const data: Brand[] = json?.data || [];
      setBrands(data);
    } catch (e: any) {
      toast.error(e.message || 'Failed to load brands');
    } finally {
      setLoading(false);
      NProgress.done();
    }
  };

  useEffect(() => { fetchBrands(); }, []);

  const handleCreate = async () => {
    if (!brandName.trim()) {
      toast.error('Please enter a brand name');
      return;
    }

    try {
      setSaving(true);
      NProgress.start();
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/brands`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'Accept': 'application/json',
        },
        body: JSON.stringify({ brand_name: brandName.trim() }),
      });
      
      let json: any = null;
      try { json = await res.json(); } catch {}
      
      if (!res.ok) {
        if (res.status === 422 && json?.errors) {
          const messages = Object.values(json.errors).flat().join('\n');
          toast.error(messages);
        } else {
          if (json?.message) {
            toast.error(json.message);
          } else {
            const text = await res.text();
            toast.error(text || 'Failed to create brand');
          }
        }
        return;
      }
      
      toast.success((json && json.message) || 'Brand created successfully');
      setBrandName('');
      setCreateOpen(false);
      await fetchBrands();
    } catch (e: any) {
      toast.error(e.message || 'Create failed');
    } finally {
      setSaving(false);
      NProgress.done();
    }
  };

  const handleEdit = async () => {
    if (!brandName.trim() || !editingBrand) {
      toast.error('Please enter a brand name');
      return;
    }

    try {
      setSaving(true);
      NProgress.start();
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/brands/${editingBrand.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'Accept': 'application/json',
        },
        body: JSON.stringify({ brand_name: brandName.trim() }),
      });
      
      let json: any = null;
      try { json = await res.json(); } catch {}
      
      if (!res.ok) {
        if (res.status === 422 && json?.errors) {
          const messages = Object.values(json.errors).flat().join('\n');
          toast.error(messages);
        } else {
          if (json?.message) {
            toast.error(json.message);
          } else {
            const text = await res.text();
            toast.error(text || 'Failed to update brand');
          }
        }
        return;
      }
      
      toast.success((json && json.message) || 'Brand updated successfully');
      setBrandName('');
      setEditingBrand(null);
      setEditOpen(false);
      await fetchBrands();
    } catch (e: any) {
      toast.error(e.message || 'Update failed');
    } finally {
      setSaving(false);
      NProgress.done();
    }
  };

  const handleDelete = async () => {
    if (!brandToDelete) return;

    try {
      setDeleting(brandToDelete.id);
      NProgress.start();
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/brands/${brandToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'Accept': 'application/json',
        },
      });
      
      let json: any = null;
      try { json = await res.json(); } catch {}
      
      if (!res.ok) {
        if (json?.message) {
          toast.error(json.message);
        } else {
          const text = await res.text();
          toast.error(text || 'Failed to delete brand');
        }
        return;
      }
      
      toast.success((json && json.message) || 'Brand deleted successfully');
      setBrandToDelete(null);
      setDeleteOpen(false);
      await fetchBrands();
    } catch (e: any) {
      toast.error(e.message || 'Delete failed');
    } finally {
      setDeleting(null);
      NProgress.done();
    }
  };

  const openCreateModal = () => {
    setBrandName('');
    setCreateOpen(true);
  };

  const openEditModal = (brand: Brand) => {
    setEditingBrand(brand);
    setBrandName(brand.brand_name);
    setEditOpen(true);
  };

  const openDeleteModal = (brand: Brand) => {
    setBrandToDelete(brand);
    setDeleteOpen(true);
  };

  return (
    <Box>
      <PageHeading 
        title="Brands" 
        description="Manage product brands and manufacturers"
      />
      
      <Card size="3">
        <Flex justify="between" align="center" mb="4">
          <Flex align="center" gap="2">
            <Package size={20} />
            <Text size="4" weight="bold">Brand Management</Text>
            <Text size="2" color="gray">({brands.length} brands)</Text>
          </Flex>
          <Button onClick={openCreateModal} size="2">
            <Plus size={16} />
            Add Brand
          </Button>
        </Flex>

        {loading ? (
          <Flex justify="center" py="8">
            <Flex direction="column" align="center" gap="2">
              <RefreshCcw className="animate-spin" size={24} />
              <Text size="2" color="gray">Loading brands...</Text>
            </Flex>
          </Flex>
        ) : brands.length === 0 ? (
          <Flex justify="center" py="8">
            <Flex direction="column" align="center" gap="3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Package size={24} className="text-gray-400" />
              </div>
              <Text color="gray" size="3">No brands found</Text>
              <Text color="gray" size="2">Create your first brand to get started</Text>
              <Button onClick={openCreateModal} size="2" mt="2">
                <Plus size={16} />
                Add First Brand
              </Button>
            </Flex>
          </Flex>
        ) : (
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Brand Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Products</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell width="120px">Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {brands.map((brand) => (
                <Table.Row key={brand.id}>
                  <Table.Cell>
                    <Text weight="medium" size="3">{brand.brand_name}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" color="gray">
                      {brand.products_count || 0} products
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" color="gray">
                      {brand.created_at ? new Date(brand.created_at).toLocaleDateString() : 'N/A'}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap="2">
                      <IconButton
                        variant="soft"
                        size="1"
                        onClick={() => openEditModal(brand)}
                        title="Edit brand"
                      >
                        <Edit size={14} />
                      </IconButton>
                      <IconButton
                        variant="soft"
                        color="red"
                        size="1"
                        onClick={() => openDeleteModal(brand)}
                        disabled={deleting === brand.id}
                        title="Delete brand"
                      >
                        {deleting === brand.id ? (
                          <RefreshCcw className="animate-spin" size={14} />
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
        )}
      </Card>

      {/* Create Brand Dialog */}
      <Dialog.Root open={createOpen} onOpenChange={setCreateOpen}>
        <Dialog.Content maxWidth="400px">
          <Dialog.Title>Add New Brand</Dialog.Title>
          <Flex direction="column" gap="4" mt="4">
            <Box>
              <Text size="2" mb="2" weight="medium" as="label">Brand Name</Text>
              <TextField.Root
                placeholder="e.g., Nike, Apple, Samsung"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
            </Box>
          </Flex>
          <Flex gap="3" mt="6" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">Cancel</Button>
            </Dialog.Close>
            <Button onClick={handleCreate} disabled={saving || !brandName.trim()}>
              {saving ? <RefreshCcw className="animate-spin" size={16} /> : <Plus size={16} />}
              {saving ? 'Creating...' : 'Create Brand'}
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Edit Brand Dialog */}
      <Dialog.Root open={editOpen} onOpenChange={setEditOpen}>
        <Dialog.Content maxWidth="400px">
          <Dialog.Title>Edit Brand</Dialog.Title>
          <Flex direction="column" gap="4" mt="4">
            <Box>
              <Text size="2" mb="2" weight="medium" as="label">Brand Name</Text>
              <TextField.Root
                placeholder="e.g., Nike, Apple, Samsung"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
              />
            </Box>
          </Flex>
          <Flex gap="3" mt="6" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">Cancel</Button>
            </Dialog.Close>
            <Button onClick={handleEdit} disabled={saving || !brandName.trim()}>
              {saving ? <RefreshCcw className="animate-spin" size={16} /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Delete Confirmation Dialog */}
      <Dialog.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
        <Dialog.Content maxWidth="450px">
          <Dialog.Title color="red">Delete Brand</Dialog.Title>
          <Flex direction="column" gap="3" mt="4">
            <Flex align="center" gap="3" p="3" className="bg-red-50 rounded-lg border border-red-200">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <Box>
                <Text weight="medium" size="3">Are you sure?</Text>
                <Text size="2" color="gray" mt="1">
                  This will permanently delete &quot;{brandToDelete?.brand_name}&quot; and cannot be undone.
                </Text>
                {brandToDelete?.products_count && brandToDelete.products_count > 0 && (
                  <Text size="2" color="red" mt="1">
                    Warning: This brand has {brandToDelete.products_count} associated products.
                  </Text>
                )}
              </Box>
            </Flex>
          </Flex>
          <Flex gap="3" mt="6" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">Cancel</Button>
            </Dialog.Close>
            <Button color="red" onClick={handleDelete}>
              <Trash2 size={16} />
              Delete Brand
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
}
