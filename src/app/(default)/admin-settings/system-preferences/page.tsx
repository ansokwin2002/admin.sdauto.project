'use client';

import React, { useState } from 'react';
import { Box, Tabs, Flex, Text } from '@radix-ui/themes';
import { Globe, Clock, Bell, Timer } from 'lucide-react';
import { PageHeading } from '@/components/common/PageHeading';
import dynamic from 'next/dynamic';
import { usePageTitle } from '@/hooks/usePageTitle';

// Use dynamic imports to avoid potential SSR issues with client components
const LanguageCurrency = dynamic(() => import('@/components/admin-settings/system-preferences/LanguageCurrency'), { ssr: false });
const DateTimeFormat = dynamic(() => import('@/components/admin-settings/system-preferences/DateTimeFormat'), { ssr: false });
const NotificationSettings = dynamic(() => import('@/components/admin-settings/system-preferences/NotificationSettings'), { ssr: false });
const SessionTimeout = dynamic(() => import('@/components/admin-settings/system-preferences/SessionTimeout'), { ssr: false });

export default function SystemPreferencesPage() {
  const [activeTab, setActiveTab] = useState('language');
  usePageTitle('System Preferences');

  return (
    <Box>
      <PageHeading
        title="System Preferences"
        description="Configure global system settings and preferences"
      />

      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Trigger value="language">
            <Flex gap="2" align="center">
              <Globe size={16} />
              <Text>Language & Currency</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="datetime">
            <Flex gap="2" align="center">
              <Clock size={16} />
              <Text>Date/Time Format</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="notifications">
            <Flex gap="2" align="center">
              <Bell size={16} />
              <Text>Notification Settings</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="session">
            <Flex gap="2" align="center">
              <Timer size={16} />
              <Text>Session Timeout</Text>
            </Flex>
          </Tabs.Trigger>
        </Tabs.List>
        
        <Box mt="4">
          <Tabs.Content value="language">
            <LanguageCurrency />
          </Tabs.Content>
          
          <Tabs.Content value="datetime">
            <DateTimeFormat />
          </Tabs.Content>
          
          <Tabs.Content value="notifications">
            <NotificationSettings />
          </Tabs.Content>
          
          <Tabs.Content value="session">
            <SessionTimeout />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}