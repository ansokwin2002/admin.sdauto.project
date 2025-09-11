'use client';

import { Card, Box, Text, Flex, Table, Badge, ScrollArea } from '@radix-ui/themes';
import { ShoppingCart, Package, File } from 'lucide-react';
import { mockSupplierOrders } from '@/data/SupplierData';
import Pagination from '@/components/common/Pagination';
import { useState } from 'react';

// Number of items per page
const ITEMS_PER_PAGE = 10;

interface SupplierOrderHistoryProps {
  supplierId: string;
}

export default function SupplierOrderHistory({ supplierId }: SupplierOrderHistoryProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  
  // Filter orders for this supplier
  const supplierOrders = mockSupplierOrders.filter(order => order.supplierId === supplierId);
  
  // Pagination logic
  const totalPages = Math.ceil(supplierOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, supplierOrders.length);
  const paginatedOrders = supplierOrders.slice(startIndex, endIndex);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending':
        return 'orange';
      case 'delivered':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Box>
      {supplierOrders.length === 0 ? (
        <Card>
          <Box className="py-6 text-center text-slate-500 dark:text-neutral-400">
            <Package className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-neutral-600" />
            <Text as="p">No orders found for this supplier</Text>
          </Box>
        </Card>
      ) : (
        <Box>
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Order Number</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Order Date</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Updated At</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Items</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="right">Total Quantity</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="right">Total Amount</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginatedOrders.map((order) => (
                <Table.Row key={order.id}>
                  <Table.Cell>
                    <Flex align="center" gap="2">
                      <File className="h-4 w-4 text-slate-400" />
                      <Text weight="medium">{order.orderNumber}</Text>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>{formatDate(order.orderDate)}</Table.Cell>
                  <Table.Cell>{formatDate(order.updatedAt)}</Table.Cell>
                  <Table.Cell>
                    <Text>{order.totalItems} items</Text>
                  </Table.Cell>
                  <Table.Cell align="right">{order.totalQuantity}</Table.Cell>
                  <Table.Cell align="right">${order.totalAmount.toFixed(2)}</Table.Cell>
                  <Table.Cell>
                    <Badge color={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          
          {supplierOrders.length > ITEMS_PER_PAGE && (
            <Box className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={supplierOrders.length}
                startIndex={startIndex + 1}
                endIndex={endIndex}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(newSize) => {
                  setItemsPerPage(newSize);
                  setCurrentPage(1); // Reset to first page when changing items per page
                }}
              />
            </Box>
          )}
        </Box>
      )}    
    </Box>
  );
} 