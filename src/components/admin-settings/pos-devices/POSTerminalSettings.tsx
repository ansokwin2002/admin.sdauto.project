'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Card,
  Dialog,
  Flex, 
  Select,
  Switch,
  Table, 
  Text, 
  TextField,
  Badge,
  Separator,
  Code
} from '@radix-ui/themes';
import { Check, Edit, Plus, RefreshCcw, Save, Search, X } from 'lucide-react';
import Pagination from '@/components/common/Pagination';

// Mock data for terminals
const mockTerminals = [
  {
    id: "TERM001",
    name: "Main Counter 1",
    deviceId: "POS-HQ-001",
    branch: "HQ Branch",
    usage: "Dine-in",
    status: "active",
    isDefault: true,
    offlineMode: true
  },
  {
    id: "TERM002",
    name: "Main Counter 2",
    deviceId: "POS-HQ-002",
    branch: "HQ Branch",
    usage: "Takeaway",
    status: "active",
    isDefault: false,
    offlineMode: true
  },
  {
    id: "TERM003",
    name: "Downtown Terminal",
    deviceId: "POS-DT-001",
    branch: "Downtown Branch",
    usage: "Dine-in",
    status: "inactive",
    isDefault: true,
    offlineMode: false
  },
  {
    id: "TERM004",
    name: "Delivery Station",
    deviceId: "POS-HQ-003",
    branch: "HQ Branch",
    usage: "Delivery",
    status: "active",
    isDefault: false,
    offlineMode: false
  }
];

// Mock branches
const mockBranches = [
  { id: "branch1", name: "HQ Branch" },
  { id: "branch2", name: "Downtown Branch" },
  { id: "branch3", name: "Mall Branch" }
];

