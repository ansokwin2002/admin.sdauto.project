'use client';

import React, { useState, useMemo } from 'react';
import { Badge, Box, Button, Flex, Select, Table, Text, TextField, IconButton } from '@radix-ui/themes';
import { Edit, RefreshCcw, Search } from 'lucide-react';
import { mockRoles } from '@/data/RolesPermissionsData';
import { useRouter } from 'next/navigation';
import Pagination from '@/components/common/Pagination';

export default function RoleList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [accessScopeFilter, setAccessScopeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const router = useRouter();

  // Check if any filter is active
  const isFilterActive = searchTerm !== '' || accessScopeFilter !== 'all';

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setAccessScopeFilter('all');
    setCurrentPage(1);
  };

  // Filter roles based on search term and filters
  const filteredRoles = useMemo(() => {
    return mockRoles.filter(role => {
      // Search term filter (name or description)
      const matchesSearch = 
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Access Scope filter
      const matchesAccessScope = accessScopeFilter === 'all' || role.accessScope === accessScopeFilter;
      
      return matchesSearch && matchesAccessScope;
    });
  }, [searchTerm, accessScopeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRoles = filteredRoles.slice(startIndex, endIndex);

  // Handle edit role button click
  const handleEditRole = (roleId: string) => {
    router.push(`/admin-settings/roles-permissions/${roleId}`);
  };

  return (
    <Box>
      <Flex direction="column" gap="4">
        {/* Search and filters */}
        <Flex gap="4" align="center" justify="between">
          <Flex gap="4" align="center" style={{ flex: 1 }}>
            <Box style={{ flexGrow: 1 }}>
              <TextField.Root placeholder="Search by role name or description..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              >
                <TextField.Slot>
                  <Search size={16} className="text-gray-400" />
                </TextField.Slot>
              </TextField.Root>
            </Box>
            
            <Box>
              <Select.Root 
                value={accessScopeFilter} 
                onValueChange={setAccessScopeFilter}
              >
                <Select.Trigger placeholder="Access Scope" />
                <Select.Content>
                  <Select.Item value="all">All Scopes</Select.Item>
                  <Select.Item value="HQ">HQ</Select.Item>
                  <Select.Item value="Region">Region</Select.Item>
                  <Select.Item value="Branch">Branch</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
            
            <Button 
              onClick={handleResetFilters} 
              color={isFilterActive ? "red" : "gray"} 
              variant="soft" 
              disabled={!isFilterActive}
            >
              <RefreshCcw size={16} />
              Reset Filters
            </Button>
          </Flex>
        </Flex>
        
        {/* Roles list table */}
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Role Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Assigned Users</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Access Level</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="center">Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          
          <Table.Body>
            {paginatedRoles.length > 0 ? (
              paginatedRoles.map(role => (
                <Table.Row key={role.id} className="cursor-pointer align-middle hover:bg-gray-50 dark:hover:bg-neutral-800" onClick={() => handleEditRole(role.id)}>
                  <Table.Cell>
                    <Text weight="medium" as="div">{role.name}</Text>
                  </Table.Cell>
                  <Table.Cell>{role.description}</Table.Cell>
                  <Table.Cell>{role.assignedUsers}</Table.Cell>
                  <Table.Cell>
                    <Badge color={
                      role.accessScope === 'HQ' ? 'blue' : 
                      role.accessScope === 'Region' ? 'purple' : 
                      'green'
                    }>
                      {role.accessScope}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell align="center">
                    <Flex gap="3" justify="center">
                      <IconButton 
                        variant="ghost" 
                        size="1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditRole(role.id);
                        }}
                      >
                        <Edit size={14} />
                      </IconButton>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={5}>
                  <Text align="center" color="gray">No roles found matching your filters</Text>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
        
        {/* Pagination */}
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredRoles.length}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(newSize) => {
            setItemsPerPage(newSize);
            setCurrentPage(1);
          }}
        />
      </Flex>
    </Box>
  );
} 