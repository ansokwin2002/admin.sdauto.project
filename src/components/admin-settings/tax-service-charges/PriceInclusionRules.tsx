'use client';

import React, { useState } from 'react';
import { Box, Card, Flex, Text, Button, Heading, Table, RadioGroup, Select, Dialog, Inset, IconButton } from '@radix-ui/themes';
import { Edit, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import CardHeading from '@/components/common/CardHeading';

// Mock data for menu categories
const menuCategories = [
  { id: 1, name: 'Alcoholic Drinks', inclusionRule: 'exclude' },
  { id: 2, name: 'Food', inclusionRule: 'include' },
  { id: 3, name: 'Non-Alcoholic Drinks', inclusionRule: 'include' },
  { id: 4, name: 'Desserts', inclusionRule: 'include' },
  { id: 5, name: 'Appetizers', inclusionRule: 'include' },
];

export default function PriceInclusionRules() {
  const [globalRule, setGlobalRule] = useState('include');
  const [categories, setCategories] = useState(menuCategories);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    id: 0,
    name: '',
    inclusionRule: ''
  });
  
  const handleEdit = (categoryId: number) => {
    const categoryToEdit = categories.find(cat => cat.id === categoryId);
    if (categoryToEdit) {
      setCurrentCategory({
        id: categoryToEdit.id,
        name: categoryToEdit.name,
        inclusionRule: categoryToEdit.inclusionRule
      });
      setShowEditModal(true);
    }
  };
  
  const handleSaveCategory = () => {
    setCategories(categories.map(cat => 
      cat.id === currentCategory.id 
        ? { ...cat, inclusionRule: currentCategory.inclusionRule } 
        : cat
    ));
    setShowEditModal(false);
    toast.success('Category price inclusion rule updated');
  };
  
  const handleCancelEdit = () => {
    setShowEditModal(false);
  };
  
  const handleSaveGlobalRule = () => {
    // In a real implementation, this would save the settings to the server
    console.log({ globalRule });
    toast.success('Global price inclusion rule saved');
  };

  return (
    <Box>
      <Flex direction="column" gap="4">
        <Card size="3">
          <CardHeading title="Price Inclusion Rules" />
          
          <Flex direction="column" gap="3">
            <Text size="2" weight="medium">Global Price Inclusion Rule</Text>
            
            <Flex gap="4" align="center">
              <RadioGroup.Root value={globalRule} onValueChange={setGlobalRule}>
                <Flex gap="3" direction="column">
                  <Text as="label" size="2">
                    <Flex gap="2" align="center">
                      <RadioGroup.Item value="include" />
                      All Menu Prices Include Tax
                    </Flex>
                  </Text>
                  <Text as="label" size="2">
                    <Flex gap="2" align="center">
                      <RadioGroup.Item value="exclude" />
                      All Menu Prices Exclude Tax
                    </Flex>
                  </Text>
                </Flex>
              </RadioGroup.Root>
            </Flex>
            <Flex gap="4" mt="4">
              <Button color="green" onClick={handleSaveGlobalRule}>
                <Save size={16} />
                Save Global Rule
              </Button>
            </Flex>
          </Flex>
        </Card>
        
        <Card size="3">
          <CardHeading title="Category Exceptions" />
          <Inset>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Menu Category</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Inclusion Rule</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align="center">Actions</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              
              <Table.Body>
                {categories.map(category => (
                  <Table.Row key={category.id}>
                    <Table.Cell>{category.name}</Table.Cell>
                    <Table.Cell>
                      {category.inclusionRule === 'include' 
                        ? 'Price Includes Tax' 
                        : 'Price Excludes Tax'
                      }
                    </Table.Cell>
                    <Table.Cell align="center">
                      <Flex gap="3" justify="center">
                        <IconButton 
                          variant="ghost" 
                          size="1"
                          color="gray"
                          onClick={() => handleEdit(category.id)}
                        >
                          <Edit size={14} />
                        </IconButton>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Inset>
          <Dialog.Root open={showEditModal} onOpenChange={setShowEditModal}>
            <Dialog.Content style={{ maxWidth: 450 }}>
              <Flex justify="between">
                <Dialog.Title>Edit Category Rule</Dialog.Title>
                <Dialog.Close>
                  <Button color="gray" variant="ghost">
                    <X size={16} />
                  </Button>
                </Dialog.Close>
              </Flex>
              <Dialog.Description size="2" mb="4">
                Update the price inclusion rule for this category
              </Dialog.Description>
              
              <Flex direction="column" gap="4">
                
                <Flex gap="4" align="center">
                  <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Category</Text>
                  <Text>{currentCategory.name}</Text>
                </Flex>
                
                <Flex gap="4" align="center">
                  <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Inclusion Rule</Text>
                  <Select.Root 
                    value={currentCategory.inclusionRule} 
                    onValueChange={(value) => setCurrentCategory({...currentCategory, inclusionRule: value})}
                  >
                    <Select.Trigger placeholder="Select inclusion rule" />
                    <Select.Content>
                      <Select.Item value="include">Price Includes Tax</Select.Item>
                      <Select.Item value="exclude">Price Excludes Tax</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Flex>
                
                <Flex gap="4" mt="4" justify="end">
                  <Button color="gray" variant="soft" onClick={handleCancelEdit}>
                    <X size={16} />
                    Cancel
                  </Button>
                  <Button color="green" onClick={handleSaveCategory}>
                    <Save size={16} />
                    Save Rule
                  </Button>
                </Flex>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Card>
      </Flex>
    </Box>
  );
}
