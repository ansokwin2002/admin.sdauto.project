import React, { useState, useEffect } from 'react';
import { Box, Card, Heading, Text, Table, Flex, Badge } from '@radix-ui/themes';
import { CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { chartColorPalettes, useChartOptions } from '@/utilities/chartOptions';
import ChartLoadingPlaceholder from '@/components/common/ChartLoadingPlaceholder';
import { formatCurrency, formatNumberThousand } from '@/utilities';
import CardHeading from '@/components/common/CardHeading';

// Dynamically import chart component to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface PurchaseOrderStatusReportProps {
  data: {
    id: string;
    name: string;
    completedOrders: number;
    pendingOrders: number;
    inTransitOrders: number;
    cancelledOrders: number;
    totalOrders: number;
    completedValue: number;
    pendingValue: number;
    inTransitValue: number;
    avgProcessingTime: number;
  }[];
  isClient: boolean;
}

const PurchaseOrderStatusReport: React.FC<PurchaseOrderStatusReportProps> = ({ data, isClient }) => {
  const chartOptions = useChartOptions();
  const [chartsLoading, setChartsLoading] = useState(true);
  
  // Simulate chart loading effect
  useEffect(() => {
    if (isClient) {
      const timer = setTimeout(() => {
        setChartsLoading(false);
      }, 1200);
      
      return () => clearTimeout(timer);
    }
  }, [isClient]);
  
  // Calculate totals
  const totalCompletedOrders = data.reduce((sum, branch) => sum + branch.completedOrders, 0);
  const totalPendingOrders = data.reduce((sum, branch) => sum + branch.pendingOrders, 0);
  const totalInTransitOrders = data.reduce((sum, branch) => sum + branch.inTransitOrders, 0);
  const totalCancelledOrders = data.reduce((sum, branch) => sum + branch.cancelledOrders, 0);
  const totalOrders = totalCompletedOrders + totalPendingOrders + totalInTransitOrders + totalCancelledOrders;
  
  const totalCompletedValue = data.reduce((sum, branch) => sum + branch.completedValue, 0);
  const totalPendingValue = data.reduce((sum, branch) => sum + branch.pendingValue, 0);
  const totalInTransitValue = data.reduce((sum, branch) => sum + branch.inTransitValue, 0);
  const totalValue = totalCompletedValue + totalPendingValue + totalInTransitValue;
  
  // Calculate average processing time
  const avgProcessingTime = data.reduce((sum, branch) => sum + branch.avgProcessingTime, 0) / data.length;
  
  // Prepare data for donut chart
  const donutChartSeries = [totalCompletedOrders, totalPendingOrders, totalInTransitOrders, totalCancelledOrders];
  const donutChartOptions = chartOptions.getPieOptions({
    labels: ['Completed', 'Pending', 'In Transit', 'Cancelled'],
    colors: [chartColorPalettes.positive[4], chartColorPalettes.warm[2], chartColorPalettes.negative[1], chartColorPalettes.negative[2]],
    tooltip: {
      ...chartOptions.getBaseTooltipOptions(),
      y: {
        formatter: (value: number) => `${value} orders`
      }
    }
  });
  
  // Prepare data for stacked bar chart
  const barChartSeries = [
    {
      name: 'Completed',
      data: data.map(branch => branch.completedOrders)
    },
    {
      name: 'Pending',
      data: data.map(branch => branch.pendingOrders)
    },
    {
      name: 'In Transit',
      data: data.map(branch => branch.inTransitOrders)
    },
    {
      name: 'Cancelled',
      data: data.map(branch => branch.cancelledOrders)
    }
  ];
  
  const barChartOptions = chartOptions.getStackedBarOptions({
    xaxis: {
      ...chartOptions.getBaseXAxisOptions(),
      categories: data.map(branch => branch.name),
    },
    colors: [chartColorPalettes.positive[4], chartColorPalettes.warm[2], chartColorPalettes.negative[1], chartColorPalettes.negative[2]],
    tooltip: {
      ...chartOptions.getBaseTooltipOptions(),
    }
  });

  return (
    <Box className="space-y-6">
      {/* Summary Cards */}
      <Flex gap="4" wrap="wrap">
        <Card size="2" style={{ flex: '1 0 200px' }}>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Total Orders</Text>
            <Heading size="6">{formatNumberThousand(totalOrders)}</Heading>
            <Flex align="center" gap="1">
              <CheckCircle size={14} className="text-green-600" />
              <Text size="1" color="green">{((totalCompletedOrders / totalOrders) * 100).toFixed(1)}% completed</Text>
            </Flex>
          </Flex>
        </Card>
        
        <Card size="2" style={{ flex: '1 0 200px' }}>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Orders Value</Text>
            <Heading size="6">{formatCurrency(totalValue)}</Heading>
            <Text size="1" color="gray">Total purchase value</Text>
          </Flex>
        </Card>
        
        <Card size="2" style={{ flex: '1 0 200px' }}>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Pending Value</Text>
            <Heading size="6">{formatCurrency(totalPendingValue + totalInTransitValue)}</Heading>
            <Flex align="center" gap="1">
              <Clock size={14} className="text-amber-500" />
              <Text size="1" color="orange">Not yet received</Text>
            </Flex>
          </Flex>
        </Card>
        
        <Card size="2" style={{ flex: '1 0 200px' }}>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Avg. Processing Time</Text>
            <Heading size="6">{avgProcessingTime.toFixed(1)} days</Heading>
            <Text size="1" color="gray">Order to delivery</Text>
          </Flex>
        </Card>
      </Flex>

      {/* Charts */}
      <Flex gap="4" direction={{ initial: 'column', md: 'row' }}>
        <Card size="3" style={{ flex: 1 }}>
          <CardHeading title="Order Status Distribution" />
          <div className="h-[350px]">
            {isClient && !chartsLoading ? (
              <Chart
                options={donutChartOptions}
                series={donutChartSeries}
                type="donut"
                height={350}
              />
            ) : (
              <ChartLoadingPlaceholder height={350} message="Loading status data..." />
            )}
          </div>
        </Card>
        
        <Card size="3" style={{ flex: 1 }}>
          <CardHeading title="Order Status by Branch" />
          <div className="h-[350px]">
            {isClient && !chartsLoading ? (
              <Chart
                options={barChartOptions}
                series={barChartSeries}
                type="bar"
                height={350}
              />
            ) : (
              <ChartLoadingPlaceholder height={350} message="Loading branch data..." />
            )}
          </div>
        </Card>
      </Flex>

      {/* Detailed Table */}
      <Card size="3">
        <CardHeading title="Purchase Order Status by Branch" />
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Branch</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Completed</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Pending</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>In Transit</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Cancelled</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Total Value</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Avg. Processing</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((branch) => (
              <Table.Row key={branch.id}>
                <Table.Cell>
                  <Text weight="medium">{branch.name}</Text>
                </Table.Cell>
                <Table.Cell>{branch.completedOrders}</Table.Cell>
                <Table.Cell>{branch.pendingOrders}</Table.Cell>
                <Table.Cell>{branch.inTransitOrders}</Table.Cell>
                <Table.Cell>{branch.cancelledOrders}</Table.Cell>
                <Table.Cell>
                  {formatCurrency(branch.completedValue + branch.pendingValue + branch.inTransitValue)}
                </Table.Cell>
                <Table.Cell>
                  <Badge color={branch.avgProcessingTime <= 2 ? 'green' : branch.avgProcessingTime <= 3 ? 'orange' : 'red'}>
                    {branch.avgProcessingTime} days
                  </Badge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>
    </Box>
  );
};

export default PurchaseOrderStatusReport; 