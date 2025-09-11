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
  ScrollArea,
  Code,
  Tabs,
  IconButton
} from '@radix-ui/themes';
import { 
  CheckCircle, 
  Download, 
  Eye, 
  RefreshCcw, 
  Search, 
  Ticket, 
  X 
} from 'lucide-react';
import Pagination from '@/components/common/Pagination';
import { SortableHeader } from '@/components/common/SortableHeader';

// Mock data for system errors
const mockSystemErrors = [
  {
    id: "ERR001",
    timestamp: "2023-11-15T09:22:45",
    errorType: "API Error",
    severity: "critical",
    message: "Failed to connect to payment gateway",
    module: "Payment",
    status: "open",
    stackTrace: `Error: Failed to connect to payment gateway
  at PaymentService.processPayment (/src/services/PaymentService.ts:45:23)
  at OrderController.checkout (/src/controllers/OrderController.ts:132:19)
  at processRequest (/src/middleware/async.ts:20:7)`,
    requestData: {
      method: "POST",
      endpoint: "/api/payments/process",
      payload: { orderId: "ORD-1234", amount: 45.99, method: "credit_card" }
    },
    responseData: {
      status: 500,
      error: "Gateway connection timeout"
    }
  },
  {
    id: "ERR002",
    timestamp: "2023-11-15T10:35:12",
    errorType: "Database Error",
    severity: "high",
    message: "Database query failed: Duplicate entry",
    module: "Inventory",
    status: "resolved",
    stackTrace: `Error: ER_DUP_ENTRY: Duplicate entry '123' for key 'PRIMARY'
  at QueryExecutor.execute (/src/db/executor.ts:72:13)
  at InventoryService.updateStock (/src/services/InventoryService.ts:89:24)
  at async InventoryController.adjustStock (/src/controllers/InventoryController.ts:45:18)`,
    requestData: {
      method: "PUT",
      endpoint: "/api/inventory/items/123",
      payload: { quantity: 50, reason: "Restocking" }
    },
    responseData: {
      status: 500,
      error: "Database constraint violation"
    }
  },
  {
    id: "ERR003",
    timestamp: "2023-11-15T13:15:33",
    errorType: "Runtime Error",
    severity: "medium",
    message: "Uncaught TypeError: Cannot read property 'apply' of undefined",
    module: "Reports",
    status: "open",
    stackTrace: `TypeError: Cannot read property 'apply' of undefined
  at ReportGenerator.generateSalesReport (/src/services/ReportGenerator.ts:127:42)
  at ReportController.getSalesReport (/src/controllers/ReportController.ts:68:32)
  at processRequest (/src/middleware/async.ts:20:7)`,
    requestData: {
      method: "GET",
      endpoint: "/api/reports/sales?period=weekly",
      payload: null
    },
    responseData: {
      status: 500,
      error: "Internal server error"
    }
  },
  {
    id: "ERR004",
    timestamp: "2023-11-15T15:42:19",
    errorType: "Authentication Error",
    severity: "high",
    message: "JWT verification failed",
    module: "Authentication",
    status: "open",
    stackTrace: `Error: invalid signature
  at JwtService.verify (/src/services/JwtService.ts:52:11)
  at AuthMiddleware.validateToken (/src/middleware/auth.ts:33:26)
  at AuthMiddleware.handle (/src/middleware/auth.ts:18:14)`,
    requestData: {
      method: "GET",
      endpoint: "/api/users/profile",
      payload: null
    },
    responseData: {
      status: 401,
      error: "Invalid token provided"
    }
  },
  {
    id: "ERR005",
    timestamp: "2023-11-15T16:08:56",
    errorType: "Validation Error",
    severity: "low",
    message: "Request validation failed: Missing required field 'price'",
    module: "Menu",
    status: "resolved",
    stackTrace: `Error: ValidationError: "price" is required
  at ValidationService.validate (/src/services/ValidationService.ts:33:7)
  at MenuController.createMenuItem (/src/controllers/MenuController.ts:29:12)
  at processRequest (/src/middleware/async.ts:20:7)`,
    requestData: {
      method: "POST",
      endpoint: "/api/menu/items",
      payload: { name: "New Burger", category: "Main", description: "Delicious burger" }
    },
    responseData: {
      status: 400,
      error: "Validation error: Missing required field 'price'"
    }
  }
];

// Mock modules for filter
const mockModules = [
  "Payment",
  "Inventory",
  "Reports",
  "Authentication",
  "Menu",
  "Orders",
  "Users"
];

