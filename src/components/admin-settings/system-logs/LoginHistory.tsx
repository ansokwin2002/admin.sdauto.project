'use client';

import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Button, 
  Flex, 
  Select,
  Table, 
  Text, 
  TextField,
  Badge,
  Tooltip,
  Code
} from '@radix-ui/themes';
import { Download, RefreshCcw, Search } from 'lucide-react';
import Pagination from '@/components/common/Pagination';
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
const mockLoginHistory = [
  {
    id: "LOGIN001",
    timestamp: generateRandomDate(),
    username: "john.doe",
    status: "success",
    ipAddress: "192.168.1.101",
    device: "Chrome / Windows 10",
    location: "New York, USA",
    failedReason: null,
    isNewLocation: false,
    failedAttempts: 0
  },
  {
    id: "LOGIN002",
    timestamp: generateRandomDate(),
    username: "jane.smith",
    status: "success",
    ipAddress: "192.168.1.102",
    device: "Safari / macOS",
    location: "Los Angeles, USA",
    failedReason: null,
    isNewLocation: true,
    failedAttempts: 0
  },
  {
    id: "LOGIN003",
    timestamp: generateRandomDate(),
    username: "admin.user",
    status: "failed",
    ipAddress: "192.168.1.103",
    device: "Firefox / Ubuntu",
    location: "Chicago, USA",
    failedReason: "Incorrect password",
    isNewLocation: false,
    failedAttempts: 1
  },
  {
    id: "LOGIN004",
    timestamp: generateRandomDate(),
    username: "admin.user",
    status: "failed",
    ipAddress: "192.168.1.103",
    device: "Firefox / Ubuntu",
    location: "Chicago, USA",
    failedReason: "Incorrect password",
    isNewLocation: false,
    failedAttempts: 2
  },
  {
    id: "LOGIN005",
    timestamp: generateRandomDate(),
    username: "admin.user",
    status: "failed",
    ipAddress: "192.168.1.103",
    device: "Firefox / Ubuntu",
    location: "Chicago, USA",
    failedReason: "Incorrect password",
    isNewLocation: false,
    failedAttempts: 3
  },
  {
    id: "LOGIN006",
    timestamp: generateRandomDate(),
    username: "admin.user",
    status: "failed",
    ipAddress: "192.168.1.103",
    device: "Firefox / Ubuntu",
    location: "Chicago, USA",
    failedReason: "Incorrect password",
    isNewLocation: false,
    failedAttempts: 4
  },
  {
    id: "LOGIN007",
    timestamp: generateRandomDate(),
    username: "admin.user",
    status: "failed",
    ipAddress: "192.168.1.103",
    device: "Firefox / Ubuntu",
    location: "Chicago, USA",
    failedReason: "Incorrect password",
    isNewLocation: false,
    failedAttempts: 5
  },
  {
    id: "LOGIN008",
    timestamp: generateRandomDate(),
    username: "admin.user",
    status: "success",
    ipAddress: "192.168.1.103",
    device: "Firefox / Ubuntu",
    location: "Chicago, USA",
    failedReason: null,
    isNewLocation: false,
    failedAttempts: 0
  },
  {
    id: "LOGIN009",
    timestamp: generateRandomDate(),
    username: "robert.johnson",
    status: "success",
    ipAddress: "192.168.1.105",
    device: "Edge / Windows 11",
    location: "Seattle, USA",
    failedReason: null,
    isNewLocation: false,
    failedAttempts: 0
  },
  {
    id: "LOGIN010",
    timestamp: generateRandomDate(),
    username: "sarah.williams",
    status: "success",
    ipAddress: "192.168.1.106",
    device: "Chrome / Android",
    location: "Miami, USA",
    failedReason: null,
    isNewLocation: true,
    failedAttempts: 0
  },
  {
    id: "LOGIN011",
    timestamp: generateRandomDate(),
    username: "james.brown",
    status: "failed",
    ipAddress: "192.168.1.107",
    device: "Safari / iOS",
    location: "Boston, USA",
    failedReason: "Account locked",
    isNewLocation: false,
    failedAttempts: 1
  },
  {
    id: "LOGIN012",
    timestamp: generateRandomDate(),
    username: "lisa.miller",
    status: "success",
    ipAddress: "192.168.1.108",
    device: "Firefox / macOS",
    location: "Denver, USA",
    failedReason: null,
    isNewLocation: false,
    failedAttempts: 0
  },
  {
    id: "LOGIN013",
    timestamp: generateRandomDate(),
    username: "john.doe",
    status: "success",
    ipAddress: "192.168.1.109",
    device: "Chrome / Windows 10",
    location: "Tokyo, Japan",
    failedReason: null,
    isNewLocation: true,
    failedAttempts: 0
  },
  {
    id: "LOGIN014",
    timestamp: generateRandomDate(),
    username: "admin.user",
    status: "success",
    ipAddress: "192.168.1.110",
    device: "Chrome / Ubuntu",
    location: "Chicago, USA",
    failedReason: null,
    isNewLocation: false,
    failedAttempts: 0
  },
  {
    id: "LOGIN015",
    timestamp: generateRandomDate(),
    username: "jane.smith",
    status: "success",
    ipAddress: "192.168.1.111",
    device: "Safari / macOS",
    location: "San Francisco, USA",
    failedReason: null,
    isNewLocation: true,
    failedAttempts: 0
  }
];

