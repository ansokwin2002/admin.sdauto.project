'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Tabs, Text, Badge, AlertDialog } from '@radix-ui/themes';
import { ArrowLeft, Save, User, Shield, Activity, X, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { mockUsers } from '@/data/UserData';
import { User as UserType } from '@/data/UserData';
import { PageHeading } from '@/components/common/PageHeading';
import ProfileInfoTab from './tabs/ProfileInfoTab';
import RolesAccessTab from './tabs/RolesAccessTab';
import ActivityLogTab from './tabs/ActivityLogTab';

interface UserEditFormProps {
  userId: string;
  onDelete?: (id: string) => void;
}

export default function UserEditForm({ userId, onDelete }: UserEditFormProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();
  
  // Load user data
  useEffect(() => {
    // In a real app, this would be an API call
    const foundUser = mockUsers.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
    } else {
      // Redirect if user not found
      router.push('/admin-settings/users');
    }
  }, [userId, router]);
  
  if (!user) {
    return <Box>Loading user data...</Box>;
  }
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real app, this would be an API call to update the user
    console.log('Updating user:', user);
    
    setTimeout(() => {
      setIsLoading(false);
      router.push('/admin-settings/users');
    }, 500);
  };
  
  // Handle user data updates from child components
  const handleUserUpdate = (updates: Partial<UserType>) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        ...updates
      };
    });
  };
  
  // Handle cancel and return to users list
  const handleCancel = () => {
    router.push('/admin-settings/users');
  };

  const handleDelete = () => {
    if (user?.id && onDelete) {
      onDelete(user.id);
      setShowDeleteDialog(false);
    }
  };

  return (
    <Box>
      <Flex justify="between" gap="3" mb="5">
        <PageHeading
          title={`Edit ${user.name}`}
          description="Manage user details, roles, and access permissions"
          showBackButton
          onBackClick={handleCancel}
          noMarginBottom
          badge={
            <Flex gap="2">
              <Badge color="gray">{user.role}</Badge>
              <Badge color={user.status === 'active' ? 'green' : 'red'} className="capitalize">{user.status}</Badge>
            </Flex>
          }
        />
      </Flex>
      
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Trigger value="profile">
            <Flex gap="2" align="center">
              <User size={16} />
              <Text>Profile Info</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="roles">
            <Flex gap="2" align="center">
              <Shield size={16} />
              <Text>Roles & Access</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="activity">
            <Flex gap="2" align="center">
              <Activity size={16} />
              <Text>Activity Log</Text>
            </Flex>
          </Tabs.Trigger>
        </Tabs.List>
        
        <Box mt="4">
          <Tabs.Content value="profile">
            <ProfileInfoTab 
              user={user} 
              onUpdate={handleUserUpdate} 
            />
          </Tabs.Content>
          
          <Tabs.Content value="roles">
            <RolesAccessTab 
              user={user} 
              onUpdate={handleUserUpdate} 
            />
          </Tabs.Content>
          
          <Tabs.Content value="activity">
            <ActivityLogTab 
              user={user}
            />
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
        <Button 
          variant="soft" 
          color="red" 
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 size={16} />
          Delete
        </Button>
      </Flex>

      <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialog.Content>
          <AlertDialog.Title>Delete User</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to delete this user? This action cannot be undone.
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