export default function SystemErrors() {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewingError, setViewingError] = useState<any>(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Check if any filter is active
  const isFilterActive = searchTerm !== '' || 
    severityFilter !== 'all' || 
    moduleFilter !== 'all' ||
    statusFilter !== 'all' ||
    sortConfig !== null;

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSeverityFilter('all');
    setModuleFilter('all');
    setStatusFilter('all');
    setSortConfig(null);
    setCurrentPage(1);
  };

  // Filter system errors based on filters
  const filteredErrors = useMemo(() => {
    return mockSystemErrors
      .filter(error => {
        // Search term filter (check message, errorType, module)
        const matchesSearch = 
          error.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          error.errorType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          error.module.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Severity filter
        const matchesSeverity = severityFilter === 'all' || error.severity === severityFilter;
        
        // Module filter
        const matchesModule = moduleFilter === 'all' || error.module === moduleFilter;
        
        // Status filter
        const matchesStatus = statusFilter === 'all' || error.status === statusFilter;
        
        return matchesSearch && matchesSeverity && matchesModule && matchesStatus;
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
          case 'errorType':
            aValue = a.errorType.toLowerCase();
            bValue = b.errorType.toLowerCase();
            break;
          case 'severity':
            aValue = a.severity.toLowerCase();
            bValue = b.severity.toLowerCase();
            break;
          case 'message':
            aValue = a.message.toLowerCase();
            bValue = b.message.toLowerCase();
            break;
          case 'module':
            aValue = a.module.toLowerCase();
            bValue = b.module.toLowerCase();
            break;
          case 'status':
            aValue = a.status.toLowerCase();
            bValue = b.status.toLowerCase();
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
  }, [searchTerm, severityFilter, moduleFilter, statusFilter, sortConfig]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredErrors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredErrors.length);
  const paginatedErrors = filteredErrors.slice(startIndex, endIndex);

  // Function to format timestamp to a readable format
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Handle view error details
  const handleViewError = (error: any) => {
    setViewingError(error);
    setIsErrorDialogOpen(true);
  };

  // Handle export errors
  const handleExportErrors = () => {
    console.log('Exporting system errors');
    // In a real app, this would generate and download a CSV/Excel file
  };

  // Handle mark as resolved
  const handleResolveError = (errorId: string) => {
    console.log('Marking error as resolved:', errorId);
    // In a real app, this would update the error status in the database
    setIsErrorDialogOpen(false);
  };

  // Handle create support ticket
  const handleCreateTicket = (errorId: string) => {
    console.log('Creating support ticket for error:', errorId);
    // In a real app, this would create a ticket in the support system
  };

  // Helper to get the color for severity badge
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'blue';
      default: return 'gray';
    }
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
              <TextField.Root placeholder="Search errors..." 
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
                value={severityFilter} 
                onValueChange={setSeverityFilter}
              >
                <Select.Trigger placeholder="Severity" />
                <Select.Content>
                  <Select.Item value="all">All Severity</Select.Item>
                  <Select.Item value="critical">Critical</Select.Item>
                  <Select.Item value="high">High</Select.Item>
                  <Select.Item value="medium">Medium</Select.Item>
                  <Select.Item value="low">Low</Select.Item>
                </Select.Content>
              </Select.Root>
              
              <Select.Root 
                value={moduleFilter} 
                onValueChange={setModuleFilter}
              >
                <Select.Trigger placeholder="Module" />
                <Select.Content>
                  <Select.Item value="all">All Modules</Select.Item>
                  {mockModules.map(module => (
                    <Select.Item key={module} value={module}>{module}</Select.Item>
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
                  <Select.Item value="open">Open</Select.Item>
                  <Select.Item value="resolved">Resolved</Select.Item>
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
            <Button variant="outline" onClick={handleExportErrors}>
              <Download size={16} />
              Export Error Log
            </Button>
          </Box>
        </Flex>

        {/* System Errors Table */}
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
              <Table.ColumnHeaderCell width="120">
                <SortableHeader
                  label="Error Type"
                  sortKey="errorType"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell width="100">
                <SortableHeader
                  label="Severity"
                  sortKey="severity"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="Message"
                  sortKey="message"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="Module"
                  sortKey="module"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell width="100">
                <SortableHeader
                  label="Status"
                  sortKey="status"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell width="80">Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          
          <Table.Body>
            {paginatedErrors.length > 0 ? (
              paginatedErrors.map(error => (
                <Table.Row key={error.id}>
                  <Table.Cell>{formatTimestamp(error.timestamp)}</Table.Cell>
                  <Table.Cell>{error.errorType}</Table.Cell>
                  <Table.Cell>
                    <Badge color={getSeverityColor(error.severity)}>
                      {error.severity.charAt(0).toUpperCase() + error.severity.slice(1)}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="truncate max-w-[300px]">{error.message}</Text>
                  </Table.Cell>
                  <Table.Cell>{error.module}</Table.Cell>
                  <Table.Cell>
                    <Badge color={error.status === "resolved" ? "green" : "red"}>
                      {error.status === "resolved" ? "Resolved" : "Open"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Button size="1" onClick={() => handleViewError(error)}>
                      <Eye size={14} />
                      View
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={7}>
                  <Text align="center" className="py-4">No system errors found</Text>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>

        {/* Pagination */}
        {filteredErrors.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredErrors.length}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(value) => {
              setItemsPerPage(value);
              setCurrentPage(1);
            }}
          />
        )}
      </Flex>

      {/* Error Details Dialog */}
      <Dialog.Root open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <Dialog.Content size="4">
          <Flex justify="between">
            <Dialog.Title>Error Details</Dialog.Title>
            <Dialog.Close>
              <IconButton variant="ghost" color="gray">
              <X size={16} />
              </IconButton>
            </Dialog.Close>
          </Flex>
          <Dialog.Description size="2" mb="4">
            Complete information about error {viewingError?.id}
          </Dialog.Description>

          <Tabs.Root defaultValue="overview">
            <Tabs.List>
              <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
              <Tabs.Trigger value="technical">Stack Trace</Tabs.Trigger>
              <Tabs.Trigger value="request">Request Data</Tabs.Trigger>
              <Tabs.Trigger value="response">Response Data</Tabs.Trigger>
            </Tabs.List>
            
            <Box mt="3">
              <Tabs.Content value="overview">
                <Flex direction="column" gap="3">
                  <Flex>
                    <Box width="150px">
                      <Text weight="bold">Timestamp:</Text>
                    </Box>
                    <Text>{viewingError && formatTimestamp(viewingError.timestamp)}</Text>
                  </Flex>
                  
                  <Flex>
                    <Box width="150px">
                      <Text weight="bold">Error Type:</Text>
                    </Box>
                    <Text>{viewingError?.errorType}</Text>
                  </Flex>
                  
                  <Flex>
                    <Box width="150px">
                      <Text weight="bold">Module:</Text>
                    </Box>
                    <Text>{viewingError?.module}</Text>
                  </Flex>
                  
                  <Flex>
                    <Box width="150px">
                      <Text weight="bold">Severity:</Text>
                    </Box>
                    <Badge color={getSeverityColor(viewingError?.severity || '')}>
                      {viewingError?.severity?.charAt(0).toUpperCase() + viewingError?.severity?.slice(1)}
                    </Badge>
                  </Flex>
                  
                  <Flex>
                    <Box width="150px">
                      <Text weight="bold">Status:</Text>
                    </Box>
                    <Badge color={viewingError?.status === "resolved" ? "green" : "red"}>
                      {viewingError?.status === "resolved" ? "Resolved" : "Open"}
                    </Badge>
                  </Flex>
                  
                  <Flex>
                    <Box width="150px">
                      <Text weight="bold">Message:</Text>
                    </Box>
                    <Text>{viewingError?.message}</Text>
                  </Flex>
                </Flex>
              </Tabs.Content>
              
              <Tabs.Content value="technical">
                <Flex direction="column" gap="4">
                  <Box>
                    <ScrollArea style={{ height: '350px' }} scrollbars="vertical" className="p-2 bg-slate-50 dark:bg-neutral-950">
                      <Code variant="ghost" color="gray" size="2" style={{ whiteSpace: 'pre-wrap' }}>
                        {viewingError?.stackTrace}
                      </Code>
                    </ScrollArea>
                  </Box>
                </Flex>
              </Tabs.Content>

              <Tabs.Content value="request">
                <ScrollArea style={{ height: '350px' }} scrollbars="vertical" className="p-2 bg-slate-50 dark:bg-neutral-950">
                  <Code variant="ghost" color="gray" size="2" style={{ whiteSpace: 'pre-wrap' }}>
                    {viewingError && JSON.stringify(viewingError.requestData, null, 2)}
                  </Code>
                </ScrollArea>
              </Tabs.Content>

              <Tabs.Content value="response">
                <ScrollArea style={{ height: '350px' }} scrollbars="vertical" className="p-2 bg-slate-50 dark:bg-neutral-950">
                  <Code variant="ghost" color="gray" size="2" style={{ whiteSpace: 'pre-wrap' }}>
                    {viewingError && JSON.stringify(viewingError.responseData, null, 2)}
                  </Code>
                </ScrollArea>
              </Tabs.Content>
            </Box>
          </Tabs.Root>

          <Flex gap="3" mt="6" justify={viewingError?.status !== "resolved" ? "between" : "end"}>
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Close
              </Button>
            </Dialog.Close>

            {viewingError?.status !== "resolved" && (
              <Flex gap="3">
                <Button 
                  onClick={() => handleCreateTicket(viewingError?.id)} 
                  variant="soft"
                >
                  <Ticket size={16} />
                  Create Support Ticket
                </Button>
                <Button 
                  onClick={() => handleResolveError(viewingError?.id)} 
                  color="green"
                >
                  <CheckCircle size={16} />
                  Mark as Resolved
                </Button>
              </Flex>
            )}
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
} 