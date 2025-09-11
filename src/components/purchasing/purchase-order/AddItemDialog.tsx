'use client';

import { useState, useEffect } from 'react';
import { Dialog, TextField, Button, Flex, Grid, Text, Box, IconButton } from '@radix-ui/themes';
import { PurchaseOrderItem } from '@/data/PurchaseOrderData';
import { v4 as uuidv4 } from 'uuid';
import SearchableSelect from '@/components/common/SearchableSelect';
import { mockStockItems } from '@/data/StockItemData';
import { Save, X } from 'lucide-react';

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItem: (item: PurchaseOrderItem) => void;
  initialItem?: PurchaseOrderItem | null;
}

export default function AddItemDialog({
  open,
  onOpenChange,
  onAddItem,
  initialItem = null
}: AddItemDialogProps) {
  const [item, setItem] = useState<Partial<PurchaseOrderItem>>({
    itemName: '',
    quantityOrdered: 1,
    unitPrice: 0,
    receivedQuantity: 0,
    stockLocation: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [itemOptions, setItemOptions] = useState<Array<{ value: string; label: string }>>([]);
  
  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (initialItem) {
        // If we're editing an existing item, pre-populate the form
        setItem(initialItem);
      } else {
        // Otherwise reset to default values
        setItem({
          itemName: '',
          quantityOrdered: 1,
          unitPrice: 0,
          receivedQuantity: 0,
          stockLocation: ''
        });
      }
      setErrors({});
    }
  }, [open, initialItem]);

  useEffect(() => {
    // Convert stock items to options for searchable select
    const options = mockStockItems.map(stockItem => ({
      value: stockItem.id,
      label: `${stockItem.name} (${stockItem.sku})`
    }));
    setItemOptions(options);
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!item.itemName?.trim()) {
      newErrors.itemName = 'Item name is required';
    }
    
    if (!item.quantityOrdered || item.quantityOrdered <= 0) {
      newErrors.quantityOrdered = 'Quantity must be greater than 0';
    }
    
    if (!item.unitPrice || item.unitPrice <= 0) {
      newErrors.unitPrice = 'Unit price must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const itemToSubmit: PurchaseOrderItem = {
        id: initialItem ? initialItem.id : uuidv4(),
        itemName: item.itemName || '',
        quantityOrdered: item.quantityOrdered || 0,
        unitPrice: item.unitPrice || 0,
        receivedQuantity: initialItem ? initialItem.receivedQuantity : 0,
        stockLocation: initialItem ? initialItem.stockLocation : '',
      };
      
      onAddItem(itemToSubmit);
      
      // Reset form happens in useEffect when dialog closes
      onOpenChange(false);
    }
  };

  // Handle item selection and auto-populate fields when an item is selected
  const handleItemSelect = (itemId: string | null) => {
    if (itemId) {
      const selectedStockItem = mockStockItems.find(i => i.id === itemId);
      if (selectedStockItem) {
        setItem({
          ...item,
          itemName: selectedStockItem.name,
          // You might want to auto-populate the unit price if available in your data
          // unitPrice: selectedStockItem.unitPrice || 0
        });
      }
    } else {
      setItem({
        ...item,
        itemName: ''
      });
    }
  };

  // Find the current item ID from the name to display in the SearchableSelect
  const getCurrentItemId = () => {
    if (!item.itemName) return null;
    
    const option = itemOptions.find(opt => 
      opt.label.toLowerCase().includes(item.itemName.toLowerCase())
    );
    
    return option?.value || null;
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 500 }} className="!overflow-visible">
        <Flex justify="between" mb="3">
          <Dialog.Title>{initialItem ? 'Edit Order Item' : 'Add Order Item'}</Dialog.Title>
          <IconButton variant="ghost" color="gray" onClick={() => onOpenChange(false)}>
            <X size={16} />
          </IconButton>
        </Flex>
        <Dialog.Description size="2" mb="4">
          {initialItem ? 'Update item details.' : 'Add new item to this purchase order.'}
        </Dialog.Description>
        
        <Grid columns="1" gap="3" width="auto">
          <Flex direction="column" gap="1">
            <Text as="label" size="2" weight="medium">Item Name *</Text>
            <div style={{ position: 'relative' }}>
              <SearchableSelect 
                options={itemOptions}
                onChange={handleItemSelect}
                placeholder="Search for an item..."
                value={getCurrentItemId()}
              />
            </div>
            {errors.itemName && (
              <Text size="1" color="red">{errors.itemName}</Text>
            )}
          </Flex>
          
          <Grid columns="2" gap="3">
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Quantity *</Text>
              <TextField.Root 
                type="number"
                min="1"
                placeholder="Enter quantity"
                value={item.quantityOrdered?.toString()}
                onChange={(e) => setItem({ ...item, quantityOrdered: parseInt(e.target.value) || 0 })}
                color={errors.quantityOrdered ? 'red' : undefined}
              />
              {errors.quantityOrdered && (
                <Text size="1" color="red">{errors.quantityOrdered}</Text>
              )}
            </Flex>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Unit Price ($) *</Text>
              <TextField.Root 
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={item.unitPrice?.toString()}
                onChange={(e) => setItem({ ...item, unitPrice: parseFloat(e.target.value) || 0 })}
                color={errors.unitPrice ? 'red' : undefined}
              >
                <TextField.Slot>
                  $
                </TextField.Slot>
              </TextField.Root>
              {errors.unitPrice && (
                <Text size="1" color="red">{errors.unitPrice}</Text>
              )}
            </Flex>
          </Grid>
        </Grid>
        
        <Flex gap="3" mt="6" justify="end">
          <Button variant="soft" color="gray" onClick={() => onOpenChange(false)}>
            <X size={16} />
            Cancel
          </Button>
          <Button color="green" onClick={handleSubmit}>
            <Save size={16} />
            {initialItem ? 'Update Item' : 'Add Item'}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
} 