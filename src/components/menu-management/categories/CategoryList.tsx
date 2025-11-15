"use client"

import { Button, Dialog, Flex, Grid, Table, Text, TextField, IconButton, Badge, Switch } from '@radix-ui/themes'
import { Box, Heading } from '@radix-ui/themes'
import { Plus, Save, X, Edit, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from 'sonner'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { API_BASE_URL } from "@/utilities/constants"

interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  status: boolean;
  items_count: number;
}

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    sort_order: 0,
    status: true,
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const apiEndpoint = `${API_BASE_URL}/api/admin/categories`;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const response = await axios.get(apiEndpoint, { headers });
        setCategories(response.data.data || response.data);
      } catch (error) {
        toast.error('Failed to fetch categories.');
        console.error(error);
      }
    };
    fetchCategories();
  }, [apiEndpoint]);

  const handleCreate = () => {
    setSelectedCategory(null);
    setFormData({ name: "", slug: "", sort_order: 0, status: true });
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      sort_order: category.sort_order,
      status: category.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        await axios.delete(`${apiEndpoint}/${categoryToDelete.id}`, { headers });
        setCategories(categories.filter(c => c.id !== categoryToDelete.id));
        toast.success('Category deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete category.');
        console.error(error);
      } finally {
        setIsDeleteDialogOpen(false);
        setCategoryToDelete(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      if (selectedCategory) {
        const response = await axios.put(`${apiEndpoint}/${selectedCategory.id}`, formData, { headers });
        setCategories(categories.map(c => c.id === selectedCategory.id ? response.data.data || response.data : c));
        toast.success('Category updated successfully!');
      } else {
        const response = await axios.post(apiEndpoint, formData, { headers });
        setCategories([...categories, response.data.data || response.data]);
        toast.success('Category created successfully!');
      }
      setIsDialogOpen(false);
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.errors) {
            const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
            toast.error(errorMessages);
        } else {
            toast.error(`Failed to ${selectedCategory ? 'update' : 'create'} category.`);
        }
        console.error(error);
    }
  };

  return (
    <Box className="space-y-4">
      <Flex justify="between" align="center" mb="4">
        <Heading as="h2" size="3">Manage Categories</Heading>
        <Button onClick={handleCreate}><Plus size={16} /> Add Category</Button>
      </Flex>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Category Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Slug</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Menu Items</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Sort Order</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell align="right">Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {categories.map((category) => (
            <Table.Row key={category.id}>
              <Table.Cell>{category.name}</Table.Cell>
              <Table.Cell>{category.slug}</Table.Cell>
              <Table.Cell>{category.items_count}</Table.Cell>
              <Table.Cell>{category.sort_order}</Table.Cell>
              <Table.Cell>
                <Badge color={category.status ? 'green' : 'red'}>
                  {category.status ? 'Active' : 'Inactive'}
                </Badge>
              </Table.Cell>
              <Table.Cell align="right">
                <Flex gap="3" justify="end">
                  <IconButton variant="ghost" size="1" color="gray" onClick={() => handleEdit(category)}><Edit size={14} /></IconButton>
                  <IconButton variant="ghost" color="red" size="1" onClick={() => handleDelete(category)}><Trash2 size={14} /></IconButton>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Content>
          <form onSubmit={handleSubmit}>
            <Flex justify="between" mb="4">
              <Dialog.Title>{selectedCategory ? "Edit Category" : "Create Category"}</Dialog.Title>
              <Dialog.Close><X size={16} /></Dialog.Close>
            </Flex>
            <Grid gap="4" py="4">
              <Grid gap="2">
                <Text as="label" size="2" weight="medium">Category Name</Text>
                <TextField.Root
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter category name"
                  required
                />
              </Grid>
              <Grid gap="2">
                <Text as="label" size="2" weight="medium">Slug</Text>
                <TextField.Root type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} placeholder="e.g., main-courses" />
              </Grid>
              <Grid gap="2">
                <Text as="label" size="2" weight="medium">Sort Order</Text>
                <TextField.Root type="number" value={formData.sort_order} onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})} />
              </Grid>
              <Grid gap="2">
                <Text as="label" size="2" weight="medium">Status</Text>
                <Flex align="center" gap="2">
                    <Switch checked={formData.status} onCheckedChange={(checked) => setFormData({...formData, status: checked})} />
                    <Text>{formData.status ? 'Active' : 'Inactive'}</Text>
                </Flex>
              </Grid>
            </Grid>
            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close><Button variant="soft" color="gray" type="button"><X size={16} /> Cancel</Button></Dialog.Close>
              <Button color="green" type="submit"><Save size={16} /> {selectedCategory ? "Save Changes" : "Create Category"}</Button>
            </Flex>
          </form>
        </Dialog.Content>
      </Dialog.Root>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        color="red"
      />
    </Box>
  )
}
