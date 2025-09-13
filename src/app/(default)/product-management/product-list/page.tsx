'use client';

import { useState, useEffect, Suspense } from 'react';
import { Box, Tabs, Flex, Button, Text } from '@radix-ui/themes';
import { PlusIcon, LayoutDashboard, List } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterBranchProvider, useFilterBranch } from '@/contexts/FilterBranchContext';
import { useAppOrganization } from '@/contexts/AppOrganizationContext';
import BranchFilterInput from '@/components/common/BranchFilterInput';
import { organization } from '@/data/CommonData';
import ProductDashboard from '@/components/product-management/product-list/ProductDashboard';
import ProductList from '@/components/product-management/product-list/ProductList';
import { PageHeading } from '@/components/common/PageHeading';
import { usePageTitle } from '@/hooks/usePageTitle';

// Mock data for dashboard - this should be replaced with API data in the future
const menuMetrics = {
  totalItems: 0,
  activeItems: 0,
  inactiveItems: 0,
  lowStockItems: 0,
};
const bestSellingItems: any[] = [];
const menuItems: any[] = [];

function MenuContent() {
  usePageTitle('Product List');
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'list'; // Default to list view
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const { activeBranchFilter, setActiveBranchFilter } = useFilterBranch();
  const { activeEntity } = useAppOrganization();
  
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.push(`?${params.toString()}`);
  };
  
  useEffect(() => {
    setActiveBranchFilter(activeEntity.id === 'hq' ? null : activeEntity);
  }, [activeEntity, setActiveBranchFilter]);

  const handleAddMenuItem = () => {
    router.push('/product-management/product-list/add');
  };
  
  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setStatusFilter('all');
  };

  return (
    <Box>
      <Flex 
        direction={{ initial: "column", sm: "row" }} 
        justify="between" 
        align={{ initial: "stretch", sm: "center" }}
        gap={{ initial: "4", sm: "0" }}
        mb="5"
      >
        <PageHeading title="Product List" description="Manage your products" noMarginBottom />
        <Flex 
          direction={{ initial: "column", sm: "row" }} 
          align={{ initial: "stretch", sm: "center" }} 
          gap="4"
          width={{ initial: "full", sm: "auto" }}
        >
          <Box width={{ initial: "full", sm: "auto" }}>
            <BranchFilterInput 
              selectedBranch={activeBranchFilter?.id || ''} 
              setSelectedBranch={(id: string) => {
                const branch = organization.find(o => o.id === id);
                const params = new URLSearchParams(searchParams.toString());
                if (branch) {
                  setActiveBranchFilter(branch);
                } else {
                  setActiveBranchFilter(null);
                }
                router.push(`?${params.toString()}`);
              }}
              clearFilter={() => {
                const params = new URLSearchParams(searchParams.toString());
                setActiveBranchFilter(null);
                router.push(`?${params.toString()}`);
              }}
            />
          </Box>
          <Box width={{ initial: "full", sm: "auto" }}>
            <Button onClick={handleAddMenuItem} className="w-full sm:w-auto">
              <PlusIcon size={16} />
              Add Product
            </Button>
          </Box>
        </Flex>
      </Flex>

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
              <List size={16} />
              <Text>Product List</Text>
            </Flex>
          </Tabs.Trigger>
        </Tabs.List>
        
        <Tabs.Content value="dashboard">
          <ProductDashboard
            menuMetrics={menuMetrics}
            bestSellingItems={bestSellingItems}
            menuItems={menuItems}
          />
        </Tabs.Content>
        
        <Tabs.Content value="list">
          <ProductList
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            statusFilter={statusFilter}
            onCategoryFilterChange={setCategoryFilter}
            onStatusFilterChange={setStatusFilter}
            onResetFilters={handleResetFilters}
          />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}

export default function MenuPage() {
  return (
    <FilterBranchProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <MenuContent />
      </Suspense>
    </FilterBranchProvider>
  );
}
