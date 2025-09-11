'use client';

import React, { Suspense } from 'react';
import { Box, Tabs, Flex, Text } from '@radix-ui/themes';
import { Building2, GitBranch } from 'lucide-react';
import { PageHeading } from '@/components/common/PageHeading';
import BranchList from '@/components/admin-settings/organization/BranchList';
import OrganizationProfileForm from '@/components/admin-settings/organization/OrganizationProfileForm';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePageTitle } from "@/hooks/usePageTitle";

function OrganizationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'profile';
  
  const handleAddBranch = () => {
    router.push('/admin-settings/organization/branch/new');
  };
  
  const handleTabChange = (value: string) => {
    router.push(`/admin-settings/organization?tab=${value}`);
  };
  
  return (
    <Tabs.Root value={tab} onValueChange={handleTabChange}>
      <Tabs.List>
        <Tabs.Trigger value="profile">
          <Flex gap="2" align="center">
            <Building2 size={16} />
            <Text>Organization Profile</Text>
          </Flex>
        </Tabs.Trigger>
        <Tabs.Trigger value="branches">
          <Flex gap="2" align="center">
            <GitBranch size={16} />
            <Text>Branch Management</Text>
          </Flex>
        </Tabs.Trigger>
      </Tabs.List>
      
      <Box py="4">
        <Tabs.Content value="profile">
          <OrganizationProfileForm />
        </Tabs.Content>
        
        <Tabs.Content value="branches">
          <BranchList handleAddBranch={handleAddBranch} />
        </Tabs.Content>
      </Box>
    </Tabs.Root>
  );
}

export default function OrganizationPage() {
  usePageTitle('Organization Management')

  return (
    <Box className="space-y-6">
      <PageHeading
        title="Organization Management"
        description="Manage root organization details and branch locations"
      />
      
      <Suspense fallback={<div>Loading...</div>}>
        <OrganizationContent />
      </Suspense>
    </Box>
  );
}