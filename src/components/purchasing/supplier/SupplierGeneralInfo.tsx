'use client';

import { Card, Box, Flex, Text, Grid, TextField, Avatar, Button, TextArea } from '@radix-ui/themes';
import { Supplier, StockCategory } from '@/types/inventory';
import { ingredientItemCategories } from '@/data/CommonData';
import { Select } from '@radix-ui/themes';

interface SupplierGeneralInfoProps {
  supplier: Supplier;
  onUpdate: (updates: Partial<Supplier>) => void;
}

export default function SupplierGeneralInfo({ supplier, onUpdate }: SupplierGeneralInfoProps) {
  const handleChange = (field: keyof Supplier) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ [field]: e.target.value });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ notes: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    onUpdate({ category: value as StockCategory });
  };

  const handleActiveChange = (value: string) => {
    onUpdate({ active: value === 'active' });
  };

  return (
    <Card size="3" className="p-6">
      <Grid columns={{ initial: '1', md: '3' }} gap="6">
        {/* Logo and Name */}
        <Box className="md:col-span-1">
          <Flex direction="column" gap="3">
            <Flex align="center" gap="2" mb="4">
              <Avatar 
                size="6" 
                src={supplier.logoUrl || ''} 
                fallback={supplier.name.substring(0, 2)} 
                radius="full"
              />
              <Flex align="center" gap="2">
                <label className="flex-1">
                  <Button size="1" variant="outline" onClick={() => document.getElementById('logo-upload')?.click()}>                  
                    Upload Image
                  </Button>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          onUpdate({ logoUrl: e.target?.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {supplier.logoUrl && (
                  <Button size="1" variant="outline" color="red">Remove Image</Button>
                )}
              </Flex>
            </Flex>
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Supplier Name</Text>
              <TextField.Root 
                value={supplier.name} 
                onChange={handleChange('name')}
                placeholder="Supplier Name"
              />
            </Flex>
            <Flex direction="column" gap="1">
              <Text size="2" weight="medium">Category</Text>
              <Select.Root 
                value={supplier.category} 
                onValueChange={handleCategoryChange}
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  {ingredientItemCategories.map(category => (
                    <Select.Item key={category} value={category}>{category}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Flex>
            <Flex direction="column" gap="1">
              <Text size="2" weight="medium">Status</Text>
              <Select.Root 
                value={supplier.active ? 'active' : 'inactive'} 
                onValueChange={handleActiveChange}
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="active">Active</Select.Item>
                  <Select.Item value="inactive">Inactive</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
          </Flex>
        </Box>

        {/* Contact Information */}
        <Box className="md:col-span-2">          
          <Flex direction="column" gap="4">
            <Flex direction="column" gap="1">
              <Text size="2" weight="medium">Contact Person</Text>
              <TextField.Root 
                value={supplier.contactPerson} 
                onChange={handleChange('contactPerson')}
                placeholder="Contact Person"
              />
            </Flex>
            
            <Flex direction="column" gap="1">
              <Text size="2" weight="medium">Phone Number</Text>
              <TextField.Root 
                value={supplier.phone} 
                onChange={handleChange('phone')}
                placeholder="Phone Number"
              />
            </Flex>
            
            <Flex direction="column" gap="1">
              <Text size="2" weight="medium">Email Address</Text>
              <TextField.Root 
                value={supplier.email} 
                onChange={handleChange('email')}
                placeholder="Email Address"
              />
            </Flex>
            
            <Flex direction="column" gap="1">
              <Text size="2" weight="medium">Address</Text>
              <TextField.Root 
                value={supplier.address} 
                onChange={handleChange('address')}
                placeholder="Address"
              />
            </Flex>
            
            <Flex direction="column" gap="1">
              <Text size="2" weight="medium">Notes</Text>
              <TextArea
                value={supplier.notes || ''} 
                onChange={handleNotesChange}
                placeholder="Additional notes about this supplier"
              />
            </Flex>
          </Flex>
        </Box>
      </Grid>
    </Card>
  );
} 