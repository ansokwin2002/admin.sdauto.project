'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Checkbox,
  Dialog,
  Flex, 
  Select,
  Table, 
  Text, 
  TextField,
  Badge,
  Switch,
  Separator,
  Card
} from '@radix-ui/themes';
import { Edit, Plus, Printer as PrinterIcon, RefreshCcw, Save, Search, X } from 'lucide-react';
import Pagination from '@/components/common/Pagination';

// Mock data for printers
const mockPrinters = [
  {
    id: "PRINT001",
    name: "Main Receipt Printer",
    type: "Receipt",
    assignedTo: "Main Counter 1",
    assignmentType: "Terminal",
    branch: "Mall Branch",
    orderTypes: ["Dine-in", "Takeaway"],
    station: "",
    ipAddress: "192.168.1.101",
    status: "active",
    autoRetry: true
  },
  {
    id: "PRINT002",
    name: "Kitchen Printer",
    type: "Kitchen",
    assignedTo: "Hot Kitchen",
    assignmentType: "Station",
    branch: "Mall Branch",
    orderTypes: ["Dine-in", "Takeaway", "Delivery"],
    station: "Hot Kitchen",
    ipAddress: "192.168.1.102",
    status: "active",
    autoRetry: true
  },
  {
    id: "PRINT003",
    name: "Bar Printer",
    type: "Kitchen",
    assignedTo: "Bar",
    assignmentType: "Station",
    branch: "Downtown Branch",
    orderTypes: ["Dine-in"],
    station: "Bar",
    ipAddress: "192.168.1.103",
    status: "inactive",
    autoRetry: false
  },
  {
    id: "PRINT004",
    name: "Takeaway Label Printer",
    type: "Label",
    assignedTo: "Main Counter 2",
    assignmentType: "Terminal",
    branch: "Downtown Branch",
    orderTypes: ["Takeaway"],
    station: "",
    ipAddress: "192.168.1.104",
    status: "active",
    autoRetry: true
  }
];

// Mock branches and terminals
const mockBranches = [
  { id: "branch1", name: "HQ Branch" },
  { id: "branch2", name: "Downtown Branch" },
  { id: "branch3", name: "Mall Branch" }
];

const mockTerminals = [
  { id: "term1", name: "Main Counter 1", branch: "HQ Branch" },
  { id: "term2", name: "Main Counter 2", branch: "HQ Branch" },
  { id: "term3", name: "Downtown Terminal", branch: "Downtown Branch" },
  { id: "term4", name: "Mall Kiosk", branch: "Mall Branch" }
];

// Mock kitchen stations
const mockStations = [
  "Hot Kitchen",
  "Cold Kitchen",
  "Bar",
  "Dessert Station"
];

