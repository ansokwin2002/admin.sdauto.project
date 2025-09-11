'use client';

import React, { useState } from 'react';
import { Box, Tabs, Flex, Text } from '@radix-ui/themes';
import { Percent, Building, Receipt, Tag } from 'lucide-react';
import { PageHeading } from '@/components/common/PageHeading';
import dynamic from 'next/dynamic';
import { usePageTitle } from '@/hooks/usePageTitle';

// Use dynamic imports to avoid potential SSR issues with client components
const GlobalTaxSettings = dynamic(() => import('@/components/admin-settings/tax-service-charges/GlobalTaxSettings'), { ssr: false });
const BranchTaxOverrides = dynamic(() => import('@/components/admin-settings/tax-service-charges/BranchTaxOverrides'), { ssr: false });
const ServiceCharges = dynamic(() => import('@/components/admin-settings/tax-service-charges/ServiceCharges'), { ssr: false });
const PriceInclusionRules = dynamic(() => import('@/components/admin-settings/tax-service-charges/PriceInclusionRules'), { ssr: false });

export default function TaxServiceChargesPage() {
  usePageTitle('Tax & Service Charges');
  const [activeTab, setActiveTab] = useState('global-tax');

  return (
    <Box>
      <PageHeading
        title="Tax & Service Charges"
        description="Configure tax settings, service charges, and price inclusion rules"
      />

      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Trigger value="global-tax">
            <Flex gap="2" align="center">
              <Percent size={16} />
              <Text>Global Tax Settings</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="branch-tax">
            <Flex gap="2" align="center">
              <Building size={16} />
              <Text>Branch Tax Overrides</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="service-charges">
            <Flex gap="2" align="center">
              <Receipt size={16} />
              <Text>Service Charges</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="price-inclusion">
            <Flex gap="2" align="center">
              <Tag size={16} />
              <Text>Price Inclusion Rules</Text>
            </Flex>
          </Tabs.Trigger>
        </Tabs.List>
        
        <Box mt="4">
          <Tabs.Content value="global-tax">
            <GlobalTaxSettings />
          </Tabs.Content>
          
          <Tabs.Content value="branch-tax">
            <BranchTaxOverrides />
          </Tabs.Content>
          
          <Tabs.Content value="service-charges">
            <ServiceCharges />
          </Tabs.Content>
          
          <Tabs.Content value="price-inclusion">
            <PriceInclusionRules />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}