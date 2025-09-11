'use client';

import React, { useState } from 'react';
import { Box, Card, Flex, Text, Select, Switch, Button, RadioGroup } from '@radix-ui/themes';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for date formats and timezones
const dateFormats = [
  { id: 'MM/DD/YYYY', label: 'MM/DD/YYYY', example: '05/02/2025' },
  { id: 'DD/MM/YYYY', label: 'DD/MM/YYYY', example: '02/05/2025' },
  { id: 'YYYY-MM-DD', label: 'YYYY-MM-DD', example: '2025-05-02' },
  { id: 'DD-MMM-YYYY', label: 'DD-MMM-YYYY', example: '02-May-2025' },
  { id: 'MMM DD, YYYY', label: 'MMM DD, YYYY', example: 'May 02, 2025' }
];

const timezones = [
  { id: 'Asia/Jakarta', label: 'Asia/Jakarta (GMT+7)' },
  { id: 'Asia/Singapore', label: 'Asia/Singapore (GMT+8)' },
  { id: 'Asia/Tokyo', label: 'Asia/Tokyo (GMT+9)' },
  { id: 'America/New_York', label: 'America/New_York (GMT-4)' },
  { id: 'Europe/London', label: 'Europe/London (GMT+1)' },
  { id: 'UTC', label: 'UTC (GMT+0)' }
];

export default function DateTimeFormat() {
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [timeFormat, setTimeFormat] = useState('24h');
  const [timezone, setTimezone] = useState('Asia/Jakarta');
  const [syncWithServer, setSyncWithServer] = useState(true);
  
  // Get current date and time for preview
  const now = new Date();
  
  // Format date based on selected format
  const formatDate = () => {
    const format = dateFormats.find(f => f.id === dateFormat);
    return format ? format.example : '';
  };
  
  // Format time based on selected format
  const formatTime = () => {
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    if (timeFormat === '12h') {
      const period = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
    } else {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  };
  
  // Handle save changes
  const handleSave = () => {
    // In a real implementation, this would save the settings to the server
    console.log({
      dateFormat,
      timeFormat,
      timezone,
      syncWithServer
    });
    
    // Show success toast
    toast.success('Changes saved successfully');
  };

  return (
    <Card size="3">
      <Flex direction="column" gap="4">
        <Flex gap="4" direction="column">
          <Flex gap="4" align="center">
            <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Date Format</Text>
            <Select.Root value={dateFormat} onValueChange={setDateFormat}>
              <Select.Trigger placeholder="Select date format" />
              <Select.Content>
                {dateFormats.map(format => (
                  <Select.Item key={format.id} value={format.id}>
                    {format.label} ({format.example})
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>
          
          <Flex gap="4" align="center">
            <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Time Format</Text>
            <RadioGroup.Root value={timeFormat} onValueChange={setTimeFormat}>
              <Flex gap="2">
                <Text as="label" size="2">
                  <Flex gap="1" align="center">
                    <RadioGroup.Item value="12h" />
                    12-hour
                  </Flex>
                </Text>
                <Text as="label" size="2">
                  <Flex gap="1" align="center">
                    <RadioGroup.Item value="24h" />
                    24-hour
                  </Flex>
                </Text>
              </Flex>
            </RadioGroup.Root>
          </Flex>
          
          <Flex gap="4" align="center">
            <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Timezone</Text>
            <Select.Root value={timezone} onValueChange={setTimezone}>
              <Select.Trigger placeholder="Select timezone" />
              <Select.Content>
                {timezones.map(tz => (
                  <Select.Item key={tz.id} value={tz.id}>{tz.label}</Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>
          
          <Flex gap="4" align="center">
            <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Sync with Server Time</Text>
            <Switch color="green" checked={syncWithServer} onCheckedChange={setSyncWithServer} />
          </Flex>
          
          <Flex gap="4" align="center">
            <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Preview</Text>
            <Text size="3" weight="medium">{formatDate()} {formatTime()}</Text>
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
  );
}
