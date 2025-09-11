import React from 'react';
import { Box, Card, Flex, Heading, Select, Text } from '@radix-ui/themes';
import { Branch } from '@/data/BranchData';
import { User } from '@/types/user';

// Mock users data for manager selection
const mockManagers: User[] = [
  {
    id: 'u1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Branch Manager'
  },
  {
    id: 'u2',
    name: 'Emma Johnson',
    email: 'emma.johnson@example.com',
    role: 'Branch Manager'
  },
  {
    id: 'u3',
    name: 'Michael Davis',
    email: 'michael.davis@example.com',
    role: 'Branch Manager'
  },
  {
    id: 'u4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    role: 'Branch Manager'
  },
  {
    id: 'u7',
    name: 'David Park',
    email: 'david.park@example.com',
    role: 'Branch Manager'
  }
];

// Mock regional managers
const mockRegionalManagers: User[] = [
  {
    id: 'u5',
    name: 'Linda Chen',
    email: 'linda.chen@example.com',
    role: 'Regional Director'
  },
  {
    id: 'u6',
    name: 'Robert Patel',
    email: 'robert.patel@example.com',
    role: 'Regional Director'
  }
];

interface ManagerAssignmentTabProps {
  branch: Branch;
  onUpdate: (updates: Partial<Branch>) => void;
}

export default function ManagerAssignmentTab({ branch, onUpdate }: ManagerAssignmentTabProps) {
  // Handle branch manager change
  const handleBranchManagerChange = (userId: string) => {
    const selectedManager = mockManagers.find(manager => manager.id === userId);
    onUpdate({ manager: selectedManager });
  };
  
  // Handle regional manager change
  const handleRegionalManagerChange = (userId: string) => {
    const selectedManager = mockRegionalManagers.find(manager => manager.id === userId);
    onUpdate({ regionalManager: selectedManager });
  };
  
  return (
    <Card size="3">
      <Flex direction="column" gap="4">
        <Flex direction="column" gap="2">
          <Text as="label" size="2" weight="medium">
            Regional Manager
          </Text>
          <Select.Root 
            value={branch.regionalManager?.id || ''}
            onValueChange={handleRegionalManagerChange}
          >
            <Select.Trigger placeholder="Select regional manager" />
            <Select.Content>
              <Select.Item value="none">None</Select.Item>
              {mockRegionalManagers.map(manager => (
                <Select.Item key={manager.id} value={manager.id}>
                  {manager.name} - {manager.role}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>
        
        <Flex direction="column" gap="2">
          <Text as="label" size="2" weight="medium">
            Branch Manager
          </Text>
          <Select.Root 
            value={branch.manager?.id || ''}
            onValueChange={handleBranchManagerChange}
          >
            <Select.Trigger placeholder="Select branch manager" />
            <Select.Content>
              <Select.Item value="none">None</Select.Item>
              {mockManagers.map(manager => (
                <Select.Item key={manager.id} value={manager.id}>
                  {manager.name} - {manager.email}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>
      </Flex>
    </Card>
  );
} 