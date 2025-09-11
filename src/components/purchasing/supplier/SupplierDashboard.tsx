'use client';

import { Card, Box, Heading, Flex, Text, Grid } from '@radix-ui/themes';
import { AlertCircle, Clock, Package, Truck, Users } from 'lucide-react';
import { mockSupplierMetrics, mockTopSuppliers, mockStockShortages } from '@/data/SupplierData';
import MetricCard from '@/components/common/MetricCard';

export default function SupplierDashboard() {
  return (
    <Box className="space-y-4">
      <Grid columns="4" gap="4">
        <MetricCard
          title="Total Suppliers"
          value={mockSupplierMetrics.totalSuppliers}
          description="Active suppliers in the system"
          icon={<Users className="h-5 w-5 text-blue-500" />}
          trend="up"
          trendValue="2"
        />
        <MetricCard
          title="Pending Orders"
          value={mockSupplierMetrics.pendingOrders}
          description="Orders awaiting delivery"
          icon={<Package className="h-5 w-5 text-amber-500" />}
          trend="down"
          trendValue="1"
        />
        <MetricCard
          title="Avg. Delivery Time"
          value={`${mockSupplierMetrics.averageDeliveryTime} days`}
          description="Average supplier lead time"
          icon={<Truck className="h-5 w-5 text-green-500" />}
        />
        <MetricCard
          title="Monthly Purchases"
          value={`$${mockSupplierMetrics.totalMonthlyPurchases.toLocaleString()}`}
          description="Total spend this month"
          icon={<Clock className="h-5 w-5 text-purple-500" />}
          trend="up"
          trendValue="8%"
        />
      </Grid>

      <Grid columns="2" gap="4">
        <Card>
          <Heading as="h3" size="2" mb="4">Top Suppliers</Heading>
          <Box className="space-y-4">
            {mockTopSuppliers.map(supplier => (
              <Box key={supplier.id} className="p-3 bg-stone-50 rounded-md">
                <Flex justify="between" align="center">
                  <Text as="p" size="3" weight="medium">{supplier.name}</Text>
                  <Box>
                    <Text as="p" size="2" className="text-slate-500">{supplier.orderCount} orders</Text>
                  </Box>
                </Flex>
                <Flex justify="between" align="center" className="mt-2">
                  <Text as="p" size="2" className="text-slate-500">Total spend</Text>
                  <Text as="p" size="3" weight="medium">${supplier.totalSpent.toLocaleString()}</Text>
                </Flex>
              </Box>
            ))}
          </Box>
        </Card>

        <Card>
          <Heading as="h3" size="2" mb="4">Recent Stock Shortages</Heading>
          <Box className="space-y-4">
            {mockStockShortages.map(item => (
              <Box key={item.id} className="p-3 bg-stone-50 rounded-md">
                <Flex justify="between" align="center">
                  <Flex align="center" gap="2">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <Box>
                      <Text as="p" size="3" weight="medium">{item.name}</Text>
                      <Text as="p" size="2" className="text-slate-500 mt-2">Supplier: {item.supplier}</Text>    
                    </Box>
                  </Flex>
                  <Text as="p" size="2" className="text-orange-600">{item.daysDelayed} days delayed</Text>
                </Flex>
              </Box>
            ))}
          </Box>
        </Card>
      </Grid>
    </Box>
  );
} 