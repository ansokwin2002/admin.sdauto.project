'use client';

import React, { useState } from 'react';
import { Card, Flex, Button, TextField, Text, Heading, Avatar } from '@radix-ui/themes';
import { Save } from 'lucide-react';
import { OrganizationEntity, organization } from '@/data/CommonData';
import { toast } from 'sonner';

export default function OrganizationProfileForm() {
  // Get HQ data from organization array
  const hqData = organization.find(entity => entity.id === 'hq') || organization[0];
  
  const [formData, setFormData] = useState<OrganizationEntity>({
    ...hqData
  });

  const handleChange = (field: keyof OrganizationEntity, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would update the data in the backend
    console.log('Organization data updated:', formData);
    toast.success('Organization data updated successfully!');
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
  };

  return (
    <Card size="3">
      <Flex direction="column" gap="4">
        <Heading size="3">Root Organization Details</Heading>
        <Text size="2" color="gray">
          This information will be used across the system and may appear on reports, invoices, and customer-facing materials.
        </Text>
        
        <Flex gap="4" direction="column">
          <Flex direction="column" gap="1">
            <Text as="label" size="2" weight="medium">Organization Logo</Text>
            <Flex align="center" gap="2" mb="4">
              <Avatar 
                size="6" 
                src={formData.image || '#'} 
                fallback={formData.name.substring(0, 2)}
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
                          handleChange('image', e.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {formData.image && (
                  <Button size="1" variant="outline" color="red" onClick={handleRemoveImage}>
                    Remove Image
                  </Button>
                )}
              </Flex>
            </Flex>
          </Flex>
          
          <Flex direction="column" gap="1">
            <Text as="label" size="2" weight="medium">Organization Name</Text>
            <TextField.Root
              placeholder="Organization Name" 
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </Flex>
          
          <Flex direction="column" gap="1">
            <Text as="label" size="2" weight="medium">Business Address</Text>
            <TextField.Root
              placeholder="Business Address" 
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </Flex>
          
          <Flex direction="column" gap="1">
            <Text as="label" size="2" weight="medium">Phone Number</Text>
            <TextField.Root style={{ flexGrow: 1 }}
              placeholder="Phone Number" 
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </Flex>
          
          <Flex direction="column" gap="1">
            <Text as="label" size="2" weight="medium">Email Address</Text>
            <TextField.Root style={{ flexGrow: 1 }}
              placeholder="Email Address" 
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </Flex>
          
          <Flex direction="column" gap="1">
            <Text as="label" size="2" weight="medium">Website URL</Text>
            <TextField.Root
              placeholder="Website URL" 
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
            />
          </Flex>
          
          <Flex>
            <Button color="green" onClick={handleSubmit}>
              <Save size={16} />
              Save Changes
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
