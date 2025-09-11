'use client';

import React, { useState, useEffect } from 'react';
import { Box, Card, Heading, Text, Table, Flex, Badge, Grid } from '@radix-ui/themes';
import { TrendingDown, TrendingUp, Minus, DollarSign, PieChart, BarChart4 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { chartColorPalettes, useChartOptions } from '@/utilities/chartOptions';
import ChartLoadingPlaceholder from '@/components/common/ChartLoadingPlaceholder';
import { formatCurrency, formatNumberThousand } from '@/utilities';
import CardHeading from '@/components/common/CardHeading';

// Dynamically import chart component to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface WastageCostReportProps {
  data: {
    id: string;
    category: string;
    currentCost: number;
    previousCost: number;
    costChange: number;
    forecastCost: number;
    forecastChange: number;
    percentOfRevenue: number;
    costPerIncident: number;
    costPerKg: number;
  }[];
  monthlyCostData: {
    month: string;
    value: number;
    percentOfRevenue: number;
    revenue: number;
  }[];
}

const WastageCostReport: React.FC<WastageCostReportProps> = ({ data, monthlyCostData }) => {
  const chartOptions = useChartOptions();
  
  // Calculate total current and previous costs
  const totalCurrentCost = data.reduce((sum, category) => sum + category.currentCost, 0);
  const totalPreviousCost = data.reduce((sum, category) => sum + category.previousCost, 0);
  
  // Calculate change percentage
  const totalCostChange = ((totalCurrentCost - totalPreviousCost) / totalPreviousCost) * 100;
  
  // Calculate total forecast cost
  const totalForecastCost = data.reduce((sum, category) => sum + category.forecastCost, 0);
  
  // Calculate average percent of revenue
  const avgPercentOfRevenue = data.reduce((sum, category) => sum + category.percentOfRevenue, 0) / data.length;
  
  // Prepare data for category cost chart
  const categoryCostSeries = [{
    name: 'Current Cost',
    data: data.map(category => category.currentCost)
  }, {
    name: 'Previous Cost',
    data: data.map(category => category.previousCost)
  }, {
    name: 'Forecast Cost',
    data: data.map(category => category.forecastCost)
  }];
  
  const categoryCostOptions = chartOptions.getBarOptions({
    xaxis: {
      ...chartOptions.getBaseXAxisOptions(),
      categories: data.map(category => category.category),
    },
    yaxis: {
      labels: {
        ...chartOptions.getBaseYAxisLabels(),
        formatter: (value: number) => formatCurrency(value)
      }
    },
    colors: [chartColorPalettes.negative[2], chartColorPalettes.info[2], chartColorPalettes.monochrome[3]],
    plotOptions: {
      bar: {
        horizontal: false,
      }
    },
    tooltip: {
      ...chartOptions.getBaseTooltipOptions(),
      y: {
        formatter: (value: number) => formatCurrency(value)
      }
    }
  });
  
  // Prepare data for monthly trend chart
  const monthlyTrendSeries = [{
    name: 'Waste Cost',
    data: monthlyCostData.map(item => item.value)
  }, {
    name: '% of Revenue',
    data: monthlyCostData.map(item => item.percentOfRevenue)
  }];
  
  const monthlyTrendOptions = chartOptions.getLineOptions({
    chart: {
      type: 'line',
      toolbar: {
        show: false
      }
    },
    stroke: {
      width: [3, 2],
      curve: 'smooth',
      dashArray: [0, 5]
    },
    xaxis: {
      ...chartOptions.getBaseXAxisOptions(),
      categories: monthlyCostData.map(item => item.month),
    },
    yaxis: [
      {
        title: {
          text: 'Waste Cost',
        },
        labels: {
          ...chartOptions.getBaseYAxisLabels(),
          formatter: (value: number) => `${formatCurrency(value)}`
        }
      },
      {
        opposite: true,
        title: {
          text: '% of Revenue'
        },
        labels: {
          ...chartOptions.getBaseYAxisLabels(),
          formatter: (value: number) => `${value.toFixed(1)}%`
        },
        min: 0,
      }
    ],
    colors: [chartColorPalettes.negative[2], chartColorPalettes.info[2]],
    markers: {
      size: 4
    },
    tooltip: {
      ...chartOptions.getBaseTooltipOptions(),
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number, { seriesIndex }) => {
          if (seriesIndex === 0) {
            return formatCurrency(value);
          }
          return `${value.toFixed(1)}%`;
        }
      }
    }
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsClient(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box className="space-y-6">
      {/* Summary Cards */}
      <Grid gap="4" columns={{ initial: '1', sm: '2', md: '4' }}>
        <Card size="2">
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Current Month Cost</Text>
            <Heading size="6">{formatCurrency(totalCurrentCost)}</Heading>
            <Flex align="center" gap="1">
              {totalCostChange > 0 ? (
                <>
                  <TrendingUp size={14} className="text-red-600" />
                  <Text size="1" color="red">+{totalCostChange.toFixed(1)}% from last month</Text>
                </>
              ) : (
                <>
                  <TrendingDown size={14} className="text-green-600" />
                  <Text size="1" color="green">{totalCostChange.toFixed(1)}% from last month</Text>
                </>
              )}
            </Flex>
          </Flex>
        </Card>
        
        <Card size="2">
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Forecast Next Month</Text>
            <Heading size="6">{formatCurrency(totalForecastCost)}</Heading>
            <Flex align="center" gap="1">
              {totalForecastCost > totalCurrentCost ? (
                <Text size="1" color="red">+{((totalForecastCost - totalCurrentCost) / totalCurrentCost * 100).toFixed(1)}% expected increase</Text>
              ) : (
                <Text size="1" color="green">{((totalForecastCost - totalCurrentCost) / totalCurrentCost * 100).toFixed(1)}% expected decrease</Text>
              )}
            </Flex>
          </Flex>
        </Card>
        
        <Card size="2">
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">% of Revenue</Text>
            <Heading size="6">{avgPercentOfRevenue.toFixed(1)}%</Heading>
            <Text size="1" color="gray">Average across categories</Text>
          </Flex>
        </Card>
        
        <Card size="2">
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Highest Cost Category</Text>
            <Heading size="6">{data.sort((a, b) => b.currentCost - a.currentCost)[0]?.category}</Heading>
            <Text size="1" color="gray">
              {formatCurrency(data.sort((a, b) => b.currentCost - a.currentCost)[0]?.currentCost || 0)}
            </Text>
          </Flex>
        </Card>
      </Grid>

      {/* Category Cost Chart */}
      <Card size="3">
        <CardHeading title="Waste Cost by Category" />
        <Box height="350px">
          {isClient ? (
            <Chart
              options={categoryCostOptions}
              series={categoryCostSeries}
              type="bar"
              height={350}
            />
          ) : (
            <ChartLoadingPlaceholder height={350} message="Loading category cost data..." />
          )}
        </Box>

        <Flex justify="center" gap="8" mt="4">
          <Card size="1" variant="ghost">
            <Flex gap="2" align="center">
              <DollarSign size={24} className="text-red-500" />
              <Flex direction="column">
                <Text size="2" weight="medium">Annual Waste Cost</Text>
                <Heading size="5">{formatCurrency(totalCurrentCost * 12)}</Heading>
                <Text size="1" color="gray">Projected based on current month</Text>
              </Flex>
            </Flex>
          </Card>
          
          <Card size="1" variant="ghost">
            <Flex gap="2" align="center">
              <PieChart size={24} className="text-blue-500" />
              <Flex direction="column">
                <Text size="2" weight="medium">Average Cost per Incident</Text>
                <Heading size="6">{formatCurrency(data.reduce((sum, category) => sum + category.costPerIncident, 0) / data.length)}</Heading>
                <Text size="1" color="gray">Across all categories</Text>
              </Flex>
            </Flex>
          </Card>
          
          <Card size="1" variant="ghost">
            <Flex gap="2" align="center">
              <BarChart4 size={24} className="text-green-500" />
              <Flex direction="column">
                <Text size="2" weight="medium">Potential Savings</Text>
                <Heading size="5">{formatCurrency(totalCurrentCost * 0.3)}</Heading>
                <Text size="1" color="gray">Based on 30% waste reduction</Text>
              </Flex>
            </Flex>
          </Card>
        </Flex>
      </Card>

      {/* Monthly Trend and Revenue Impact Charts */}
      <Card size="3" style={{ flex: 1 }}>
        <CardHeading title="Monthly Waste Cost Trend" />
        <Box height="350px">
          {isClient ? (
            <Chart
              options={monthlyTrendOptions}
              series={monthlyTrendSeries}
              type="line"
              height={350}
            />
          ) : (
            <ChartLoadingPlaceholder height={350} message="Loading monthly trend data..." />
          )}
        </Box>
      </Card>

      {/* Cost Impact Metrics */}
      <Card size="3">
        <CardHeading title="Cost Analysis by Category" />
        <Box style={{ overflowX: 'auto' }}>
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Current Cost</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Previous Cost</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Change</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Forecast</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>% of Revenue</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Cost per Incident</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Cost per Kg</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.map((category) => (
                <Table.Row key={category.id}>
                  <Table.Cell>
                    <Text weight="medium">{category.category}</Text>
                  </Table.Cell>
                  <Table.Cell>{formatCurrency(category.currentCost)}</Table.Cell>
                  <Table.Cell>{formatCurrency(category.previousCost)}</Table.Cell>
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
                        {category.costChange > 0 ? '+' : ''}{category.costChange.toFixed(1)}%
                      </Text>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    {formatCurrency(category.forecastCost)}
                    <Text size="1" color={category.forecastChange > 0 ? 'red' : 'green'}>
                      {category.forecastChange > 0 ? '+' : ''}{category.forecastChange.toFixed(1)}%
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={
                      category.percentOfRevenue > 2 ? 'red' : 
                      category.percentOfRevenue > 1 ? 'orange' : 
                      'green'
                    }>
                      {category.percentOfRevenue.toFixed(1)}%
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{formatCurrency(category.costPerIncident)}</Table.Cell>
                  <Table.Cell>{formatCurrency(category.costPerKg)}/kg</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Card>
    </Box>
  );
};

export default WastageCostReport;