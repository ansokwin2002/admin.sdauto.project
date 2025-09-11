'use client';

import { useState, useEffect } from 'react';
import { Card, Box, Heading, Flex, Text, Grid, Badge, Separator, Inset } from '@radix-ui/themes';
import { StockMetrics, StockMovement } from '@/types/inventory';
import dynamic from 'next/dynamic';
import { AlertCircle, CookingPot, ShoppingCart, SlidersHorizontal, Trash } from 'lucide-react';
import MetricCard from '@/components/common/MetricCard';
import { organization } from '@/data/CommonData';
import { mockStockItems } from '@/data/StockItemData';
import { useChartOptions } from '@/utilities/chartOptions';
import CardHeading from '@/components/common/CardHeading';

const mockUsageData = [
  { date: '2024-01', usage: 1200 },
  { date: '2024-02', usage: 1350 },
  { date: '2024-03', usage: 1100 },
  { date: '2024-04', usage: 1400 },
  { date: '2024-05', usage: 1250 },
  { date: '2024-06', usage: 1300 },
];

const mockMetrics: StockMetrics = {
  totalValue: 25000,
  lowStockItems: 5,
  outOfStockItems: 2,
  expiringItems: 3,
};

const movementTypes = [
  {
    id: '1',
    type: 'purchase',
    name: 'Purchase',
    icon: <ShoppingCart className="text-amber-400" />
  },
  {
    id: '2',
    type: 'usage',
    name: 'Usage',
    icon: <CookingPot className="text-amber-400" />
  },
  {
    id: '3',
    type: 'adjustment',
    name: 'Adjustment',
    icon: <SlidersHorizontal className="text-amber-400" />
  },
  {
    id: '4',
    type: 'waste',
    name: 'Waste',
    icon: <Trash className="text-red-400" />
  }
]

const mockRecentMovements: StockMovement[] = [
  {
    id: '1',
    stockItemId: '1',
    type: 'purchase',
    quantity: 50,
    date: new Date(),
    notes: 'Regular restocking'
  },
  {
    id: '2',
    stockItemId: '2',
    type: 'usage',
    quantity: 20,
    date: new Date(),
    notes: 'Customer purchase'
  },
  {
    id: '3',
    stockItemId: '3',
    type: 'waste',
    quantity: 21,
    date: new Date(),
    notes: 'Waste due to spoilage'
  },
  {
    id: '4',
    stockItemId: '4',
    type: 'usage',
    quantity: 30,
    date: new Date(),
    notes: 'Customer purchase'
  },
  {
    id: '5',
    stockItemId: '5',
    type: 'adjustment',
    quantity: 10,
    date: new Date(),
    notes: 'Inventory count'
  },
];

// Dynamically import ApexCharts with SSR disabled
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function StockDashboard() {
  const [isClient, setIsClient] = useState(false);
  const chartOptions = useChartOptions();
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <div className="space-y-6">
      <Card size="3">
        <Flex align="center" gap="2" mb="2">
          <AlertCircle className="h-4 w-4 text-orange-700" />
          <Heading as="h3" size="3" color="orange">Low Stock Alerts</Heading>
        </Flex>
        
        <Box className="space-y-4">
          <Box>
            <Text size="2" weight="bold" className="text-orange-700">{organization.find(branch => branch.id === "br-1")?.name}</Text>
            <Flex direction="column" gap="1" mt="1">
              <Text as="p" size="2" color="orange">• Tomatoes - Only 2kg remaining (Reorder level: 5kg)</Text>
              <Text as="p" size="2" color="orange">• Chicken Breast - Only 3kg remaining (Reorder level: 10kg)</Text>
            </Flex>
          </Box>
          
          <Box>
            <Text size="2" weight="bold" className="text-orange-700">{organization.find(branch => branch.id === "br-2")?.name}</Text>
            <Flex direction="column" gap="1" mt="1">
              <Text as="p" size="2" color="orange">• Fresh Pasta - Only 1kg remaining (Reorder level: 4kg)</Text>
            </Flex>
          </Box>
        </Box>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Stock Value"
          value={`$${mockMetrics.totalValue.toLocaleString()}`}
          description="Current inventory value"
          trend="up"
          trendValue="12%"
        />
        <MetricCard
          title="Low Stock Items"
          value={mockMetrics.lowStockItems}
          description="Items needing restock"
          trend="down"
          trendValue="2"
        />
        <MetricCard
          title="Out of Stock"
          value={mockMetrics.outOfStockItems}
          description="Items completely depleted"
        />
        <MetricCard
          title="Expiring Soon"
          value={mockMetrics.expiringItems}
          description="Items near expiration"
        />
      </div>

      <Grid columns={{ initial: "1", sm: "2" }} gap="4">
        <Card>
          <CardHeading title="Stock Usage Trends"/>
          {isClient && (
            <div className="h-[330px]">
              <ReactApexChart
                type="line"
                height={330}
                options={chartOptions.getLineOptions({
                  xaxis: {
                    ...chartOptions.getBaseXAxisOptions(),
                    categories: mockUsageData.map(item => item.date),
                  },
                  tooltip: chartOptions.getBaseTooltipOptions(),
                })}
                series={[
                  {
                    name: 'Usage',
                    data: mockUsageData.map(item => item.usage),
                    color: '#2563eb',
                  }
                ]}
              />
            </div>
          )}
        </Card>

        <Card>
          <CardHeading title="Recent Stock Movements" mb="8"/>
          <Inset className="space-y-3">
            {mockRecentMovements.map((movement, index) => (
              <Box key={movement.id}>
                <Flex align="center" gap="3" className="px-4">
                  {movementTypes.find(type => type.type === movement.type)?.icon}
                  <Flex justify="between" flexGrow="1" mb="4">
                    <Box>
                      <Text as="p" size="1" weight="bold" mb="1">
                        {mockStockItems.find(item => item.id === movement.stockItemId)?.name}
                      </Text>
                      <Box>
                        <Badge color="gray">
                          {movement.quantity} {mockStockItems.find(item => item.id === movement.stockItemId)?.storageUnit}
                        </Badge>
                        <Badge color="gray" ml="2">
                          {movementTypes.find(type => type.type === movement.type)?.name}
                        </Badge>
                      </Box>
                    </Box>
                    <Flex direction="column" align="end" gap="1">
                      <Text as="p" size="1">{movement.notes}</Text>
                      <Text as="p" size="1" color="gray">
                        {movement.date.toLocaleDateString()}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
                {index < mockRecentMovements.length - 1 && (
                  <Separator size="4" style={{ backgroundColor: 'var(--gray-4)' }} />
                )}
              </Box>
            ))}
          </Inset>
        </Card>
      </Grid>
    </div>
  );
} 