export default function PrinterConfiguration() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState<any>(null);

  // Check if any filter is active
  const isFilterActive = searchTerm !== '' || 
    typeFilter !== 'all' || 
    branchFilter !== 'all' || 
    statusFilter !== 'all';

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setBranchFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  // Filter printers based on filters
  const filteredPrinters = mockPrinters.filter(printer => {
    // Search term filter
    const matchesSearch = 
      printer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      printer.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const matchesType = typeFilter === 'all' || printer.type === typeFilter;
    
    // Branch filter
    const matchesBranch = branchFilter === 'all' || printer.branch === branchFilter;
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || printer.status === statusFilter;
    
    return matchesSearch && matchesType && matchesBranch && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredPrinters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredPrinters.length);
  const paginatedPrinters = filteredPrinters.slice(startIndex, endIndex);

  // Add new printer
  const handleAddPrinter = () => {
    setEditingPrinter({
      id: "",
      name: "",
      type: "Receipt",
      assignedTo: "",
      assignmentType: "Terminal",
      branch: "",
      orderTypes: ["Dine-in"],
      station: "",
      ipAddress: "",
      status: "active",
      autoRetry: false
    });
    setIsDialogOpen(true);
  };

  // Edit printer
  const handleEditPrinter = (printer: any) => {
    setEditingPrinter({...printer});
    setIsDialogOpen(true);
  };

  // Test print
  const handleTestPrint = (printerId: string) => {
    console.log('Testing printer:', printerId);
    // In a real app, this would send a test print command
  };

  // Handle form save
  const handleSavePrinter = () => {
    // In a real app, this would save to the database
    console.log('Saving printer:', editingPrinter);
    setIsDialogOpen(false);
  };

  // Toggle order type selection
  const toggleOrderType = (type: string) => {
    if (!editingPrinter) return;
    
    const updatedOrderTypes = [...editingPrinter.orderTypes];
    const typeIndex = updatedOrderTypes.indexOf(type);
    
    if (typeIndex === -1) {
      updatedOrderTypes.push(type);
    } else {
      updatedOrderTypes.splice(typeIndex, 1);
    }
    
    setEditingPrinter({...editingPrinter, orderTypes: updatedOrderTypes});
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
              <TextField.Root placeholder="Search printers..." 
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
                value={typeFilter} 
                onValueChange={setTypeFilter}
              >
                <Select.Trigger placeholder="Type" />
                <Select.Content>
                  <Select.Item value="all">All Types</Select.Item>
                  <Select.Item value="Receipt">Receipt</Select.Item>
                  <Select.Item value="Kitchen">Kitchen</Select.Item>
                  <Select.Item value="Label">Label</Select.Item>
                </Select.Content>
              </Select.Root>
              
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
          
          {/* Add Printer Button */}
          <Button onClick={handleAddPrinter} className="w-full sm:w-auto">
            <Plus size={16} />
            Add Printer
          </Button>
        </Flex>
        
        {/* Printers Table */}
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Printer Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Assigned To</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Branch</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          
          <Table.Body>
            {paginatedPrinters.length > 0 ? (
              paginatedPrinters.map(printer => (
                <Table.Row key={printer.id} className="align-middle cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800" onClick={() => handleEditPrinter(printer)}>
                  <Table.Cell>
                    <Text weight="medium">{printer.name}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge 
                      color={
                        printer.type === 'Receipt' ? 'blue' : 
                        printer.type === 'Kitchen' ? 'green' : 
                        'purple'
                      } 
                      size="1"
                    >
                      {printer.type}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text as="div">{printer.assignedTo}</Text>
                    <Text size="1" color="gray">
                      {printer.orderTypes.join(', ')}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>{printer.branch}</Table.Cell>
                  <Table.Cell>
                    <Badge 
                      color={printer.status === 'active' ? 'green' : 'gray'} 
                      size="1"
                    >
                      {printer.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap="2">
                      <Button 
                        variant="outline" 
                        size="1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPrinter(printer);
                        }}
                      >
                        <Edit size={14} />
                        Edit
                      </Button>
                      <Button 
                        variant="outline"
                        color="blue"
                        size="1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTestPrint(printer.id);
                        }}
                      >
                        <PrinterIcon size={14} />
                        Test
                      </Button>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={6}>
                  <Text align="center" color="gray">No printers found matching your filters</Text>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
        
        {/* Pagination */}
        {filteredPrinters.length > itemsPerPage && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredPrinters.length}
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

      {/* Add/Edit Printer Dialog */}
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Content style={{ maxWidth: 500 }}>
          <Flex justify="between">
            <Dialog.Title>{editingPrinter?.id ? 'Edit Printer' : 'Add Printer'}</Dialog.Title>
            <Dialog.Close>
              <Button color="gray" variant="ghost">
                <X size={16} />
              </Button>
            </Dialog.Close>
          </Flex>
          
          <Flex direction="column" gap="3" mt="4">
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Printer Name</Text>
              <TextField.Root 
                placeholder="Enter printer name" 
                value={editingPrinter?.name || ''}
                onChange={(e) => setEditingPrinter({...editingPrinter, name: e.target.value})}
              />
            </Flex>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Printer Type</Text>
              <Select.Root 
                value={editingPrinter?.type || ''} 
                onValueChange={(value) => {
                  setEditingPrinter({
                    ...editingPrinter, 
                    type: value,
                    assignmentType: value === 'Kitchen' ? 'Station' : 'Terminal'
                  });
                }}
              >
                <Select.Trigger placeholder="Select type" />
                <Select.Content>
                  <Select.Item value="Receipt">Receipt</Select.Item>
                  <Select.Item value="Kitchen">Kitchen</Select.Item>
                  <Select.Item value="Label">Label</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Branch</Text>
              <Select.Root 
                value={editingPrinter?.branch || ''} 
                onValueChange={(value) => setEditingPrinter({...editingPrinter, branch: value})}
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
              <Text as="label" size="2" weight="medium">Print Destination</Text>
              
              {editingPrinter?.type === 'Kitchen' ? (
                <Flex direction="column" gap="2">
                  <Text size="1" weight="medium">Assigned Station</Text>
                  <Select.Root 
                    value={editingPrinter?.station || ''} 
                    onValueChange={(value) => setEditingPrinter({
                      ...editingPrinter, 
                      station: value,
                      assignedTo: value
                    })}
                  >
                    <Select.Trigger placeholder="Select station" />
                    <Select.Content>
                      {mockStations.map(station => (
                        <Select.Item key={station} value={station}>{station}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Flex>
              ) : (
                <Card variant="classic">
                  <Flex direction="column" gap="2">
                    <Text size="1" weight="medium">POS Terminal</Text>
                    <Select.Root 
                      value={editingPrinter?.assignedTo || ''} 
                      onValueChange={(value) => setEditingPrinter({...editingPrinter, assignedTo: value})}
                    >
                      <Select.Trigger placeholder="Select terminal" />
                      <Select.Content>
                        {mockTerminals
                          .filter(term => !editingPrinter?.branch || term.branch === editingPrinter.branch)
                          .map(terminal => (
                            <Select.Item key={terminal.id} value={terminal.name}>{terminal.name}</Select.Item>
                          ))
                        }
                      </Select.Content>
                    </Select.Root>
                  </Flex>
                </Card>
              )}
            </Flex>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Order Types</Text>
              <Flex gap="2">
                <Checkbox 
                  checked={editingPrinter?.orderTypes.includes('Dine-in')}
                  onCheckedChange={() => toggleOrderType('Dine-in')}
                  id="dine-in"
                />
                <Text as="label" size="2" htmlFor="dine-in">Dine-in</Text>
              </Flex>
              <Flex gap="2">
                <Checkbox 
                  checked={editingPrinter?.orderTypes.includes('Takeaway')}
                  onCheckedChange={() => toggleOrderType('Takeaway')}
                  id="takeaway"
                />
                <Text as="label" size="2" htmlFor="takeaway">Takeaway</Text>
              </Flex>
              <Flex gap="2">
                <Checkbox 
                  checked={editingPrinter?.orderTypes.includes('Delivery')}
                  onCheckedChange={() => toggleOrderType('Delivery')}
                  id="delivery"
                />
                <Text as="label" size="2" htmlFor="delivery">Delivery</Text>
              </Flex>
            </Flex>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">IP Address</Text>
              <TextField.Root 
                placeholder="Enter IP address or Bluetooth identifier" 
                value={editingPrinter?.ipAddress || ''}
                onChange={(e) => setEditingPrinter({...editingPrinter, ipAddress: e.target.value})}
              />
            </Flex>

            <Separator my="2" size="4" />
            
            <Flex align="center" justify="between">
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="bold">Auto Retry Print if Failed</Text>
                <Text size="1" color="gray">Automatically retry printing if the first attempt fails</Text>
              </Flex>
              <Switch 
                color="green"
                checked={editingPrinter?.autoRetry || false}
                onCheckedChange={(checked) => 
                  setEditingPrinter({...editingPrinter, autoRetry: checked})
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
            <Button color="green" onClick={handleSavePrinter}>
              <Save size={16} />
              Save Printer
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
} 