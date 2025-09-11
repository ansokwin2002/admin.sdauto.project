import React, { useState, useEffect } from 'react';
import { Box, Card, Heading, Text, Table, Flex, Badge, Grid } from '@radix-ui/themes';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import dynamic from 'next/dynamic';
import { chartColorPalettes, useChartOptions } from '@/utilities/chartOptions';
import { formatCurrency, formatNumberThousand } from '@/utilities';
import ChartLoadingPlaceholder from '@/components/common/ChartLoadingPlaceholder';
import CardHeading from '@/components/common/CardHeading';

// Dynamically import chart component to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface PurchaseSpendingReportProps {
  data: {
    id: string;
    name: string;
    spending: number;
    supplierCount: number;
    growth: number;
    avgOrderValue: number;
    pendingOrdersValue: number;
  }[];
  isClient: boolean;
}

const PurchaseSpendingReport: React.FC<PurchaseSpendingReportProps> = ({ data, isClient }) => {
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
  
  // Calculate total spending
  const totalSpending = data.reduce((sum, category) => sum + category.spending, 0);
  const totalPending = data.reduce((sum, category) => sum + category.pendingOrdersValue, 0);
  
  // Prepare data for pie chart
  const pieChartSeries = data.map(category => category.spending);
  const pieChartOptions = chartOptions.getPieOptions({
    labels: data.map(category => category.name),
    colors: chartColorPalettes.default,
    tooltip: {
      ...chartOptions.getBaseTooltipOptions(),
      y: {
        formatter: (value: number) => formatCurrency(value)
      }
    }
  });
  
  // Prepare data for trend chart
  const trendChartSeries = [{
    name: 'Monthly Spending',
    data: [42500, 45800, 40200, 47700, 44500, totalSpending]
  }];
  
  const trendChartOptions = chartOptions.getLineOptions({
    xaxis: {
      ...chartOptions.getBaseXAxisOptions(),
      categories: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
    },
    colors: [chartColorPalettes.default[0]],
    yaxis: {
      labels: {
        ...chartOptions.getBaseYAxisLabels(),
        formatter: (value: number) => `$${(value/1000).toFixed(1)}k`
      }
    },
    tooltip: {
      ...chartOptions.getBaseTooltipOptions(),
      y: {
        formatter: (value: number) => formatCurrency(value)
      }
    }
  });

  return (
    <Box className="space-y-6">
      {/* Summary Cards */}
      <Grid gap="4" columns={{ initial: '1', md: '3' }}>
        <Card size="2">
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Total Purchase Spending</Text>
            <Heading size="6">{formatCurrency(totalSpending)}</Heading>
            <Text size="1" color="gray">Across {data.reduce((sum, cat) => sum + cat.supplierCount, 0)} suppliers</Text>
          </Flex>
        </Card>
        
        <Card size="2">
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Average Order Value</Text>
            <Heading size="6">{formatCurrency(data.reduce((sum, cat) => sum + cat.avgOrderValue, 0) / data.length)}</Heading>
            <Text size="1" color="gray">Per purchase order</Text>
          </Flex>
        </Card>
        
        <Card size="2">
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Pending Orders Value</Text>
            <Heading size="6">{formatCurrency(totalPending)}</Heading>
            <Text size="1" color="gray">Not yet fulfilled</Text>
          </Flex>
        </Card>
      </Grid>

      {/* Charts */}
      <Flex gap="4" direction={{ initial: 'column', md: 'row' }}>
        <Card size="3" style={{ flex: 1 }}>
          <CardHeading title="Spending by Category" />
          <div className="h-[350px]">
            {isClient && !chartsLoading ? (
              <Chart
                options={pieChartOptions}
                series={pieChartSeries}
                type="pie"
                height={350}
              />
            ) : (
              <ChartLoadingPlaceholder height={350} message="Loading spending data..." />
            )}
          </div>
        </Card>
        
        <Card size="3" style={{ flex: 1 }}>
          <CardHeading title="Monthly Spending Trend" />
          <div className="h-[350px]">
            {isClient && !chartsLoading ? (
              <Chart
                options={trendChartOptions}
                series={trendChartSeries}
                type="line"
                height={350}
              />
            ) : (
              <ChartLoadingPlaceholder height={350} message="Loading trend data..." />
            )}
          </div>
        </Card>
      </Flex>

      {/* Detailed Table */}
      <Card size="3">
        <CardHeading title="Spending by Supplier Category" />
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Suppliers</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Total Spending</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Avg. Order Value</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Monthly Change</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Pending Orders</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((category) => (
              <Table.Row key={category.id}>
                <Table.Cell>
                  <Text weight="medium">{category.name}</Text>
                </Table.Cell>
                <Table.Cell>{category.supplierCount}</Table.Cell>
                <Table.Cell>{formatCurrency(category.spending)}</Table.Cell>
                <Table.Cell>{formatCurrency(category.avgOrderValue)}</Table.Cell>
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
                  {formatCurrency(category.pendingOrdersValue)}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>
    </Box>
  );
};

export default PurchaseSpendingReport; 