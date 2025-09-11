'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Checkbox,
  Dialog,
  Flex, 
  Select,
  Switch,
  Table, 
  Text, 
  TextField,
  Badge,
  Grid,
  Separator
} from '@radix-ui/themes';
import { Edit, Plus, MonitorPlay, Search, X, Save, RefreshCcw } from 'lucide-react';
import Pagination from '@/components/common/Pagination';

// Mock data for KDS stations
const mockKDSStations = [
  {
    id: "KDS001",
    name: "Hot Kitchen",
    assignedOrders: ["Dine-in", "Takeaway"],
    assignedCategories: ["Grill", "Fry", "Soup"],
    autoClear: true,
    autoClearMinutes: 15,
    priorityOrders: true,
    displayMode: "Ticket",
    activeScreens: 2,
    soundNotification: true,
    status: "active"
  },
  {
    id: "KDS002",
    name: "Cold Kitchen",
    assignedOrders: ["Dine-in", "Takeaway", "Delivery"],
    assignedCategories: ["Salad", "Appetizer", "Dessert"],
    autoClear: true,
    autoClearMinutes: 10,
    priorityOrders: true,
    displayMode: "List",
    activeScreens: 1,
    soundNotification: true,
    status: "active"
  },
  {
    id: "KDS003",
    name: "Bar",
    assignedOrders: ["Dine-in"],
    assignedCategories: ["Drinks", "Cocktails"],
    autoClear: false,
    autoClearMinutes: 0,
    priorityOrders: false,
    displayMode: "Ticket",
    activeScreens: 1,
    soundNotification: true,
    status: "active"
  },
  {
    id: "KDS004",
    name: "Dessert Station",
    assignedOrders: ["Dine-in", "Takeaway"],
    assignedCategories: ["Dessert", "Ice Cream"],
    autoClear: true,
    autoClearMinutes: 8,
    priorityOrders: false,
    displayMode: "List",
    activeScreens: 1,
    soundNotification: false,
    status: "inactive"
  }
];

// Mock terminal devices that can be used for KDS
const mockDevices = [
  { id: "dev1", name: "Kitchen Display 1" },
  { id: "dev2", name: "Kitchen Display 2" },
  { id: "dev3", name: "Bar Monitor" },
  { id: "dev4", name: "Cold Kitchen Tablet" }
];

// Mock food categories
const mockCategories = [
  "Grill", "Fry", "Soup", "Salad", "Appetizer", 
  "Dessert", "Ice Cream", "Drinks", "Cocktails"
];

