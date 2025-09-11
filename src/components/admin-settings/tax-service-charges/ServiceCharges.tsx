'use client';

import React, { useState } from 'react';
import { Box, Flex, Text, TextField, Switch, Button, Table, Select, Checkbox, Dialog, IconButton } from '@radix-ui/themes';
import { Save, Edit, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import CardHeading from '@/components/common/CardHeading';

// Mock data for service charges
const initialServiceCharges = [
  { 
    id: 1, 
    name: 'Service Fee', 
    type: 'percentage', 
    value: 5, 
    applyToDineIn: true, 
    applyToDelivery: false, 
    applyToTakeaway: false, 
    isInclusive: false 
  },
  { 
    id: 2, 
    name: 'Delivery Surcharge', 
    type: 'fixed', 
    value: 2, 
    applyToDineIn: false, 
    applyToDelivery: true, 
    applyToTakeaway: false, 
    isInclusive: false 
  }
];

export default function ServiceCharges() {
  const [serviceCharges, setServiceCharges] = useState(initialServiceCharges);
  const [showModal, setShowModal] = useState(false);
  const [currentCharge, setCurrentCharge] = useState({
    id: 0,
    name: '',
    type: 'percentage',
    value: 0,
    applyToDineIn: false,
    applyToDelivery: false,
    applyToTakeaway: false,
    isInclusive: false
  });
  const [isEditing, setIsEditing] = useState(false);
  
  const resetForm = () => {
    setCurrentCharge({
      id: 0,
      name: '',
      type: 'percentage',
      value: 0,
      applyToDineIn: false,
      applyToDelivery: false,
      applyToTakeaway: false,
      isInclusive: false
    });
    setIsEditing(false);
  };
  
  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
  };
  
  const handleEdit = (id: number) => {
    const chargeToEdit = serviceCharges.find(charge => charge.id === id);
    if (chargeToEdit) {
      setCurrentCharge(chargeToEdit);
      setIsEditing(true);
      setShowModal(true);
    }
  };
  
  const handleSave = () => {
    if (!currentCharge.name) {
      toast.error('Service charge name is required');
      return;
    }
    
    if (currentCharge.value <= 0) {
      toast.error('Service charge value must be greater than 0');
      return;
    }
    
    if (!currentCharge.applyToDineIn && !currentCharge.applyToDelivery && !currentCharge.applyToTakeaway) {
      toast.error('Please select at least one service type to apply the charge to');
      return;
    }
    
    if (isEditing) {
      setServiceCharges(serviceCharges.map(charge => 
        charge.id === currentCharge.id ? currentCharge : charge
      ));
      toast.success('Service charge updated successfully');
    } else {
      const newId = Math.max(0, ...serviceCharges.map(c => c.id)) + 1;
      setServiceCharges([...serviceCharges, { ...currentCharge, id: newId }]);
      toast.success('Service charge added successfully');
    }
    
    setShowModal(false);
    resetForm();
  };
  
  const handleCancel = () => {
    setShowModal(false);
    resetForm();
  };
  
  const getAppliedToText = (charge: typeof currentCharge) => {
    const applied = [];
    if (charge.applyToDineIn) applied.push('Dine-in');
    if (charge.applyToDelivery) applied.push('Delivery');
    if (charge.applyToTakeaway) applied.push('Takeaway');
    
    return applied.join(', ') || 'None';
  };

  return (
    <Box>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <CardHeading title="Service Charges" mb="0" />
          <Button onClick={handleAddNew}>
            <Plus size={16} />
            Add Service Charge
          </Button>
        </Flex>
        
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Service Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Value</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Applied to</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Inclusive?</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="center">Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          
          <Table.Body>
            {serviceCharges.map(charge => (
              <Table.Row key={charge.id}>
                <Table.Cell>{charge.name}</Table.Cell>
                <Table.Cell>{charge.type === 'percentage' ? 'Percentage' : 'Fixed'}</Table.Cell>
                <Table.Cell>{charge.type === 'percentage' ? `${charge.value}%` : `$${charge.value.toFixed(2)}`}</Table.Cell>
                <Table.Cell>{getAppliedToText(charge)}</Table.Cell>
                <Table.Cell>{charge.isInclusive ? 'Yes' : 'No'}</Table.Cell>
                <Table.Cell align="center">
                  <Flex gap="3" justify="center">
                    <IconButton 
                      variant="ghost" 
                      size="1"
                      color="gray"
                      onClick={() => handleEdit(charge.id)}
                    >
                      <Edit size={14} />
                    </IconButton>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
             
        <Dialog.Root open={showModal} onOpenChange={setShowModal}>
          <Dialog.Content style={{ maxWidth: 500 }}>
            <Flex justify="between">
              <Dialog.Title>{isEditing ? 'Edit' : 'Add'} Service Charge</Dialog.Title>
              <Dialog.Close>
                <Button color="gray" variant="ghost">
                  <X size={16} />
                </Button>
              </Dialog.Close>
            </Flex>
            <Dialog.Description size="2" mb="4">
              {isEditing ? 'Update the service charge details' : 'Enter the details for the new service charge'}
            </Dialog.Description>
            
            <Flex direction="column" gap="4">
              
              <Flex gap="4" align="center">
                <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Service Charge Name</Text>
                <TextField.Root 
                  value={currentCharge.name}
                  onChange={(e) => setCurrentCharge({...currentCharge, name: e.target.value})}
                  placeholder="Enter service charge name"
                  className="flex-1"  
                />
              </Flex>
              
              <Flex gap="4" align="center">
                <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Charge Type</Text>
                <Select.Root 
                  value={currentCharge.type} 
                  onValueChange={(value) => setCurrentCharge({...currentCharge, type: value})}
                >
                  <Select.Trigger placeholder="Select charge type" />
                  <Select.Content>
                    <Select.Item value="percentage">Percentage (%)</Select.Item>
                    <Select.Item value="fixed">Fixed Amount</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>
              
              <Flex gap="4" align="center">
                <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Charge Value</Text>
                <TextField.Root 
                  value={currentCharge.value.toString()}
                  onChange={(e) => setCurrentCharge({
                    ...currentCharge, 
                    value: parseFloat(e.target.value.replace(/[^0-9.]/g, '') || '0')
                  })}
                  placeholder={currentCharge.type === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                  type="number"
                >
                  {currentCharge.type === 'fixed' && <TextField.Slot>$</TextField.Slot>}
                </TextField.Root>
                {currentCharge?.type === 'percentage' && <Text>%</Text>}
              </Flex>
              
              <Flex gap="4" align="start">
                <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Apply To</Text>
                <Flex direction="column" gap="2">
                  <Text as="label" size="2">
                    <Flex gap="2" align="center">
                      <Checkbox 
                        checked={currentCharge.applyToDineIn}
                        onCheckedChange={(checked) => 
                          setCurrentCharge({...currentCharge, applyToDineIn: !!checked})
                        }
                      />
                      <Text size="2">Dine-in</Text>
                    </Flex>
                  </Text>
                  <Text as="label" size="2">
                    <Flex gap="2" align="center">
                      <Checkbox 
                        checked={currentCharge.applyToDelivery}
                        onCheckedChange={(checked) => 
                          setCurrentCharge({...currentCharge, applyToDelivery: !!checked})
                        }
                      />
                      Delivery
                    </Flex>
                  </Text>
                  <Text as="label" size="2">
                    <Flex gap="2" align="center">
                      <Checkbox 
                        checked={currentCharge.applyToTakeaway}
                        onCheckedChange={(checked) => 
                          setCurrentCharge({...currentCharge, applyToTakeaway: !!checked})
                        }
                      />
                      Takeaway
                    </Flex>
                  </Text>
                </Flex>
              </Flex>
              
              <Flex gap="4" align="center">
                <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Inclusive</Text>
                <Switch 
                  color="green"
                  checked={currentCharge.isInclusive} 
                  onCheckedChange={(checked) => setCurrentCharge({...currentCharge, isInclusive: checked})}
                />
                <Text size="2">{currentCharge.isInclusive ? 'Inclusive' : 'Exclusive'}</Text>
              </Flex>
              
              <Flex gap="4" mt="4" justify="end">
                <Button color="gray" variant="soft" onClick={handleCancel}>
                  <X size={16} />
                  Cancel
                </Button>
                <Button color="green" onClick={handleSave}>
                  <Save size={16} />
                  {isEditing ? 'Update' : 'Add'} Service Charge
                </Button>
              </Flex>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>
    </Box>
  );
}
