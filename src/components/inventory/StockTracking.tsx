'use client';

import { useState, useEffect, useMemo } from 'react';
import { TextField, Button, Select, Table, Flex, Box } from '@radix-ui/themes';
import { StockCategory, StockStatus, StockItem } from '@/types/inventory';
import { mockStockItems } from '@/data/StockItemData';
import { formatDate } from '@/utilities';
import { Import, Search, RefreshCcw } from 'lucide-react';
import Pagination from '@/components/common/Pagination';
import { SortableHeader } from '@/components/common/SortableHeader';

interface StockTrackingProps {
  stockItems?: StockItem[];
  selectedBranch?: string;
}

export default function StockTracking({ stockItems = mockStockItems }: StockTrackingProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<StockCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<StockStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setStatusFilter('all');
  };

  // Update displayed items when filters or props change
  const displayItems = useMemo(() => {
    let filtered = stockItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortConfig.key) {
          case 'name':
            aValue = a.name;
            bValue = b.name;
            break;
          case 'sku':
            aValue = a.sku;
            bValue = b.sku;
            break;
          case 'category':
            aValue = a.category;
            bValue = b.category;
            break;
          case 'quantity':
            aValue = a.quantity;
            bValue = b.quantity;
            break;
          case 'reorderLevel':
            aValue = a.reorderLevel;
            bValue = b.reorderLevel;
            break;
          case 'lastRestocked':
            aValue = new Date(a.lastRestockedDate).getTime();
            bValue = new Date(b.lastRestockedDate).getTime();
            break;
          case 'expires':
            aValue = a.expirationDate ? new Date(a.expirationDate).getTime() : 0;
            bValue = b.expirationDate ? new Date(b.expirationDate).getTime() : 0;
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
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
  }, [searchTerm, categoryFilter, statusFilter, stockItems, sortConfig]);

  const totalItems = displayItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = displayItems.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Box className="space-y-4">
      <Flex justify="between" align="center">
        <Flex gap="4" wrap="wrap">
          <Box className="flex-grow min-w-[250px]">
            <TextField.Root
              placeholder="Search items or suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            >
              <TextField.Slot>
                <Search size={16} />
              </TextField.Slot>
            </TextField.Root>
          </Box>
          <Select.Root
            value={categoryFilter}
            onValueChange={(value: StockCategory | 'all') => setCategoryFilter(value)}
          >
            <Select.Trigger placeholder="Category" />
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
              <Select.Item value="Other">Other</Select.Item>
            </Select.Content>
          </Select.Root>
          <Select.Root
            value={statusFilter}
            onValueChange={(value: StockStatus | 'all') => setStatusFilter(value)}
          >
            <Select.Trigger placeholder="Status" />
            <Select.Content>
              <Select.Item value="all">All Status</Select.Item>
              <Select.Item value="In Stock">In Stock</Select.Item>
              <Select.Item value="Low Stock">Low Stock</Select.Item>
              <Select.Item value="Out of Stock">Out of Stock</Select.Item>
            </Select.Content>
          </Select.Root>
          
          <Button 
            variant="soft" 
            color={(categoryFilter !== 'all' || statusFilter !== 'all' || searchTerm !== '') ? 'red' : 'gray'} 
            onClick={resetFilters}
            className="flex-shrink-0"
            disabled={(categoryFilter === 'all' && statusFilter === 'all' && searchTerm === '')}
          >
            <RefreshCcw size={16} />
            Reset Filters
          </Button>
        </Flex>
        <Flex gap="2" align="center">
          <Button variant="outline">
            <Import size={16} />
            Import
          </Button>
        </Flex>
      </Flex>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Item Name"
                sortKey="name"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="SKU"
                sortKey="sku"
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
                label="Qty."
                sortKey="quantity"
                currentSort={sortConfig}
                onSort={handleSort}
                align="right"
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Storage Unit</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Reorder Level"
                sortKey="reorderLevel"
                currentSort={sortConfig}
                onSort={handleSort}
                align="right"
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Last Restocked"
                sortKey="lastRestocked"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Expires"
                sortKey="expires"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Status"
                sortKey="status"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-right">Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell className="font-medium">{item.name}</Table.Cell>
                <Table.Cell>{item.sku}</Table.Cell>
                <Table.Cell>{item.category}</Table.Cell>
                <Table.Cell className="text-right">{item.quantity}</Table.Cell>
                <Table.Cell>{item.storageUnit}</Table.Cell>
                <Table.Cell className="text-right">{item.reorderLevel}</Table.Cell>
                <Table.Cell>{formatDate(item.lastRestockedDate)}</Table.Cell>
                <Table.Cell>
                  {formatDate(item.expirationDate) || 'N/A'}
                </Table.Cell>
                <Table.Cell>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-nowrap
                    ${item.status === 'In Stock' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                    item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
                    {item.status}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Flex justify="end" gap="2">
                    <Button size="1">
                      Order
                    </Button>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={10} align="center" className="py-6 text-gray-500">
                No items found matching your filters
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
      
      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          startIndex={startIndex + 1}
          endIndex={endIndex}
          onPageChange={handlePageChange}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value);
            setCurrentPage(1);
          }}
        />
      )}
    </Box>
  );
} 