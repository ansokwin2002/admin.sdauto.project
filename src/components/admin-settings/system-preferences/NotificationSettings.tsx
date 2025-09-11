'use client';

import React, { useState } from 'react';
import { Box, Card, Flex, Text, Button, Heading, Table, IconButton, Checkbox } from '@radix-ui/themes';
import { Save, Send } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for notification types
const notificationTypes = [
  {
    id: 'new_sales',
    name: 'New Sales Order',
    channels: {
      inApp: true,
      email: true
    }
  },
  {
    id: 'low_stock',
    name: 'Low Stock Alert',
    channels: {
      inApp: false,
      email: true
    }
  },
  {
    id: 'staff_login',
    name: 'Staff Login Notification',
    channels: {
      inApp: true,
      email: false
    }
  },
  {
    id: 'payment_received',
    name: 'Payment Received',
    channels: {
      inApp: true,
      email: true
    }
  },
  {
    id: 'order_canceled',
    name: 'Order Canceled',
    channels: {
      inApp: true,
      email: false
    }
  }
];

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState(notificationTypes);
  const [testingNotification, setTestingNotification] = useState<string | null>(null);
  
  // Toggle notification channel
  const toggleChannel = (notificationId: string, channel: 'inApp' | 'email') => {
    setNotifications(notifications.map(notification => {
      if (notification.id === notificationId) {
        return {
          ...notification,
          channels: {
            ...notification.channels,
            [channel]: !notification.channels[channel]
          }
        };
      }
      return notification;
    }));
  };
  
  // Test notification
  const testNotification = (notificationId: string) => {
    setTestingNotification(notificationId);
    
    // Simulate test notification
    setTimeout(() => {
      setTestingNotification(null);
      // In a real implementation, this would send a test notification
      console.log(`Testing notification: ${notificationId}`);
      
      // Show test notification toast
      const notification = notifications.find(n => n.id === notificationId);
      if (notification) {
        toast.info(`Test notification sent: ${notification.name}`);
      }
    }, 2000);
  };
  
  // Handle save changes
  const handleSave = () => {
    // In a real implementation, this would save the settings to the server
    console.log({ notifications });
    
    // Show success toast
    toast.success('Changes saved successfully');
  };

  return (
    <Card size="3">
      <Box>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Notification Type</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Channel</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Enabled</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="center">Test</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          
          <Table.Body>
            {notifications.map(notification => (
              <Table.Row key={notification.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800">
                <Table.Cell>{notification.name}</Table.Cell>
                <Table.Cell>
                  <Flex direction="column" gap="1">
                    <Text size="2">
                      {notification.channels.inApp && notification.channels.email 
                        ? 'In-app, Email' 
                        : notification.channels.inApp 
                          ? 'In-app Only' 
                          : 'Email Only'}
                    </Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Flex gap="4">
                    <Text as="label" size="2">
                      <Flex gap="1" align="center">
                        <Checkbox 
                          checked={notification.channels.inApp}
                          onCheckedChange={() => toggleChannel(notification.id, 'inApp')}
                        />
                        In-app
                      </Flex>
                    </Text>
                    <Text as="label" size="2">
                      <Flex gap="1" align="center">
                        <Checkbox 
                          checked={notification.channels.email}
                          onCheckedChange={() => toggleChannel(notification.id, 'email')}
                        />
                        Email
                      </Flex>
                    </Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell align="center">
                  <IconButton 
                    size="1" 
                    variant="outline" 
                    color="green"
                    disabled={testingNotification === notification.id}
                    onClick={() => testNotification(notification.id)}
                    loading={testingNotification === notification.id}
                  >
                    <Send size={14} className={testingNotification === notification.id ? 'animate-pulse' : ''} />
                  </IconButton>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        
        <Flex gap="4" mt="2">
          <Button color="green" onClick={handleSave}>
            <Save size={16} />
            Save Changes
          </Button>
        </Flex>
      </Box>
    </Card>
  );
}