export default function KDSSetup() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<any>(null);

  // Check if any filter is active
  const isFilterActive = searchTerm !== '' || statusFilter !== 'all';

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  // Filter KDS stations based on filters
  const filteredStations = mockKDSStations.filter(station => {
    // Search term filter
    const matchesSearch = 
      station.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || station.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredStations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredStations.length);
  const paginatedStations = filteredStations.slice(startIndex, endIndex);

  // Add new KDS station
  const handleAddStation = () => {
    setEditingStation({
      id: "",
      name: "",
      assignedOrders: ["Dine-in"],
      assignedCategories: [],
      autoClear: false,
      autoClearMinutes: 10,
      priorityOrders: false,
      displayMode: "Ticket",
      activeScreens: 0,
      soundNotification: true,
      status: "active"
    });
    setIsDialogOpen(true);
  };

  // Edit KDS station
  const handleEditStation = (station: any) => {
    setEditingStation({...station});
    setIsDialogOpen(true);
  };

  // Test KDS display
  const handleTestDisplay = (stationId: string) => {
    console.log('Testing KDS display:', stationId);
    // In a real app, this would open a test display
  };

  // Handle form save
  const handleSaveStation = () => {
    // In a real app, this would save to the database
    console.log('Saving KDS station:', editingStation);
    setIsDialogOpen(false);
  };

  // Toggle order type selection
  const toggleOrderType = (type: string) => {
    if (!editingStation) return;
    
    const updatedOrderTypes = [...editingStation.assignedOrders];
    const typeIndex = updatedOrderTypes.indexOf(type);
    
    if (typeIndex === -1) {
      updatedOrderTypes.push(type);
    } else {
      updatedOrderTypes.splice(typeIndex, 1);
    }
    
    setEditingStation({...editingStation, assignedOrders: updatedOrderTypes});
  };

  // Toggle category selection
  const toggleCategory = (category: string) => {
    if (!editingStation) return;
    
    const updatedCategories = [...editingStation.assignedCategories];
    const categoryIndex = updatedCategories.indexOf(category);
    
    if (categoryIndex === -1) {
      updatedCategories.push(category);
    } else {
      updatedCategories.splice(categoryIndex, 1);
    }
    
    setEditingStation({...editingStation, assignedCategories: updatedCategories});
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
              <TextField.Root placeholder="Search KDS stations..." 
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
          
          {/* Add KDS Station Button */}
          <Button onClick={handleAddStation} className="w-full sm:w-auto">
            <Plus size={16} />
            Add KDS Station
          </Button>
        </Flex>

        {/* KDS Stations Table */}
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Station Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Assigned Orders</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Auto-Clear?</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Priority Orders?</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Active Screens</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          
          <Table.Body>
            {paginatedStations.length > 0 ? (
              paginatedStations.map(station => (
                <Table.Row key={station.id} className="align-middle cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800" onClick={() => handleEditStation(station)}>
                  <Table.Cell>
                    <Text weight="medium" as="div">{station.name}</Text>
                    <Text size="1" color="gray">
                      {station.displayMode} View
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap="1" wrap="wrap">
                      {station.assignedOrders.map(order => (
                        <Badge 
                          key={order} 
                          color={
                            order === 'Dine-in' ? 'blue' : 
                            order === 'Takeaway' ? 'purple' : 
                            'orange'
                          }
                          size="1"
                        >
                          {order}
                        </Badge>
                      ))}
                    </Flex>
                    <Text size="1" color="gray" mt="1">
                      {station.assignedCategories.slice(0, 2).join(', ')}
                      {station.assignedCategories.length > 2 && ` +${station.assignedCategories.length - 2} more`}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    {station.autoClear ? (
                      <Badge color="green" size="1">Yes - {station.autoClearMinutes} min</Badge>
                    ) : (
                      <Badge color="gray" size="1">No</Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge 
                      color={station.priorityOrders ? 'amber' : 'gray'} 
                      size="1"
                    >
                      {station.priorityOrders ? 'Yes' : 'No'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                      {station.activeScreens} screen{station.activeScreens !== 1 ? 's' : ''}
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap="2">
                      <Button 
                        variant="outline" 
                        size="1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditStation(station);
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
                          handleTestDisplay(station.id);
                        }}
                      >
                        <MonitorPlay size={14} />
                        Test
                      </Button>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={6}>
                  <Text align="center" color="gray">No KDS stations found matching your filters</Text>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
        
        {/* Pagination */}
        {filteredStations.length > itemsPerPage && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredStations.length}
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

      {/* Add/Edit KDS Station Dialog */}
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Content style={{ maxWidth: 600 }}>
          <Flex justify="between">
            <Dialog.Title>{editingStation?.id ? 'Edit KDS Station' : 'Add KDS Station'}</Dialog.Title>
            <Dialog.Close>
              <Button color="gray" variant="ghost">
                <X size={16} />
              </Button>
            </Dialog.Close>
          </Flex>
          
          <Flex direction="column" gap="3" mt="4">
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Station Name</Text>
              <TextField.Root 
                placeholder="Enter station name" 
                value={editingStation?.name || ''}
                onChange={(e) => setEditingStation({...editingStation, name: e.target.value})}
              />
            </Flex>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Order Types Assigned</Text>
              <Flex wrap="wrap" gap="3">
                <Flex gap="2">
                  <Checkbox 
                    checked={editingStation?.assignedOrders.includes('Dine-in')}
                    onCheckedChange={() => toggleOrderType('Dine-in')}
                    id="dine-in-kds"
                  />
                  <Text as="label" size="2" htmlFor="dine-in-kds">Dine-in</Text>
                </Flex>
                <Flex gap="2">
                  <Checkbox 
                    checked={editingStation?.assignedOrders.includes('Takeaway')}
                    onCheckedChange={() => toggleOrderType('Takeaway')}
                    id="takeaway-kds"
                  />
                  <Text as="label" size="2" htmlFor="takeaway-kds">Takeaway</Text>
                </Flex>
                <Flex gap="2">
                  <Checkbox 
                    checked={editingStation?.assignedOrders.includes('Delivery')}
                    onCheckedChange={() => toggleOrderType('Delivery')}
                    id="delivery-kds"
                  />
                  <Text as="label" size="2" htmlFor="delivery-kds">Delivery</Text>
                </Flex>
              </Flex>
            </Flex>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Menu Categories Assigned</Text>
              <Grid columns="3" gap="2">
                {mockCategories.map(category => (
                  <Flex gap="2" key={category}>
                    <Checkbox 
                      checked={editingStation?.assignedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                      id={`category-${category}`}
                    />
                    <Text as="label" size="2" htmlFor={`category-${category}`}>{category}</Text>
                  </Flex>
                ))}
              </Grid>
            </Flex>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Display Mode</Text>
              <Select.Root 
                value={editingStation?.displayMode || ''} 
                onValueChange={(value) => setEditingStation({...editingStation, displayMode: value})}
              >
                <Select.Trigger placeholder="Select display mode" />
                <Select.Content>
                  <Select.Item value="Ticket">Ticket View (vertical tickets)</Select.Item>
                  <Select.Item value="List">List View (compact summary)</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>

            <Separator mt="2" size="4" />
            
            <Flex align="center" justify="between">
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Auto-Clear Orders</Text>
                <Text size="1" color="gray">Automatically clear completed orders after a set time</Text>
              </Flex>
              <Switch 
                color="green"
                checked={editingStation?.autoClear || false}
                onCheckedChange={(checked) => 
                  setEditingStation({...editingStation, autoClear: checked})
                }
              />
            </Flex>
            
            {editingStation?.autoClear && (
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Clear After <Text size="1" color="gray">(minutes)</Text></Text>
                <TextField.Root 
                  type="number"
                  min="1"
                  max="60"
                  className="w-20"
                  size="1"
                  value={editingStation?.autoClearMinutes || 10}
                  onChange={(e) => setEditingStation({
                    ...editingStation, 
                    autoClearMinutes: parseInt(e.target.value) || 10
                  })}
                />
              </Flex>
            )}

            <Separator size="4" />
            
            <Flex align="center" justify="between">
              <Text as="label" size="2" weight="medium">Show Priority Tags</Text>
              <Switch 
                color="green"
                checked={editingStation?.priorityOrders || false}
                onCheckedChange={(checked) => 
                  setEditingStation({...editingStation, priorityOrders: checked})
                }
              />
            </Flex>
            
            <Separator size="4" />
            
            <Flex align="center" justify="between">
              <Text as="label" size="2" weight="medium">Sound Notification for New Orders</Text>
              <Switch 
                color="green"
                checked={editingStation?.soundNotification || false}
                onCheckedChange={(checked) => 
                  setEditingStation({...editingStation, soundNotification: checked})
                }
              />
            </Flex>

            <Separator size="4" />
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Assign to Screen or Device</Text>
              <Select.Root 
                value={editingStation?.assignedDevice || ''} 
                onValueChange={(value) => setEditingStation({
                  ...editingStation, 
                  assignedDevice: value,
                  activeScreens: value ? 1 : 0
                })}
              >
                <Select.Trigger placeholder="Select device" />
                <Select.Content>
                  <Select.Item value="none">None</Select.Item>
                  {mockDevices.map(device => (
                    <Select.Item key={device.id} value={device.id}>{device.name}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Flex>
          </Flex>      
          
          <Flex gap="3" mt="6" justify="end">
            <Dialog.Close>
              <Button color="gray" variant="soft">
                <X size={16} />
                Cancel
              </Button>
            </Dialog.Close>
            <Button color="green" onClick={handleSaveStation}>
              <Save size={16} />
              Save KDS Station
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
} 