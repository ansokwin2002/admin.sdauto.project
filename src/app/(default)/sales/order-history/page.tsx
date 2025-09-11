'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  Flex,
  Badge,
  TextField,
  Select,
  Table,
} from '@radix-ui/themes';
import { 
  Search,
  ChevronRight, 
  FileDown,
  Printer,
  RefreshCcw
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { orderHistoryData, OrderHistoryItem } from '@/data/OrderHistoryData';
import { organization } from '@/data/CommonData';
import Pagination from '@/components/common/Pagination';
import { PageHeading } from '@/components/common/PageHeading';
import { usePageTitle } from '@/hooks/usePageTitle'
import { SortableHeader } from '@/components/common/SortableHeader';

const ITEMS_PER_PAGE = 10;

export default function OrderHistoryPage() {
  usePageTitle('Order History')
  const router = useRouter();
  const [allOrders] = useState<OrderHistoryItem[]>(orderHistoryData);
  const [filteredOrders, setFilteredOrders] = useState<OrderHistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    // Apply filters
    let filtered = [...allOrders];
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.customer.toLowerCase().includes(term) ||
        order.orderNumber.toLowerCase().includes(term) ||
        order.id.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(order => order.type === typeFilter);
    }

    // Apply branch filter
    if (branchFilter !== 'all') {
      filtered = filtered.filter(order => order.branch === branchFilter);
    }
    
    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key as keyof OrderHistoryItem];
        let bValue = b[sortConfig.key as keyof OrderHistoryItem];

        if (sortConfig.key === 'total') {
          aValue = a.total;
          bValue = b.total;
        } else if (sortConfig.key === 'timeCreated') {
          aValue = a.timeCreated.getTime();
          bValue = b.timeCreated.getTime();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    } else {
      // Default sort by most recent first
      filtered.sort((a, b) => b.timeCreated.getTime() - a.timeCreated.getTime());
    }
    
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter, branchFilter, sortConfig, allOrders]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredOrders.length);
  const currentItems = filteredOrders.slice(startIndex, endIndex);

  // Navigate to order details
  const navigateToOrderDetails = (orderId: string) => {
    router.push(`/sales/order-history/${orderId}`);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setBranchFilter('all');
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      case 'refunded': return 'orange';
      case 'partially_refunded': return 'yellow';
      default: return 'gray';
    }
  };

  // Format date function
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format time function
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Order #', 'Customer', 'Type', 'Items', 'Total', 'Status', 'Date', 'Time', 'Branch'];
    const csvData = filteredOrders.map(order => [
      order.orderNumber,
      order.customer,
      order.type,
      order.items.length,
      `$${order.total.toFixed(2)}`,
      order.status,
      formatDate(order.timeCreated),
      formatTime(order.timeCreated),
      order.branch || 'N/A'
    ]);
    
    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    // Create a Blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `order_history_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <Box className="space-y-4">
      <Flex 
        direction={{ initial: "column", sm: "row" }} 
        justify="between" 
        align={{ initial: "stretch", sm: "center" }}
        gap={{ initial: "4", sm: "0" }}
        mb="5"
      >
        <PageHeading title="Order History" description="View all past orders and transactions" noMarginBottom />
        <Flex gap="2" width={{ initial: "full", sm: "auto" }}>
          <Box width={{ initial: "full", sm: "auto" }}>
            <Button variant="outline" color="gray" onClick={exportToCSV}>
              <FileDown size={16} />
              <Text>Export</Text>
            </Button>
          </Box>
          <Box width={{ initial: "full", sm: "auto" }}>
            <Button variant="outline" color="gray">
              <Printer size={16} />
              <Text>Print</Text>
            </Button>
          </Box>
        </Flex>
      </Flex>

      <Box> 
        <Flex gap="4" align="center" wrap="wrap">
          <Box className="flex-grow min-w-[250px]">
            <TextField.Root
              placeholder="Search by order # or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            >
              <TextField.Slot>
                <Search size={16} />
              </TextField.Slot>
            </TextField.Root>
          </Box>

          <Flex align="center" gap="2" className="flex-shrink-0">
            <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
              <Select.Trigger placeholder="All Statuses" />
              <Select.Content>
                <Select.Item value="all">All Statuses</Select.Item>
                <Select.Item value="completed">Completed</Select.Item>
                <Select.Item value="cancelled">Cancelled</Select.Item>
                <Select.Item value="refunded">Refunded</Select.Item>
                <Select.Item value="partially_refunded">Partially Refunded</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>

          <Flex align="center" gap="2" className="flex-shrink-0">
            <Select.Root value={typeFilter} onValueChange={setTypeFilter}>
              <Select.Trigger placeholder="All Types" />
              <Select.Content>
                <Select.Item value="all">All Types</Select.Item>
                <Select.Item value="Dine-in">Dine-in</Select.Item>
                <Select.Item value="Takeout">Takeout</Select.Item>
                <Select.Item value="Delivery">Delivery</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>

          <Flex align="center" gap="2" className="flex-shrink-0">
            <Select.Root value={branchFilter} onValueChange={setBranchFilter}>
              <Select.Trigger placeholder="All Branches" />
              <Select.Content>
                <Select.Item value="all">All Branches</Select.Item>
                {organization.filter(org => org.id !== "hq").map(branch => (
                  <Select.Item key={branch.id} value={branch.name}>{branch.name}</Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>

          <Button 
            variant="soft" 
            color={(statusFilter !== 'all' || typeFilter !== 'all' || branchFilter !== 'all' || searchTerm !== '') ? 'red' : 'gray'} 
            onClick={handleResetFilters}
            className="flex-shrink-0"
            disabled={(statusFilter === 'all' && typeFilter === 'all' && branchFilter === 'all' && searchTerm === '')}
          >
            <RefreshCcw size={16} />
            Reset Filters
          </Button>
        </Flex>
      </Box>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Order #"
                sortKey="orderNumber"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Customer"
                sortKey="customer"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Type"
                sortKey="type"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Total"
                sortKey="total"
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
                label="Date & Time"
                sortKey="timeCreated"
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
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {currentItems.length > 0 ? (
            currentItems.map((order) => (
              <Table.Row key={order.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800 cursor-pointer" onClick={() => navigateToOrderDetails(order.id)}>
                <Table.Cell>
                  <Text weight="bold">#{order.orderNumber}</Text>
                </Table.Cell>
                <Table.Cell>{order.customer}</Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="1">
                    {order.type === 'Dine-in' ? (
                      <Text size="2">Table {order.table}</Text>
                    ) : (
                      <Text size="2">{order.type}</Text>
                    )}
                  </Flex>
                </Table.Cell>
                <Table.Cell>${order.total.toFixed(2)}</Table.Cell>
                <Table.Cell>
                  <Badge color={getStatusColor(order.status)} className="capitalize">
                    {order.status.replace('_', ' ')}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Text size="2">{formatDate(order.timeCreated)}</Text>
                  <Text size="2" color="gray" ml="2" >{formatTime(order.timeCreated)}</Text>
                </Table.Cell>
                <Table.Cell>
                  {order.branch && (
                    <Badge variant="surface" color="gray">
                      {order.branch}
                    </Badge>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Button size="1" onClick={(e) => {
                    e.stopPropagation();
                    navigateToOrderDetails(order.id);
                  }}>
                    View
                    <ChevronRight size={14} />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={8}>
                <Box className="py-8 text-center">
                  <Text size="2" color="gray">No order history found. Try adjusting your filters.</Text>
                </Box>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>

      {filteredOrders.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredOrders.length}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(newSize) => {
            setItemsPerPage(newSize);
            setCurrentPage(1);
          }}
        />
      )}
    </Box>
  );
}
