import React, { useState, useEffect } from 'react';
import { Box, Card, Heading, Text, Table, Flex, Badge, Grid } from '@radix-ui/themes';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import dynamic from 'next/dynamic';
import { chartColorPalettes, useChartOptions } from '@/utilities/chartOptions';
import ChartLoadingPlaceholder from '@/components/common/ChartLoadingPlaceholder';
import { formatCurrency } from '@/utilities';
import CardHeading from '@/components/common/CardHeading';

// Dynamically import chart component to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface IngredientUsageReportProps {
  data: {
    id: string;
    name: string;
    category: string;
    weeklyUsage: number;
    monthlyUsage: number;
    variance: number;
    monthlyCost: number;
    unit: string;
  }[];
  isClient: boolean;
}

const IngredientUsageReport: React.FC<IngredientUsageReportProps> = ({ data, isClient }) => {
  const chartOptions = useChartOptions();
  const [chartsLoading, setChartsLoading] = useState(true);
  
  useEffect(() => {
    if (isClient) {
      const timer = setTimeout(() => {
        setChartsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isClient]);
  
  // Calculate totals
  const totalMonthlyUsage = data.reduce((sum, item) => sum + item.monthlyUsage, 0);
  const totalMonthlyCost = data.reduce((sum, item) => sum + item.monthlyCost, 0);
  
  // Get top 8 ingredients by usage for chart
  const topIngredients = [...data]
    .sort((a, b) => b.monthlyUsage - a.monthlyUsage)
    .slice(0, 8);
  
  // Prepare data for bar chart
  const barChartSeries = [{
    name: 'Monthly Usage',
    data: topIngredients.map(item => item.monthlyUsage)
  }];
  
  const barChartOptions = chartOptions.getHorizontalBarOptions({
    xaxis: {
      ...chartOptions.getBaseXAxisOptions(),
      categories: topIngredients.map(item => item.name),
    },
    yaxis: {
      labels: chartOptions.getBaseYAxisLabels(),
      title: {
        text: 'Usage Units'
      }
    },
    colors: [chartColorPalettes.warm[0]],
    dataLabels: {
      enabled: false
    },
    tooltip: chartOptions.getBaseTooltipOptions()
  });
  
  // Group by category for pie chart
  const categoryUsage: {[key: string]: number} = {};
  data.forEach(item => {
    categoryUsage[item.category] = (categoryUsage[item.category] || 0) + item.monthlyCost;
  });
  
  // Prepare data for pie chart
  const pieChartSeries = Object.values(categoryUsage);
  const pieChartOptions = chartOptions.getPieOptions({
    labels: Object.keys(categoryUsage),
    colors: chartColorPalettes.default,
    tooltip: {
      ...chartOptions.getBaseTooltipOptions(),
      y: {
        formatter: function(val: number) {
          return '$' + val.toFixed(2);
        }
      }
    }
  });

  return (
    <Box className="space-y-6">
      {/* Summary Cards */}
      <Grid gap="4" columns={{ initial: '1', md: '3' }}>
        <Card size="2">
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Total Monthly Usage</Text>
            <Heading size="6">{formatCurrency(totalMonthlyUsage)}</Heading>
            <Text size="1" color="gray">Across all ingredients</Text>
          </Flex>
        </Card>
        
        <Card size="2">
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Total Monthly Cost</Text>
            <Heading size="6">{formatCurrency(totalMonthlyCost)}</Heading>
            <Text size="1" color="gray">For all ingredients</Text>
          </Flex>
        </Card>
        
        <Card size="2">
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Average Usage Variance</Text>
            <Heading size="6">
              {(data.reduce((sum, item) => sum + item.variance, 0) / data.length).toFixed(1)}%
            </Heading>
            <Text size="1" color="gray">From expected usage</Text>
          </Flex>
        </Card>
      </Grid>

      {/* Charts */}
      <Flex gap="4" direction={{ initial: 'column', md: 'row' }}>
        <Card size="3" style={{ flex: 1 }}>
          <CardHeading title="Top 8 Ingredients by Usage" />
          <div className="h-[350px]">
            {isClient ? (
              chartsLoading ? (
                <ChartLoadingPlaceholder height={350} message="Loading usage data..." />
              ) : (
                <Chart
                  options={barChartOptions}
                  series={barChartSeries}
                  type="bar"
                  height={350}
                />
              )
            ) : (
              <ChartLoadingPlaceholder height={350} message="Loading usage data..." />
            )}
          </div>
        </Card>
        
        <Card size="3" style={{ flex: 1 }}>
          <CardHeading title="Monthly Cost by Category" />
          <div className="h-[350px]">
            {isClient ? (
              chartsLoading ? (
                <ChartLoadingPlaceholder height={350} message="Loading cost data..." />
              ) : (
                <Chart
                  options={pieChartOptions}
                  series={pieChartSeries}
                  type="pie"
                  height={350}
                />
              )
            ) : (
              <ChartLoadingPlaceholder height={350} message="Loading cost data..." />
            )}
          </div>
        </Card>
      </Flex>

      {/* Detailed Table */}
      <Card size="3">
        <CardHeading title="Ingredient Usage Details" />
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Ingredient</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Weekly Usage</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Monthly Usage</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Usage Variance</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Monthly Cost</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>
                  <Text weight="medium">{item.name}</Text>
                </Table.Cell>
                <Table.Cell>{item.category}</Table.Cell>
                <Table.Cell>{item.weeklyUsage.toFixed(2)} {item.unit}</Table.Cell>
                <Table.Cell>{item.monthlyUsage.toFixed(2)} {item.unit}</Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="1">
                    {item.variance > 5 ? (
                      <TrendingUp size={16} className="text-red-600" />
                    ) : item.variance < -5 ? (
                      <TrendingDown size={16} className="text-green-600" />
                    ) : (
                      <Minus size={16} className="text-gray-500" />
                    )}
                    <Text color={item.variance > 5 ? 'red' : item.variance < -5 ? 'green' : 'gray'}>
                      {item.variance > 0 ? '+' : ''}{item.variance}%
                    </Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell>{formatCurrency(item.monthlyCost)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>
    </Box>
  );
};

export default IngredientUsageReport; 