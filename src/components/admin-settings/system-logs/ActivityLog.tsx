'use client';

import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Button, 
  Dialog,
  Flex, 
  Select,
  Table, 
  Text, 
  TextField,
  Badge,
  Code,
  ScrollArea,
  Tabs,
  IconButton
} from '@radix-ui/themes';
import { 
  Download, 
  Eye, 
  RefreshCcw, 
  Search, 
  X 
} from 'lucide-react';
import Pagination from '@/components/common/Pagination';
import DateRangeInput from '@/components/common/DateRangeInput';
import { Range } from 'react-date-range';
import { SortableHeader } from '@/components/common/SortableHeader';

// Add utility function to generate random dates between today and 30 days ago
const generateRandomDate = (daysAgo = 30) => {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - daysAgo);
  
  // Random date between pastDate and today
  const randomTimestamp = pastDate.getTime() + Math.random() * (today.getTime() - pastDate.getTime());
  return new Date(randomTimestamp).toISOString();
};

// Update the mock data timestamps to be dynamic
const mockActivityLogs = [
  {
    id: "ACT001",
    timestamp: generateRandomDate(),
    user: "John Doe",
    action: "Create",
    target: "Menu Item",
    branch: "Mall Branch",
    ipAddress: "192.168.1.101",
    deviceId: "TERM-001",
    details: {
      itemName: "Spicy Chicken Burger",
      category: "Main Course",
      price: 12.99,
      status: "active"
    }
  },
  {
    id: "ACT002",
    timestamp: generateRandomDate(),
    user: "Jane Smith",
    action: "Update",
    target: "Inventory Item",
    branch: "Downtown Branch",
    ipAddress: "192.168.1.102",
    deviceId: "TERM-005",
    details: {
      itemName: "Chicken Breast",
      oldQuantity: 25,
      newQuantity: 50,
      reason: "Restocking"
    }
  },
  {
    id: "ACT003",
    timestamp: generateRandomDate(),
    user: "Admin User",
    action: "Delete",
    target: "Promotion",
    branch: "HQ Branch",
    ipAddress: "192.168.1.103",
    deviceId: "TERM-002",
    details: {
      promotionName: "Happy Hour Special",
      reason: "Expired"
    }
  },
  {
    id: "ACT004",
    timestamp: generateRandomDate(),
    user: "Kitchen Staff",
    action: "View",
    target: "Order",
    branch: "Mall Branch",
    ipAddress: "192.168.1.104",
    deviceId: "KDS-001",
    details: {
      orderId: "ORD-1234",
      customerName: "Mike Johnson",
      orderType: "Dine-in"
    }
  },
  {
    id: "ACT005",
    timestamp: generateRandomDate(),
    user: "Jane Smith",
    action: "Export",
    target: "Sales Report",
    branch: "Downtown Branch",
    ipAddress: "192.168.1.102",
    deviceId: "TERM-005",
    details: {
      reportType: "Daily",
      dateRange: "2023-11-14 to 2023-11-15",
      format: "Excel"
    }
  },
  {
    id: "ACT006",
    timestamp: generateRandomDate(),
    user: "Robert Johnson",
    action: "Create",
    target: "Employee",
    branch: "HQ Branch",
    ipAddress: "192.168.1.110",
    deviceId: "TERM-001",
    details: {
      employeeName: "Sarah Williams",
      position: "Cashier",
      startDate: "2023-11-20",
      salary: 2800
    }
  },
  {
    id: "ACT007",
    timestamp: generateRandomDate(),
    user: "Admin User",
    action: "Update",
    target: "System Settings",
    branch: "HQ Branch",
    ipAddress: "192.168.1.103",
    deviceId: "TERM-002",
    details: {
      setting: "Tax Rate",
      oldValue: "7.5%",
      newValue: "8.0%",
      reason: "Tax regulation update"
    }
  },
  {
    id: "ACT008",
    timestamp: generateRandomDate(),
    user: "John Doe",
    action: "Login",
    target: "System",
    branch: "Mall Branch",
    ipAddress: "192.168.1.101",
    deviceId: "TERM-003",
    details: {
      browser: "Chrome",
      os: "Windows 10",
      loginSuccess: true
    }
  },
  {
    id: "ACT009",
    timestamp: generateRandomDate(),
    user: "Kitchen Staff",
    action: "Print",
    target: "Order Receipt",
    branch: "Mall Branch",
    ipAddress: "192.168.1.104",
    deviceId: "KDS-001",
    details: {
      orderId: "ORD-1242",
      items: 5,
      printer: "Kitchen Printer 1"
    }
  },
  {
    id: "ACT010",
    timestamp: generateRandomDate(),
    user: "Jane Smith",
    action: "Create",
    target: "Discount",
    branch: "Downtown Branch",
    ipAddress: "192.168.1.102",
    deviceId: "TERM-005",
    details: {
      discountName: "Holiday Special",
      discountRate: "15%",
      startDate: "2023-12-01",
      endDate: "2023-12-31"
    }
  },
  {
    id: "ACT011",
    timestamp: generateRandomDate(),
    user: "Robert Johnson",
    action: "Delete",
    target: "Menu Item",
    branch: "HQ Branch",
    ipAddress: "192.168.1.110",
    deviceId: "TERM-001",
    details: {
      itemName: "Seasonal Salad",
      category: "Appetizers",
      reason: "End of season"
    }
  },
  {
    id: "ACT012",
    timestamp: generateRandomDate(),
    user: "Admin User",
    action: "Export",
    target: "Customer Data",
    branch: "HQ Branch",
    ipAddress: "192.168.1.103",
    deviceId: "TERM-002",
    details: {
      format: "CSV",
      records: 1250,
      filters: "Loyalty members only"
    }
  },
  {
    id: "ACT013",
    timestamp: generateRandomDate(),
    user: "John Doe",
    action: "Update",
    target: "Reservation",
    branch: "Mall Branch",
    ipAddress: "192.168.1.101",
    deviceId: "TERM-003",
    details: {
      reservationId: "RES-089",
      customerName: "David Miller",
      oldTime: "19:00",
      newTime: "20:30",
      reason: "Customer request"
    }
  },
  {
    id: "ACT014",
    timestamp: generateRandomDate(),
    user: "Jane Smith",
    action: "Create",
    target: "Order",
    branch: "Downtown Branch",
    ipAddress: "192.168.1.102",
    deviceId: "TERM-005",
    details: {
      orderId: "ORD-1255",
      amount: 64.75,
      items: 4,
      paymentMethod: "Credit Card"
    }
  },
  {
    id: "ACT015",
    timestamp: generateRandomDate(),
    user: "Kitchen Staff",
    action: "View",
    target: "Inventory Report",
    branch: "Mall Branch",
    ipAddress: "192.168.1.104",
    deviceId: "KDS-001",
    details: {
      reportType: "Low Stock Alert",
      itemsLow: 8,
      criticalItems: 3
    }
  }
];

