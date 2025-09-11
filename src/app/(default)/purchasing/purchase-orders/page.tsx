'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Box, Tabs, Flex, Button, Text } from '@radix-ui/themes';
import PurchaseOrderDashboard from '@/components/purchasing/purchase-order/PurchaseOrderDashboard';
import PurchaseOrderList from '@/components/purchasing/purchase-order/PurchaseOrderList';
import { PlusIcon, LayoutDashboard, ClipboardList } from 'lucide-react';
import BranchFilterInput from '@/components/common/BranchFilterInput';

import { organization } from '@/data/CommonData';
import { FilterBranchProvider, useFilterBranch } from '@/contexts/FilterBranchContext';
import { useAppOrganization } from '@/contexts/AppOrganizationContext';
import { PageHeading } from '@/components/common/PageHeading';
import { usePageTitle } from '@/hooks/usePageTitle';

type ViewType = 'dashboard' | 'list';

function PurchaseOrderHeader({ onCreate }: { onCreate: () => void }) {
  const { activeBranchFilter, setActiveBranchFilter } = useFilterBranch();
  const { activeEntity } = useAppOrganization();
  
  useEffect(() => {
    setActiveBranchFilter(activeEntity.id === 'hq' ? null : activeEntity);
  }, [activeEntity, setActiveBranchFilter]);

  return (
    <Flex 
      direction={{ initial: "column", sm: "row" }} 
      justify="between" 
      align={{ initial: "stretch", sm: "center" }}
      gap={{ initial: "4", sm: "0" }}
      mb="4"
    >
      <PageHeading 
        title="Purchase Orders" 
        description="Manage your inventory orders and supplier relationships"
        noMarginBottom
      />
      <Flex 
        direction={{ initial: "column", sm: "row" }}
        gap={{ initial: "3", sm: "4" }}
        align={{ initial: "stretch", sm: "center" }}
      >
        <BranchFilterInput
          selectedBranch={activeBranchFilter ? activeBranchFilter.id : null}
          setSelectedBranch={(id: string) => {
            const branch = organization.find(o => o.id === id);
            if (branch) {
              setActiveBranchFilter(branch);
            }  
          }}
          clearFilter={() => setActiveBranchFilter(null)}
        />
        <Button onClick={onCreate}>
          <PlusIcon size={16} />
          Create Purchase Order
        </Button>
      </Flex>
    </Flex>
  );
}

function PurchaseOrdersContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const initialTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<ViewType>(
    initialTab === 'list' ? 'list' : 'dashboard' 
  );

  useEffect(() => {
    const currentTab = searchParams.get('tab');
    setActiveTab(currentTab === 'list' ? 'list' : 'dashboard');
  }, [searchParams]);

  const handleCreatePurchaseOrder = () => {
    router.push('/purchasing/purchase-orders/add');
  };

  const handleTabChange = (value: string) => {
    const newTab = value as ViewType;
    setActiveTab(newTab);
    router.replace(`${pathname}?tab=${newTab}`);
  };

  return (
    <Box>
      <PurchaseOrderHeader onCreate={handleCreatePurchaseOrder} />
      
      <Tabs.Root value={activeTab} onValueChange={handleTabChange}>
        <Tabs.List>
          <Tabs.Trigger value="dashboard">
            <Flex gap="2" align="center">
              <LayoutDashboard size={16} />
              <Text>Dashboard</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="list">
            <Flex gap="2" align="center">
              <ClipboardList size={16} />
              <Text>Purchase Order List</Text>
            </Flex>
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>

      <Box className="mt-6">
        {activeTab === 'dashboard' ? <PurchaseOrderDashboard /> : <PurchaseOrderList />}
      </Box>
    </Box>
  );
}

export default function PurchaseOrders() {
  usePageTitle('Purchase Orders');
  return (
    <FilterBranchProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <PurchaseOrdersContent />
      </Suspense>
    </FilterBranchProvider>
  );
}