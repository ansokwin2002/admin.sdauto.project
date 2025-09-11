'use client';

import React, { useState, useMemo } from 'react';
import { Badge, Box, Button, Flex, Select, Table, Text, TextField } from '@radix-ui/themes';
import { Edit, Plus, Search, X } from 'lucide-react';
import { mockBranches, regions } from '@/data/BranchData';
import { useRouter } from 'next/navigation';
import Pagination from '@/components/common/Pagination';
import { SortableHeader } from '@/components/common/SortableHeader';

export default function BranchList({ handleAddBranch }: { handleAddBranch: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const router = useRouter();

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Check if any filter is active
  const isFilterActive = searchTerm !== '' || 
    statusFilter !== 'all' || 
    regionFilter !== 'all' || 
    serviceFilter !== 'all' ||
    sortConfig !== null;

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setRegionFilter('all');
    setServiceFilter('all');
    setSortConfig(null);
    setCurrentPage(1);
  };

  // Filter branches based on search term and filters
  const filteredBranches = useMemo(() => {
    return mockBranches
      .filter(branch => {
        // Search term filter
        const matchesSearch = 
          branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          branch.region.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Status filter
        const matchesStatus = 
          statusFilter === 'all' || 
          (statusFilter === 'active' && branch.status === 'active') ||
          (statusFilter === 'inactive' && branch.status === 'inactive');
        
        // Region filter
        const matchesRegion = regionFilter === 'all' || branch.region === regionFilter;
        
        // Service filter
        const matchesService = 
          serviceFilter === 'all' || 
          (serviceFilter === 'dineIn' && branch.services.dineIn) ||
          (serviceFilter === 'takeaway' && branch.services.takeaway) ||
          (serviceFilter === 'delivery' && branch.services.delivery);
        
        return matchesSearch && matchesStatus && matchesRegion && matchesService;
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
          case 'region':
            aValue = a.region.toLowerCase();
            bValue = b.region.toLowerCase();
            break;
          case 'status':
            aValue = a.status.toLowerCase();
            bValue = b.status.toLowerCase();
            break;
          case 'manager':
            aValue = a.manager?.name?.toLowerCase() || '';
            bValue = b.manager?.name?.toLowerCase() || '';
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
  }, [searchTerm, statusFilter, regionFilter, serviceFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBranches = filteredBranches.slice(startIndex, startIndex + itemsPerPage);

  // Handle edit button click
  const handleEditBranch = (branchId: string) => {
    router.push(`/admin-settings/organization/branch/${branchId}`);
  };

  return (
    <Box>
      <Flex direction="column" gap="4">
        <Flex 
          direction={{ initial: "column", sm: "row" }}
          justify="between" 
          align={{ initial: "stretch", sm: "center" }}
          gap={{ initial: "4", sm: "0" }}
        >
          {/* Search and filters */}
          <Flex 
            direction={{ initial: "column", sm: "row" }}
            gap={{ initial: "3", sm: "4" }}
            align={{ initial: "stretch", sm: "center" }}
            wrap="wrap"
          >
            <Box className="w-full sm:w-auto">
              <TextField.Root placeholder="Search branches..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              >
                <TextField.Slot>
                  <Search size={16} className="text-gray-400" />
                </TextField.Slot>
              </TextField.Root>
            </Box>
            
            <Flex 
              gap={{ initial: "3", sm: "4" }}
              align={{ initial: "stretch", sm: "center" }}
              className="w-full sm:w-auto"
            >
              <Box className="w-full sm:w-auto">
                <Select.Root 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <Select.Trigger placeholder="Status" className="w-full" />
                  <Select.Content>
                    <Select.Item value="all">All Status</Select.Item>
                    <Select.Item value="active">Active</Select.Item>
                    <Select.Item value="inactive">Inactive</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>
              
              <Box className="w-full sm:w-auto">
                <Select.Root 
                  value={regionFilter} 
                  onValueChange={setRegionFilter}
                >
                  <Select.Trigger placeholder="Region" className="w-full" />
                  <Select.Content>
                    <Select.Item value="all">All Regions</Select.Item>
                    {regions.map(region => (
                      <Select.Item key={region} value={region}>{region}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Box>
              
              <Box className="w-full sm:w-auto">
                <Select.Root 
                  value={serviceFilter} 
                  onValueChange={setServiceFilter}
                >
                  <Select.Trigger placeholder="Services" className="w-full" />
                  <Select.Content>
                    <Select.Item value="all">All Services</Select.Item>
                    <Select.Item value="dineIn">Dine-in</Select.Item>
                    <Select.Item value="takeaway">Takeaway</Select.Item>
                    <Select.Item value="delivery">Delivery</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>
            </Flex>
            
            <Button 
              onClick={handleResetFilters} 
              color={isFilterActive ? "red" : "gray"} 
              variant="soft" 
              disabled={!isFilterActive}
              className="w-full sm:w-auto"
            >
              <X size={16} />
              Reset Filters
            </Button>
          </Flex>

          {/* Add Branch */}
          <Button 
            onClick={handleAddBranch}
            className="w-full sm:w-auto"
          >
            <Plus size={16} />
            Add Branch
          </Button>
        </Flex>

        {/* Branch list table */}
        <div className="overflow-x-auto">
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>
                  <SortableHeader
                    label="Branch Name"
                    sortKey="name"
                    currentSort={sortConfig}
                    onSort={handleSort}
                  />
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  <SortableHeader
                    label="Region"
                    sortKey="region"
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
                <Table.ColumnHeaderCell>
                  <SortableHeader
                    label="Manager"
                    sortKey="manager"
                    currentSort={sortConfig}
                    onSort={handleSort}
                  />
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Services</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            
            <Table.Body>
              {paginatedBranches.length > 0 ? (
                paginatedBranches.map(branch => (
                  <Table.Row key={branch.id} className="align-middle cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800" onClick={() => handleEditBranch(branch.id)}>
                    <Table.Cell>
                      <Text weight="medium" as="div">{branch.name}</Text>
                      <Text size="1" color="gray" as="div">Code: {branch.code}</Text>
                    </Table.Cell>
                    <Table.Cell>{branch.region}</Table.Cell>
                    <Table.Cell>
                      <Badge color={branch.status === 'active' ? 'green' : 'gray'} size="1" className="capitalize">{branch.status}</Badge>
                    </Table.Cell>
                    <Table.Cell>
                      {branch.manager ? branch.manager.name : 'Unassigned'}
                    </Table.Cell>
                    <Table.Cell>
                      <Flex gap="1" wrap="wrap">
                        {branch.services.dineIn && <Badge color="blue" size="1">Dine-in</Badge>}
                        {branch.services.takeaway && <Badge color="purple" size="1">Takeaway</Badge>}
                        {branch.services.delivery && <Badge color="orange" size="1">Delivery</Badge>}
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      <Button 
                        variant="soft" 
                        size="1"
                        onClick={() => handleEditBranch(branch.id)}
                      >
                        <Edit size={14} />
                        Edit
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={6}>
                    <Text align="center" color="gray">No branches found matching your filters</Text>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
          
          {/* Pagination */}
          {filteredBranches.length > itemsPerPage && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredBranches.length}
              startIndex={startIndex}
              endIndex={endIndex}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(newSize) => {
                setItemsPerPage(newSize);
                setCurrentPage(1);
              }}
            />
          )}
        </div>
      </Flex>
    </Box>
  );
} 