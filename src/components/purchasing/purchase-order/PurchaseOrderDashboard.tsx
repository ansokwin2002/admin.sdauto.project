'use client';

import { useState, useEffect } from 'react';
import { Card, Flex, Text, Box, Grid, Heading, Button, Table, Inset } from '@radix-ui/themes';
import { 
  Activity, 
  Clock, 
  DollarSign, 
  Package, 
  Truck, 
  CheckCircle, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { mockPurchaseOrderStats, RestockAlert } from '@/data/PurchaseOrderData';
import MetricCard from '@/components/common/MetricCard';
import CardHeading from '@/components/common/CardHeading';

export default function PurchaseOrderDashboard() {
  const [stats, setStats] = useState(mockPurchaseOrderStats);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Simulate API call
    const fetchStats = async () => {
      setStats(mockPurchaseOrderStats);
      setIsLoaded(true);
    };
    
    fetchStats();
  }, []);
  
  return (
    <Box className="space-y-6">
      {/* Key Metrics */}
      <Grid columns={{ initial: '1', sm: '2', md: '3' }} gap="4">
        <MetricCard 
          title="Total Purchase Orders" 
          value={stats.totalPurchaseOrders.toString()} 
          icon={<Package className="h-5 w-5 text-blue-500" />}
          description="Total POs created" 
        />
        <MetricCard 
          title="Pending Orders" 
          value={stats.pendingOrders.toString()} 
          icon={<Clock className="h-5 w-5 text-amber-500" />}
          description="Orders awaiting delivery" 
        />
        <MetricCard 
          title="Completed Orders" 
          value={stats.completedOrders.toString()} 
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          description="Successfully received" 
        />
        <MetricCard 
          title="Outstanding Payments" 
          value={stats.outstandingPayments.toString()} 
          icon={<DollarSign className="h-5 w-5 text-green-500" />}
          description="Unpaid supplier invoices" 
        />
        <MetricCard 
          title="Avg. Delivery Time" 
          value={`${stats.averageDeliveryTime} days`} 
          icon={<Truck className="h-5 w-5 text-purple-500" />}
          description="From order to delivery" 
        />
        <MetricCard 
          title="Supplier Accuracy Rate" 
          value={`${stats.accuracyRate}%`} 
          icon={<Activity className="h-5 w-5 text-rose-500" />}
          description="Order fulfillment accuracy" 
        />
      </Grid>
      
      {/* Restock Alerts */}
      <Box>
        <Card size="3">
          <CardHeading title="Restock Alerts" mb="8"/>
          <Inset>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Current Stock</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Reorder Point</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Recommended Supplier</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {stats.restockAlerts.map((alert) => (
                  <Table.Row key={alert.id}>
                    <Table.Cell>{alert.itemName}</Table.Cell>
                    <Table.Cell>
                      <Text color="red" weight="bold">{alert.currentStock}</Text>
                    </Table.Cell>
                    <Table.Cell>{alert.reorderPoint}</Table.Cell>
                    <Table.Cell>{alert.supplier}</Table.Cell>
                    <Table.Cell>
                      <Button size="1">
                        Order Now
                        <ChevronRight size={14} />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Inset>
        </Card>
      </Box>
      
      {/* Recent Purchase Order Activity */}        
      <Card size="3">
        <CardHeading title="Recent Activity"/>
        <Flex direction="column" gap="4">
          <Flex gap="3" align="center">
            <Box className="size-8 bg-purple-500/10 rounded-full p-2">
              <Truck className="h-4 w-4 text-purple-500" />
            </Box>
            <Box>
              <Text size="2" as="p" weight="medium">Purchase order PO-10030 was delivered</Text>
              <Text size="1" color="gray">2 hours ago</Text>
            </Box>
          </Flex>
          <Flex gap="3" align="center">
            <Box className="size-8 bg-blue-500/10 rounded-full p-2">
              <Package className="h-4 w-4 text-blue-500" />
            </Box>
            <Box>
              <Text size="2" as="p" weight="medium">New purchase order PO-10027 created with Farm Fresh Produce</Text>
              <Text size="1" color="gray">2 hours ago</Text>
            </Box>
          </Flex>
          <Flex gap="3" align="center">
            <Box className="size-8 bg-green-500/10 rounded-full p-2">
              <DollarSign className="h-4 w-4 text-green-500" />
            </Box>
            <Box>
              <Text size="2" as="p" weight="medium">Payment for PO-10018 processed via Bank Transfer</Text>
              <Text size="1" color="gray">2 hours ago</Text>
            </Box>
          </Flex>
          <Flex gap="3" align="center">
            <Box className="size-8 bg-red-500/10 rounded-full p-2">
              <Package className="h-4 w-4 text-red-500" />
            </Box>
            <Box>
              <Text size="2" as="p" weight="medium">Partial delivery received for PO-10025</Text>
              <Text size="1" color="gray">2 hours ago</Text>
            </Box>
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
} 