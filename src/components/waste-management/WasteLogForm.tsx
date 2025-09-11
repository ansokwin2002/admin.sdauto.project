'use client';

import React, { useState, useEffect } from 'react';
import { WasteLog, UnitOfMeasure } from '@/types/inventory';
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Select,
  Text,
  TextArea,
  TextField,
  AlertDialog,
} from '@radix-ui/themes';
import { Save, X, Trash2 } from 'lucide-react';
import { wasteSources, wasteReasons } from '@/data/WasteLogData';
import SearchableSelect from '@/components/common/SearchableSelect';
import { ingredientItems } from '@/data/IngredientItemsData';
import { unitOfMeasures } from '@/data/CommonData';
import DateInput from '@/components/common/DateInput';
import { PageHeading } from '@/components/common/PageHeading';

// Mock staff data - In real implementation this should come from a data file or API
const staffList = [
  { id: 'emp-001', name: 'David Kim', position: 'Shift Manager' },
  { id: 'emp-002', name: 'Lisa Chen', position: 'Chef' },
  { id: 'emp-003', name: 'Robert Jones', position: 'Server' },
  { id: 'emp-004', name: 'Emily Davis', position: 'Server' },
  { id: 'emp-005', name: 'Carlos Rodriguez', position: 'Cashier' },
  { id: 'emp-006', name: 'Maria Garcia', position: 'Store Manager' },
  { id: 'emp-007', name: 'Peter Bryan', position: 'Manager' },
  { id: 'emp-008', name: 'Jane Smith', position: 'Inventory Specialist' },
  { id: 'emp-009', name: 'Robert Johnson', position: 'Purchasing Agent' },
];

interface WasteLogFormProps {
  onSubmit: (wasteLog: Omit<WasteLog, 'id'> & { id?: string }) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
  editingItem?: WasteLog | null;
}

