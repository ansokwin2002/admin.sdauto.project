'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Box, Heading, Flex, Text, Grid, Badge, Button, Table, Separator } from '@radix-ui/themes';
import { ArrowLeft, CreditCard, Receipt, CheckCircle, AlertCircle, FileText, Printer, User, Phone, MapPin, Edit, HandHelping, CookingPot, Soup } from 'lucide-react';
import { liveOrdersData, LiveOrder } from '@/data/LiveOrdersData';
import OrderTimer from '@/components/common/OrderTimer';
import { PageHeading } from '@/components/common/PageHeading';
import CardHeading from '@/components/common/CardHeading';
import { usePageTitle } from '@/hooks/usePageTitle'

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<LiveOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the order from mock data
    const foundOrder = liveOrdersData.find(o => o.id === orderId);
    
    if (foundOrder) {
      setOrder(foundOrder);
    }
    
    setLoading(false);
  }, [orderId]);

  usePageTitle(order ? `Order ${order.orderNumber}` : 'Order Details')

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

  // Handle status update
  const updateOrderStatus = (newStatus: 'new' | 'preparing' | 'cooking' | 'ready' | 'completed' | 'cancelled') => {
    if (order) {
      const updatedOrder = {
        ...order,
        status: newStatus,
        isCompleted: newStatus === 'completed' || newStatus === 'ready'
      };
      setOrder(updatedOrder);
      
      // In a real application, this would make an API call to update the order status
      // For mock data, we would update the order in the liveOrdersData array
    }
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
          <Button variant="ghost" color="gray" size="2" onClick={() => router.push('/sales/live-orders')}>
            <ArrowLeft size={16} />
            <Text>Back to Orders</Text>
          </Button>
        </Box>
        <Card size="3" className="p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <Heading as="h2" size="5" mb="2">Order Not Found</Heading>
          <Text as="p" size="2" color="gray">The order you&apos;re looking for doesn&apos;t exist or has been removed.</Text>
          <Button variant="soft" color="gray" mt="4" onClick={() => router.push('/sales/live-orders')}>
            <Text>Return to Orders</Text>
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
      <Flex justify="between" align="start" direction={{ initial: "column", sm: "row" }} mb="5">
        <Flex direction="column" gap="2">
          <Flex gap="2" align="center">
            <PageHeading
              title={`Order ${order.orderNumber}`}
              description={`Order details for order ${order.orderNumber}`}
              showBackButton={true}
              onBackClick={() => router.push('/sales/live-orders')}
              noMarginBottom={true}
            >
              <Flex gap="3" align="center">
                <Badge size="2" color={getStatusColor(order.status)} className="capitalize">
                  {order.status}
                </Badge>
                <OrderTimer 
                  timeReceived={order.timeReceived}
                  isCompleted={order.isCompleted}
                  color={order.isCompleted ? "green" : undefined}
                />
                <Text size="2" color="gray">{new Date(order.timeReceived).toLocaleString()}</Text>
              </Flex>
            </PageHeading>
          </Flex>
        </Flex>

        <Flex gap="2" mt={{ initial: "2", sm: "0"}} >
          <Button variant="outline" color="gray" size="2">
            <Printer size={16} />
            <Text>Print Receipt</Text>
          </Button>
          <Button variant="outline" color="gray" size="2">
            <FileText size={16} />
            <Text>Download Receipt</Text>
          </Button>
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
              <Separator my="2" size="4" />
              <Flex justify="between" align="center" mt="2">
                <Text size="3" weight="bold">Total</Text>
                <Text size="3" weight="bold">${order.total.toFixed(2)}</Text>
              </Flex>
            </Box>
          </Card>
          
          {/* Order Timeline Card */}
          <Card size="2">
            <CardHeading title="Order Timeline" />
            
            <Box className="relative pl-10">
              {/* Timeline connector line */}
              <Box className="absolute left-4 top-4 bottom-0 w-[1px] bg-slate-200 dark:bg-neutral-600" style={{ transform: 'translateX(-50%)' }} />
              
              {/* Order Received Step */}
              <Box className="relative mb-6">
                <Flex align="center" justify="center" className="absolute left-0 top-2 w-8 h-8 rounded-full bg-slate-100 dark:bg-neutral-600 -translate-x-10" style={{ transform: 'translateY(0)' }}>
                  <HandHelping size={16} className="text-slate-400 dark:text-neutral-400" />
                </Flex>
                <Box>
                  <Text as="p" size="2" weight="bold">Order Received</Text>
                  <Text as="p" size="1" color="gray" mt="1">{new Date(order.timeReceived).toLocaleString()}</Text>
                </Box>
              </Box>
              
              {/* Preparation Step */}
              {(order.status === 'preparing' || order.status === 'cooking' || order.status === 'ready' || order.status === 'completed') && (
                <Box className="relative mb-6">
                  <Flex align="center" justify="center" className="absolute left-0 top-2 w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 -translate-x-10" style={{ transform: 'translateY(0)' }}>
                    <CheckCircle size={16} className="text-yellow-500 dark:text-yellow-600" />
                  </Flex>
                  <Box>
                    <Text as="p" size="2" weight="bold">Order Preparation Started</Text>
                    <Text as="p" size="1" color="gray" mt="1">{new Date(order.timeReceived.getTime() + 2 * 60 * 1000).toLocaleString()}</Text>
                  </Box>
                </Box>
              )}
              
              {/* Cooking Step */}
              {(order.status === 'cooking' || order.status === 'ready' || order.status === 'completed') && (
                <Box className="relative mb-6">
                  <Flex align="center" justify="center" className="absolute left-0 top-2 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 -translate-x-10" style={{ transform: 'translateY(0)' }}>
                    <CookingPot size={16} className="text-orange-500 dark:text-orange-600" />
                  </Flex>
                  <Box>
                    <Text as="p" size="2" weight="bold">Order is Cooking</Text>
                    <Text as="p" size="1" color="gray" mt="1">{new Date(order.timeReceived.getTime() + 4 * 60 * 1000).toLocaleString()}</Text>
                  </Box>
                </Box>
              )}
              
              {/* Ready Step */}
              {(order.status === 'ready' || order.status === 'completed') && (
                <Box className="relative mb-6">
                  <Flex align="center" justify="center" className="absolute left-0 top-2 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 -translate-x-10" style={{ transform: 'translateY(0)' }}>
                    <Soup size={16} className="text-blue-500 dark:text-blue-600" />
                  </Flex>
                  <Box>
                    <Text as="p" size="2" weight="bold">Order is Ready</Text>
                    <Text as="p" size="1" color="gray" mt="1">{new Date(order.timeReceived.getTime() + 10 * 60 * 1000).toLocaleString()}</Text>
                  </Box>
                </Box>
              )}
              
              {/* Completed Step */}
              {order.status === 'completed' && (
                <Box className="relative mb-6">
                  <Flex align="center" justify="center" className="absolute left-0 top-2 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 -translate-x-10" style={{ transform: 'translateY(0)' }}>
                    <CheckCircle size={16} className="text-green-500 dark:text-green-600" />
                  </Flex>
                  <Box>
                    <Text as="p" size="2" weight="bold">Order Completed</Text>
                    <Text as="p" size="1" color="gray" mt="1">{new Date(order.timeReceived.getTime() + 15 * 60 * 1000).toLocaleString()}</Text>
                  </Box>
                </Box>
              )}
              
              {/* Cancelled Step (only shown for cancelled orders) */}
              {order.status === 'cancelled' && (
                <Box className="relative mb-6">
                  <Flex align="center" justify="center" className="absolute left-0 top-2 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 -translate-x-10" style={{ transform: 'translateY(0)' }}>
                    <AlertCircle size={16} className="text-red-500 dark:text-red-600" />
                  </Flex>
                  <Box>
                    <Text as="p" size="2" weight="bold">Order Cancelled</Text>
                    <Text as="p" size="1" color="gray" mt="1">{new Date(order.timeReceived.getTime() + 5 * 60 * 1000).toLocaleString()}</Text>
                  </Box>
                </Box>
              )}
            </Box>
          </Card>
        </Box>
        
        {/* Customer and Actions Column */}
        <Box className="md:col-span-2">
          {/* Customer Details Card */}
          <Card size="2" mb="4">
            <Flex justify="between" align="center" mb="4">
              <CardHeading title="Customer Details" mb="0" />
              <Button variant="ghost" color="gray" size="1">
                <Edit size={14} />
              </Button>
            </Flex>
            
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
                      <Text>123 Main Street</Text><br />
                      <Text size="2" color="gray">Apt 4B New York, NY 10001</Text>
                    </Box>
                  </Flex>
                </>
              )}
              
              <Flex align="center" gap="2">
                <CreditCard size={16} className="text-slate-500 dark:text-neutral-600" />
                <Text>{order.paymentMethod}</Text>
              </Flex>
            </Flex>
          </Card>
          
          {/* Actions Card */}
          <Card size="2">
            <CardHeading title="Order Actions" />
            
            {/* Status Update Actions */}
            <Box>
              <Heading as="h4" size="2" mb="2">Update Status</Heading>
              <Text as="p" size="2" mb="2" color="gray">Set Status to:</Text>
              <Grid columns="2" gap="2">
                <Button 
                  color="yellow"
                  disabled={order.status !== 'new'}
                  onClick={() => updateOrderStatus('preparing')}
                >
                  <Text>Preparing</Text>
                </Button>
                <Button 
                  color="orange"
                  disabled={order.status !== 'preparing'}
                  onClick={() => updateOrderStatus('cooking')}
                >
                  <Text>Cooking</Text>
                </Button>
                <Button 
                  color="blue"
                  disabled={order.status !== 'cooking'}
                  onClick={() => updateOrderStatus('ready')}
                >
                  <Text>Ready</Text>
                </Button>
                <Button 
                  color="green"
                  disabled={order.status !== 'ready'}
                  onClick={() => updateOrderStatus('completed')}
                >
                  <Text>Completed</Text>
                </Button>
              </Grid>
            </Box>
            
            <Separator my="4" size="4" />
            
            {/* Additional Actions */}
            <Box>
              <Heading as="h4" size="2" mb="2">More Actions</Heading>
              <Flex direction="column" gap="2">
                <Button variant="soft" color="gray">
                  <Receipt size={16} />
                  <Text>Print Receipt</Text>
                </Button>
                {(order.status !== 'completed' && order.status !== 'cancelled') && (
                  <Button variant="soft" color="red">
                    <AlertCircle size={16} />
                    <Text>Cancel Order</Text>
                  </Button>
                )}
              </Flex>
            </Box>
          </Card>
        </Box>
      </Grid>
    </Box>
  );
} 