export default function LoginHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
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

  // Function to format timestamp to a readable format
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Check if any filter is active
  const isFilterActive = searchTerm !== '' || 
    statusFilter !== 'all' || 
    dateFilter !== 'all' ||
    sortConfig !== null;

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('all');
    setSortConfig(null);
    setCurrentPage(1);
  };

  // Filter login history based on filters
  const filteredHistory = useMemo(() => {
    return mockLoginHistory
      .filter(login => {
        // Search term filter (check username, device, ip, location)
        const matchesSearch = 
          login.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          login.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
          login.ipAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
          login.location.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Status filter
        const matchesStatus = statusFilter === 'all' || login.status === statusFilter;
        
        // Date filter (this is simplified - in a real app, you'd use proper date filtering)
        const matchesDate = dateFilter === 'all'; // Just a placeholder for now
        
        return matchesSearch && matchesStatus && matchesDate;
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
          case 'username':
            aValue = a.username.toLowerCase();
            bValue = b.username.toLowerCase();
            break;
          case 'status':
            aValue = a.status.toLowerCase();
            bValue = b.status.toLowerCase();
            break;
          case 'ipAddress':
            aValue = a.ipAddress.toLowerCase();
            bValue = b.ipAddress.toLowerCase();
            break;
          case 'device':
            aValue = a.device.toLowerCase();
            bValue = b.device.toLowerCase();
            break;
          case 'location':
            aValue = a.location.toLowerCase();
            bValue = b.location.toLowerCase();
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
  }, [searchTerm, statusFilter, dateFilter, sortConfig]);

  // Group logins to detect multiple failed attempts
  const loginsByUser = filteredHistory.reduce((acc: any, login) => {
    if (!acc[login.username]) {
      acc[login.username] = [];
    }
    acc[login.username].push(login);
    return acc;
  }, {});

  // Pagination calculations
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredHistory.length);
  const paginatedHistory = filteredHistory.slice(startIndex, endIndex);

  // Handle export logs
  const handleExportLogs = () => {
    console.log('Exporting login history');
    // In a real app, this would generate and download a CSV/Excel file
  };

  // Helper to determine badge status for suspicious activity
  const getSuspiciousBadge = (login: any) => {
    if (login.failedAttempts >= 5) {
      return (
        <Tooltip content="Multiple failed login attempts">
          <Badge color="red" className="ml-2">Security Risk</Badge>
        </Tooltip>
      );
    } else if (login.failedAttempts >= 3) {
      return (
        <Tooltip content="Several failed login attempts">
          <Badge color="orange" className="ml-2">Warning</Badge>
        </Tooltip>
      );
    } else if (login.isNewLocation) {
      return (
        <Tooltip content="First login from this location">
          <Badge color="blue" className="ml-2">New Location</Badge>
        </Tooltip>
      );
    }
    return null;
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
              <TextField.Root placeholder="Search username, device..." 
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
                  <Select.Item value="success">Success</Select.Item>
                  <Select.Item value="failed">Failed</Select.Item>
                </Select.Content>
              </Select.Root>
              
              <Select.Root 
                value={dateFilter} 
                onValueChange={setDateFilter}
              >
                <Select.Trigger placeholder="Date" />
                <Select.Content>
                  <Select.Item value="all">All Time</Select.Item>
                  <Select.Item value="today">Today</Select.Item>
                  <Select.Item value="week">This Week</Select.Item>
                  <Select.Item value="month">This Month</Select.Item>
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
              Export Login History
            </Button>
          </Box>
        </Flex>

        {/* Login History Table */}
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
                  label="Username"
                  sortKey="username"
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
                  label="Device"
                  sortKey="device"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="Location"
                  sortKey="location"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Failed Reason</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          
          <Table.Body>
            {paginatedHistory.length > 0 ? (
              paginatedHistory.map(login => (
                <Table.Row key={login.id}>
                  <Table.Cell>{formatTimestamp(login.timestamp)}</Table.Cell>
                  <Table.Cell>
                    <Text weight="medium">{login.username}</Text>
                    {getSuspiciousBadge(login)}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={login.status === "success" ? "green" : "red"}>
                      {login.status === "success" ? "Success" : "Failed"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell><Code color="gray">{login.ipAddress}</Code></Table.Cell>
                  <Table.Cell>{login.device}</Table.Cell>
                  <Table.Cell>{login.location}</Table.Cell>
                  <Table.Cell>
                    {login.failedReason ? (
                      <Text color="red">{login.failedReason}</Text>
                    ) : (
                      <Text color="gray">-</Text>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={7}>
                  <Text align="center" className="py-4">No login history found</Text>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>

        {/* Pagination */}
        {filteredHistory.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredHistory.length}
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
            Export Login History
          </Button>
        </Box>
      </Flex>
    </Box>
  );
} 