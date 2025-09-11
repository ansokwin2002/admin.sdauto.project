'use client';

import React, { useState } from 'react';
import { Box, Tabs, Flex, Text } from '@radix-ui/themes';
import { Monitor, Printer, Layout } from 'lucide-react';
import { PageHeading } from '@/components/common/PageHeading';
import dynamic from 'next/dynamic';
import { usePageTitle } from '@/hooks/usePageTitle';

// Use dynamic imports to avoid potential SSR issues with client components
const POSTerminalSettings = dynamic(() => import('@/components/admin-settings/pos-devices/POSTerminalSettings'), { ssr: false });
const PrinterConfiguration = dynamic(() => import('@/components/admin-settings/pos-devices/PrinterConfiguration'), { ssr: false });
const KDSSetup = dynamic(() => import('@/components/admin-settings/pos-devices/KDSSetup'), { ssr: false });

export default function POSDevicesPage() {
  const [activeTab, setActiveTab] = useState('terminals');
  usePageTitle('POS Devices');

  return (
    <Box>
      <PageHeading
        title="POS & Device Management"
        description="Configure and manage all point-of-sale hardware and kitchen display systems"
      />

      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Trigger value="terminals">
            <Flex gap="2" align="center">
              <Monitor size={16} />
              <Text>POS Terminal Settings</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="printers">
            <Flex gap="2" align="center">
              <Printer size={16} />
              <Text>Printer Configuration</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="kds">
            <Flex gap="2" align="center">
              <Layout size={16} />
              <Text>KDS Setup</Text>
            </Flex>
          </Tabs.Trigger>
        </Tabs.List>
        
        <Box mt="4">
          <Tabs.Content value="terminals">
            <POSTerminalSettings />
          </Tabs.Content>
          
          <Tabs.Content value="printers">
            <PrinterConfiguration />
          </Tabs.Content>
          
          <Tabs.Content value="kds">
            <KDSSetup />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
