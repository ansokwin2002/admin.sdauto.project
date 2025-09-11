'use client';

import { useState, useEffect, Suspense } from 'react';
import { Box, Tabs, Flex, Button, Text } from '@radix-ui/themes';
import { PlusIcon, LayoutDashboard, List } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterBranchProvider, useFilterBranch } from '@/contexts/FilterBranchContext';
import { useAppOrganization } from '@/contexts/AppOrganizationContext';
import { menuItems, menuCategories, MenuItem } from '@/data/MenuData';
import BranchFilterInput from '@/components/common/BranchFilterInput';
import { organization } from '@/data/CommonData';
import ProductDashboard from '@/components/product-management/product-list/ProductDashboard';
import ProductList from '@/components/product-management/product-list/ProductList';
import { PageHeading } from '@/components/common/PageHeading';
import { usePageTitle } from '@/hooks/usePageTitle';

// Menu metrics for dashboard
const menuMetrics = {
  totalItems: menuItems.length,
  activeItems: menuItems.filter(item => item.isActive).length,
  inactiveItems: menuItems.filter(item => !item.isActive).length,
  lowStockItems: menuItems.filter(item => item.stockWarning).length,
};

// Best-selling items data for chart
const bestSellingItems = menuItems
  .sort((a, b) => b.popularity - a.popularity)
  .slice(0, 5)
  .map(item => ({
    name: item.name,
    sales: item.popularity * 2.5,
    image: item.imageUrl || '',
  }));

function MenuContent() {
  usePageTitle('Product List');
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  const [filteredMenuItems, setFilteredMenuItems] = useState(menuItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const { activeBranchFilter, setActiveBranchFilter } = useFilterBranch();
  const { activeEntity } = useAppOrganization();
  
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.push(`?${params.toString()}`);
  };
  
  // Sync filter with global context when global context changes
  useEffect(() => {
    setActiveBranchFilter(activeEntity.id === 'hq' ? null : activeEntity);
  }, [activeEntity, setActiveBranchFilter]);

  useEffect(() => {
    let filtered = menuItems;

    // Filter by branch availability if a branch is selected
    if (activeBranchFilter) {
      filtered = filtered.filter(item => 
        item.availableBranchesIds.includes(activeBranchFilter.id)
      );
    }

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        menuCategories.find(cat => cat.id === item.category)?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(item => item.isActive === isActive);
    }
    
    // Apply availability filter
    if (availabilityFilter !== 'all') {
      const availableBranches = organization.filter(org => org.id !== "hq");
      
      if (availabilityFilter === 'all_branches') {
        filtered = filtered.filter(item => 
          item.availableBranchesIds.length === availableBranches.length
        );
      } else if (availabilityFilter === 'some_branches') {
        filtered = filtered.filter(item => 
          item.availableBranchesIds.length > 0 && 
          item.availableBranchesIds.length < availableBranches.length
        );
      } else if (availabilityFilter === 'not_available') {
        filtered = filtered.filter(item => 
          item.availableBranchesIds.length === 0
        );
      }
    }
    
    setFilteredMenuItems(filtered);
  }, [searchTerm, activeBranchFilter, categoryFilter, statusFilter, availabilityFilter]);

  const handleAddMenuItem = () => {
    router.push('/product-management/product-list/add');
  };
  
  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setAvailabilityFilter('all');
  };

  const handleEditItem = (item: MenuItem) => {
    router.push(`/product-management/product-list/${item.id}`);
  };

  const handleDeleteItem = (item: MenuItem) => {
    // TODO: Implement delete functionality
    console.log('Delete item:', item);
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
        <PageHeading title="Product List" description="Manage your restaurant menu items" noMarginBottom />
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
                // Preserve the 'tab' query parameter when changing branch filter
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
            filteredMenuItems={filteredMenuItems}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            categoryFilter={categoryFilter}
            statusFilter={statusFilter}
            availabilityFilter={availabilityFilter}
            onCategoryFilterChange={setCategoryFilter}
            onStatusFilterChange={setStatusFilter}
            onAvailabilityFilterChange={setAvailabilityFilter}
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