export default function WasteLogForm({ onSubmit, onCancel, onDelete, editingItem }: WasteLogFormProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  // Initialize form with existing data if in edit mode
  const getInitialFormData = () => {
    if (editingItem) {
      return {
        ...editingItem,
        timestamp: new Date(editingItem.timestamp)
      };
    }
    
    return {
      productId: '',
      productName: '',
      quantity: 0,
      measureUnit: 'kg' as UnitOfMeasure,
      reason: 'spoiled',
      source: 'storage',
      staffName: '',
      timestamp: null,
      notes: '',
      cost: 0
    };
  };

  const [formData, setFormData] = useState<any>(getInitialFormData());
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Update form data if editingItem changes
  useEffect(() => {
    if (editingItem) {
      setFormData({
        ...editingItem,
        timestamp: new Date(editingItem.timestamp)
      });
    }
  }, [editingItem]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' || name === 'cost' ? parseFloat(value) || 0 : value
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleProductSelect = (productId: string | string[] | null) => {
    if (!productId || Array.isArray(productId)) return;
    
    const product = ingredientItems.find(item => item.id === productId);
    
    if (product) {
      setFormData({
        ...formData,
        productId: product.id,
        productName: product.name,
        measureUnit: product.storageUnit
      });
      // Clear productName error
      if (errors.productName) {
        setErrors(prevErrors => {
          const newErrors = { ...prevErrors };
          delete newErrors.productName;
          return newErrors;
        });
      }
    }
  };

  const handleDateChange = (date: Date | undefined | null) => {
    setFormData({
      ...formData,
      timestamp: date // Keep it null if cleared
    });
     // Clear timestamp error
     if (errors.timestamp) {
       setErrors(prevErrors => {
         const newErrors = { ...prevErrors };
         delete newErrors.timestamp;
         return newErrors;
       });
     }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.productName) {
      newErrors.productName = 'Product name is required';
    }
    
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    
    if (!formData.reason) {
      newErrors.reason = 'Reason is required';
    }
    
    if (!formData.source) {
      newErrors.source = 'Source is required';
    }
    
    if (!formData.staffName) {
      newErrors.staffName = 'Staff name is required';
    }
    
    if (!formData.timestamp) {
      newErrors.timestamp = 'Date and time is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Call the onSubmit prop with the form data
    onSubmit(formData);
  };

  const handleDelete = () => {
    if (editingItem?.id && onDelete) {
      onDelete(editingItem.id);
      setShowDeleteDialog(false);
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Flex justify="between" align="center" mb="4">
          <PageHeading 
            title={editingItem ? `Edit Waste Log - ${editingItem.productName}` : 'Log New Waste'}
            description={editingItem ? 'Update the details of this waste log.' : 'Record a new waste incident.'}
            showBackButton
            onBackClick={onCancel}
            noMarginBottom
          />
        </Flex>

        <Flex gap="3" direction={{ initial: "column", md: "row" }}>
          <Card size="3" className="w-full md:w-3/4">
            <Flex direction="column" gap="4">
              {/* Product selection */}
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Product/Ingredient</Text>
                <SearchableSelect
                  options={ingredientItems.map(item => ({
                    value: item.id,
                    label: item.name
                  }))}
                  placeholder="Select product"
                  onChange={handleProductSelect}
                  value={formData.productId}
                />
                {errors.productName && <Text size="1" color="red">{errors.productName}</Text>}
              </Flex>

              {/* Quantity and Unit */}
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Quantity & Unit</Text>
                <Flex gap="2" align="center">
                  <TextField.Root
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-24"
                  />
                  <Select.Root 
                    value={formData.measureUnit} 
                    onValueChange={(value) => handleSelectChange('measureUnit', value)}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      {unitOfMeasures.map(unit => (
                        <Select.Item key={unit} value={unit}>
                          {unit}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Flex>
                {errors.quantity && <Text size="1" color="red">{errors.quantity}</Text>}
              </Flex>

              {/* Reason */}
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Reason</Text>
                <Select.Root 
                  value={formData.reason} 
                  onValueChange={(value) => handleSelectChange('reason', value)}
                >
                  <Select.Trigger />
                  <Select.Content>
                    {wasteReasons.map(reason => (
                      <Select.Item key={reason.value} value={reason.value}>
                        {reason.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                {errors.reason && <Text size="1" color="red">{errors.reason}</Text>}
              </Flex>

              {/* Staff Name */}
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Staff Name</Text>
                <Select.Root 
                  value={formData.staffName} 
                  onValueChange={(value) => handleSelectChange('staffName', value)}
                >
                  <Select.Trigger placeholder="Select staff member" />
                  <Select.Content>
                    {staffList.map(staff => (
                      <Select.Item key={staff.id} value={staff.name}>
                        {staff.name} - {staff.position}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                {errors.staffName && <Text size="1" color="red">{errors.staffName}</Text>}
              </Flex>

              {/* Date & Time */}
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Date & Time</Text>
                <DateInput
                  value={formData.timestamp}
                  onChange={handleDateChange}
                  includeTime={true}
                  position="top"
                />
                {errors.timestamp && <Text size="1" color="red">{errors.timestamp}</Text>}
              </Flex>
            </Flex>
          </Card>
          <Card size="3" className="w-full md:w-1/4">
            <Flex direction="column" gap="4">
              {/* Source */}
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Source</Text>
                <Select.Root 
                  value={formData.source} 
                  onValueChange={(value) => handleSelectChange('source', value)}
                >
                  <Select.Trigger />
                  <Select.Content>
                    {wasteSources.map(source => (
                      <Select.Item key={source.value} value={source.value}>
                        {source.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                {errors.source && <Text size="1" color="red">{errors.source}</Text>}
              </Flex>

              {/* Estimated Cost */}
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Estimated Cost</Text>
                <TextField.Root
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                >
                  <TextField.Slot>$</TextField.Slot>
                </TextField.Root>
              </Flex>

              {/* Notes */}
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Notes</Text>
                <TextArea
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  placeholder="Additional details about the waste incident..."
                  rows={7}
                />
              </Flex>
            </Flex>
          </Card>
        </Flex>        

        <Flex justify="between" mt="4" direction={{ initial: "column", sm: "row" }} gap={{ initial: "4", sm: "0" }}>
          <Flex gap="4" direction={{ initial: "column", sm: "row" }}>
            <Button color="green" type="submit" className="w-full sm:w-auto">
              <Save size={16} /> 
              {editingItem ? 'Update Log' : 'Save Log'}
            </Button>
            <Button variant="soft" color="gray" onClick={onCancel} type="button" className="w-full sm:w-auto">
              <X size={16} />
              Cancel
            </Button>
          </Flex>
          {editingItem && (
            <Button 
              variant="soft" 
              color="red" 
              onClick={() => setShowDeleteDialog(true)}
              className="w-full sm:w-auto"
            >
              <Trash2 size={16} />
              Delete
            </Button>
          )}
        </Flex>
      </form>

      <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialog.Content>
          <AlertDialog.Title>Delete Waste Log</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to delete this waste log? This action cannot be undone.
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
} 