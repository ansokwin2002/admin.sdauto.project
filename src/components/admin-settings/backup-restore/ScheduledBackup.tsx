'use client';

import React, { useState } from 'react';
import { Box, Card, Flex, Text, Switch, Select, Button, TextField, Checkbox, Grid, Heading } from '@radix-ui/themes';
import { Save, Clock } from 'lucide-react';
import CardHeading from '@/components/common/CardHeading';

// Mock admin email list for notifications
const adminEmails = [
  { id: '1', email: 'admin@eatlypos.com' },
  { id: '2', email: 'manager@eatlypos.com' },
  { id: '3', email: 'tech@eatlypos.com' }
];

// Mock current schedule
const currentSchedule = {
  enabled: true,
  frequency: 'Daily',
  backupType: 'Database Only',
  timeOfDay: '02:00',
  retention: 7,
  notifications: ['admin@eatlypos.com', 'tech@eatlypos.com']
};

export default function ScheduledBackup() {
  const [scheduleEnabled, setScheduleEnabled] = useState(currentSchedule.enabled);
  const [frequency, setFrequency] = useState('daily');
  const [backupType, setBackupType] = useState('database');
  const [timeOfDay, setTimeOfDay] = useState('02:00');
  const [retention, setRetention] = useState('7');
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>(currentSchedule.notifications);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSchedule = () => {
    setIsSaving(true);
    // Simulate saving process
    setTimeout(() => {
      setIsSaving(false);
      // In a real implementation, this would save the schedule configuration
    }, 1500);
  };

  const handleAdminToggle = (email: string) => {
    setSelectedAdmins(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email) 
        : [...prev, email]
    );
  };

  return (
    <Grid columns={{ initial: '1', md: '4' }} gap="6">
      {/* Configuration Section - Takes 3/4 of the width */}
      <Box className="col-span-3">
        <Card size="3">
          <Flex direction="column" gap="4">
            <CardHeading title="Scheduled Backup Configuration" />
            
            <Flex gap="4" direction="column">
              <Flex gap="4" align="center">
                <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Enable Scheduling</Text>
                <Switch 
                  color="green"
                  checked={scheduleEnabled} 
                  onCheckedChange={setScheduleEnabled} 
                />
              </Flex>
              
              <Flex gap="4" align="center">
                <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Frequency</Text>
                <Select.Root 
                  value={frequency} 
                  onValueChange={setFrequency}
                  disabled={!scheduleEnabled}
                >
                  <Select.Trigger placeholder="Select frequency" />
                  <Select.Content>
                    <Select.Item value="daily">Daily</Select.Item>
                    <Select.Item value="weekly">Weekly</Select.Item>
                    <Select.Item value="biweekly">Bi-Weekly</Select.Item>
                    <Select.Item value="monthly">Monthly</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>
              
              <Flex gap="4" align="center">
                <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Backup Type</Text>
                <Select.Root 
                  value={backupType} 
                  onValueChange={setBackupType}
                  disabled={!scheduleEnabled}
                >
                  <Select.Trigger placeholder="Select backup type" />
                  <Select.Content>
                    <Select.Item value="database">Database Only</Select.Item>
                    <Select.Item value="full">Full System</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>
              
              <Flex gap="4" align="center">
                <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Time of Day</Text>
                <TextField.Root 
                  type="time" 
                  value={timeOfDay} 
                  onChange={(e) => setTimeOfDay(e.target.value)}
                  disabled={!scheduleEnabled}
                />
              </Flex>
              
              <Flex gap="4" align="center">
                <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Retention Policy</Text>
                <Flex align="center" gap="2">
                  <TextField.Root 
                    type="number" 
                    value={retention} 
                    onChange={(e) => setRetention(e.target.value)}
                    disabled={!scheduleEnabled}
                    style={{ width: '80px' }}
                  />
                  <Text>backups</Text>
                </Flex>
              </Flex>
              
              <Box>
                <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Notify Admins</Text>
                <Flex direction="column" gap="2" mt="2">
                  {adminEmails.map((admin) => (
                    <Flex key={admin.id} align="center" gap="2">
                      <Checkbox 
                        checked={selectedAdmins.includes(admin.email)} 
                        onCheckedChange={() => handleAdminToggle(admin.email)}
                        disabled={!scheduleEnabled}
                      />
                      <Text>{admin.email}</Text>
                    </Flex>
                  ))}
                </Flex>
              </Box>
              
              <Flex gap="4" mt="2">
                <Button 
                  color="green" 
                  onClick={handleSaveSchedule} 
                  disabled={isSaving || !scheduleEnabled}
                >
                  <Save size={16} />
                  {isSaving ? 'Saving...' : 'Save Schedule'}
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Card>
      </Box>

      {/* Current Schedule Section - Takes 1/4 of the width */}
      <Box className="col-span-1">
        <Card size="3" style={{ height: '100%' }}>
          <Flex direction="column" gap="3" height="100%">
            <CardHeading title="Current Schedule" mb="4"/>
            
            <Flex direction="column">
              <Text as="label" size="2" weight="medium" className="text-slate-500 dark:text-neutral-400">Status:</Text>
              <Text size="2">
                <Flex align="center" gap="1">
                  <Box 
                    style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: currentSchedule.enabled ? 'var(--green-9)' : 'var(--gray-8)' 
                    }} 
                  />
                  {currentSchedule.enabled ? 'Active' : 'Inactive'}
                </Flex>
              </Text>
            </Flex>
            
            <Flex direction="column">
              <Text as="label" size="2" weight="medium" className="text-slate-500 dark:text-neutral-400">Schedule:</Text>
              <Text size="2">{currentSchedule.frequency} at {currentSchedule.timeOfDay}</Text>
            </Flex>
            
            <Flex direction="column">
              <Text as="label" size="2" weight="medium" className="text-slate-500 dark:text-neutral-400">Backup Type:</Text>
              <Text size="2">{currentSchedule.backupType}</Text>
            </Flex>
            
            <Flex direction="column">
              <Text as="label" size="2" weight="medium" className="text-slate-500 dark:text-neutral-400">Retention:</Text>
              <Text size="2">Keep last {currentSchedule.retention} backups</Text>
            </Flex>
            
            <Flex direction="column">
              <Text as="label" size="2" weight="medium" className="text-slate-500 dark:text-neutral-400">Notifications:</Text>
              <Flex direction="column">
                {currentSchedule.notifications.map((email, index) => (
                  <Text key={index} size="2">{email}</Text>
                ))}
              </Flex>
            </Flex>
            
            <Flex gap="4" mt="auto" width="100%">
              <Button 
                variant={currentSchedule.enabled ? "soft" : "solid"}
                color={currentSchedule.enabled ? "red" : "green"}
                style={{ width: '100%' }}
              >
                <Clock size={16} />
                {currentSchedule.enabled ? 'Disable Schedule' : 'Enable Schedule'}
              </Button>
            </Flex>
          </Flex>
        </Card>
      </Box>
    </Grid>
  );
} 