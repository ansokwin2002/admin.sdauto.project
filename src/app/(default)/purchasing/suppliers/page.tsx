'use client';

import { Box, Flex, Button } from '@radix-ui/themes';
import SupplierList from '@/components/purchasing/supplier/SupplierList';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PageHeading } from '@/components/common/PageHeading';
import { usePageTitle } from '@/hooks/usePageTitle';

function SupplierHeader() {
  const router = useRouter();

  const handleAddSupplier = () => {
    router.push('/purchasing/suppliers/add');
  };

  return (
    <Flex 
      direction={{ initial: "column", sm: "row" }} 
      justify="between" 
      align={{ initial: "stretch", sm: "center" }}
      gap={{ initial: "4", sm: "0" }}
      mb="5"
    >
      <PageHeading 
        title="Suppliers" 
        description="Manage your vendor relationships and supply chain"
        noMarginBottom
      />
      <Flex gap="3" width={{ initial: "full", sm: "auto" }}>
        <Box width={{ initial: "full", sm: "auto" }}>
          <Button onClick={handleAddSupplier}>
            <PlusIcon size={16} />
            Add Supplier
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
}

export default function SuppliersPage() {
  usePageTitle('Suppliers');
  return (
    <Box>
      <SupplierHeader />
      <SupplierList />
    </Box>
  );
}
