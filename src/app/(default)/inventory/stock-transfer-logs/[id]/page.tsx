'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Heading,
  Text,
  Button,
  Flex,
  Table,
  Badge,
  IconButton,
  Tabs,
  Callout,
  Inset,
} from '@radix-ui/themes';
import { ArrowLeft, AlertTriangle, FileText, Package, ArrowRight } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { getTransferLogById, getUserById } from '@/data/StockTransferLogData';
import { organization } from '@/data/CommonData';
import { getStockItemById } from '@/data/StockTransferLogData';
import { formatDate } from '@/utilities/index';
import { getTransferStatusBadge } from '@/utilities/transferStatusBadge';
import { PageHeading } from '@/components/common/PageHeading';
import Image from 'next/image';

export default function StockTransferLogDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [transferLog, setTransferLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch transfer log details
  useEffect(() => {
    setLoading(true);
    try {
      const logId = params.id as string;
      const foundLog = getTransferLogById(logId);
      
      if (!foundLog) {
        setError('Transfer log not found');
        setTransferLog(null);
      } else {
        setTransferLog(foundLog);
        setError(null);
      }
    } catch (err) {
      setError(`Failed to load transfer log details: ${err}`);
      setTransferLog(null);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  const handleBack = () => {
    router.push('/inventory/stock-transfer-logs');
  };

  if (loading) {
    return (
      <Box className="p-6">
        <Text>Loading transfer log details...</Text>
      </Box>
    );
  }

  if (error || !transferLog) {
    return (
      <Box className="p-6">
        <Flex align="center" gap="3" mb="4">
          <IconButton variant="ghost" onClick={handleBack}>
            <ArrowLeft size={20} />
          </IconButton>
          <Heading size="6">Transfer Log Error</Heading>
        </Flex>
        <Card>
          <Text color="red">{error || 'Transfer log not found'}</Text>
          <Button mt="4" onClick={handleBack}>Back to Transfer Logs</Button>
        </Card>
      </Box>
    );
  }

  // Get organization names
  const originName = organization.find(org => org.id === transferLog.originId)?.name || 'Unknown';
  const destinationName = organization.find(org => org.id === transferLog.destinationId)?.name || 'Unknown';
  
  // Get user names
  const creatorName = getUserById(transferLog.createdBy)?.name || 'Unknown';
  const approverName = transferLog.approvedBy ? getUserById(transferLog.approvedBy).name : 'N/A';
  const rejectedBy = transferLog.rejectedBy ? getUserById(transferLog.rejectedBy).name : 'N/A';
  return (
    <Box className="space-y-4">
      {/* Header with back button */}
      <PageHeading 
        title="Transfer Log" 
        description="View details of stock transfer between branches"
        showBackButton
        onBackClick={handleBack}
      >
        <Flex gap="2" align="center">
          <Badge color="blue">{originName}</Badge>
          <ArrowRight size={16} color="gray" />
          <Badge color="green">{destinationName}</Badge>
        </Flex>
      </PageHeading>

      {/* Transfer details card */}
      <Card size="3">
        <Flex direction="column" gap="4">
          <Inset side="top">
            <Flex 
              className="px-5 py-3 border-b border-slate-200 dark:border-neutral-800"
              justify="between"
              align="center"
            >
              <Flex gap="3" align="center">
                <Text size="5" weight="bold" className="text-slate-800 dark:text-neutral-200">{transferLog.transferNumber}</Text>
                {getTransferStatusBadge({ status: transferLog.status })}
              </Flex>
              <Text size="2" className="text-slate-500 dark:text-neutral-500">
                Created on {formatDate(new Date(transferLog.dateCreated))}
              </Text>
            </Flex>
          </Inset>

          {/* Main details grid */}
          <Flex className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-5 gap-x-8">
            <Flex direction="column" gap="1">
              <Text as="p" size="2" className="text-slate-500 dark:text-neutral-500">From</Text>
              <Text as="p" weight="medium" size="2" className="text-slate-800 dark:text-neutral-200">{originName}</Text>
            </Flex>
            <Flex direction="column" gap="1">
              <Text as="p" size="2" className="text-slate-500 dark:text-neutral-500">To</Text>
              <Text as="p" weight="medium" size="2" className="text-slate-800 dark:text-neutral-200">{destinationName}</Text>
            </Flex>
            <Flex direction="column" gap="1">
              <Text as="p" size="2" className="text-slate-500 dark:text-neutral-500">Created By</Text>
              <Text as="p" weight="medium" size="2" className="text-slate-800 dark:text-neutral-200">{creatorName}</Text>
            </Flex>
            {transferLog.status !== 'Rejected' && transferLog.status !== 'New' && (
            <Flex direction="column" gap="1">
              <Text as="p" size="2" className="text-slate-500 dark:text-neutral-500">Approved By</Text>
              <Text as="p" weight="medium" size="2" className="text-slate-800 dark:text-neutral-200">{approverName}</Text>
            </Flex>
            )}
            {transferLog.status === 'Rejected' && (
            <Flex direction="column" gap="1">
              <Text as="p" size="2" className="text-slate-500 dark:text-neutral-500">Rejected By</Text>
              <Text as="p" weight="medium" size="2" className="text-slate-800 dark:text-neutral-200">{rejectedBy}</Text>
            </Flex>
            )}
            {transferLog.dateReceived && (
              <Flex direction="column" gap="1">
                <Text as="p" size="2" className="text-slate-500 dark:text-neutral-500">Date Received</Text>
                <Text as="p" weight="medium" size="2" className="text-slate-800 dark:text-neutral-200">
                  {formatDate(new Date(transferLog.dateReceived))}
                </Text>
              </Flex>
            )}
          </Flex>

          {transferLog.notes && (
            <Box className="bg-slate-50 dark:bg-neutral-800 p-4 rounded-md mt-2">
              <Text as="p" size="2" className="text-slate-500 dark:text-neutral-500 mb-1">Transfer Notes</Text>
              <Text as="p" size="2" className="text-slate-800 dark:text-neutral-200">{transferLog.notes}</Text>
            </Box>
          )}
          
          {transferLog.hasDiscrepancies && (
            <Callout.Root color="amber" className="mt-2 bg-amber-50 dark:bg-neutral-800">
              <Flex gap="3" align="start">
                <AlertTriangle size={20} className="text-amber-600 mt-0.5" />
                <Box>
                  <Text weight="bold" size="3" className="text-amber-800 dark:text-neutral-200">Discrepancies Detected</Text><br/>
                  <Text size="2" className="text-amber-700 dark:text-neutral-200 mt-1">
                    This transfer has reported discrepancies between expected and received items.
                  </Text>
                </Box>
              </Flex>
            </Callout.Root>
          )}
        </Flex>
      </Card>

      {/* Tabs for Items and Attachments */}
      <Tabs.Root defaultValue="items">
        <Tabs.List>
          <Tabs.Trigger value="items">
            <Flex gap="1" align="center">
              <Package size={16} />
              <Text>Items ({transferLog.items.length})</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="attachments">
            <Flex gap="1" align="center">
              <FileText size={16} />
              <Text>Attachments ({transferLog.attachments.length})</Text>
            </Flex>
          </Tabs.Trigger>
        </Tabs.List>
        
        {/* Items Tab */}
        <Tabs.Content value="items">
          <Table.Root variant="surface" mt="3">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Expected Qty</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Received Qty</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Condition</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Notes</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {transferLog.items.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={5} align="center">No items found in this transfer.</Table.Cell>
                </Table.Row>
              ) : (
                transferLog.items.map((item) => {
                  const stockItem = getStockItemById(item.stockItemId);
                  const hasDiscrepancy = item.discrepancy !== undefined;
                  
                  return (
                    <Table.Row key={item.id}>
                      <Table.RowHeaderCell>
                        <Flex direction="column">
                          <Text weight="bold">{stockItem?.name || 'Unknown Item'}</Text>
                          <Text size="1" color="gray">{stockItem?.sku || ''}</Text>
                        </Flex>
                      </Table.RowHeaderCell>
                      
                      <Table.Cell>
                        {item.quantity} {stockItem?.storageUnit || 'units'}
                      </Table.Cell>
                      
                      <Table.Cell>
                        {hasDiscrepancy ? (
                          <Flex gap="2" align="center">
                            {item.discrepancy.receivedQuantity} {stockItem?.storageUnit || 'units'}
                            {item.discrepancy.receivedQuantity !== item.quantity && (
                              <Badge color="red" size="1">
                                <Flex gap="1" align="center">
                                  <AlertTriangle size={12} />
                                  {item.discrepancy.receivedQuantity < item.quantity
                                    ? `Missing ${item.quantity - item.discrepancy.receivedQuantity}`
                                    : `Extra ${item.discrepancy.receivedQuantity - item.quantity}`}
                                </Flex>
                              </Badge>
                            )}
                          </Flex>
                        ) : (
                          `${item.quantity} ${stockItem?.storageUnit || 'units'}`
                        )}
                      </Table.Cell>
                      
                      <Table.Cell>
                        {hasDiscrepancy ? (
                          <Badge color={
                            item.discrepancy.condition === 'good' ? 'green' :
                            item.discrepancy.condition === 'damaged' ? 'red' : 'amber'
                          }>
                            {item.discrepancy.condition.charAt(0).toUpperCase() + item.discrepancy.condition.slice(1)}
                          </Badge>
                        ) : (
                          '-'
                        )}
                      </Table.Cell>
                      
                      <Table.Cell>
                        {hasDiscrepancy && item.discrepancy.notes ? item.discrepancy.notes : '-'}
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              )}
            </Table.Body>
          </Table.Root>
        </Tabs.Content>
        
        {/* Attachments Tab */}
        <Tabs.Content value="attachments">
          <Card size="2" mt="3">
            {transferLog.attachments.length === 0 ? (
              <Flex justify="center" align="center" p="6" direction="column" gap="3">
                <FileText size={32} className="text-slate-400" />
                <Text color="gray">No attachments for this transfer</Text>
              </Flex>
            ) : (
              <Box>
                <Text weight="medium" size="3" mb="3">Documents & Photos</Text>
                <Flex gap="4" wrap="wrap">
                  {transferLog.attachments.map(attachment => {
                    return (
                      <Card key={attachment.id} className="w-[200px]">
                        <Flex direction="column" gap="2">
                          <Flex justify="center" align="center" className="bg-slate-100 h-[150px] rounded-md">
                            {attachment.type === 'receipt' || attachment.type === 'damage' ? (
                              <Box position="relative" style={{ width: '100%', height: '150px' }}>
                                <Image 
                                  src={attachment.url} 
                                  alt={attachment.fileName}
                                  width={200}
                                  height={150}
                                  className="w-full h-full object-cover rounded-md"
                                />
                              </Box>
                            ) : (
                              <FileText size={48} className="text-slate-400" />
                            )}
                          </Flex>
                          <Box>
                            <Text as="p" size="1" weight="medium" className="truncate">
                              {attachment.fileName}
                            </Text>
                            <Badge size="1" color={
                              attachment.type === 'receipt' ? 'green' :
                              attachment.type === 'damage' ? 'red' : 'gray'
                            }>
                              {attachment.type.charAt(0).toUpperCase() + attachment.type.slice(1)}
                            </Badge>
                          </Box>
                        </Flex>
                      </Card>
                    );
                  })}
                </Flex>
              </Box>
            )}
          </Card>
        </Tabs.Content>
      </Tabs.Root>

      {/* Action button */}
      <Flex gap="3">
        <Button variant="soft" color="gray" onClick={handleBack}>
          <ArrowLeft size={16} />
          Back to Logs
        </Button>
      </Flex>
    </Box>
  );
} 