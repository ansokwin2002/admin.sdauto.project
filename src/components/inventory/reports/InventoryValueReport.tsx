import React from 'react';
import { Box, Card, Heading, Text, Table, Flex, Badge, Grid } from '@radix-ui/themes';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import dynamic from 'next/dynamic';
import { chartColorPalettes, useChartOptions } from '@/utilities/chartOptions';
import { formatCurrency, formatNumberThousand } from '@/utilities';
import CardHeading from '@/components/common/CardHeading';

// Dynamically import chart component to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface InventoryValueReportProps {
  data: {
    id: string;
    name: string;
    value: number;
    quantity: number;
    itemCount: number;
    growth: number;
    lowStockCount: number;
  }[];
  isClient: boolean;
}

const InventoryValueReport: React.FC<InventoryValueReportProps> = ({ data, isClient }) => {
  const chartOptions = useChartOptions();
  
  // Calculate total inventory value
  const totalValue = data.reduce((sum, category) => sum + category.value, 0);
  
  // Prepare data for pie chart
  const pieChartSeries = data.map(category => category.value);
  const pieChartOptions = chartOptions.getPieOptions({
    labels: data.map(category => category.name),
    colors: chartColorPalettes.default,
    tooltip: {
      ...chartOptions.getBaseTooltipOptions(),
      y: {
        formatter: (value: number) => `$${value.toFixed(2)}`
      }
    }
  });
  
  // Prepare data for trend chart
  const trendChartSeries = [{
    name: 'Inventory Value',
    data: [12500, 11800, 13200, 12700, 14500, totalValue]
  }];
  
  const trendChartOptions = chartOptions.getLineOptions({
    chart: {
      type: 'line',
      toolbar: {
        show: false
      }
    },
    xaxis: {
      ...chartOptions.getBaseXAxisOptions(),
      categories: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
    },
    colors: [chartColorPalettes.default[3]],
    yaxis: {
      labels: {
        ...chartOptions.getBaseYAxisLabels(),
        formatter: (value: number) => `$${(value/1000).toFixed(1)}k`
      }
    },
    tooltip: chartOptions.getBaseTooltipOptions()
  });

  return (
    <Box className="space-y-6">
      {/* Summary Cards */}
      <Grid gap="4" columns={{ initial: '1', md: '3' }}>
        <Card size="2">
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Total Inventory Value</Text>
            <Heading size="6">{formatCurrency(totalValue)}</Heading>
            <Text size="1" color="gray">Across {data.reduce((sum, cat) => sum + cat.itemCount, 0)} items</Text>
          </Flex>
        </Card>
        
        <Card size="2">
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Average Item Value</Text>
            <Heading size="6">{formatCurrency(totalValue / data.reduce((sum, cat) => sum + cat.itemCount, 0))}</Heading>
            <Text size="1" color="gray">Per inventory item</Text>
          </Flex>
        </Card>
        
        <Card size="2">
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Low Stock Items</Text>
            <Heading size="6">{data.reduce((sum, cat) => sum + cat.lowStockCount, 0)}</Heading>
            <Text size="1" color="gray">Items below reorder threshold</Text>
          </Flex>
        </Card>
      </Grid>

      {/* Charts */}
      <Flex gap="4" direction={{ initial: 'column', md: 'row' }}>
        <Card size="3" style={{ flex: 1 }}>
          <CardHeading title="Inventory Value by Category" />
          {isClient && (
            <Chart
              options={pieChartOptions}
              series={pieChartSeries}
              type="pie"
              height={350}
            />
          )}
        </Card>
        
        <Card size="3" style={{ flex: 1 }}>
          <CardHeading title="Inventory Value Trend" />
          {isClient && (
            <Chart
              options={trendChartOptions}
              series={trendChartSeries}
              type="line"
              height={350}
            />
          )}
        </Card>
      </Flex>

      {/* Detailed Table */}
      <Card size="3">
        <CardHeading title="Inventory Value by Category" />
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Items</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Value</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Monthly Change</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Low Stock</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((category) => (
              <Table.Row key={category.id}>
                <Table.Cell>
                  <Text weight="medium">{category.name}</Text>
                </Table.Cell>
                <Table.Cell>{category.itemCount}</Table.Cell>
                <Table.Cell>{formatNumberThousand(category.quantity)} units</Table.Cell>
                <Table.Cell>{formatCurrency(category.value)}</Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="1">
                    {category.growth > 0 ? (
                      <TrendingUp size={16} className="text-green-600" />
                    ) : category.growth < 0 ? (
                      <TrendingDown size={16} className="text-red-600" />
                    ) : (
                      <Minus size={16} className="text-gray-500" />
                    )}
                    <Text color={category.growth > 0 ? 'green' : category.growth < 0 ? 'red' : 'gray'}>
                      {category.growth > 0 ? '+' : ''}{category.growth}%
                    </Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  {category.lowStockCount > 0 ? (
                    <Badge color="red">{category.lowStockCount} items</Badge>
                  ) : (
                    <Badge color="green">None</Badge>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>
    </Box>
  );
};

export default InventoryValueReport; 