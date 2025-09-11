import React from 'react';
import { Box, Card, Heading, Text, Table, Flex, Badge } from '@radix-ui/themes';
import { AlertTriangle, ShoppingCart, Calendar } from 'lucide-react';
import dynamic from 'next/dynamic';
import { chartColorPalettes, useChartOptions } from '@/utilities/chartOptions';
import ChartLoadingPlaceholder from '@/components/common/ChartLoadingPlaceholder';
import { formatCurrency } from '@/utilities';
import CardHeading from '@/components/common/CardHeading';

// Dynamically import chart component to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface LowStockReportProps {
  data: {
    id: string;
    name: string;
    category: string;
    categoryName: string;
    price: number;
    stockQuantity: number;
    unit: string;
    reorderLevel: number;
    daysUntilStockout: number;
    branch: string;
    branchId: string;
    lastOrderDate: Date;
    suggestedOrderQuantity: number;
    value: number;
  }[];
  isClient: boolean;
}

const LowStockReport: React.FC<LowStockReportProps> = ({ data, isClient }) => {
  const chartOptions = useChartOptions();
  
  // Count critical items (less than 3 days until stockout)
  const criticalItems = data.filter(item => item.daysUntilStockout <= 3).length;
  
  // Count warning items (4-7 days until stockout)
  const warningItems = data.filter(item => item.daysUntilStockout > 3 && item.daysUntilStockout <= 7).length;
  
  // Count caution items (more than 7 days but still low)
  const cautionItems = data.length - criticalItems - warningItems;
  
  // Calculate total value at risk
  const valueAtRisk = data.reduce((sum, item) => sum + item.value, 0);
  
  // Categorize items by urgency
  const stockStatusCounts = [
    { name: 'Critical (0-3 days)', value: criticalItems },
    { name: 'Warning (4-7 days)', value: warningItems },
    { name: 'Caution (8+ days)', value: cautionItems }
  ];
  
  // Prepare data for pie chart
  const pieChartSeries = stockStatusCounts.map(status => status.value);
  const pieChartOptions = chartOptions.getPieOptions({
    labels: stockStatusCounts.map(status => status.name),
    colors: [chartColorPalettes.negative[2], chartColorPalettes.warm[2], chartColorPalettes.info[0]],
    tooltip: chartOptions.getBaseTooltipOptions()
  });
  
  // Prepare data for category distribution
  const categoryCounts: {[key: string]: number} = {};
  data.forEach(item => {
    categoryCounts[item.categoryName] = (categoryCounts[item.categoryName] || 0) + 1;
  });
  
  const categoryChartSeries = [{
    name: 'Low Stock Items',
    data: Object.values(categoryCounts)
  }];
  
  const categoryChartOptions = chartOptions.getBarOptions({
    xaxis: {
      ...chartOptions.getBaseXAxisOptions(),
      categories: Object.keys(categoryCounts),
    },
    yaxis: {
      labels: chartOptions.getBaseYAxisLabels()
    },
    colors: [chartColorPalettes.restaurant[2]],
    tooltip: chartOptions.getBaseTooltipOptions()
  });

  return (
    <Box className="space-y-6">
      {/* Summary Cards */}
      <Flex gap="4" wrap="wrap">
        <Card size="2" style={{ flex: '1 0 250px' }}>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Total Low Stock Items</Text>
            <Heading size="6">{data.length}</Heading>
            <Text size="1" color="gray">Items below reorder threshold</Text>
          </Flex>
        </Card>
        
        <Card size="2" style={{ flex: '1 0 250px' }}>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Critical Items</Text>
            <Heading size="6" color="red">{criticalItems}</Heading>
            <Flex align="center" gap="1">
              <AlertTriangle size={14} className="text-red-600" />
              <Text size="1" color="red">Stocking out within 3 days</Text>
            </Flex>
          </Flex>
        </Card>
        
        <Card size="2" style={{ flex: '1 0 250px' }}>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Value at Risk</Text>
            <Heading size="6">{formatCurrency(valueAtRisk)}</Heading>
            <Text size="1" color="gray">Inventory value at risk</Text>
          </Flex>
        </Card>
      </Flex>

      {/* Charts */}
      <Flex gap="4" direction={{ initial: 'column', md: 'row' }}>
        <Card size="3" style={{ flex: 1 }}>
          <CardHeading title="Low Stock Items by Urgency" />
          {isClient ? (
            <Chart
              options={pieChartOptions}
              series={pieChartSeries}
              type="pie"
              height={300}
            />
          ) : (
            <ChartLoadingPlaceholder height={300} message="Loading urgency data..." />
          )}
        </Card>
        
        <Card size="3" style={{ flex: 1 }}>
          <CardHeading title="Low Stock Items by Category" />
          {isClient ? (
            <Chart
              options={categoryChartOptions}
              series={categoryChartSeries}
              type="bar"
              height={300}
            />
          ) : (
            <ChartLoadingPlaceholder height={300} message="Loading category data..." />
          )}
        </Card>
      </Flex>

      {/* Detailed Table */}
      <Card size="3">
        <CardHeading title="Low Stock Items Detail" />
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Branch</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Current Stock</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Reorder Level</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Days Until Stockout</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Suggested Order</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>
                  <Text weight="medium">{item.name}</Text>
                </Table.Cell>
                <Table.Cell>{item.categoryName}</Table.Cell>
                <Table.Cell>{item.branch}</Table.Cell>
                <Table.Cell>
                  <Badge color={item.stockQuantity < item.reorderLevel ? 'red' : 'orange'}>
                    {item.stockQuantity} {item.unit}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{item.reorderLevel} {item.unit}</Table.Cell>
                <Table.Cell>
                  <Text color={
                    item.daysUntilStockout <= 3 ? 'red' : 
                    item.daysUntilStockout <= 7 ? 'orange' : 
                    'gray'
                  }>
                    {item.daysUntilStockout} {item.daysUntilStockout === 1 ? 'day' : 'days'}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  {item.suggestedOrderQuantity} {item.unit}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>
    </Box>
  );
};

export default LowStockReport; 