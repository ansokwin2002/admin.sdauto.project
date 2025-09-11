'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Tabs, 
  Flex, 
  Button,
  Text, 
  AlertDialog
} from '@radix-ui/themes';
import { Building2, Clock, Save, Settings, Users, X, Trash2, OctagonX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Branch, mockBranches } from '@/data/BranchData';
import GeneralInfoTab from './tabs/GeneralInfoTab';
import ServicesHoursTab from './tabs/ServicesHoursTab';
import ManagerAssignmentTab from './tabs/ManagerAssignmentTab';
import AdvancedSettingsTab from './tabs/AdvancedSettingsTab';
import { regions } from '@/data/BranchData';
import { PageHeading } from '@/components/common/PageHeading';

interface BranchFormProps {
  branchId?: string;
}

// Default empty branch template for new branches
const emptyBranch: Branch = {
  id: '',
  name: '',
  code: '',
  region: '',
  status: 'active',
  address: '',
  city: '',
  phone: '',
  services: {
    dineIn: true,
    takeaway: true,
    delivery: false,
  },
  businessHours: [
    { day: 'Monday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
    { day: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
    { day: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
    { day: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
    { day: 'Friday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
    { day: 'Saturday', isOpen: true, openTime: '10:00', closeTime: '22:00' },
    { day: 'Sunday', isOpen: true, openTime: '10:00', closeTime: '20:00' },
  ],
  settings: {
    inventoryTracking: true,
    allowLocalMenuOverride: false,
    defaultPrinter: 'Default Printer',
    taxRules: 'Standard Tax',
  },
};

export default function BranchForm({ branchId }: BranchFormProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [branch, setBranch] = useState<Branch>(emptyBranch);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const isNewBranch = !branchId;
  
  // Load branch data if editing
  useEffect(() => {
    if (branchId) {
      // In a real app, this would be an API call
      const foundBranch = mockBranches.find(b => b.id === branchId);
      if (foundBranch) {
        setBranch(foundBranch);
      }
    }
  }, [branchId]);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      setIsLoading(false);
      router.push('/admin-settings/organization');
    }, 500);
  };
  
  // Handle branch data updates from child components
  const handleBranchUpdate = (updates: Partial<Branch>) => {
    setBranch(prev => ({
      ...prev,
      ...updates
    }));
  };
  
  // Go back to branch list
  const handleCancel = () => {
    router.push('/admin-settings/organization?tab=branches');
  };
  
  // Handle delete branch
  const handleDelete = () => {
    // In a real app, this would be an API call
    console.log('Deleting branch:', branchId);
    router.push('/admin-settings/organization?tab=branches');
  };
  
  // Handle disable branch
  const handleDisableBranch = () => {
    // In a real app, this would be an API call
    console.log('Disabling branch:', branchId);
    router.push('/admin-settings/organization?tab=branches');
  };
  
  return (
    <Box>
      <Flex direction="column" gap="4">
        <PageHeading
          title={isNewBranch ? 'Add New Branch' : `Edit ${branch.name}`}
          description={`Manage ${isNewBranch ? 'new' : 'existing'} branch details and settings`}
          showBackButton
          onBackClick={handleCancel}
          noMarginBottom
        />
        
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Trigger value="general">
              <Flex gap="2" align="center">
                <Building2 size={16} />
                <Text>General Info</Text>
              </Flex>
            </Tabs.Trigger>
            <Tabs.Trigger value="services">
              <Flex gap="2" align="center">
                <Clock size={16} />
                <Text>Services & Hours</Text>
              </Flex>
            </Tabs.Trigger>
            <Tabs.Trigger value="managers">
              <Flex gap="2" align="center">
                <Users size={16} />
                <Text>Manager Assignment</Text>
              </Flex>
            </Tabs.Trigger>
            <Tabs.Trigger value="advanced">
              <Flex gap="2" align="center">
                <Settings size={16} />
                <Text>Advanced Settings</Text>
              </Flex>
            </Tabs.Trigger>
          </Tabs.List>
          
          <Box mt="4">
            <Tabs.Content value="general">
              <GeneralInfoTab 
                branch={branch} 
                onUpdate={handleBranchUpdate} 
                regions={regions}
              />
            </Tabs.Content>
            
            <Tabs.Content value="services">
              <ServicesHoursTab 
                branch={branch} 
                onUpdate={handleBranchUpdate} 
              />
            </Tabs.Content>
            
            <Tabs.Content value="managers">
              <ManagerAssignmentTab 
                branch={branch} 
                onUpdate={handleBranchUpdate} 
              />
            </Tabs.Content>
            
            <Tabs.Content value="advanced">
              <AdvancedSettingsTab 
                branch={branch} 
                onUpdate={handleBranchUpdate} 
              />
            </Tabs.Content>
          </Box>
        </Tabs.Root>

        <Flex justify="between">
          <Flex gap="3">
            <Button 
              color="green"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              <Save size={16} />
              {isLoading ? 'Saving...' : 'Save Branch'}
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

          {!isNewBranch && (
            <Flex gap="3">
              <AlertDialog.Root>
                <AlertDialog.Trigger>
                  <Button color="orange" variant="soft">
                    <OctagonX size={16} />
                    {branch.status === 'active' ? 'Disable Branch' : 'Enable Branch'}
                  </Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content>
                  <AlertDialog.Title>
                    {branch.status === 'active' ? 'Disable Branch' : 'Enable Branch'}
                  </AlertDialog.Title>
                  <AlertDialog.Description>
                    Are you sure you want to {branch.status === 'active' ? 'disable' : 'enable'} this branch?
                  </AlertDialog.Description>
                  <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                      <Button variant="soft" color="gray">
                        Cancel
                      </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                      <Button 
                        color={branch.status === 'active' ? 'orange' : 'green'} 
                        onClick={handleDisableBranch}
                      >
                        {branch.status === 'active' ? 'Disable Branch' : 'Enable Branch'}
                      </Button>
                    </AlertDialog.Action>
                  </Flex>
                </AlertDialog.Content>
              </AlertDialog.Root>

              <AlertDialog.Root>
                <AlertDialog.Trigger>
                  <Button color="red" variant="soft">
                    <Trash2 size={16} />
                    Delete Branch
                  </Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content>
                  <AlertDialog.Title>Delete Branch</AlertDialog.Title>
                  <AlertDialog.Description>
                    Are you sure you want to delete this branch? This action cannot be undone.
                  </AlertDialog.Description>
                  <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                      <Button variant="soft" color="gray">
                        Cancel
                      </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                      <Button color="red" onClick={handleDelete}>
                        Delete Branch
                      </Button>
                    </AlertDialog.Action>
                  </Flex>
                </AlertDialog.Content>
              </AlertDialog.Root>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
  );
} 