export default function POSTerminalSettings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [usageFilter, setUsageFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTerminal, setEditingTerminal] = useState<any>(null);

  // Check if any filter is active
  const isFilterActive = searchTerm !== '' || 
    branchFilter !== 'all' || 
    statusFilter !== 'all' || 
    usageFilter !== 'all';

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setBranchFilter('all');
    setStatusFilter('all');
    setUsageFilter('all');
    setCurrentPage(1);
  };

  // Filter terminals based on filters
  const filteredTerminals = mockTerminals.filter(terminal => {
    // Search term filter
    const matchesSearch = 
      terminal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      terminal.deviceId.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      statusFilter === 'all' || terminal.status === statusFilter;
    
    // Branch filter
    const matchesBranch = branchFilter === 'all' || terminal.branch === branchFilter;
    
    // Usage filter
    const matchesUsage = usageFilter === 'all' || terminal.usage === usageFilter;
    
    return matchesSearch && matchesStatus && matchesBranch && matchesUsage;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredTerminals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredTerminals.length);
  const paginatedTerminals = filteredTerminals.slice(startIndex, endIndex);

  // Open dialog to add new terminal
  const handleAddTerminal = () => {
    setEditingTerminal({
      id: "",
      name: "",
      deviceId: `POS-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      branch: "",
      usage: "Dine-in",
      status: "active",
      isDefault: false,
      offlineMode: false
    });
    setIsDialogOpen(true);
  };

  // Open dialog to edit terminal
  const handleEditTerminal = (terminal: any) => {
    setEditingTerminal({...terminal});
    setIsDialogOpen(true);
  };

  // Handle form save
  const handleSaveTerminal = () => {
    // In a real app, this would save to the database
    console.log('Saving terminal:', editingTerminal);
    setIsDialogOpen(false);
  };

  return (
    <Box>
      <Flex direction="column" gap="4">
        <Flex 
          direction={{ initial: "column", sm: "row" }}
          justify={{ initial: "start", sm: "between" }}
          align={{ initial: "stretch", sm: "center" }}
          gap={{ initial: "3", sm: "0" }}
        >
          <Flex 
            direction={{ initial: "column", sm: "row" }}
            gap={{ initial: "3", sm: "3" }}
            align={{ initial: "stretch", sm: "center" }}
            className="w-full sm:w-auto"
          >
            <Box className="w-full sm:w-auto sm:flex-grow">
              <TextField.Root placeholder="Search terminals..." 
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
              direction={{ initial: "row", sm: "row" }}
              gap={{ initial: "2", sm: "3" }}
              align="center"
              wrap="wrap"
            >
              <Select.Root 
                value={branchFilter} 
                onValueChange={setBranchFilter}
              >
                <Select.Trigger placeholder="Branch" />
                <Select.Content>
                  <Select.Item value="all">All Branches</Select.Item>
                  {mockBranches.map(branch => (
                    <Select.Item key={branch.id} value={branch.name}>{branch.name}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              
              <Select.Root 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <Select.Trigger placeholder="Status" />
                <Select.Content>
                  <Select.Item value="all">All Status</Select.Item>
                  <Select.Item value="active">Active</Select.Item>
                  <Select.Item value="inactive">Inactive</Select.Item>
                </Select.Content>
              </Select.Root>
              
              <Select.Root 
                value={usageFilter} 
                onValueChange={setUsageFilter}
              >
                <Select.Trigger placeholder="Usage" />
                <Select.Content>
                  <Select.Item value="all">All Usage</Select.Item>
                  <Select.Item value="Dine-in">Dine-in</Select.Item>
                  <Select.Item value="Takeaway">Takeaway</Select.Item>
                  <Select.Item value="Delivery">Delivery</Select.Item>
                </Select.Content>
              </Select.Root>
              
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
          
          {/* Add Terminal Button */}
          <Button onClick={handleAddTerminal} className="w-full sm:w-auto">
            <Plus size={16} />
            Register New Terminal
          </Button>
        </Flex>
        
        {/* Terminals Table */}
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Terminal Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Device ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Assigned Branch</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Usage</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          
          <Table.Body>
            {paginatedTerminals.length > 0 ? (
              paginatedTerminals.map(terminal => (
                <Table.Row key={terminal.id} className="align-middle cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800" onClick={() => handleEditTerminal(terminal)}>
                  <Table.Cell>
                    <Text weight="medium">{terminal.name}</Text>
                    {terminal.isDefault && (
                      <Badge size="1" color="green" ml="2">Default</Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell><Code color="gray">{terminal.deviceId}</Code></Table.Cell>
                  <Table.Cell>{terminal.branch}</Table.Cell>
                  <Table.Cell>
                    <Badge 
                      color={
                        terminal.usage === 'Dine-in' ? 'blue' : 
                        terminal.usage === 'Takeaway' ? 'purple' : 
                        'orange'
                      } 
                      size="1"
                    >
                      {terminal.usage}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge 
                      color={terminal.status === 'active' ? 'green' : 'gray'} 
                      size="1"
                    >
                      {terminal.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap="2">
                      <Button 
                        variant="outline" 
                        size="1"
                        onClick={() => handleEditTerminal(terminal)}
                      >
                        <Edit size={14} />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        color={terminal.status === 'active' ? 'red' : 'green'} 
                        size="1"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Deactivating terminal:', terminal.id);
                        }}
                      >
                        {terminal.status === 'active' ? 
                          <>
                            <X size={14} />
                            Deactivate
                          </>
                        : 
                          <>
                            <Check size={14} />
                            Activate
                          </>
                        }
                      </Button>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={6}>
                  <Text align="center" color="gray">No terminals found matching your filters</Text>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
        
        {/* Pagination */}
        {filteredTerminals.length > itemsPerPage && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredTerminals.length}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(newSize) => {
              setItemsPerPage(newSize);
              setCurrentPage(1);
            }}
          />
        )}
      </Flex>
     

      {/* Add/Edit Terminal Dialog */}
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Content style={{ maxWidth: 500 }}>
          <Flex justify="between">
            <Dialog.Title>{editingTerminal?.id ? 'Edit Terminal' : 'Register New Terminal'}</Dialog.Title>
            <Dialog.Close>
              <Button color="gray" variant="ghost">
                <X size={16} />
              </Button>
            </Dialog.Close>
          </Flex>
          
          <Flex direction="column" gap="3" mt="4">
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Terminal Name</Text>
              <TextField.Root 
                placeholder="Enter terminal name" 
                value={editingTerminal?.name || ''}
                onChange={(e) => setEditingTerminal({...editingTerminal, name: e.target.value})}
              />
            </Flex>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Device ID</Text>
              <TextField.Root 
                placeholder="Auto-generated" 
                value={editingTerminal?.deviceId || ''}
                disabled
              />
              <Text size="1" color="gray">Unique identifier automatically generated</Text>
            </Flex>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Branch</Text>
              <Select.Root 
                value={editingTerminal?.branch || ''} 
                onValueChange={(value) => setEditingTerminal({...editingTerminal, branch: value})}
              >
                <Select.Trigger placeholder="Select branch" />
                <Select.Content>
                  {mockBranches.map(branch => (
                    <Select.Item key={branch.id} value={branch.name}>{branch.name}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Flex>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Usage Type</Text>
              <Select.Root 
                value={editingTerminal?.usage || ''} 
                onValueChange={(value) => setEditingTerminal({...editingTerminal, usage: value})}
              >
                <Select.Trigger placeholder="Select usage" />
                <Select.Content>
                  <Select.Item value="Dine-in">Dine-in</Select.Item>
                  <Select.Item value="Takeaway">Takeaway</Select.Item>
                  <Select.Item value="Delivery">Delivery</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>

            <Separator size="4" my="2" />
            
            <Flex align="center" justify="between">
              <Text as="label" size="2" weight="medium">Set as Default Terminal</Text>
              <Switch 
                color="green"
                checked={editingTerminal?.isDefault || false} 
                onCheckedChange={(checked) => 
                  setEditingTerminal({...editingTerminal, isDefault: checked})
                }
              />
            </Flex>
            
            <Separator size="4"/>
            <Flex align="center" justify="between">
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Enable Offline Mode</Text>
                <Text size="1" color="gray">Allow terminal to function without internet connection</Text>
              </Flex>
              <Switch 
                color="green"
                checked={editingTerminal?.offlineMode || false} 
                onCheckedChange={(checked) => 
                  setEditingTerminal({...editingTerminal, offlineMode: checked})
                }
              />
            </Flex>
          </Flex>
          
          <Flex gap="3" mt="6" justify="end">
            <Dialog.Close>
              <Button color="gray" variant="soft">
                <X size={16} />
                Cancel
              </Button>
            </Dialog.Close>
            <Button color="green" onClick={handleSaveTerminal}>
              <Save size={16} />
              Save Terminal
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
} 