'use client';

import StockDashboard from '@/components/inventory/StockDashboard';
import StockTracking from '@/components/inventory/StockTracking';
import BranchFilterInput from '@/components/common/BranchFilterInput';
import { Tabs, Box, Flex, Text } from '@radix-ui/themes';
import { LayoutDashboard, ClipboardList } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { mockStockItems } from '@/data/StockItemData';
import { FilterBranchProvider, useFilterBranch } from '@/contexts/FilterBranchContext';
import { useAppOrganization } from '@/contexts/AppOrganizationContext';
import { organization } from '@/data/CommonData';
import { PageHeading } from '@/components/common/PageHeading';
import { usePageTitle } from '@/hooks/usePageTitle';

function StockOverviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  const [filteredStockItems, setFilteredStockItems] = useState(mockStockItems);
  const { activeBranchFilter, setActiveBranchFilter } = useFilterBranch();
  const { activeEntity } = useAppOrganization();
  
  // Handle tab change navigation
  const handleTabChange = (value: string) => {
    router.push(`?tab=${value}`);
  };
  
  // Sync filter with global context when global context changes
  useEffect(() => {
    // Reset filter to match global selection
    setActiveBranchFilter(activeEntity.id === 'hq' ? null : activeEntity);
  }, [activeEntity, setActiveBranchFilter]);
    
  // Update filtered items when branch selection changes
  useEffect(() => {
    if (!activeBranchFilter) {
      // When no branch is selected, show all items with their total quantities
      setFilteredStockItems(mockStockItems);
    } else {
      // When a branch is selected, filter to show only branch-specific data
      const branchFilteredItems = mockStockItems.map(item => {
        // If this item has data for the selected branch
        if (item.branchData && item.branchData[activeBranchFilter.id]) {
          const branchItem = { ...item };
          const branchData = item.branchData[activeBranchFilter.id];
          
          // Override main item properties with branch-specific properties
          branchItem.quantity = branchData.quantity;
          branchItem.reorderLevel = branchData.reorderLevel;
          branchItem.lastRestockedDate = branchData.lastRestockedDate;
          branchItem.expirationDate = branchData.expirationDate;
          branchItem.status = branchData.status;
          
          return branchItem;
        }
        // If item doesn't have data for this branch, return null
        return null;
      }).filter(Boolean); // Remove null items
      
      setFilteredStockItems(branchFilteredItems);
    }
  }, [activeBranchFilter]);

  return (
    <Box>
      <Flex 
        direction={{ initial: "column", sm: "row" }} 
        justify="between" 
        align={{ initial: "stretch", sm: "center" }}
        gap={{ initial: "4", sm: "0" }}
        mb="5"
      >
        <PageHeading title="Stock Overview" description="Manage and monitor your inventory" noMarginBottom />
        <BranchFilterInput 
          selectedBranch={activeBranchFilter?.id || ''} 
          setSelectedBranch={(id: string) => {
            const branch = organization.find(o => o.id === id);
            if (branch) {
              setActiveBranchFilter(branch);
            }
          }}
          clearFilter={() => setActiveBranchFilter(null)}
        />
      </Flex>

      <Tabs.Root value={activeTab} onValueChange={handleTabChange}>
        <Tabs.List>
          <Tabs.Trigger value="dashboard">
            <Flex gap="2" align="center">
              <LayoutDashboard size={16} />
              <Text>Dashboard</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="tracking">
            <Flex gap="2" align="center">
              <ClipboardList size={16} />
              <Text>Stock Tracking</Text>
            </Flex>
          </Tabs.Trigger>
        </Tabs.List>
        
        <Tabs.Content value="dashboard">
          <Box className="mt-4">
            <StockDashboard  />
          </Box>
        </Tabs.Content>
        
        <Tabs.Content value="tracking">
          <Box className="mt-4">
            <StockTracking 
              stockItems={filteredStockItems}
            />
          </Box>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}

export default function StockOverview() {
  usePageTitle('Stock Overview');
  return (
    <FilterBranchProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <StockOverviewContent />
      </Suspense>
    </FilterBranchProvider>
  );
}
