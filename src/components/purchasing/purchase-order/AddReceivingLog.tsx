'use client';

import { useState, useEffect } from 'react';
import { Dialog, TextField, Button, Flex, Grid, Text, Box, TextArea, Select, IconButton } from '@radix-ui/themes';
import { PurchaseOrderItem, ReceivingLog } from '@/data/PurchaseOrderData';
import { v4 as uuidv4 } from 'uuid';
import DateInput from '@/components/common/DateInput';
import SearchableSelect from '@/components/common/SearchableSelect';
import { X, Save } from 'lucide-react';

interface AddReceivingLogFormData {
  date: string;
  quantityReceived: number;
  receivedBy: string;
  notes?: string;
  selectedItemId: string;
  expiryDate?: string;
  storageLocation?: string;
}

interface AddReceivingLogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLog: (log: ReceivingLog) => void;
  availableItems: PurchaseOrderItem[];
}

export default function AddReceivingLog({
  open,
  onOpenChange,
  onAddLog,
  availableItems
}: AddReceivingLogProps) {
  const [formData, setFormData] = useState<AddReceivingLogFormData>({
    date: new Date().toISOString().slice(0, 10),
    quantityReceived: 0,
    receivedBy: '',
    notes: '',
    selectedItemId: '',
    expiryDate: '',
    storageLocation: ''
  });

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedExpiryDate, setSelectedExpiryDate] = useState<Date | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      // Reset form when dialog opens
      setFormData({
        date: new Date().toISOString().slice(0, 10),
        quantityReceived: 0,
        receivedBy: '',
        notes: '',
        selectedItemId: '',
        expiryDate: '',
        storageLocation: ''
      });
      setSelectedDate(new Date());
      setSelectedExpiryDate(null);
      setErrors({});
    }
  }, [open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.selectedItemId) {
      newErrors.selectedItemId = 'Item is required';
    }
    
    if (!formData.quantityReceived || formData.quantityReceived <= 0) {
      newErrors.quantityReceived = 'Quantity must be greater than 0';
    }
    
    if (!formData.receivedBy?.trim()) {
      newErrors.receivedBy = 'Received by is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const selectedItem = availableItems.find(item => item.id === formData.selectedItemId);
      
      if (!selectedItem) {
        setErrors({ selectedItemId: 'Please select a valid item' });
        return;
      }
      
      const newLog: ReceivingLog = {
        id: uuidv4(),
        date: formData.date,
        quantityReceived: formData.quantityReceived,
        receivedBy: formData.receivedBy,
        notes: formData.notes,
        itemName: selectedItem.itemName,
        itemSku: selectedItem.id.split('-')[0] || 'N/A', // Using the first part of ID as SKU for demo
        expiryDate: formData.expiryDate,
        storageLocation: formData.storageLocation
      };
      
      onAddLog(newLog);
      onOpenChange(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 500 }} className="!overflow-visible">
        <Flex justify="between" mb="3">
          <Dialog.Title>Add Receiving Log</Dialog.Title>
          <IconButton variant="ghost" color="gray" onClick={() => onOpenChange(false)}>
            <X size={16} />
          </IconButton>
        </Flex>
        <Dialog.Description size="2" mb="4">
          Record received items for this purchase order.
        </Dialog.Description>
        
        <Grid columns="1" gap="4" width="auto">
          <Flex direction="column" gap="1">
            <Text as="label" size="2" weight="medium">Item *</Text>
            <SearchableSelect
              options={availableItems.map(item => ({
                value: item.id,
                label: item.itemName
              }))}
              value={formData.selectedItemId}
              onChange={(selectedItem) => setFormData({ ...formData, selectedItemId: selectedItem as string })}              
              placeholder="Select an item"
            />
            {errors.selectedItem && (
              <Text size="1" color="red">{errors.selectedItem}</Text>
            )}
          </Flex>

          <Grid columns="2" gap="3">
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Date Received *</Text>
              <DateInput
                value={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date || new Date());
                  if (date) {
                    setFormData({
                      ...formData,
                      date: date.toISOString().slice(0, 10)
                    });
                  }
                }}
                placeholder="Select date received"
                maxDate={new Date()}
              />
            </Flex>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Quantity Received *</Text>
              <TextField.Root 
                type="number"
                min="1"
                placeholder="Enter quantity"
                value={formData.quantityReceived?.toString() || ''}
                onChange={(e) => setFormData({ ...formData, quantityReceived: parseInt(e.target.value) || 0 })}
                color={errors.quantityReceived ? 'red' : undefined}
              />
              {errors.quantityReceived && (
                <Text size="1" color="red">{errors.quantityReceived}</Text>
              )}
            </Flex>
          </Grid>
          
          <Grid columns="2" gap="3">
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Expiry Date</Text>
              <DateInput
                value={selectedExpiryDate}
                onChange={(date) => {
                  setSelectedExpiryDate(date);
                  setFormData({
                    ...formData,
                    expiryDate: date ? date.toISOString().slice(0, 10) : undefined
                  });
                }}
                placeholder="Select expiry date"
                minDate={new Date()}
              />
            </Flex>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Storage Location</Text>
              <Select.Root 
                value={formData.storageLocation || ''}
                onValueChange={(value) => setFormData({ ...formData, storageLocation: value })}
              >
                <Select.Trigger placeholder="Select location" />
                <Select.Content>
                  <Select.Group>
                    <Select.Item value="Dry Storage">Dry Storage</Select.Item>
                    <Select.Item value="Refrigerated">Refrigerated</Select.Item>
                    <Select.Item value="Freezer A">Freezer A</Select.Item>
                    <Select.Item value="Freezer B">Freezer B</Select.Item>
                    <Select.Item value="Pantry A">Pantry Shelf A</Select.Item>
                    <Select.Item value="Pantry B">Pantry Shelf B</Select.Item>
                    <Select.Item value="Bar">Bar</Select.Item>
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </Flex>
          </Grid>
          
          <Flex direction="column" gap="1">
            <Text as="label" size="2" weight="medium">Received By *</Text>
            <TextField.Root 
              placeholder="Enter name"
              value={formData.receivedBy || ''}
              onChange={(e) => setFormData({ ...formData, receivedBy: e.target.value })}
              color={errors.receivedBy ? 'red' : undefined}
            />
            {errors.receivedBy && (
              <Text size="1" color="red">{errors.receivedBy}</Text>
            )}
          </Flex>
          
          <Flex direction="column" gap="1">
            <Text as="label" size="2" weight="medium">Notes</Text>
            <TextArea 
              placeholder="Any additional notes about received items"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </Flex>
        </Grid>
        
        <Flex gap="3" mt="6" justify="end">
          <Button variant="soft" color="gray" onClick={() => onOpenChange(false)}>
            <X size={16} />
            Cancel
          </Button>
          <Button color="green" onClick={handleSubmit}>
            <Save size={16} />
            Add Log
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
