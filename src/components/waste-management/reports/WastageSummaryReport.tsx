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

interface WastageSummaryReportProps {
  data: {
    id: string;
    name: string;
    quantity: number;
    value: number;
    percentage: number;
    growth: number;
  }[];
}

const WastageSummaryReport: React.FC<WastageSummaryReportProps> = ({ data }) => {
  const chartOptions = useChartOptions();
  
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsClient(true), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  // Calculate total wastage value
  const totalValue = data.reduce((sum, category) => sum + category.value, 0);
  
  // Calculate total wastage quantity
  const totalQuantity = data.reduce((sum, category) => sum + category.quantity, 0);
  
  // Calculate average waste growth rate
  const avgGrowth = data.reduce((sum, category) => sum + category.growth, 0) / data.length;
  
  // Prepare data for pie chart
  const pieChartSeries = data.map(category => category.value);
  const pieChartOptions = chartOptions.getPieOptions({
    labels: data.map(category => category.name),
    colors: chartColorPalettes.negative,
    tooltip: {
      ...chartOptions.getBaseTooltipOptions(),
      y: {
        formatter: (value: number) => `${formatCurrency(value)}`
      }
    }
  });
  
  // Prepare data for trend chart - monthly wastage trend
  const trendChartSeries = [{
    name: 'Wastage Value',
    data: [8500, 9200, 8700, 9800, 10200, totalValue]
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
    colors: [chartColorPalettes.negative[2]],
    yaxis: {
      labels: {
        ...chartOptions.getBaseYAxisLabels(),
        formatter: (value: number) => `${formatCurrency(value)}`
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
            <Text size="2" color="gray">Total Wastage Value</Text>
            <Heading size="6">{formatCurrency(totalValue)}</Heading>
            <Flex align="center" gap="1">
              {avgGrowth > 0 ? (
                <>
                  <TrendingUp size={14} className="text-red-600" />
                  <Text size="1" color="red">+{avgGrowth.toFixed(1)}% from last month</Text>
                </>
              ) : (
                <>
                  <TrendingDown size={14} className="text-green-600" />
                  <Text size="1" color="green">{avgGrowth.toFixed(1)}% from last month</Text>
                </>
              )}
            </Flex>
          </Flex>
        </Card>
        
        <Card size="2">
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Total Wastage Quantity</Text>
            <Heading size="6">{formatNumberThousand(totalQuantity)} kg</Heading>
            <Text size="1" color="gray">Across {data.length} waste categories</Text>
          </Flex>
        </Card>
        
        <Card size="2">
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Wastage Percentage</Text>
            <Heading size="6">{(totalQuantity / 35000 * 100).toFixed(1)}%</Heading>
            <Text size="1" color="gray">Of total inventory usage</Text>
          </Flex>
        </Card>
      </Grid>

      {/* Charts */}
      <Flex gap="4" direction={{ initial: 'column', md: 'row' }}>
        <Card size="3" style={{ flex: 1 }}>
          <CardHeading title="Wastage by Category" />
          <Box height="350px">
          {isClient ? (
            <Chart
              options={pieChartOptions}
              series={pieChartSeries}
              type="pie"
              height={350}
            />
          ) : (
            <ChartLoadingPlaceholder height={350} message="Loading chart data..." />
          )}
          </Box>
        </Card>
        
        <Card size="3" style={{ flex: 1 }}>
          <CardHeading title="Wastage Value Trend" />
          <Box height="350px">
          {isClient ? (
            <Chart
              options={trendChartOptions}
              series={trendChartSeries}
              type="line"
              height={350}
            />
          ) : (
            <ChartLoadingPlaceholder height={350} message="Loading chart data..." />
          )}
          </Box>
        </Card>
      </Flex>

      {/* Detailed Table */}
      <Card size="3">
        <CardHeading title="Wastage by Category" />
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Quantity (kg)</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Value</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>% of Total</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Monthly Change</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((category) => (
              <Table.Row key={category.id}>
                <Table.Cell>
                  <Text weight="medium">{category.name}</Text>
                </Table.Cell>
                <Table.Cell>{formatNumberThousand(category.quantity)} kg</Table.Cell>
                <Table.Cell>{formatCurrency(category.value)}</Table.Cell>
                <Table.Cell>
                  <Badge color={
                    category.percentage > 25 ? 'red' : 
                    category.percentage > 15 ? 'orange' : 
                    'green'
                  }>
                    {category.percentage.toFixed(1)}%
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="1">
                    {category.growth > 0 ? (
                      <TrendingUp size={16} className="text-red-600" />
                    ) : category.growth < 0 ? (
                      <TrendingDown size={16} className="text-green-600" />
                    ) : (
                      <Minus size={16} className="text-gray-500" />
                    )}
                    <Text color={category.growth > 0 ? 'red' : category.growth < 0 ? 'green' : 'gray'}>
                      {category.growth > 0 ? '+' : ''}{category.growth.toFixed(1)}%
                    </Text>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>
    </Box>
  );
};

export default WastageSummaryReport; 