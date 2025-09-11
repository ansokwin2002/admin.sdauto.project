'use client';

import React from 'react';
import { Box, Button, Flex } from '@radix-ui/themes';
import { PageHeading } from '@/components/common/PageHeading';
import UserList from '@/components/admin-settings/users/UserList';
import { UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  const router = useRouter();
  
    // Handle invite user button click
    const handleInviteUser = () => {
      router.push('/admin-settings/users/invite');
    };

  return (
    <Box>
      <Flex 
        direction={{ initial: "column", sm: "row" }}
        justify={{ initial: "start", sm: "between" }}
        align={{ initial: "stretch", sm: "center" }}
        gap={{ initial: "4", sm: "0" }}
        mb="5"
      >
        <PageHeading
          title="User Management"
          description="Manage user accounts, roles, and permissions"
          noMarginBottom
        />
        <Button onClick={handleInviteUser} className="w-full sm:w-auto">
          <UserPlus size={16} />
          Invite User
        </Button>
      </Flex>
      
      <UserList />
    </Box>
  );
}
