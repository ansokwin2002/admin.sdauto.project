import React, { useState } from 'react';
import { Avatar, Button, Card, Flex, Heading, Switch, Text, TextField } from '@radix-ui/themes';
import { User } from '@/data/UserData';
import { Upload, X } from 'lucide-react';

interface ProfileInfoTabProps {
  user: User;
  onUpdate: (updates: Partial<User>) => void;
}

export default function ProfileInfoTab({ user, onUpdate }: ProfileInfoTabProps) {
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpdate({ avatar: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    onUpdate({ avatar: '' });
  };

  // Handle status change
  const handleStatusChange = (checked: boolean) => {
    onUpdate({ status: checked ? 'active' : 'inactive' });
  };
  
  // Handle input change
  const handleInputChange = (field: keyof User, value: any) => {
    onUpdate({ [field]: value });
  };
  
  return (
    <Card size="3">
      <Flex direction="column" gap="5">
        <Flex direction="column" gap="4">
          {/* Profile Image */}
          <Flex direction="column" gap="1">
            <Text as="label" size="2" weight="medium">Profile Image</Text>
            <Flex align="center" gap="4">
              <Avatar 
                size="6" 
                src={user.avatar || ''} 
                fallback={`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
              />
              <Flex align="center" gap="2">
                <label>
                  <Button color="gray" size="1" variant="soft" onClick={() => document.getElementById('profile-upload')?.click()}>
                    <Upload size={16} />
                    Upload Image
                  </Button>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                {user.avatar && (
                  <Button color="red" size="1" variant="soft" onClick={handleRemoveImage}>
                    <X size={16} />
                    Remove Image
                  </Button>
                )}
              </Flex>
            </Flex>
          </Flex>
          
          {/* Email (read-only) */}
          <Flex direction="column" gap="1">
            <Text as="label" size="2" weight="medium">Email Address</Text>
            <TextField.Root
              value={user.email}
              disabled
            />
            <Text size="1" color="gray">Email address cannot be changed</Text>
          </Flex>
          
          {/* Name (read-only) */}
          <Flex gap="3">
            <Flex direction="column" gap="1" style={{ width: '50%' }}>
              <Text as="label" size="2" weight="medium">First Name</Text>
              <TextField.Root
                value={user.firstName}
                disabled
              />
            </Flex>
            
            <Flex direction="column" gap="1" style={{ width: '50%' }}>
              <Text as="label" size="2" weight="medium">Last Name</Text>
              <TextField.Root
                value={user.lastName}
                disabled
              />
            </Flex>
          </Flex>
          
          {/* Phone number */}
          <Flex direction="column" gap="1">
            <Text as="label" size="2" weight="medium">Phone Number</Text>
            <TextField.Root
              placeholder="Enter phone number"
              value={user.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </Flex>
          
          {/* User Status */}
          <Flex direction="column" gap="1">
            <Text as="label" size="2" weight="medium">
              User Status
            </Text>
            <Text as="label" size="2" weight="medium">
              <Flex align="center" gap="2">
                <Switch 
                  color="green"
                  checked={user.status === 'active'}
                  onCheckedChange={handleStatusChange}
                />
                {user.status === 'active' ? 'Active' : 'Inactive'}
              </Flex>
            </Text>
            <Text size="1" color="gray" mt="1">
              Inactive users cannot log in to the system
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
