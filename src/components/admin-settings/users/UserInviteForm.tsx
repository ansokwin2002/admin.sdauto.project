'use client';

import React, { useState } from 'react';
import { Box, Button, Card, Flex, Heading, Select, Switch, Text, TextField } from '@radix-ui/themes';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { roles } from '@/data/UserData';
import { mockBranches, regions } from '@/data/BranchData';
import { PageHeading } from '@/components/common/PageHeading';
import { toast } from 'sonner';
import { getStrongPassword } from '@/utilities';
import CardHeading from '@/components/common/CardHeading';

interface UserInviteFormData {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  branches: string[];
  region: string;
  setTemporaryPassword: boolean;
  temporaryPassword: string;
}

export default function UserInviteForm() {
  const [formData, setFormData] = useState<UserInviteFormData>({
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    branches: [],
    region: '',
    setTemporaryPassword: false,
    temporaryPassword: getStrongPassword(),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();


  // Generate a strong password with uppercase, lowercase, numbers and special chars
  const generateStrongPassword = () => {
    const password = getStrongPassword();
    handleInputChange('temporaryPassword', password);
    
    // Show the password when it's generated
    setShowPassword(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real app, this would be an API call to invite the user
    console.log('Inviting user:', formData);
    toast.success('User invited successfully');
    
    setTimeout(() => {
      setIsLoading(false);
      router.push('/admin-settings/users');
    }, 500);
  };

  // Handle form input changes
  const handleInputChange = (field: keyof UserInviteFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle branch selection
  const handleBranchToggle = (branchId: string) => {
    setFormData(prev => {
      const newBranches = prev.branches.includes(branchId)
        ? prev.branches.filter(id => id !== branchId)
        : [...prev.branches, branchId];
      
      return {
        ...prev,
        branches: newBranches
      };
    });
  };

  // Handle cancel and return to users list
  const handleCancel = () => {
    router.push('/admin-settings/users');
  };

  return (
    <Box>
      <Flex justify="between" gap="3" mb="5">
        <PageHeading
          title="Invite User"
          description="Send an invitation to a new user to join your organization"
          showBackButton
          onBackClick={handleCancel}
          noMarginBottom
        />
      </Flex>
      <Flex gap="4">
        <Box className="w-3/4 space-y-4">
          <Card size="3">
            <CardHeading title="User Information" />
            
            <Flex direction="column" gap="4">
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Email Address</Text>
                <TextField.Root
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </Flex>

              <Flex gap="3">
                <Flex direction="column" gap="1" style={{ width: '50%' }}>
                  <Text as="label" size="2" weight="medium">First Name</Text>
                  <TextField.Root
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                </Flex>
                
                <Flex direction="column" gap="1" style={{ width: '50%' }}>
                  <Text as="label" size="2" weight="medium">Last Name</Text>
                  <TextField.Root
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </Flex>
              </Flex>

              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Role</Text>
                <Select.Root 
                  value={formData.role} 
                  onValueChange={(value) => handleInputChange('role', value)}
                >
                  <Select.Trigger placeholder="Select user role" />
                  <Select.Content>
                    <Select.Group>
                      {roles.map(role => (
                        <Select.Item key={role.id} value={role.name}>
                          {role.name}
                        </Select.Item>
                      ))}
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </Flex>
            </Flex>
          </Card>

          <Card size="3">
            <CardHeading title="Branch Assignment" />
            
            <Flex direction="column" gap="4">
              {formData.role === 'Regional Manager' && (
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Region</Text>
                  <Select.Root 
                    value={formData.region} 
                    onValueChange={(value) => handleInputChange('region', value)}
                  >
                    <Select.Trigger placeholder="Select region" />
                    <Select.Content>
                      <Select.Group>
                        {regions.map(region => (
                          <Select.Item key={region} value={region}>
                            {region}
                          </Select.Item>
                        ))}
                      </Select.Group>
                    </Select.Content>
                  </Select.Root>
                </Flex>
              )}
              
              <Box>
                <Text as="div" size="2" weight="medium" mb="2">Assign to Branch(es)</Text>
                <Box className="max-h-[300px] overflow-y-auto">
                  <Flex direction="column" gap="4">
                    {mockBranches.map(branch => (
                      <Text as="label" size="2" key={branch.id}>
                        <Flex align="center" gap="2">
                          <Switch 
                            checked={formData.branches.includes(branch.id)}
                            onCheckedChange={() => handleBranchToggle(branch.id)}
                          />
                          <Text>{branch.name}</Text>
                          <Text size="1" color="gray">({branch.region})</Text>
                        </Flex>
                      </Text>
                    ))}
                  </Flex>
                </Box>
              </Box>
            </Flex>
          </Card>
        </Box>
        <Box className="w-1/4">
          <Card size="3">
            <CardHeading title="Password Settings" />
            
            <Flex direction="column" gap="4">
              <Text as="label" size="2">
                <Flex align="center" gap="2">
                  <Switch 
                    checked={formData.setTemporaryPassword}
                    onCheckedChange={(checked) => handleInputChange('setTemporaryPassword', checked)}
                  />
                  Set a temporary password
                </Flex>
              </Text>
              
              {formData.setTemporaryPassword && (
                <Flex direction="column" gap="4">
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Temporary Password</Text>
                    <TextField.Root
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter temporary password"
                      value={formData.temporaryPassword}
                      onChange={(e) => handleInputChange('temporaryPassword', e.target.value)}
                    />
                    <Text size="1" color="gray">
                      The user will be prompted to change this password on first login
                    </Text>
                  </Flex>
                  <Flex direction="column" gap="2">
                    <Button color="gray" onClick={generateStrongPassword}>
                      Generate Password
                    </Button>
                    <Button color="gray" variant="outline" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? 'Hide Password' : 'View Password'}
                    </Button>
                  </Flex>
                </Flex>
              )}
              
              {!formData.setTemporaryPassword && (
                <Text size="1" color="gray">
                  If not set, the user will receive an email with instructions to set their own password
                </Text>
              )}
            </Flex>
          </Card>
        </Box>
      </Flex>

      <Flex justify="start" gap="3" mt="4">
        <Button 
          color="green"
          disabled={isLoading}
          onClick={handleSubmit}
        >
          <Save size={16} />
          {isLoading ? 'Sending Invitation...' : 'Send Invitation'}
        </Button>
        <Button 
          color="gray"
          variant="soft"
          onClick={handleCancel}
        >
          <X size={16} />
          Cancel
        </Button>
      </Flex>
    </Box>
  );
} 