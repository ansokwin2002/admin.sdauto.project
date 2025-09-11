import { Box, Button, Flex, Table, Text, Badge, TextField, Select, IconButton } from '@radix-ui/themes';
import { Search, AlertCircle, RefreshCcw, Utensils, Edit, Trash2 } from 'lucide-react';
import { MenuItem, menuCategories } from '@/data/MenuData';
import { organization } from '@/data/CommonData';
import Image from 'next/image';
import Pagination from '@/components/common/Pagination';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { SortableHeader } from '@/components/common/SortableHeader';
import { useState } from 'react';
import Link from 'next/link';

interface MenuListProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filteredMenuItems: MenuItem[];
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (item: MenuItem) => void;
  categoryFilter?: string;
  statusFilter?: string;
  availabilityFilter?: string;
  onCategoryFilterChange?: (value: string) => void;
  onStatusFilterChange?: (value: string) => void;
  onAvailabilityFilterChange?: (value: string) => void;
  onResetFilters?: () => void;
}

export default function MenuList({
  searchTerm,
  onSearchChange,
  filteredMenuItems,
  onEditItem,
  onDeleteItem,
  categoryFilter = 'all',
  statusFilter = 'all',
  availabilityFilter = 'all',
  onCategoryFilterChange = () => {},
  onStatusFilterChange = () => {},
  onAvailabilityFilterChange = () => {},
  onResetFilters = () => {},
}: MenuListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const availableBranches = organization.filter(b => b.id !== "hq");

  // Calculate pagination values
  const totalItems = filteredMenuItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredMenuItems.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleDeleteClick = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      onDeleteItem(itemToDelete);
      setItemToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };

  // Sort items based on sortConfig
  const sortedItems = [...currentItems].sort((a, b) => {
    if (!sortConfig) return 0;

    let aValue = a[sortConfig.key as keyof MenuItem];
    let bValue = b[sortConfig.key as keyof MenuItem];

    if (sortConfig.key === 'price') {
      aValue = a.price;
      bValue = b.price;
    } else if (sortConfig.key === 'availableBranchesIds') {
      aValue = a.availableBranchesIds.length;
      bValue = b.availableBranchesIds.length;
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return (
    <Box className="mt-6 space-y-4">
      <Flex gap="4" align="center" wrap="wrap">
        <Box className="flex-grow min-w-[250px]">
          <TextField.Root
            type="text"
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          >
            <TextField.Slot>
              <Search size={16} />
            </TextField.Slot>
          </TextField.Root>
        </Box>

        <Flex align="center" gap="2" className="flex-shrink-0">
          <Select.Root value={categoryFilter} onValueChange={onCategoryFilterChange}>
            <Select.Trigger placeholder="All Categories" />
            <Select.Content>
              <Select.Item value="all">All Categories</Select.Item>
              {menuCategories.map(category => (
                <Select.Item key={category.id} value={category.id}>{category.name}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>

        <Flex align="center" gap="2" className="flex-shrink-0">
          <Select.Root value={statusFilter} onValueChange={onStatusFilterChange}>
            <Select.Trigger placeholder="All Statuses" />
            <Select.Content>
              <Select.Item value="all">All Statuses</Select.Item>
              <Select.Item value="active">Active</Select.Item>
              <Select.Item value="inactive">Inactive</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>

        <Flex align="center" gap="2" className="flex-shrink-0">
          <Select.Root value={availabilityFilter} onValueChange={onAvailabilityFilterChange}>
            <Select.Trigger placeholder="All Availability" />
            <Select.Content>
              <Select.Item value="all">All Availability</Select.Item>
              <Select.Item value="all_branches">All Branches</Select.Item>
              <Select.Item value="some_branches">Some Branches</Select.Item>
              <Select.Item value="not_available">Not Available</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>

        <Button 
          variant="soft" 
          color={(categoryFilter !== 'all' || statusFilter !== 'all' || availabilityFilter !== 'all' || searchTerm !== '') ? 'red' : 'gray'} 
          onClick={onResetFilters}
          className="flex-shrink-0"
          disabled={(categoryFilter === 'all' && statusFilter === 'all' && availabilityFilter === 'all' && searchTerm === '')}
        >
          <RefreshCcw size={16} />
          Reset Filters
        </Button>
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
            <Table.ColumnHeaderCell align="right">
              <SortableHeader
                label="Base Price"
                sortKey="price"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Status"
                sortKey="isActive"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Availability"
                sortKey="availableBranchesIds"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Seasonal?"
                sortKey="isSeasonal"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell align="right">Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedItems.map((item) => (
            <Table.Row key={item.id} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-neutral-800" onClick={() => onEditItem(item)}>
              <Table.Cell>
                <Flex align="center" gap="2">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl} 
                      alt={item.name} 
                      width={32} 
                      height={32}
                      className="rounded object-cover w-5 h-5"
                    />
                  ) : (
                    <Flex align="center" justify="center" className="w-5 h-5 rounded bg-slate-200 dark:bg-neutral-600">
                      <Utensils size={12} className="text-gray-500 dark:text-gray-300" />
                    </Flex>
                  )}
                  {item.stockWarning && <AlertCircle size={16} className="text-amber-500" />}
                  {item.name}
                </Flex>
              </Table.Cell>
              <Table.Cell>
                {menuCategories.find(cat => cat.id === item.category)?.name}
              </Table.Cell>
              <Table.Cell align="right">${item.price.toFixed(2)}</Table.Cell>
              <Table.Cell>
                <Badge color={item.isActive ? 'green' : 'gray'} variant="soft">
                  {item.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                {item.availableBranchesIds.length === 0 ? (
                  <Badge color="red" variant="soft">Not Available</Badge>
                ) : item.availableBranchesIds.length === availableBranches.length ? (
                  <Badge color="green" variant="soft">All Branches</Badge>
                ) : (
                  <Badge color="amber" variant="soft">
                    {item.availableBranchesIds.length} of {availableBranches.length} Branches
                  </Badge>
                )}
              </Table.Cell>
              <Table.Cell>
                {item.isSeasonal ? (
                  <Text>Yes</Text>
                ) : (
                  <Text>No</Text>
                )}
              </Table.Cell>
              <Table.Cell align="right">
                <Flex gap="3" justify="end">
                  <Link href={`/menu-management/menu/${item.id}`}>
                    <IconButton 
                      variant="ghost" 
                      size="1"
                      color="gray"
                    >
                      <Edit size={14} />
                    </IconButton>
                  </Link>
                  <IconButton 
                    variant="ghost" 
                    color="red" 
                    size="1" 
                    onClick={(e) => handleDeleteClick(e, item)}
                  >
                    <Trash2 size={14} />
                  </IconButton>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      
      {filteredMenuItems.length === 0 ? (
        <Box className="py-8 text-center">
          <Text size="3" color="gray">No menu items found matching your search criteria.</Text>
        </Box>
      ) : (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Menu Item"
        description={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        color="red"
      />
    </Box>
  );
} 