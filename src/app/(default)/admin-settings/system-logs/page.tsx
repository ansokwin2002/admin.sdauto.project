'use client';

import React, { useState } from 'react';
import { Box, Tabs, Flex, Text } from '@radix-ui/themes';
import { Activity, LogIn, AlertTriangle } from 'lucide-react';
import { PageHeading } from '@/components/common/PageHeading';
import dynamic from 'next/dynamic';
import { usePageTitle } from '@/hooks/usePageTitle';

// Use dynamic imports to avoid potential SSR issues with client components
const ActivityLog = dynamic(() => import('@/components/admin-settings/system-logs/ActivityLog'), { ssr: false });
const LoginHistory = dynamic(() => import('@/components/admin-settings/system-logs/LoginHistory'), { ssr: false });
const SystemErrors = dynamic(() => import('@/components/admin-settings/system-logs/SystemErrors'), { ssr: false });

export default function SystemLogsPage() {
  const [activeTab, setActiveTab] = useState('activity');
  usePageTitle('System Logs');

  return (
    <Box>
      <PageHeading
        title="System Logs"
        description="View and analyze system activity, login attempts, and error logs"
      />

      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Trigger value="activity">
            <Flex gap="2" align="center">
              <Activity size={16} />
              <Text>Activity Log</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="login">
            <Flex gap="2" align="center">
              <LogIn size={16} />
              <Text>Login History</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="errors">
            <Flex gap="2" align="center">
              <AlertTriangle size={16} />
              <Text>System Errors</Text>
            </Flex>
          </Tabs.Trigger>
        </Tabs.List>
        
        <Box mt="4">
          <Tabs.Content value="activity">
            <ActivityLog />
          </Tabs.Content>
          
          <Tabs.Content value="login">
            <LoginHistory />
          </Tabs.Content>
          
          <Tabs.Content value="errors">
            <SystemErrors />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
