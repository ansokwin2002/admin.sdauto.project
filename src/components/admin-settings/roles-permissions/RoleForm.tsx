'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Tabs, Text, TextField, TextArea, Select, Card, AlertDialog } from '@radix-ui/themes';
import { Save, Shield, Users, X, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Role, Permission, moduleNames, mockRoles } from '@/data/RolesPermissionsData';
import { PageHeading } from '@/components/common/PageHeading';
import PermissionsMatrix from './PermissionsMatrix';

interface RoleFormProps {
  roleId?: string;
  onDelete?: (id: string) => void;
}

export default function RoleForm({ roleId, onDelete }: RoleFormProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();
  const isNewRole = !roleId;
  
  // Load role data
  useEffect(() => {
    // For new role, create a default template
    if (isNewRole) {
      setRole({
        id: 'new',
        name: '',
        description: '',
        accessScope: 'Branch',
        assignedUsers: 0,
        permissions: moduleNames.map(module => ({
          id: `${module.toLowerCase().replace(/\s/g, '-')}-new`,
          module,
          view: false,
          create: false,
          edit: false,
          delete: false
        }))
      });
      return;
    }
    
    // For existing role, load from mock data
    const foundRole = mockRoles.find(r => r.id === roleId);
    if (foundRole) {
      setRole(foundRole);
    } else {
      // Redirect if role not found
      router.push('/admin-settings/roles-permissions');
    }
  }, [roleId, router, isNewRole]);
  
  if (!role) {
    return <Box>Loading role data...</Box>;
  }
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real app, this would be an API call to update or create the role
    console.log('Saving role:', role);
    
    setTimeout(() => {
      setIsLoading(false);
      router.push('/admin-settings/roles-permissions');
    }, 500);
  };
  
  // Handle permission updates
  const handlePermissionsUpdate = (updatedPermissions: Permission[]) => {
    setRole(prev => {
      if (!prev) return null;
      return {
        ...prev,
        permissions: updatedPermissions
      };
    });
  };
  
  // Handle cancel and return to roles list
  const handleCancel = () => {
    router.push('/admin-settings/roles-permissions');
  };
  
  // Handle field changes
  const handleFieldChange = (field: keyof Role, value: any) => {
    setRole(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleDelete = () => {
    if (role?.id && onDelete) {
      onDelete(role.id);
      setShowDeleteDialog(false);
    }
  };

  return (
    <Box>
      <Flex justify="between" gap="3" mb="5">
        <PageHeading
          title={isNewRole ? 'Create New Role' : `Edit ${role.name}`}
          description={isNewRole 
            ? "Define a new role and its permissions" 
            : "Update role details and permissions"}
          showBackButton
          onBackClick={handleCancel}
          noMarginBottom
        />
      </Flex>
      
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Trigger value="details">
            <Flex gap="2" align="center">
              <Shield size={16} />
              <Text>Role Details</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="permissions">
            <Flex gap="2" align="center">
              <Users size={16} />
              <Text>Permissions</Text>
            </Flex>
          </Tabs.Trigger>
        </Tabs.List>
        
        <Box mt="4">
          <Tabs.Content value="details">
            <Card size="3">
              <Flex direction="column" gap="4">
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">
                    Role Name
                  </Text>
                  <TextField.Root 
                    placeholder="Enter role name" 
                    value={role.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                  />
                </Flex>
                
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">
                    Description
                  </Text>
                  <TextArea 
                    placeholder="Describe this role's purpose and responsibilities" 
                    value={role.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                  />
                </Flex>
                
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">
                    Access Scope
                  </Text>
                  <Select.Root 
                    value={role.accessScope} 
                    onValueChange={(value) => handleFieldChange('accessScope', value)}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Item value="HQ">HQ - Headquarters (All Access)</Select.Item>
                      <Select.Item value="Region">Region - Multiple Branches</Select.Item>
                      <Select.Item value="Branch">Branch - Specific Location</Select.Item>
                    </Select.Content>
                  </Select.Root>
                  <Text as="p" size="1" color="gray" mt="1">
                    {role.accessScope === 'HQ' && 'Users with this role can access all branches and headquarters functions.'}
                    {role.accessScope === 'Region' && 'Users with this role can access multiple branches within their assigned region.'}
                    {role.accessScope === 'Branch' && 'Users with this role can only access their specific assigned branch.'}
                  </Text>
                </Flex>
              </Flex>
            </Card>
          </Tabs.Content>
          
          <Tabs.Content value="permissions">
            <Box>
              <Text as="p" size="2" mb="3">
                Select what users with this role can do in each module of the system.
              </Text>
              <PermissionsMatrix 
                permissions={role.permissions}
                onChange={handlePermissionsUpdate}
              />
            </Box>
          </Tabs.Content>
        </Box>
      </Tabs.Root>

      <Flex justify="between" mt="4">
        <Flex gap="3">
          <Button 
            color="green"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            <Save size={16} />
            {isLoading ? 'Saving...' : 'Save Changes'}
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
        {!isNewRole && (
          <Button 
            variant="soft" 
            color="red" 
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 size={16} />
            Delete
          </Button>
        )}
      </Flex>

      <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialog.Content>
          <AlertDialog.Title>Delete Role</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to delete this role? This action cannot be undone.
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