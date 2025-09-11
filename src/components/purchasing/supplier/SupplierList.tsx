'use client';

import { useState, useMemo } from 'react';
import { Table, Box, TextField, Select, Flex, Text, Button, Badge, Callout } from '@radix-ui/themes';
import { SearchIcon, FilterIcon, RefreshCcw, ChevronRight } from 'lucide-react';
import { mockSuppliers } from '@/data/SupplierData';
import { ingredientItemCategories } from '@/data/CommonData';
import { formatDate } from '@/utilities';
import { useRouter } from 'next/navigation';
import Pagination from '@/components/common/Pagination';
import SupplierAdvancedSearchDialog from './SupplierAdvancedSearchDialog';
import { SortableHeader } from '@/components/common/SortableHeader';

// Number of items per page
const ITEMS_PER_PAGE = 10;

export default function SupplierList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<any>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredSuppliers = useMemo(() => {
    return mockSuppliers
      .filter(supplier => {
        const matchesSearch = 
          supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = filterCategory === 'all' || supplier.category === filterCategory;
        
        // Apply advanced filters if they exist
        let matchesAdvancedFilters = true;
        if (advancedFilters) {
          // Check for various advanced filters
          if (advancedFilters.contactPerson && !supplier.contactPerson.toLowerCase().includes(advancedFilters.contactPerson.toLowerCase())) {
            matchesAdvancedFilters = false;
          }
          if (advancedFilters.email && !supplier.email.toLowerCase().includes(advancedFilters.email.toLowerCase())) {
            matchesAdvancedFilters = false;
          }
          if (advancedFilters.phone && !supplier.phone.toLowerCase().includes(advancedFilters.phone.toLowerCase())) {
            matchesAdvancedFilters = false;
          }
          if (advancedFilters.address && !supplier.address.toLowerCase().includes(advancedFilters.address.toLowerCase())) {
            matchesAdvancedFilters = false;
          }
          if (advancedFilters.minOrders !== null && supplier.totalOrders < advancedFilters.minOrders) {
            matchesAdvancedFilters = false;
          }
          if (advancedFilters.maxOrders !== null && supplier.totalOrders > advancedFilters.maxOrders) {
            matchesAdvancedFilters = false;
          }
          if (advancedFilters.orderDateFrom) {
            const fromDate = new Date(advancedFilters.orderDateFrom);
            if (supplier.lastOrderDate < fromDate) {
              matchesAdvancedFilters = false;
            }
          }
          if (advancedFilters.orderDateTo) {
            const toDate = new Date(advancedFilters.orderDateTo);
            toDate.setHours(23, 59, 59, 999); // End of the day
            if (supplier.lastOrderDate > toDate) {
              matchesAdvancedFilters = false;
            }
          }
          if (advancedFilters.active !== null && supplier.active !== advancedFilters.active) {
            matchesAdvancedFilters = false;
          }
        }
        
        return matchesSearch && matchesCategory && matchesAdvancedFilters;
      })
      .sort((a, b) => {
        if (!sortConfig) return 0;

        let aValue: any;
        let bValue: any;

        switch (sortConfig.key) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'category':
            aValue = a.category.toLowerCase();
            bValue = b.category.toLowerCase();
            break;
          case 'contactPerson':
            aValue = a.contactPerson.toLowerCase();
            bValue = b.contactPerson.toLowerCase();
            break;
          case 'lastOrderDate':
            aValue = a.lastOrderDate.getTime();
            bValue = b.lastOrderDate.getTime();
            break;
          case 'totalOrders':
            aValue = a.totalOrders;
            bValue = b.totalOrders;
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
  }, [searchTerm, filterCategory, sortConfig, advancedFilters]);

  const handleAdvancedSearch = (filters: any) => {
    setAdvancedFilters(filters);
    setCurrentPage(1); // Reset to first page when applying filters
  };
  
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setAdvancedFilters(null);
    setSortConfig(null);
    setCurrentPage(1);
  };

  const handleViewSupplier = (id: string) => {
    router.push(`/purchasing/suppliers/${id}`);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredSuppliers.length);
  const paginatedSuppliers = filteredSuppliers.slice(startIndex, endIndex);

  return (
    <Box>
      <Flex gap="4" className="mb-4" wrap="wrap">
        <Box className="flex-1 min-w-[240px]">
          <TextField.Root
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          >
            <TextField.Slot>
              <SearchIcon className="h-4 w-4" />
            </TextField.Slot>
          </TextField.Root>
        </Box>
        <Select.Root value={filterCategory} onValueChange={setFilterCategory}>
          <Select.Trigger placeholder="Filter by category" />
          <Select.Content>
            <Select.Item value="all">All Categories</Select.Item>
            {ingredientItemCategories.map(category => (
              <Select.Item key={category} value={category}>{category}</Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        
        <Button 
          variant="soft" 
          color={(filterCategory !== 'all' || searchTerm !== '' || advancedFilters !== null || sortConfig !== null) ? 'red' : 'gray'} 
          onClick={handleResetFilters}
          disabled={(filterCategory === 'all' && searchTerm === '' && advancedFilters === null && sortConfig === null)}
        >
          <RefreshCcw size={16} />
          Reset Filters
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => setIsAdvancedSearchOpen(true)}
        >
          <FilterIcon className="h-4 w-4" />
          Advanced Filters {advancedFilters ? '(Active)' : ''}
        </Button>
      </Flex>

      {/* Show indicator when advanced filters are active */}
      {advancedFilters && (
        <Callout.Root color="orange" size="1" mb="2">
          <Callout.Text className="flex gap-2 align-center">
            Advanced filters are active
            <Button 
              size="1"
              onClick={() => setAdvancedFilters(null)}
            >
              Clear Filters
            </Button>
          </Callout.Text>            
        </Callout.Root>
      )}

      <Box>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="Supplier Name"
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
                  label="Contact Person"
                  sortKey="contactPerson"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Contact Info</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="Last Order Date"
                  sortKey="lastOrderDate"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="Total Orders"
                  sortKey="totalOrders"
                  currentSort={sortConfig}
                  onSort={handleSort}
                  align="right"
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredSuppliers.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={8}>
                  <Text align="center" className="py-4">No suppliers found matching your criteria</Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              paginatedSuppliers.map((supplier) => (
                <Table.Row key={supplier.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800 cursor-pointer align-middle" onClick={() => handleViewSupplier(supplier.id)}>
                  <Table.Cell>{supplier.id}</Table.Cell>
                  <Table.Cell>
                    <Text weight="bold">{supplier.name}</Text>
                    {!supplier.active && 
                    <Box>
                      <Badge color="red">
                        Inactive
                      </Badge>
                    </Box>
                    }
                  </Table.Cell>
                  <Table.Cell>{supplier.category}</Table.Cell>
                  <Table.Cell>{supplier.contactPerson}</Table.Cell>
                  <Table.Cell>
                    <Text className="block">{supplier.phone}</Text>
                    <Text className="block text-blue-500">{supplier.email}</Text>
                  </Table.Cell>
                  <Table.Cell>{formatDate(supplier.lastOrderDate)}</Table.Cell>
                  <Table.Cell align="right">{supplier.totalOrders}</Table.Cell>
                  <Table.Cell>
                    <Button size="1" onClick={(e) => {
                      handleViewSupplier(supplier.id);
                    }}>
                      View
                      <ChevronRight size={14} />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Box>

      {filteredSuppliers.length > 0 && (
        <Box className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredSuppliers.length}
            startIndex={startIndex + 1}
            endIndex={endIndex}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(newSize) => {
              setItemsPerPage(newSize);
              setCurrentPage(1); // Reset to first page when changing items per page
            }}
          />
        </Box>
      )}

      {/* Advanced Search Dialog */}
      <SupplierAdvancedSearchDialog
        open={isAdvancedSearchOpen}
        onOpenChange={setIsAdvancedSearchOpen}
        onSearch={handleAdvancedSearch}
      />
    </Box>
  );
} 