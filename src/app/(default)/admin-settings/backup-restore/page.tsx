'use client';

import React, { useState } from 'react';
import { Box, Tabs, Flex, Text } from '@radix-ui/themes';
import { Database, Clock } from 'lucide-react';
import { PageHeading } from '@/components/common/PageHeading';
import dynamic from 'next/dynamic';
import { usePageTitle } from '@/hooks/usePageTitle';

// Use dynamic imports to avoid potential SSR issues with client components
const ManualBackup = dynamic(() => import('@/components/admin-settings/backup-restore/ManualBackup'), { ssr: false });
const ScheduledBackup = dynamic(() => import('@/components/admin-settings/backup-restore/ScheduledBackup'), { ssr: false });

export default function BackupRestorePage() {
  const [activeTab, setActiveTab] = useState('manual');
  usePageTitle('Backup & Restore');

  return (
    <Box>
      <PageHeading
        title="Backup & Restore"
        description="Configure system backup settings and manage data restoration"
      />

      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Trigger value="manual">
            <Flex gap="2" align="center">
              <Database size={16} />
              <Text>Manual Backup</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="scheduled">
            <Flex gap="2" align="center">
              <Clock size={16} />
              <Text>Scheduled Backup</Text>
            </Flex>
          </Tabs.Trigger>
        </Tabs.List>
        
        <Box mt="4">
          <Tabs.Content value="manual">
            <ManualBackup />
          </Tabs.Content>
          
          <Tabs.Content value="scheduled">
            <ScheduledBackup />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
