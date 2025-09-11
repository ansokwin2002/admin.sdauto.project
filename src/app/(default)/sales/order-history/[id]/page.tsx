'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Box, Heading, Flex, Text, Grid, Badge, Button, Table, Separator, Dialog, TextField, IconButton, TextArea } from '@radix-ui/themes';
import { ArrowLeft, CreditCard, AlertCircle, Printer, User, Phone, MapPin, FileDown, Calendar, Clock, DollarSign, BanknoteIcon, ReceiptText, Store, X } from 'lucide-react';
import { orderHistoryData, OrderHistoryItem } from '@/data/OrderHistoryData';
import { PageHeading } from '@/components/common/PageHeading';
import CardHeading from '@/components/common/CardHeading';
import { usePageTitle } from '@/hooks/usePageTitle'

export default function OrderHistoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<OrderHistoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState<string>('');
  const [refundReason, setRefundReason] = useState<string>('');

  useEffect(() => {
    // Find the order from mock data
    const foundOrder = orderHistoryData.find(o => o.id === orderId);
    
    if (foundOrder) {
      setOrder(foundOrder);
      // Initialize refund amount to full total if not already refunded
      if (!foundOrder.refundAmount && foundOrder.status !== 'refunded' && foundOrder.status !== 'partially_refunded') {
        setRefundAmount(foundOrder.total.toFixed(2));
      } else if (foundOrder.refundAmount) {
        setRefundAmount(foundOrder.refundAmount.toFixed(2));
      }
    }
    
    setLoading(false);
  }, [orderId]);

  usePageTitle(order ? `Order ${order.orderNumber}` : 'Order Details')

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

  // Process refund
  const handleRefund = () => {
    if (!order || !refundAmount || parseFloat(refundAmount) <= 0) return;
    
    const refundAmountNum = parseFloat(refundAmount);
    const newStatus = refundAmountNum >= order.total ? 'refunded' as const : 'partially_refunded' as const;
    
    const updatedOrder = {
      ...order,
      status: newStatus,
      refundAmount: refundAmountNum,
      refundReason: refundReason
    };
    
    setOrder(updatedOrder);
    setIsRefundDialogOpen(false);
    
    // In a real app, this would make an API call to process the refund
  };

  // Print invoice
  const printInvoice = () => {
    // In a real app, this would trigger a print window or PDF generation
    alert('Printing invoice (Mock functionality)');
  };

  // Download invoice as PDF
  const downloadInvoice = () => {
    // In a real app, this would generate and download a PDF
    alert('Downloading invoice as PDF (Mock functionality)');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Text>Loading order details...</Text>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <Box mb="4">
          <Button variant="ghost" color="gray" size="2" onClick={() => router.push('/sales/order-history')}>
            <ArrowLeft size={16} />
            <Text>Back to Order History</Text>
          </Button>
        </Box>
        <Card size="3" className="p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <Heading as="h2" size="5" mb="2">Order Not Found</Heading>
          <Text as="p" size="2" color="gray">The order you&apos;re looking for doesn&apos;t exist or has been removed.</Text>
          <Button variant="soft" color="gray" mt="4" onClick={() => router.push('/sales/order-history')}>
            <Text>Return to Order History</Text>
          </Button>
        </Card>
      </div>
    );
  }

  // Calculate subtotal
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Assume tax is 8.5% of subtotal
  const taxRate = 0.085;
  const tax = subtotal * taxRate;
  
  return (
    <Box className="space-y-4">
      <Flex 
        direction={{ initial: "column", sm: "row" }} 
        justify="between" 
        align={{ initial: "stretch", sm: "center" }}
        gap={{ initial: "4", sm: "0" }}
        mb="5"
      >
        <Flex direction="column" gap="2">
          <PageHeading
            title={`Order ${order.orderNumber}`}
            description={`Order details for order ${order.orderNumber}`}
            showBackButton={true} 
            onBackClick={() => router.push('/sales/order-history')}
            noMarginBottom={true}
          >
            <Flex gap="3" align="center" wrap="wrap">
              <Badge size="2" color={getStatusColor(order.status)} className="capitalize">
                {order.status.replace('_', ' ')}
              </Badge>
              <Text size="2" color="gray">{formatDate(order.timeCreated)} {formatTime(order.timeCreated)}</Text>
              {order.branch && (
                <Badge variant="surface" color="gray">{order.branch}</Badge>
              )}
            </Flex>
          </PageHeading>
        </Flex>

        <Flex gap="2" width={{ initial: "full", sm: "auto" }}>
          <Box width={{ initial: "full", sm: "auto" }}>
            <Button variant="outline" color="gray" size="2" onClick={printInvoice} className="w-full sm:w-auto">
              <Printer size={16} />
              <Text>Print Receipt</Text>
            </Button>
          </Box>
          <Box width={{ initial: "full", sm: "auto" }}>
            <Button variant="outline" color="gray" size="2" onClick={downloadInvoice} className="w-full sm:w-auto">
              <FileDown size={16} />
              <Text>Download Invoice</Text>
            </Button>
          </Box>
        </Flex>
      </Flex>

      <Grid columns={{ initial: "1", md: "5" }} gap="4">
        {/* Order Info Column */}
        <Box className="md:col-span-3">
          {/* Order Details Card */}
          <Card size="2" mb="4">
            <Flex justify="between" align="center" mb="4">
              <CardHeading title="Order Details" mb="0" />
              <Flex gap="2">
                <Badge size="2" className="capitalize">{order.type}</Badge>
                {order.type === 'Dine-in' && order.table && (
                  <Badge color="blue" size="2">Table {order.table}</Badge>
                )}
              </Flex>
            </Flex>
            
            <Table.Root variant="surface">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Total</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {order.items.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>
                      <Box>
                        <Text as="p" weight="medium">{item.name}</Text>
                        <Flex gap="2">
                          {item.modifiers && item.modifiers.length > 0 && (
                            <Text size="1" color="gray">Size: {item.modifiers.join(', ')}</Text>
                          )}
                          {item.addons && item.addons.length > 0 && (
                            <Text size="1" color="gray">Add: {item.addons.join(', ')}</Text>
                          )}
                        </Flex>
                      </Box>
                    </Table.Cell>
                    <Table.Cell>{item.quantity}</Table.Cell>
                    <Table.Cell>${item.price.toFixed(2)}</Table.Cell>
                    <Table.Cell>${(item.price * item.quantity).toFixed(2)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>

            {/* Order Notes */}
            {order.notes && (
              <Card className="p-2 bg-slate-50 dark:bg-neutral-800" mt="4">
                <Heading as="h4" size="2" mb="2">Order Notes</Heading>
                <Text size="2">{order.notes}</Text>
              </Card>
            )}

            {/* Order Summary */}
            <Box mt="4">
              <Flex justify="between" align="center" mt="2">
                <Text size="2">Subtotal</Text>
                <Text size="2">${subtotal.toFixed(2)}</Text>
              </Flex>
              <Flex justify="between" align="center" mt="2">
                <Text size="2">Tax (8.5%)</Text>
                <Text size="2">${tax.toFixed(2)}</Text>
              </Flex>
              
              {/* Show refund info if order has been refunded */}
              {(order.status === 'refunded' || order.status === 'partially_refunded') && order.refundAmount && (
                <>
                  <Separator my="2" size="4" />
                  <Flex justify="between" align="center" mt="2" className="text-orange-500">
                    <Text size="2" color="orange">Refund Amount</Text>
                    <Text size="2" color="orange">-${order.refundAmount.toFixed(2)}</Text>
                  </Flex>
                  {order.refundReason && (
                    <Text size="1" color="gray" mt="1">Reason: {order.refundReason}</Text>
                  )}
                </>
              )}
              
              <Separator my="2" size="4" />
              <Flex justify="between" align="center" mt="2">
                <Text size="3" weight="bold">Total</Text>
                <Text size="3" weight="bold">
                  ${order.status === 'refunded' ? '0.00' : 
                    order.status === 'partially_refunded' ? 
                    (order.total - (order.refundAmount || 0)).toFixed(2) : 
                    order.total.toFixed(2)
                  }
                </Text>
              </Flex>
            </Box>
          </Card>
          
          {/* Order Timeline Card */}
          <Card size="2">
            <CardHeading title="Order Information" />
            
            <Grid columns="2" gap="4">
              <Box>
                <Heading as="h4" size="2" mb="2">Order Details</Heading>
                <Flex direction="column" gap="2">
                  <Flex align="center" gap="2">
                    <ReceiptText size={16} className="text-slate-500 dark:text-neutral-600" />
                    <Text size="2">Order ID: #{order.orderNumber}</Text>
                  </Flex>
                  <Flex align="center" gap="2">
                    <Calendar size={16} className="text-slate-500 dark:text-neutral-600" />
                    <Text size="2">Date: {formatDate(order.timeCreated)}</Text>
                  </Flex>
                  <Flex align="center" gap="2">
                    <Clock size={16} className="text-slate-500 dark:text-neutral-600" />
                    <Text size="2">Time: {formatTime(order.timeCreated)}</Text>
                  </Flex>
                  <Flex align="center" gap="2">
                    <Store size={16} className="text-slate-500 dark:text-neutral-600" />
                    <Text size="2">Branch: {order.branch || 'N/A'}</Text>
                  </Flex>
                </Flex>
              </Box>
              
              <Box>
                <Heading as="h4" size="2" mb="2">Payment Information</Heading>
                <Flex direction="column" gap="2">
                  <Flex align="center" gap="2">
                    <CreditCard size={16} className="text-slate-500 dark:text-neutral-600" />
                    <Text size="2">Payment Method: {order.paymentMethod}</Text>
                  </Flex>
                  <Flex align="center" gap="2">
                    <DollarSign size={16} className="text-slate-500 dark:text-neutral-600" />
                    <Text size="2">Amount: ${order.total.toFixed(2)}</Text>
                  </Flex>
                  <Flex align="center" gap="2">
                    <BanknoteIcon size={16} className="text-slate-500 dark:text-neutral-600" />
                    <Text size="2">Status: <Badge color={getStatusColor(order.status)} size="1" className="capitalize">{order.status.replace('_', ' ')}</Badge></Text>
                  </Flex>
                  
                  {/* Show refund info if order has been refunded */}
                  {(order.status === 'refunded' || order.status === 'partially_refunded') && order.refundAmount && (
                    <Flex align="center" gap="2">
                      <AlertCircle size={16} className="text-orange-500" />
                      <Text size="2" color="orange">Refunded: ${order.refundAmount.toFixed(2)}</Text>
                    </Flex>
                  )}
                </Flex>
              </Box>
            </Grid>
          </Card>
        </Box>
        
        {/* Customer and Actions Column */}
        <Box className="md:col-span-2">
          {/* Customer Details Card */}
          <Card size="2" mb="4">
            <CardHeading title="Customer Details" />
            
            <Flex direction="column" gap="3">
              <Flex align="center" gap="2">
                <User size={16} className="text-slate-500 dark:text-neutral-600" />
                <Text weight="medium">{order.customer}</Text>
              </Flex>
              
              {order.type === 'Delivery' && (
                <>
                  <Flex align="center" gap="2">
                    <Phone size={16} className="text-slate-500 dark:text-neutral-600" />
                    <Text>+1 (555) 123-4567</Text>
                  </Flex>
                  <Flex align="start" gap="2">
                    <MapPin size={16} className="text-slate-500 dark:text-neutral-600" />
                    <Box>
                      <Text>123 Main Street</Text><br/>
                      <Text size="2" color="gray">Apt 4B New York, NY 10001</Text>
                    </Box>
                  </Flex>
                </>
              )}
            </Flex>
          </Card>
          
          {/* Refund Card - Only show for completed orders */}
          {(order.status === 'completed' || order.status === 'partially_refunded') && (
            <Card size="2">
              <Heading as="h3" size="3" mb="4">Refund Options</Heading>
              
              {order.status === 'partially_refunded' && order.refundAmount ? (
                <Box>
                  <Flex align="center" gap="2" mb="2">
                    <AlertCircle size={16} className="text-orange-500" />
                    <Text size="2">This order has been partially refunded</Text>
                  </Flex>
                  <Flex justify="between" className="bg-slate-50 dark:bg-neutral-800 p-3 rounded-md mb-3">
                    <Text size="2">Refunded Amount:</Text>
                    <Text size="2" weight="bold">${order.refundAmount.toFixed(2)}</Text>
                  </Flex>
                  {order.refundReason && (
                     <Flex justify="between" className="bg-slate-50 dark:bg-neutral-800 p-3 rounded-md mb-3">
                      <Text size="2">Reason:</Text>
                      <Text size="2">{order.refundReason}</Text>
                    </Flex>
                  )}
                  <Box className="w-full">
                    <Button color="red" variant="soft" onClick={() => setIsRefundDialogOpen(true)} className="w-full">
                      <DollarSign size={16} />
                      <Text>Process Additional Refund</Text>
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Text as="p" size="2" mb="4">Issue a refund for this order if needed. This will generate a refund receipt.</Text>
                  <Button color="red" variant="soft" onClick={() => setIsRefundDialogOpen(true)}>
                    <DollarSign size={16} />
                    <Text>Process Refund</Text>
                  </Button>
                </Box>
              )}
            </Card>
          )}
        </Box>
      </Grid>

      {/* Refund Dialog */}
      <Dialog.Root open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <Dialog.Content>
          <Flex justify="between" align="start" mb="4">
            <Dialog.Title>Process Refund</Dialog.Title>
            <Dialog.Close>
              <IconButton variant="ghost" color="gray" size="2">
                <X size={16} />
              </IconButton>
            </Dialog.Close>
          </Flex>
          <Dialog.Description size="2" mb="4">
            Please specify the refund amount and reason.
          </Dialog.Description>

          <Box className="space-y-4">
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">
                Refund Amount
              </Text>
              <TextField.Root
                type="number"
                placeholder="0.00"
                value={refundAmount}
                onChange={(e) => {
                  // Allow only numbers and decimals
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  // Ensure only valid decimal format
                  if (/^\d*\.?\d{0,2}$/.test(value)) {
                    setRefundAmount(value);
                  }
                }}
              >
                <TextField.Slot>$</TextField.Slot>
              </TextField.Root>
              <Text size="1" color="gray">
                Maximum refund amount: ${order.total.toFixed(2)}
              </Text>
            </Flex>

            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">
                Refund Reason
              </Text>
              <TextArea
                rows={3}
                placeholder="Enter reason for refund..."
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
              />
            </Flex>
          </Box>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                <X size={16} />
                Cancel
              </Button>
            </Dialog.Close>
            <Button 
              color="red" 
              onClick={handleRefund}
              disabled={!refundAmount || parseFloat(refundAmount) <= 0 || parseFloat(refundAmount) > order.total}
            >
              <DollarSign size={16} />
              Confirm Refund
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
} 