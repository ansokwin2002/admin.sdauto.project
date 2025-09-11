'use client';

import { useState } from 'react';
import { Box, Flex, Button } from '@radix-ui/themes';
import { Plus } from 'lucide-react';
import MemberList from '@/components/loyalty-program/MemberList';
import AddMemberDialog from '@/components/loyalty-program/AddMemberDialog';
import { PageHeading } from '@/components/common/PageHeading';
import { usePageTitle } from '@/hooks/usePageTitle';
import { toast } from 'sonner';

export default function MembersPage() {
  usePageTitle('Loyalty Program Members');
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);

  const handleAddMember = () => {
    toast.success('Member added successfully!');
    setIsAddMemberDialogOpen(false);
  };
  
  return (
    <Box className="space-y-6">
      <Flex 
        direction={{ initial: "column", sm: "row" }} 
        justify="between" 
        align={{ initial: "stretch", sm: "center" }}
        gap={{ initial: "4", sm: "0" }}
        mb="5"
      >
        <PageHeading
          title="Loyalty Program Members"
          description="Manage and track your loyalty program members"
          noMarginBottom
        />
        <Box width={{ initial: "full", sm: "auto" }}>
          <Button onClick={() => setIsAddMemberDialogOpen(true)} className="w-full sm:w-auto">
            <Plus size={16} />
            Add Member
          </Button>
        </Box>
      </Flex>

      <MemberList />

      <AddMemberDialog
        open={isAddMemberDialogOpen}
        onOpenChange={setIsAddMemberDialogOpen}
        onAddMember={handleAddMember}
      />
    </Box>
  );
}
