'use client';

import React, { useState, useEffect } from 'react';
import {
  Badge,
  Box,
  Button,
  Callout,
  Flex,
  TextField,
  Select
} from '@radix-ui/themes';
import { ingredientItems } from '@/data/IngredientItemsData';
import { IngredientItem, StockCategory } from '@/types/inventory';
import IngredientItemsTable from '@/components/inventory/IngredientItemsTable';
import Pagination from '@/components/common/Pagination';
import BranchFilterInput from '@/components/common/BranchFilterInput';
import { FilterBranchProvider, useFilterBranch } from '@/contexts/FilterBranchContext';
import { organization } from '@/data/CommonData';
import { Plus, Search, RefreshCcw } from 'lucide-react';
import { useAppOrganization } from '@/contexts/AppOrganizationContext';
import { useRouter } from 'next/navigation';
import { PageHeading } from '@/components/common/PageHeading';
import { usePageTitle } from '@/hooks/usePageTitle';

const ITEMS_PER_PAGE = 10;

export default function IngredientItemsPageWrapper() {
  return (
    <FilterBranchProvider>
      <IngredientItemsPage />
    </FilterBranchProvider>
  );
}

// Renamed original component
function IngredientItemsPage() {
  usePageTitle('Ingredient Items');
  const [items] = useState<IngredientItem[]>(ingredientItems);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  const { activeBranchFilter, setActiveBranchFilter } = useFilterBranch();
  const [filteredItems, setFilteredItems] = useState<IngredientItem[]>(items);
  const { activeEntity } = useAppOrganization();
  const router = useRouter();
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<StockCategory | 'all'>('all');

  // Sync filter with global context when global context changes
  useEffect(() => {
    setActiveBranchFilter(activeEntity.id === 'hq' ? null : activeEntity);
  }, [activeEntity, setActiveBranchFilter]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
  };

  // Filter items when filters change
  useEffect(() => {
    let filtered = items;
    
    // Apply branch filter
    if (activeBranchFilter) {
      filtered = filtered.filter(
        item => !item.branchData || item.branchData[activeBranchFilter.id]
      );
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.sku.toLowerCase().includes(term) ||
        (item.nameLocalized && item.nameLocalized.toLowerCase().includes(term))
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [activeBranchFilter, items, searchTerm, categoryFilter]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  const handleGoToAddPage = () => {
    router.push('/inventory/ingredient-items/add');
  };

  return (
    <Box className="space-y-4">      
      <Flex 
        direction={{ initial: "column", sm: "row" }} 
        justify="between" 
        align={{ initial: "stretch", sm: "center" }}
        gap={{ initial: "4", sm: "0" }}
        mb="5"
      >
        <PageHeading title="Ingredient Items" description="Manage and monitor your ingredient inventory" noMarginBottom />
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
          <Button onClick={handleGoToAddPage}>
            <Plus size={16} />
            Add Item
          </Button>
        </Flex>
      </Flex>
      
      <Flex gap="4" align="center" wrap="wrap" mb="4">
        <Box className="flex-grow min-w-[250px]">
          <TextField.Root
            placeholder="Search by name, SKU, or localized name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          >
            <TextField.Slot>
              <Search size={16} />
            </TextField.Slot>
          </TextField.Root>
        </Box>
        
        <Flex align="center" gap="2" className="flex-shrink-0">
          <Select.Root value={categoryFilter} onValueChange={(value: StockCategory | 'all') => setCategoryFilter(value)}>
            <Select.Trigger placeholder="All Categories" />
            <Select.Content>
              <Select.Item value="all">All Categories</Select.Item>
              <Select.Item value="Vegetables">Vegetables</Select.Item>
              <Select.Item value="Meat">Meat</Select.Item>
              <Select.Item value="Dairy">Dairy</Select.Item>
              <Select.Item value="Fruits">Fruits</Select.Item>
              <Select.Item value="Grains">Grains</Select.Item>
              <Select.Item value="Beverages">Beverages</Select.Item>
              <Select.Item value="Bakery">Bakery</Select.Item>
              <Select.Item value="Seafood">Seafood</Select.Item>
              <Select.Item value="Herbs">Herbs</Select.Item>
              <Select.Item value="Spices">Spices</Select.Item>
              <Select.Item value="Oils">Oils</Select.Item>
              <Select.Item value="Other">Other</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>
        
        <Button 
          variant="soft" 
          color={(categoryFilter !== 'all' || searchTerm !== '') ? 'red' : 'gray'} 
          onClick={handleResetFilters}
          className="flex-shrink-0"
          disabled={(categoryFilter === 'all' && searchTerm === '')}
        >
          <RefreshCcw size={16} />
          Reset Filters
        </Button>
      </Flex>

      {activeBranchFilter ? (
        <Callout.Root color="blue" size="1" mb="4">
          <Callout.Text>
            Viewing ingredient items for <Badge variant="solid">{activeBranchFilter.name}</Badge>. 
            You can edit branch-specific settings by clicking the settings icon in the table (to be added).
          </Callout.Text>
        </Callout.Root>
      ) : (
        <Callout.Root color="gray" size="1" mb="4">
          <Callout.Text>
            Viewing ingredient items from all branches. Use the branch filter to manage branch-specific data.
          </Callout.Text>
        </Callout.Root>
      )}

      <IngredientItemsTable 
        items={paginatedItems} 
      />
      
      {filteredItems.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredItems.length}
          startIndex={startIndex + 1}
          endIndex={Math.min(endIndex, filteredItems.length)}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(newSize) => {
            setItemsPerPage(newSize);
            setCurrentPage(1);
          }}
        />
      )}
    </Box>
  );
}
