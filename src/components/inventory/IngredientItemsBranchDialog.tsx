'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  Flex,
  TextField,
  Button,
  Text,
  Box,
  IconButton,
  Badge
} from '@radix-ui/themes';
import { IngredientItem, BranchIngredientData } from '@/types/inventory';
import { X, Save, RefreshCcw } from 'lucide-react';

interface IngredientItemsBranchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: IngredientItem;
  branchId: string;
  branchName: string;
}

export default function IngredientItemsBranchDialog({
  open,
  onOpenChange,
  item,
  branchId,
  branchName
}: IngredientItemsBranchDialogProps) {
  const [formData, setFormData] = useState<BranchIngredientData>({
    unitPrice: 0,
    minLevel: 0,
    maxLevel: 0,
    reorderLevel: 0,
  });

  // Load initial data
  useEffect(() => {
    if (item && branchId) {
      // Get branch-specific data if it exists
      if (item.branchData && item.branchData[branchId]) {
        setFormData({
          ...item.branchData[branchId],
        });
      } else {
        // Otherwise use default values
        setFormData({
          unitPrice: item.unitPrice || 0,
          minLevel: item.minLevel || 0,
          maxLevel: item.maxLevel || 0,
          reorderLevel: item.reorderLevel || 0,
        });
      }
    }
  }, [item, branchId, open]);

  const handleChange = (name: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [name]: typeof value === 'string' ? parseFloat(value) : value
    }));
  };

  const handleReset = () => {
    // Reset to default values
    setFormData({
      unitPrice: item.unitPrice || 0,
      minLevel: item.minLevel || 0,
      maxLevel: item.maxLevel || 0,
      reorderLevel: item.reorderLevel || 0,
    });
  };

  const handleSave = () => {
    // In a real app, you would update the data in your state/database here
    console.log('Saving branch specific data:', {
      itemId: item.id,
      branchId,
      data: formData
    });
    
    // For demo purposes we're just closing the dialog
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 500 }}>
        <Flex justify="between" mb="2">
          <Dialog.Title>
            <Text className="block">Branch Settings for {item.name}</Text>
            <Badge>{branchName}</Badge>
          </Dialog.Title>
          <Dialog.Close>
            <IconButton variant="ghost" color="gray">
              <X size={18} />
            </IconButton>
          </Dialog.Close>
        </Flex>
        
        <Dialog.Description size="2" mb="4">
          Configure branch-specific settings for this branch.
        </Dialog.Description>
        
        <Box className="space-y-4">
          <Flex direction="column" gap="1">
            <Text as="label" size="2" weight="medium">
              Unit Price
            </Text>
            <TextField.Root
              type="number"
              value={formData.unitPrice?.toString()}
              onChange={(e) => handleChange('unitPrice', e.target.value)}
              step="0.01"
            >
              <TextField.Slot>$</TextField.Slot>
            </TextField.Root>
          </Flex>
          
          <Flex gap="4">
            <Box className="flex-1">
              <Text as="label" size="2" weight="medium">Min Level</Text>
              <TextField.Root
                type="number"
                value={formData.minLevel?.toString()}
                onChange={(e) => handleChange('minLevel', e.target.value)}
                step="0.01"
              >
                <TextField.Slot>Min.</TextField.Slot>
                <TextField.Slot>{item.storageUnit}</TextField.Slot>
              </TextField.Root>
            </Box>
            
            <Box className="flex-1">
              <Text as="label" size="2" weight="medium">Max Level</Text>
              <TextField.Root
                type="number"
                value={formData.maxLevel?.toString()}
                onChange={(e) => handleChange('maxLevel', e.target.value)}
                step="0.01"
              >
                <TextField.Slot>Max.</TextField.Slot>
                <TextField.Slot>{item.storageUnit}</TextField.Slot>
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="label" size="2" weight="medium">Reorder Level</Text>
              <TextField.Root
                type="number"
                value={formData.reorderLevel?.toString()}
                onChange={(e) => handleChange('reorderLevel', e.target.value)}
                step="0.01"
              >
                <TextField.Slot>at</TextField.Slot>
                <TextField.Slot>{item.storageUnit}</TextField.Slot>
              </TextField.Root>
            </Box>
          </Flex>
        </Box>
        
        <Flex gap="2" mt="6" justify="end">
          <Button variant="soft" color="gray" onClick={() => onOpenChange(false)}>
            <X size={16} />
            Cancel
          </Button>
          <Button color="green" onClick={handleSave}>
            <Save size={16} />
            Save
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}