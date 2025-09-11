'use client';

import React, { useState } from 'react';
import { Box, Flex, Text, TextField, Switch, Button, Table, Dialog } from '@radix-ui/themes';
import { Edit, Plus, Save, X } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for branches
const branchData = [
  { id: 1, name: 'Main Branch', hasOverride: true, taxName: 'GST', taxRate: 7, isInclusive: false },
  { id: 2, name: 'Downtown Branch', hasOverride: false, taxName: '', taxRate: 0, isInclusive: true },
  { id: 3, name: 'Airport Branch', hasOverride: true, taxName: 'Airport Tax', taxRate: 12, isInclusive: true },
  { id: 4, name: 'Mall Branch', hasOverride: false, taxName: '', taxRate: 0, isInclusive: true },
  { id: 5, name: 'Suburban Branch', hasOverride: false, taxName: '', taxRate: 0, isInclusive: true },
];

export default function BranchTaxOverrides() {
  const [branches, setBranches] = useState(branchData);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentBranch, setCurrentBranch] = useState({
    id: 0,
    name: '',
    hasOverride: false,
    taxName: '',
    taxRate: 0,
    isInclusive: true
  });
  
  const handleOverride = (branchId: number) => {
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      setCurrentBranch({
        ...branch,
        hasOverride: true,
        taxName: 'Custom Tax',
        taxRate: 10,
        isInclusive: true
      });
      setShowEditModal(true);
    }
  };
  
  const handleEdit = (branchId: number) => {
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      setCurrentBranch({...branch});
      setShowEditModal(true);
    }
  };
  
  const handleSave = () => {
    if (!currentBranch.taxName) {
      toast.error('Tax name is required');
      return;
    }
    
    if (currentBranch.taxRate <= 0) {
      toast.error('Tax rate must be greater than 0');
      return;
    }
    
    setBranches(branches.map(branch => 
      branch.id === currentBranch.id ? currentBranch : branch
    ));
    
    setShowEditModal(false);
    toast.success('Branch tax settings updated successfully');
  };
  
  const handleCancel = () => {
    setShowEditModal(false);
  };

  return (
    <Box>    
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Branch Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Tax Override?</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Tax Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Tax Rate %</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Inclusive?</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        
        <Table.Body>
          {branches.map(branch => (
            <Table.Row key={branch.id}>
              <Table.Cell>{branch.name}</Table.Cell>
              <Table.Cell>
                {branch.hasOverride ? 'Yes' : 'No'}
              </Table.Cell>
              <Table.Cell>
                {branch.hasOverride ? branch.taxName : '-'}
              </Table.Cell>
              <Table.Cell>
                {branch.hasOverride ? `${branch.taxRate}%` : '-'}
              </Table.Cell>
              <Table.Cell>
                {branch.hasOverride ? (branch.isInclusive ? 'Yes' : 'No') : '-'}
              </Table.Cell>
              <Table.Cell>
                {branch.hasOverride ? (
                  <Button size="1" variant="outline" onClick={() => handleEdit(branch.id)}>
                    <Edit size={14} />
                    Edit
                  </Button>
                ) : (
                  <Button size="1" variant="outline" onClick={() => handleOverride(branch.id)}>
                    <Plus size={14} />
                    Override
                  </Button>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Dialog.Root open={showEditModal} onOpenChange={setShowEditModal}>
        <Dialog.Content style={{ maxWidth: 500 }}>
          <Flex justify="between">
            <Dialog.Title>{currentBranch.hasOverride ? 'Edit' : 'Add'} Branch Tax Override</Dialog.Title>
            <Dialog.Close>
              <Button color="gray" variant="ghost">
                <X size={16} />
              </Button>
            </Dialog.Close>
          </Flex>
          <Dialog.Description size="2" mb="4">
            {currentBranch.hasOverride 
              ? `Update tax settings for ${currentBranch.name}` 
              : `Configure custom tax settings for ${currentBranch.name}`}
          </Dialog.Description>
          
          <Flex direction="column" gap="4">
            <Flex gap="4" align="center">
              <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Branch</Text>
              <Text>{currentBranch.name}</Text>
            </Flex>
            
            <Flex gap="4" align="center">
              <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Tax Name</Text>
              <TextField.Root 
                value={currentBranch.taxName}
                onChange={(e) => setCurrentBranch({...currentBranch, taxName: e.target.value})}
                placeholder="Enter tax name"
              />
            </Flex>
            
            <Flex gap="4" align="center">
              <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Tax Rate (%)</Text>
              <TextField.Root 
                value={currentBranch.taxRate.toString()}
                onChange={(e) => setCurrentBranch({
                  ...currentBranch, 
                  taxRate: parseFloat(e.target.value.replace(/[^0-9.]/g, '') || '0')
                })}
                placeholder="Enter tax rate"
                type="number"
              />
            </Flex>
            
            <Flex gap="4" align="center">
              <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Tax Inclusive</Text>
              <Switch 
                color="green"
                checked={currentBranch.isInclusive} 
                onCheckedChange={(checked) => setCurrentBranch({...currentBranch, isInclusive: checked})}
              />
              <Text size="2" color="gray">{currentBranch.isInclusive ? 'Inclusive' : 'Exclusive'}</Text>
            </Flex>
            
            <Flex gap="4" mt="4" justify="end">
              <Button color="gray" variant="soft" onClick={handleCancel}>
                <X size={16} />
                Cancel
              </Button>
              <Button color="green" onClick={handleSave}>
                <Save size={16} />
                Save Changes
              </Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
}
