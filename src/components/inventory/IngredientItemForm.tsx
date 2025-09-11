import React, { useState, useEffect } from 'react';
import { IngredientItem } from '@/types/inventory';
import {
  Box,
  Button,
  Card,
  Flex,
  Select,
  Text,
  TextField,
  AlertDialog,
} from '@radix-ui/themes';
import { ingredientItemCategories, unitOfMeasures } from '@/data/CommonData';
import { Save, X, Trash2 } from 'lucide-react';
import { PageHeading } from '@/components/common/PageHeading';

interface IngredientItemFormProps {
  onSubmit: (ingredient: Omit<IngredientItem, 'id'> & { id?: string }) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
  editingItem?: IngredientItem; // Optional existing item for editing
}

export const IngredientItemForm: React.FC<IngredientItemFormProps> = ({ 
  onSubmit, 
  onCancel,
  onDelete,
  editingItem 
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Initialize form with existing item data if in edit mode
  const getInitialFormData = () => {
    if (editingItem) {
      const { id, ...rest } = editingItem;
      return rest;
    }
    
    return {
      name: '',
      nameLocalized: '',
      sku: '',
      category: '',
      storageUnit: '',
      ingredientUnit: '',
      storageIngredientFactor: 0,
      unitPrice: 0,
      barcode: '',
      minLevel: 0,
      maxLevel: 0,
      reorderLevel: 0,
    };
  };

  const [formData, setFormData] = useState<any>(
    getInitialFormData()
  );

  // Update form data if existingItem changes
  useEffect(() => {
    if (editingItem) {
      const { id, ...rest } = editingItem;
      setFormData(rest);
    }
  }, [editingItem]);

  const handleChange = (name: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Level') || name === 'unitPrice' || name === 'storageIngredientFactor'
        ? parseFloat(value as string)
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedFormData = { ...formData };
    
    // If editing, pass the id back with the form data
    if (editingItem) {
      onSubmit({
        ...updatedFormData,
        id: editingItem.id
      });
    } else {
      onSubmit(updatedFormData);
    }
  };

  const handleDelete = () => {
    if (editingItem?.id && onDelete) {
      onDelete(editingItem.id);
      setShowDeleteDialog(false);
    }
  };

  return (
    <Box>
      <Flex justify="between" align="center" mb="5">
        <PageHeading
          title={editingItem ? `Edit ${editingItem.name}` : 'Add Ingredient Item'}
          description={editingItem ? 'View/edit the details for this ingredient.' : 'Enter the details for the new ingredient.'}
          showBackButton
          onBackClick={onCancel}
          noMarginBottom
        />
      </Flex>

      <form onSubmit={handleSubmit}>      
        <Flex 
          direction={{ initial: "column", sm: "row" }} 
          gap="4"
        >
          <Card size="3" className="w-full sm:basis-3/4 space-y-4">
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Name</Text>
              <TextField.Root
                name="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </Flex>
          
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Localized Name</Text>
              <TextField.Root
                name="nameLocalized"
                value={formData.nameLocalized}
                onChange={(e) => handleChange('nameLocalized', e.target.value)}
                required
              />
            </Flex>

            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">SKU</Text>
              <TextField.Root
                name="sku"
                value={formData.sku}
                onChange={(e) => handleChange('sku', e.target.value)}
                required
              />
            </Flex>

            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Category</Text>
              <Select.Root
                name="category"
                value={formData.category}
                onValueChange={(value) => handleChange('category', value)}
                required
              >
                <Select.Trigger />
                <Select.Content>
                  {ingredientItemCategories.map(category => (
                    <Select.Item key={category} value={category}>{category}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Flex>
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Unit Price</Text>
              <TextField.Root
                type="number"
                name="unitPrice"
                value={formData.unitPrice.toString()}
                onChange={(e) => handleChange('unitPrice', e.target.value)}
                required
                step="0.01"
              >
                <TextField.Slot>$</TextField.Slot>
              </TextField.Root>
            </Flex>

            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Barcode</Text>
              <TextField.Root
                name="barcode"
                value={formData.barcode}
                onChange={(e) => handleChange('barcode', e.target.value)}
              />
            </Flex>
          </Card>
          <Card size="3" className="w-full sm:basis-1/4 space-y-4">
            <Flex direction="column" gap="4">
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Storage Unit</Text>
                <Select.Root
                  name="storageUnit"
                  value={formData.storageUnit}
                  onValueChange={(value) => handleChange('storageUnit', value)}
                  required
                >
                  <Select.Trigger />
                  <Select.Content>
                    {unitOfMeasures.map(unit => (
                      <Select.Item key={unit} value={unit}>{unit}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Flex>

              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Ingredient Unit</Text>
                <Select.Root
                  name="ingredientUnit"
                  value={formData.ingredientUnit}
                  onValueChange={(value) => handleChange('ingredientUnit', value)}
                  required
                >
                  <Select.Trigger />
                  <Select.Content>
                    {unitOfMeasures.map(unit => (
                      <Select.Item key={unit} value={unit}>{unit}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Flex>

              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Storage/Ingredient Factor</Text>
                <TextField.Root
                  type="number"
                  name="storageIngredientFactor"
                  value={formData.storageIngredientFactor.toString()}
                  onChange={(e) => handleChange('storageIngredientFactor', e.target.value)}
                  required
                  step="0.01"
                />
              </Flex>
            </Flex>

            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Minimum Level</Text>
              <TextField.Root
                type="number"
                name="minLevel"
                value={formData.minLevel.toString()}
                onChange={(e) => handleChange('minLevel', e.target.value)}
                required
              >
                <TextField.Slot>Min.</TextField.Slot>
              </TextField.Root>
            </Flex>

            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Maximum Level</Text>
              <TextField.Root
                type="number"
                name="maxLevel"
                value={formData.maxLevel.toString()}
                onChange={(e) => handleChange('maxLevel', e.target.value)}
                required
              >
                <TextField.Slot>Max.</TextField.Slot>
              </TextField.Root>
            </Flex>

            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Reorder Level</Text>
              <TextField.Root
                type="number"
                name="reorderLevel"
                value={formData.reorderLevel.toString()}
                onChange={(e) => handleChange('reorderLevel', e.target.value)}
                required
              >
                <TextField.Slot>Reorder at</TextField.Slot>
              </TextField.Root>
            </Flex>
          </Card>
        </Flex>

        <Flex 
          direction={{ initial: "column", sm: "row" }}
          justify="between" 
          gap={{ initial: "3", sm: "4" }}
          mt="4"
        >
          <Flex 
            direction={{ initial: "column", sm: "row" }}
            gap={{ initial: "3", sm: "4" }}
          >
            <Button type="submit" color="green" onClick={handleSubmit}>
              <Save className="h-4 w-4" />
              Save Item
            </Button>
            <Button variant="soft" color="gray" onClick={onCancel}>
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </Flex>
          {editingItem && (
            <Button 
              variant="soft" 
              color="red" 
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
        </Flex>
      </form>

      <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialog.Content>
          <AlertDialog.Title>Delete Ingredient</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to delete this ingredient? This action cannot be undone.
          </AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button variant="solid" color="red" onClick={handleDelete}>
                Delete
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Box>
  );
};

export default IngredientItemForm;
