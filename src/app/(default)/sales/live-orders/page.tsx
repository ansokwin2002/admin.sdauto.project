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
  Table
} from '@radix-ui/themes';
import { Search, RotateCcw, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { liveOrdersData, LiveOrder } from '@/data/LiveOrdersData';
import Pagination from '@/components/common/Pagination';
import OrderTimer from '@/components/common/OrderTimer';
import { PageHeading } from '@/components/common/PageHeading';
import { usePageTitle } from '@/hooks/usePageTitle';
import { SortableHeader } from '@/components/common/SortableHeader';

const ITEMS_PER_PAGE = 10;

export default function LiveOrdersPage() {
  usePageTitle('Live Orders');
  const router = useRouter();
  const [allOrders] = useState<LiveOrder[]>(liveOrdersData);
  const [filteredOrders, setFilteredOrders] = useState<LiveOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
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

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key as keyof LiveOrder];
        let bValue = b[sortConfig.key as keyof LiveOrder];

        if (sortConfig.key === 'total') {
          aValue = a.total;
          bValue = b.total;
        } else if (sortConfig.key === 'items') {
          aValue = a.items.length;
          bValue = b.items.length;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter, sortConfig, allOrders]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredOrders.length);
  const currentItems = filteredOrders.slice(startIndex, endIndex);

  // Navigate to order details
  const navigateToOrderDetails = (orderId: string) => {
    router.push(`/sales/live-orders/${orderId}`);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'blue';
      case 'preparing': return 'yellow';
      case 'cooking': return 'orange';
      case 'ready': return 'green';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
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
      <Flex justify="between" align="start" mb="5">
        <PageHeading title="Live Orders" description="View and manage all current orders" noMarginBottom />
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
                <Select.Item value="new">New</Select.Item>
                <Select.Item value="preparing">Preparing</Select.Item>
                <Select.Item value="cooking">Cooking</Select.Item>
                <Select.Item value="ready">Ready</Select.Item>
                <Select.Item value="completed">Completed</Select.Item>
                <Select.Item value="cancelled">Cancelled</Select.Item>
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

          <Button variant="soft" color={statusFilter !== 'all' || typeFilter !== 'all' ? 'red' : 'gray'} onClick={handleResetFilters}>
            <RotateCcw size={16} />
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
                label="Items"
                sortKey="items"
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
            <Table.ColumnHeaderCell>Time</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {currentItems.map((order) => (
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
              <Table.Cell>{order.items.length}</Table.Cell>
              <Table.Cell>${order.total.toFixed(2)}</Table.Cell>
              <Table.Cell>
                <Badge color={getStatusColor(order.status)} className="capitalize">
                  {order.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <OrderTimer 
                  timeReceived={order.timeReceived} 
                  isCompleted={order.isCompleted}
                  color={order.isCompleted ? "green" : undefined}
                />
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
          ))}
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
