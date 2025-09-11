'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Text,
  Button,
  Flex,
  Table,
  IconButton,
  Heading
} from '@radix-ui/themes';
import { ArrowLeft, Truck, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { StockRequest, mockStockRequests } from '@/data/StockRequestData';
import { organization } from '@/data/CommonData';
import { getStockItemById } from '@/data/StockRequestData';
import { formatDate } from '@/utilities/index';
import { getTransferStatusBadge } from '@/utilities/transferStatusBadge';
import { toast } from 'sonner';
import { PageHeading } from '@/components/common/PageHeading';

// Array of relevant statuses for stock transfer out
const RELEVANT_STATUSES = ['Approved', 'Delivering'];

export default function StockTransferOutDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const requestId = params.id as string;

  const [stockRequest, setStockRequest] = useState<StockRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the stock request details
  useEffect(() => {
    setLoading(true);
    // In a real app, this would be an API call
    // For now, we'll simulate by finding the request in our mock data
    try {
      const foundRequest = mockStockRequests.find(req => req.id === requestId);
      
      if (!foundRequest) {
        setError('Stock transfer request not found');
        setStockRequest(null);
      } else if (!RELEVANT_STATUSES.includes(foundRequest.status) && foundRequest.status !== 'Completed') {
        setError('This request is not available for stock transfer out processing');
        setStockRequest(null);
      } else {
        setStockRequest(foundRequest);
        setError(null);
      }
    } catch (err) {
      setError(`Failed to load stock transfer details: ${err}`);
      setStockRequest(null);
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  // Handle deliver action
  const handleDeliver = () => {
    if (!stockRequest) return;
    
    // In a real app, this would involve an API call
    console.log(`Delivering request ${stockRequest.requestNumber}`);
    
    // Update local state
    setStockRequest({
      ...stockRequest,
      status: 'Delivering'
    });
    
    toast.success(`Delivering request ${stockRequest.requestNumber}`);
    router.push('/inventory/stock-transfer-out');
  };

  // Navigate back to the main stock transfer out page
  const handleBack = () => {
    router.push('/inventory/stock-transfer-out');
  };

  if (loading) {
    return (
      <Box className="p-6">
        <Text>Loading stock transfer details...</Text>
      </Box>
    );
  }

  if (error || !stockRequest) {
    return (
      <Box className="p-6">
        <Flex align="center" gap="3" mb="4">
          <IconButton variant="ghost" onClick={handleBack}>
            <ArrowLeft size={20} />
          </IconButton>
          <Heading size="6">Stock Transfer Out Error</Heading>
        </Flex>
        <Card>
          <Text color="red">{error || 'Stock transfer not found'}</Text>
          <Button mt="4" onClick={handleBack}>Back to Transfer List</Button>
        </Card>
      </Box>
    );
  }

  // Get origin and destination names
  const originName = organization.find(org => org.id === stockRequest.originId)?.name || 'Unknown';
  const destinationName = organization.find(org => org.id === stockRequest.destinationId)?.name || 'Unknown';

  return (
    <Box className="space-y-4">
      {/* Header section with back button */}
      <PageHeading 
        title={`Stock Transfer Out: ${stockRequest.requestNumber}`}
        description={`Manage transfer from ${originName} to ${destinationName}`}
        showBackButton
        onBackClick={handleBack}
      />

      {/* Request details card */}
      <Card size="3">
        <Flex direction="column" gap="3">
          <Flex justify="between" wrap="wrap" gap="4">
            <Box>
              <Text as="p" size="2" className="text-slate-500 dark:text-neutral-500">Request Number</Text>
              <Text as="p" size="2" weight="medium" className="text-slate-800 dark:text-white">{stockRequest.requestNumber}</Text>
            </Box>
            <Box>
              <Text as="p" size="2" className="text-slate-500 dark:text-neutral-500">Status</Text>
              {getTransferStatusBadge({ status: stockRequest.status })}
            </Box>
            <Box>
              <Text as="p" size="2" className="text-slate-500 dark:text-neutral-500">Date Requested</Text>
              <Text as="p" size="2" weight="medium" className="text-slate-800 dark:text-white">{formatDate(stockRequest.date)}</Text>
            </Box>
            <Box>
              <Text as="p" size="2" className="text-slate-500 dark:text-neutral-500">From</Text>
              <Text as="p" size="2" weight="medium" className="text-slate-800 dark:text-neutral-200">{originName}</Text>
            </Box>
            <Box>
              <Text as="p" size="2" className="text-slate-500 dark:text-neutral-500">To</Text>
              <Text as="p" size="2" weight="medium" className="text-slate-800 dark:text-neutral-200">{destinationName}</Text>
            </Box>
          </Flex>

          {stockRequest.notes && (
            <Box className="bg-slate-50 dark:bg-neutral-800 p-4 rounded-md mt-2">
              <Text as="p" size="2" className="text-slate-500 dark:text-neutral-500 mb-1">Notes</Text>
              <Text as="p" size="2" className="text-slate-800 dark:text-neutral-200">{stockRequest.notes}</Text>
            </Box>
          )}
        </Flex>
      </Card>

      {/* Items section */}
      <Box>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Item Code</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Item Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Unit</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Notes</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {stockRequest.items.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={5} align="center">No items found in this transfer.</Table.Cell>
              </Table.Row>
            ) : (
              stockRequest.items.map((item) => {
                const stockItem = getStockItemById(item.stockItemId);
                return (
                  <Table.Row key={item.id}>
                    <Table.RowHeaderCell>{stockItem?.sku || 'Unknown'}</Table.RowHeaderCell>
                    <Table.Cell>{stockItem?.name || 'Unknown Item'}</Table.Cell>
                    <Table.Cell>{item.quantity}</Table.Cell>
                    <Table.Cell>{item.unitOfMeasure}</Table.Cell>
                    <Table.Cell>{item.notes || '-'}</Table.Cell>
                  </Table.Row>
                );
              })
            )}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* Action buttons */}
      {stockRequest.status === 'Approved' && (
      <Flex  gap="3" align="center">
        <Button color="green" onClick={handleDeliver}>
          <Truck size={16} />
          Start Delivery
        </Button>
        <Button variant="soft" color="gray" onClick={handleBack}>
          <X size={16} />
          Cancel
        </Button>
        </Flex>
      )}
    </Box>
  );
} 