'use client';

import React from 'react';
import { Button, Container, Flex, Box } from '@radix-ui/themes';
import { PageHeading } from '@/components/common/PageHeading';
import RoleList from '@/components/admin-settings/roles-permissions/RoleList';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function RolesPermissionsPage() {
  const router = useRouter();
  usePageTitle('Roles & Permissions');

  const handleAddRole = () => {
    router.push('/admin-settings/roles-permissions/new');
  };

  return (
    <Container size="4">
      <Flex 
        direction={{ initial: "column", sm: "row" }} 
        justify="between" 
        align={{ initial: "stretch", sm: "center" }}
        gap={{ initial: "4", sm: "0" }}
        mb="5"
      >
        <PageHeading
          title="Roles & Permissions"
          description="Manage user roles and their access permissions across the system"
          noMarginBottom
        />
        <Box width={{ initial: "full", sm: "auto" }}>
          <Button onClick={handleAddRole}>
            <Plus size={16} />
            Add Role
          </Button>
        </Box>
      </Flex>
 
      <RoleList />
    </Container>
  );
}