// Mock action types for filter
const actionTypes = [
  "Create",
  "Update",
  "Delete",
  "View",
  "Export",
  "Login",
  "Logout",
  "Print"
];

// Mock branches for filter
const mockBranches = [
  { id: "branch1", name: "HQ Branch" },
  { id: "branch2", name: "Downtown Branch" },
  { id: "branch3", name: "Mall Branch" }
];

export default function ActivityLog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionTypeFilter, setActionTypeFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [dateRange, setDateRange] = useState<Range>({
    startDate: undefined,
    endDate: undefined,
    key: 'selection'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewingDetails, setViewingDetails] = useState<any>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Function to format timestamp to a readable format
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Check if any filter is active
  const isFilterActive = searchTerm !== '' || 
    actionTypeFilter !== 'all' || 
    branchFilter !== 'all' ||
    dateRange.startDate !== undefined ||
    sortConfig !== null;

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setActionTypeFilter('all');
    setBranchFilter('all');
    setDateRange({
      startDate: undefined,
      endDate: undefined,
      key: 'selection'
    });
    setSortConfig(null);
    setCurrentPage(1);
  };

  // Filter activity logs based on filters
  const filteredLogs = useMemo(() => {
    return mockActivityLogs
      .filter(log => {
        // Search term filter (check user, action, target)
        const matchesSearch = 
          log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Action type filter
        const matchesActionType = actionTypeFilter === 'all' || log.action === actionTypeFilter;
        
        // Branch filter
        const matchesBranch = branchFilter === 'all' || log.branch === branchFilter;
        
        // Date range filter
        let matchesDateRange = true;
        if (dateRange.startDate) {
          const logDate = new Date(log.timestamp);
          const startDate = dateRange.startDate;
          const endDate = dateRange.endDate || startDate;
          
          // Set time to the end of the day for the end date to include the entire day
          const endDateEnd = new Date(endDate);
          endDateEnd.setHours(23, 59, 59, 999);
          
          matchesDateRange = logDate >= startDate && logDate <= endDateEnd;
        }
        
        return matchesSearch && matchesActionType && matchesBranch && matchesDateRange;
      })
      .sort((a, b) => {
        if (!sortConfig) return 0;

        let aValue: any;
        let bValue: any;

        switch (sortConfig.key) {
          case 'timestamp':
            aValue = new Date(a.timestamp).getTime();
            bValue = new Date(b.timestamp).getTime();
            break;
          case 'user':
            aValue = a.user.toLowerCase();
            bValue = b.user.toLowerCase();
            break;
          case 'action':
            aValue = a.action.toLowerCase();
            bValue = b.action.toLowerCase();
            break;
          case 'target':
            aValue = a.target.toLowerCase();
            bValue = b.target.toLowerCase();
            break;
          case 'branch':
            aValue = a.branch.toLowerCase();
            bValue = b.branch.toLowerCase();
            break;
          case 'ipAddress':
            aValue = a.ipAddress.toLowerCase();
            bValue = b.ipAddress.toLowerCase();
            break;
          case 'deviceId':
            aValue = a.deviceId.toLowerCase();
            bValue = b.deviceId.toLowerCase();
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
  }, [searchTerm, actionTypeFilter, branchFilter, dateRange, sortConfig]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredLogs.length);
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  // Handle view details
  const handleViewDetails = (log: any) => {
    setViewingDetails(log);
    setIsDetailsDialogOpen(true);
  };

  // Handle export logs
  const handleExportLogs = () => {
    console.log('Exporting filtered logs');
    // In a real app, this would generate and download a CSV/Excel file
  };

  // Create a proper handler for the range change
  const handleDateRangeChange = (range: Range) => {
    setDateRange(range);
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
              <TextField.Root placeholder="Search logs..." 
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
              <Box className="min-w-64">
                <DateRangeInput
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  placeholder="Select date range"
                />
              </Box>
              
              <Select.Root 
                value={actionTypeFilter} 
                onValueChange={setActionTypeFilter}
              >
                <Select.Trigger placeholder="Action type" />
                <Select.Content>
                  <Select.Item value="all">All Actions</Select.Item>
                  {actionTypes.map(actionType => (
                    <Select.Item key={actionType} value={actionType}>{actionType}</Select.Item>
                  ))}
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
          
          {/* Export Button - Hidden on mobile, shown at bottom */}
          <Box className="hidden sm:block">
            <Button variant="outline" onClick={handleExportLogs}>
              <Download size={16} />
              Export Logs
            </Button>
          </Box>
        </Flex>

        {/* Activity Logs Table */}
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell width="180">
                <SortableHeader
                  label="Timestamp"
                  sortKey="timestamp"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="User"
                  sortKey="user"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell width="100">
                <SortableHeader
                  label="Action"
                  sortKey="action"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="Target"
                  sortKey="target"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="Branch"
                  sortKey="branch"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="IP Address"
                  sortKey="ipAddress"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="Device ID"
                  sortKey="deviceId"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell width="80">Details</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          
          <Table.Body>
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map(log => (
                <Table.Row key={log.id}>
                  <Table.Cell>{formatTimestamp(log.timestamp)}</Table.Cell>
                  <Table.Cell>
                    <Text weight="medium">{log.user}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={
                      log.action === "Create" ? "green" : 
                      log.action === "Update" ? "blue" : 
                      log.action === "Delete" ? "red" : 
                      "gray"
                    }>
                      {log.action}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{log.target}</Table.Cell>
                  <Table.Cell>{log.branch}</Table.Cell>
                  <Table.Cell><Code color="gray">{log.ipAddress}</Code></Table.Cell>
                  <Table.Cell><Code color="gray">{log.deviceId}</Code></Table.Cell>
                  <Table.Cell>
                    <Button size="1" onClick={() => handleViewDetails(log)}>
                      <Eye size={14} />
                      View
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={8}>
                  <Text align="center" className="py-4">No activity logs found</Text>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>

        {/* Pagination */}
        {filteredLogs.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredLogs.length}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(value) => {
              setItemsPerPage(value);
              setCurrentPage(1);
            }}
          />
        )}

        {/* Export Button - Shown only on mobile */}
        <Box className="sm:hidden">
          <Button variant="outline" onClick={handleExportLogs} className="w-full">
            <Download size={16} />
            Export Logs
          </Button>
        </Box>
      </Flex>

      {/* Details Dialog */}
      <Dialog.Root open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <Dialog.Content size="3">
          <Flex justify="between">
            <Dialog.Title>Activity Details</Dialog.Title>
            <Dialog.Close>
              <IconButton variant="ghost" color="gray">
                <X size={16} />
              </IconButton>
            </Dialog.Close>
          </Flex>
          <Dialog.Description size="2" mb="4">
            Complete log information for activity {viewingDetails?.id}
          </Dialog.Description>

          <Tabs.Root defaultValue="overview">
            <Tabs.List>
              <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
              <Tabs.Trigger value="raw">Raw JSON</Tabs.Trigger>
            </Tabs.List>
            
            <Box mt="3">
              <Tabs.Content value="overview">
                <Flex direction="column" gap="3">
                  <Flex>
                    <Box width="150px">
                      <Text weight="bold">Timestamp:</Text>
                    </Box>
                    <Text>{viewingDetails && formatTimestamp(viewingDetails.timestamp)}</Text>
                  </Flex>
                  
                  <Flex>
                    <Box width="150px">
                      <Text weight="bold">User:</Text>
                    </Box>
                    <Text>{viewingDetails?.user}</Text>
                  </Flex>
                  
                  <Flex>
                    <Box width="150px">
                      <Text weight="bold">Action:</Text>
                    </Box>
                    <Badge color={
                      viewingDetails?.action === "Create" ? "green" : 
                      viewingDetails?.action === "Update" ? "blue" : 
                      viewingDetails?.action === "Delete" ? "red" : 
                      "gray"
                    }>
                      {viewingDetails?.action}
                    </Badge>
                  </Flex>
                  
                  <Flex>
                    <Box width="150px">
                      <Text weight="bold">Target:</Text>
                    </Box>
                    <Text>{viewingDetails?.target}</Text>
                  </Flex>
                  
                  <Flex>
                    <Box width="150px">
                      <Text weight="bold">Branch:</Text>
                    </Box>
                    <Text>{viewingDetails?.branch}</Text>
                  </Flex>
                  
                  <Flex>
                    <Box width="150px">
                      <Text weight="bold">IP Address:</Text>
                    </Box>
                    <Code color="gray">{viewingDetails?.ipAddress}</Code>
                  </Flex>
                  
                  <Flex>
                    <Box width="150px">
                      <Text weight="bold">Device ID:</Text>
                    </Box>
                    <Code color="gray">{viewingDetails?.deviceId}</Code>
                  </Flex>
                </Flex>
              </Tabs.Content>
              
              <Tabs.Content value="raw">
                <ScrollArea style={{ height: '350px' }} scrollbars="vertical" className="p-2 bg-slate-50 dark:bg-neutral-950">
                  <Code variant="ghost" color="gray" size="2" style={{ whiteSpace: 'pre-wrap' }}>
                    {viewingDetails && JSON.stringify(viewingDetails, null, 2)}
                  </Code>
                </ScrollArea>
              </Tabs.Content>
            </Box>
          </Tabs.Root>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Close
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
} 