import React, { useState, useEffect } from 'react';
import { Box, Card, Heading, Text, Table, Flex, Badge, Grid } from '@radix-ui/themes';
import { TrendingDown, TrendingUp, Minus, AlertTriangle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { chartColorPalettes, useChartOptions } from '@/utilities/chartOptions';
import ChartLoadingPlaceholder from '@/components/common/ChartLoadingPlaceholder';
import { formatCurrency } from '@/utilities';
import CardHeading from '@/components/common/CardHeading';

// Dynamically import chart component to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface InventoryCostAnalysisReportProps {
  data: {
    id: string;
    name: string;
    currentCost: number;
    previousCost: number;
    costChange: number;
    forecastCost: number;
    forecastChange: number;
    avgItemCost: number;
  }[];
  isClient: boolean;
}

const InventoryCostAnalysisReport: React.FC<InventoryCostAnalysisReportProps> = ({ data, isClient }) => {
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
  const totalCurrentCost = data.reduce((sum, category) => sum + category.currentCost, 0);
  const totalPreviousCost = data.reduce((sum, category) => sum + category.previousCost, 0);
  const totalCostChange = parseFloat(((totalCurrentCost - totalPreviousCost) / totalPreviousCost * 100).toFixed(1));
  
  // Categories with highest cost increase
  const highIncreaseCategories = [...data]
    .sort((a, b) => b.costChange - a.costChange)
    .slice(0, 3);
  
  // Prepare comparison bar chart data
  const comparisonChartSeries = [
    {
      name: 'Previous Month',
      data: data.map(item => item.previousCost)
    },
    {
      name: 'Current Month',
      data: data.map(item => item.currentCost)
    },
    {
      name: 'Forecast Next Month',
      data: data.map(item => item.forecastCost)
    }
  ];
  
  const comparisonChartOptions = chartOptions.getBarOptions({
    xaxis: {
      ...chartOptions.getBaseXAxisOptions(),
      categories: data.map(item => item.name),
    },
    colors: [chartColorPalettes.muted[0], chartColorPalettes.restaurant[2], chartColorPalettes.restaurant[4]],
    yaxis: {
      title: {
        text: 'Cost ($)'
      },
      labels: {
        ...chartOptions.getBaseYAxisLabels(),
        formatter: function(val: number) {
          return '$' + val.toFixed(0);
        }
      }
    },
    tooltip: {
      ...chartOptions.getBaseTooltipOptions(),
      y: {
        formatter: function(val: number) {
          return '$' + val.toFixed(2);
        }
      }
    }
  });
  
  // Prepare trend line chart
  const trendChartSeries = [
    {
      name: 'Total Cost',
      data: [
        totalPreviousCost * 0.9,
        totalPreviousCost,
        totalCurrentCost,
        totalCurrentCost * (1 + (data[0].forecastChange / 100))
      ]
    }
  ];
  
  const trendChartOptions = chartOptions.getLineOptions({
    xaxis: {
      ...chartOptions.getBaseXAxisOptions(),
      categories: ['Sep', 'Oct', 'Nov', 'Dec (Forecast)'],
    },
    colors: [chartColorPalettes.info[2]],
    markers: {
      size: 6,
    },
    yaxis: {
      title: {
        text: 'Cost ($)'
      },
      labels: {
        ...chartOptions.getBaseYAxisLabels(),
        formatter: function(val: number) {
          return '$' + val.toFixed(0);
        }
      }
    },
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
            <Text size="2" color="gray">Current Month Cost</Text>
            <Heading size="6">{formatCurrency(totalCurrentCost)}</Heading>
            <Flex align="center" gap="1">
              <Text size="1" color={totalCostChange > 0 ? 'red' : 'green'}>
                {totalCostChange > 0 ? (
                  <TrendingUp size={14} className="inline text-red-600 mr-1" />
                ) : (
                  <TrendingDown size={14} className="inline text-green-600 mr-1" />
                )}
                {totalCostChange > 0 ? '+' : ''}{totalCostChange}% from last month
              </Text>
            </Flex>
          </Flex>
        </Card>
        
        <Card size="2">
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Average Item Cost</Text>
            <Heading size="6">{formatCurrency(data.reduce((sum, cat) => sum + cat.avgItemCost, 0) / data.length)}</Heading>
            <Text size="1" color="gray">Per inventory item</Text>
          </Flex>
        </Card>
        
        <Card size="2">
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Highest Increase Category</Text>
            <Heading size="6">{highIncreaseCategories[0].name}</Heading>
            <Flex align="center" gap="1">
              <AlertTriangle size={14} className="text-orange-500" />
              <Text size="1" color="orange">+{highIncreaseCategories[0].costChange}% increase</Text>
            </Flex>
          </Flex>
        </Card>
      </Grid>

      {/* Charts */}
      <Flex gap="4" direction={{ initial: 'column', md: 'row' }}>
        <Card size="3" style={{ flex: 1 }}>
          <CardHeading title="Cost Trend by Category" />
          <div className="h-[350px]">
            {isClient ? (
              chartsLoading ? (
                <ChartLoadingPlaceholder height={350} message="Loading comparison data..." />
              ) : (
                <Chart
                  options={comparisonChartOptions}
                  series={comparisonChartSeries}
                  type="bar"
                  height={350}
                />
              )
            ) : (
              <ChartLoadingPlaceholder height={350} message="Loading comparison data..." />
            )}
          </div>
        </Card>
        
        <Card size="3" style={{ flex: 1 }}>
          <CardHeading title="Total Inventory Cost Trend" />
          <div className="h-[350px]">
            {isClient ? (
              chartsLoading ? (
                <ChartLoadingPlaceholder height={350} message="Loading trend data..." />
              ) : (
                <Chart
                  options={trendChartOptions}
                  series={trendChartSeries}
                  type="line"
                  height={350}
                />
              )
            ) : (
              <ChartLoadingPlaceholder height={350} message="Loading trend data..." />
            )}
          </div>
        </Card>
      </Flex>

      {/* Detailed Table */}
      <Card size="3">
        <CardHeading title="Cost Analysis by Category" />
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Previous Month</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Current Month</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Cost Change</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Forecast Next Month</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Avg Item Cost</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((category) => (
              <Table.Row key={category.id}>
                <Table.Cell>
                  <Text weight="medium">{category.name}</Text>
                </Table.Cell>
                <Table.Cell>{formatCurrency(category.previousCost)}</Table.Cell>
                <Table.Cell>{formatCurrency(category.currentCost)}</Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="1">
                    {category.costChange > 0 ? (
                      <TrendingUp size={16} className="text-red-600" />
                    ) : category.costChange < 0 ? (
                      <TrendingDown size={16} className="text-green-600" />
                    ) : (
                      <Minus size={16} className="text-gray-500" />
                    )}
                    <Text color={category.costChange > 0 ? 'red' : category.costChange < 0 ? 'green' : 'gray'}>
                      {category.costChange > 0 ? '+' : ''}{category.costChange}%
                    </Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Text color={category.forecastChange > 0 ? 'red' : 'green'}>
                    {formatCurrency(category.forecastCost)}
                    <Text size="1">
                      ({category.forecastChange > 0 ? '+' : ''}{category.forecastChange}%)
                    </Text>
                  </Text>
                </Table.Cell>
                <Table.Cell>{formatCurrency(category.avgItemCost)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>
    </Box>
  );
};

export default InventoryCostAnalysisReport; 