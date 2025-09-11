"use client"

import { Button, Dialog, Flex, Grid, Table, Text, TextField, IconButton } from '@radix-ui/themes'
import { Box, Heading } from '@radix-ui/themes'
import { Plus, Save, X, Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import { menuCategories, menuItems } from "@/data/MenuData"
import { toast } from 'sonner';
import ConfirmDialog from '@/components/common/ConfirmDialog'

interface Category {
  id: string
  name: string
}

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>(menuCategories)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "" })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

  const handleCreate = () => {
    setSelectedCategory(null)
    setFormData({ name: "" })
    setIsDialogOpen(true)
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setFormData({ name: category.name })
    setIsDialogOpen(true)
  }

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (categoryToDelete) {
      setCategories(categories.filter(c => c.id !== categoryToDelete.id))
      setIsDeleteDialogOpen(false)
      setCategoryToDelete(null)
      toast.success('Category deleted successfully!');
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedCategory) {
      // Edit existing category
      setCategories(categories.map(c => 
        c.id === selectedCategory.id 
          ? { ...c, name: formData.name }
          : c
      ))
      toast.success('Category updated successfully!');
    } else {
      // Create new category
      const newCategory = {
        id: `category-${categories.length + 1}`,
        name: formData.name
      }
      setCategories([...categories, newCategory])
      toast.success('Category created successfully!');
    }
    setIsDialogOpen(false)
  }

  return (
    <Box className="space-y-4">
      
        <Flex justify="between" align="center" mb="4">
          <Heading as="h2" size="3">Manage Categories</Heading>
          <Button onClick={handleCreate}>
            <Plus size={16} />
            Add Category
          </Button>
        </Flex>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Category Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Menu Items</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {categories.map((category) => (
              <Table.Row key={category.id}>
                <Table.Cell>{category.name}</Table.Cell>
                <Table.Cell>
                  {menuItems.filter(item => item.category === category.id).length}
                </Table.Cell>
                <Table.Cell align="right">
                  <Flex gap="3" justify="end">
                    <IconButton 
                      variant="ghost" 
                      size="1"
                      color="gray"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit size={14} />
                    </IconButton>
                    <IconButton 
                      variant="ghost" 
                      color="red" 
                      size="1" 
                      onClick={() => handleDelete(category)}
                    >
                      <Trash2 size={14} />
                    </IconButton>
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
              <Dialog.Title>
                {selectedCategory ? "Edit Category" : "Create Category"}
              </Dialog.Title>
              <Dialog.Close>
                <X size={16} />
              </Dialog.Close>
            </Flex>
            <Dialog.Description>
              {selectedCategory 
                ? "Edit the category details below."
                : "Add a new category to your menu."}
            </Dialog.Description>

            <Grid gap="4" py="4">
              <Grid gap="2">
                <Text as="label" size="2" weight="medium">Category Name</Text>
                <TextField.Root
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  placeholder="Enter category name"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </Grid>
            </Grid>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  <X size={16} />
                  Cancel
                </Button>
              </Dialog.Close>
              <Button color="green">
                <Save size={16} />
                {selectedCategory ? "Save Changes" : "Create Category"}
              </Button>
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