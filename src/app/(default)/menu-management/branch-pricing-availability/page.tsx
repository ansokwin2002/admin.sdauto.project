'use client';

import { useState, useMemo } from 'react';
import { Box, Table, Button, Flex, Switch, TextField, Select } from '@radix-ui/themes';
import { Search, Settings } from 'lucide-react';
import { FilterBranchProvider } from '@/contexts/FilterBranchContext';
import Pagination from '@/components/common/Pagination';
import BranchPriceDialog from '@/components/menu-management/branch-pricing/BranchPriceDialog';
import { menuCategories, menuItems } from '@/data/MenuData';
import { formatCurrency } from '@/utilities';
import { PageHeading } from '@/components/common/PageHeading';
import { usePageTitle } from '@/hooks/usePageTitle';
import { SortableHeader } from '@/components/common/SortableHeader';

interface BranchPricing {
  itemId: string;
  basePrice: number;
  branchPrice: number;
  isAvailable: boolean;
  branchSpecificPrices?: { [branchId: string]: number };
}

function BranchPricingContent() {
  usePageTitle('Branch Pricing & Availability');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [branchPricing, setBranchPricing] = useState<BranchPricing[]>(
    menuItems.map(item => ({
      itemId: item.id,
      basePrice: item.price,
      branchPrice: item.price,
      isAvailable: true,
      branchSpecificPrices: item.branchPrices
    }))
  );
  const [selectedItemForPricing, setSelectedItemForPricing] = useState<BranchPricing | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = branchPricing.filter(item => {
      const menuItem = menuItems.find(mi => mi.id === item.itemId);
      if (!menuItem) return false;

      const matchesSearch = searchTerm === '' || 
        menuItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        menuCategories.find(c => c.id === menuItem.category)?.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || menuItem.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const menuItemA = menuItems.find(mi => mi.id === a.itemId);
        const menuItemB = menuItems.find(mi => mi.id === b.itemId);
        
        if (!menuItemA || !menuItemB) return 0;

        let aValue: any;
        let bValue: any;

        switch (sortConfig.key) {
          case 'name':
            aValue = menuItemA.name;
            bValue = menuItemB.name;
            break;
          case 'category':
            aValue = menuCategories.find(c => c.id === menuItemA.category)?.name;
            bValue = menuCategories.find(c => c.id === menuItemB.category)?.name;
            break;
          case 'basePrice':
            aValue = a.basePrice;
            bValue = b.basePrice;
            break;
          case 'branchPrices':
            const aPrices = Object.values(a.branchSpecificPrices || {});
            const bPrices = Object.values(b.branchSpecificPrices || {});
            aValue = aPrices.length > 0 ? Math.min(...aPrices) : 0;
            bValue = bPrices.length > 0 ? Math.min(...bPrices) : 0;
            break;
          case 'isAvailable':
            aValue = a.isAvailable;
            bValue = b.isAvailable;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [branchPricing, searchTerm, selectedCategory, sortConfig]);

  // Calculate pagination
  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  const handleAvailabilityToggle = (itemId: string) => {
    setBranchPricing(prev => 
      prev.map(item => 
        item.itemId === itemId 
          ? { ...item, isAvailable: !item.isAvailable }
          : item
      )
    );
  };

  const handleSaveBranchPrices = (itemId: string, branchPrices: { [branchId: string]: number }) => {
    setBranchPricing(prev => 
      prev.map(item => 
        item.itemId === itemId 
          ? { ...item, branchSpecificPrices: branchPrices }
          : item
      )
    );
  };
  
  const showBranchPrices = (item: BranchPricing) => {
    if (item.branchSpecificPrices) {
      const prices = Object.values(item.branchSpecificPrices);
      if (prices.length > 0) {
        return `${formatCurrency(Math.min(...prices))} - ${formatCurrency(Math.max(...prices))}`;
      } else {
        return null;
      }
    }
    return null;
  };

  return (
    <Box className="space-y-4">
      <PageHeading title="Branch Pricing & Availability" description="Manage menu pricing and availability by branch" />

      <Flex gap="4" align="center">
        <Box style={{ width: '300px' }}>
          <TextField.Root
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          >
            <TextField.Slot>
              <Search size={16} />
            </TextField.Slot>
          </TextField.Root>
        </Box>
        <Select.Root value={selectedCategory} onValueChange={setSelectedCategory}>
          <Select.Trigger placeholder="All Categories" />
          <Select.Content>
            <Select.Item value="all">All Categories</Select.Item>
            {menuCategories.map(category => (
              <Select.Item key={category.id} value={category.id}>
                {category.name}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Menu Name"
                sortKey="name"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Category"
                sortKey="category"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Base Price"
                sortKey="basePrice"
                currentSort={sortConfig}
                onSort={handleSort}
                align="right"
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Branch Prices"
                sortKey="branchPrices"
                currentSort={sortConfig}
                onSort={handleSort}
                align="right"
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Manage Branch Prices</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Availability"
                sortKey="isAvailable"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {paginatedItems.map((item) => {
            const menuItem = menuItems.find(mi => mi.id === item.itemId);

            return (
              <Table.Row key={item.itemId} className="align-middle">
                <Table.Cell>
                  <Flex align="center" gap="2">
                    {menuItem?.name}
                  </Flex>
                </Table.Cell>
                <Table.Cell>{menuCategories.find(c => c.id === menuItem?.category)?.name}</Table.Cell>
                <Table.Cell align="right">
                  ${item.basePrice.toFixed(2)}
                </Table.Cell>
                <Table.Cell align="right">
                  {showBranchPrices(item)}
                </Table.Cell>
                <Table.Cell>
                  <Button 
                    size="1"
                    onClick={() => setSelectedItemForPricing(item)}
                  >
                    <Settings size={16} />
                    Manage Prices
                  </Button>
                </Table.Cell>
                <Table.Cell>
                  <Switch
                    size="1"
                    color="green"
                    checked={item.isAvailable}
                    onCheckedChange={() => handleAvailabilityToggle(item.itemId)}
                  />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>

      {selectedItemForPricing && (
        <BranchPriceDialog
          open={!!selectedItemForPricing}
          onOpenChange={(open) => !open && setSelectedItemForPricing(null)}
          item={selectedItemForPricing}
          menuItem={menuItems.find(mi => mi.id === selectedItemForPricing.itemId)!}
          onSave={handleSaveBranchPrices}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value);
          setCurrentPage(1);
        }}
      />
    </Box>
  );
}

export default function BranchPricingPage() {
  return (
    <FilterBranchProvider>
      <BranchPricingContent />
    </FilterBranchProvider>
  );
}
