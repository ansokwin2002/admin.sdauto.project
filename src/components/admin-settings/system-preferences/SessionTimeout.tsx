'use client';

import React, { useState } from 'react';
import { Box, Card, Flex, Text, Select, Switch, Button, Heading, Checkbox, Grid } from '@radix-ui/themes';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for timeout durations and roles
const timeoutDurations = [
  { value: 5, label: '5 minutes' },
  { value: 10, label: '10 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 120, label: '2 hours' }
];

const userRoles = [
  { id: 'admin', name: 'Administrator', defaultTimeout: 60 },
  { id: 'manager', name: 'Manager', defaultTimeout: 30 },
  { id: 'cashier', name: 'Cashier', defaultTimeout: 15 },
  { id: 'kitchen', name: 'Kitchen Staff', defaultTimeout: 60 },
  { id: 'inventory', name: 'Inventory Manager', defaultTimeout: 30 }
];

export default function SessionTimeout() {
  const [timeoutDuration, setTimeoutDuration] = useState(30);
  const [applyToAllRoles, setApplyToAllRoles] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['admin', 'manager']);
  const [roleTimeouts, setRoleTimeouts] = useState<Record<string, number>>(
    Object.fromEntries(userRoles.map(role => [role.id, role.defaultTimeout]))
  );
  
  // Toggle role selection
  const toggleRole = (roleId: string) => {
    if (selectedRoles.includes(roleId)) {
      setSelectedRoles(selectedRoles.filter(id => id !== roleId));
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
  };
  
  // Update role timeout
  const updateRoleTimeout = (roleId: string, timeout: number) => {
    setRoleTimeouts({
      ...roleTimeouts,
      [roleId]: timeout
    });
  };
  
  // Handle save changes
  const handleSave = () => {
    // In a real implementation, this would save the settings to the server
    console.log({
      timeoutDuration,
      applyToAllRoles,
      roleTimeouts: applyToAllRoles 
        ? Object.fromEntries(userRoles.map(role => [role.id, timeoutDuration]))
        : Object.fromEntries(
            userRoles.map(role => [
              role.id, 
              selectedRoles.includes(role.id) ? roleTimeouts[role.id] : timeoutDuration
            ])
          )
    });
    
    // Show success toast
    toast.success('Changes saved successfully');
  };

  return (
    <Box>
      <Card size="3">
        <Flex direction="column" gap="4">
          <Flex gap="4" direction="column">
            <Flex gap="4" align="center">
              <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Timeout Duration</Text>
              <Select.Root value={timeoutDuration.toString()} onValueChange={(value) => setTimeoutDuration(parseInt(value))}>
                <Select.Trigger placeholder="Select timeout duration" />
                <Select.Content>
                  {timeoutDurations.map(duration => (
                    <Select.Item key={duration.value} value={duration.value.toString()}>
                      {duration.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Flex>
            
            <Flex gap="4">
              <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Apply to All Roles?</Text>
              <Box>
                <Switch color="green" checked={applyToAllRoles} onCheckedChange={setApplyToAllRoles} />
                {!applyToAllRoles && (
                  <Flex gap="4" direction="column">
                    <Text as="label" size="2" weight="medium" style={{ width: '180px', marginTop: '8px' }}>
                      Roles with custom timeout
                    </Text>
                    <Flex direction="column" gap="3">
                      {userRoles.map(role => (
                        <Grid key={role.id} columns="2" gap="4" maxWidth="350px">
                          <Text as="label" size="2">
                            <Flex gap="2" align="center">
                              <Checkbox 
                                checked={selectedRoles.includes(role.id)}
                                onCheckedChange={() => toggleRole(role.id)}
                              />
                              {role.name}
                            </Flex>
                          </Text>
                          
                          {selectedRoles.includes(role.id) && (
                            <Select.Root 
                              value={roleTimeouts[role.id].toString()} 
                              onValueChange={(value) => updateRoleTimeout(role.id, parseInt(value))}
                              size="1"
                            >
                              <Select.Trigger placeholder="Select timeout" />
                              <Select.Content>
                                {timeoutDurations.map(duration => (
                                  <Select.Item key={duration.value} value={duration.value.toString()}>
                                    {duration.label}
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select.Root>
                          )}
                        </Grid>
                      ))}
                    </Flex>
                  </Flex>
                )}
              </Box>
            </Flex>    
            <Flex gap="4" mt="2">
              <Button color="green" onClick={handleSave}>
                <Save size={16} />
                Save Changes
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
}
