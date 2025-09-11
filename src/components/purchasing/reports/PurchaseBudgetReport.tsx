import React, { useState, useEffect } from 'react';
import { Box, Card, Heading, Text, Table, Flex, Badge } from '@radix-ui/themes';
import { TrendingDown, TrendingUp, Minus, AlertTriangle, BadgeCheck } from 'lucide-react';
import dynamic from 'next/dynamic';
import { chartColorPalettes, useChartOptions } from '@/utilities/chartOptions';
import ChartLoadingPlaceholder from '@/components/common/ChartLoadingPlaceholder';
import { formatCurrency, formatNumberThousand } from '@/utilities';
import CardHeading from '@/components/common/CardHeading';

// Dynamically import chart component to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface PurchaseBudgetReportProps {
  data: {
    id: string;
    name: string;
    budgetAmount: number;
    actualSpending: number;
    variance: number;
    variancePercent: number;
    forecastRemaining: number;
    projectedFinalSpending: number;
    projectedVariance: number;
  }[];
  isClient: boolean;
}

const PurchaseBudgetReport: React.FC<PurchaseBudgetReportProps> = ({ data, isClient }) => {
  const chartOptions = useChartOptions();
  const [chartsLoading, setChartsLoading] = useState(true);
  
  // Simulate chart loading effect
  useEffect(() => {
    if (isClient) {
      const timer = setTimeout(() => {
        setChartsLoading(false);
      }, 1100);
      
      return () => clearTimeout(timer);
    }
  }, [isClient]);
  
  // Calculate totals
  const totalBudget = data.reduce((sum, item) => sum + item.budgetAmount, 0);
  const totalActual = data.reduce((sum, item) => sum + item.actualSpending, 0);
  const totalVariance = totalActual - totalBudget;
  const totalVariancePercent = (totalVariance / totalBudget) * 100;
  const totalProjected = data.reduce((sum, item) => sum + item.projectedFinalSpending, 0);
  const totalProjectedVariance = totalProjected - totalBudget;
  const totalProjectedVariancePercent = (totalProjectedVariance / totalBudget) * 100;
  
  // Count categories over/under budget
  const categoriesOverBudget = data.filter(item => item.variancePercent > 0).length;
  const categoriesOnBudget = data.filter(item => item.variancePercent >= -5 && item.variancePercent <= 5).length;
  const categoriesUnderBudget = data.filter(item => item.variancePercent < -5).length;
  
  // Prepare data for bar chart (budget vs actual)
  const barChartSeries = [
    {
      name: 'Budget',
      data: data.map(item => item.budgetAmount)
    },
    {
      name: 'Actual',
      data: data.map(item => item.actualSpending)
    }
  ];
  
  const barChartOptions = chartOptions.getBarOptions({
    xaxis: {
      ...chartOptions.getBaseXAxisOptions(),
      categories: data.map(item => item.name),
    },
    yaxis: {
      labels: {
        ...chartOptions.getBaseYAxisLabels(),
        formatter: function(value) {
          return formatCurrency(Number(value));
        }
      }
    },
    colors: [chartColorPalettes.info[2], chartColorPalettes.positive[2]],
    dataLabels: {
      enabled: false
    },
    tooltip: {
      ...chartOptions.getBaseTooltipOptions(),
      y: {
        formatter: (value: number) => formatCurrency(value)
      }
    }
  });
  
  // Prepare data for pie chart (variance distribution)
  const pieChartSeries = [
    categoriesOverBudget,
    categoriesOnBudget,
    categoriesUnderBudget
  ];
  
  const pieChartOptions = chartOptions.getPieOptions({
    labels: ['Over Budget', 'On Budget (±5%)', 'Under Budget'],
    colors: [chartColorPalettes.negative[2], chartColorPalettes.warm[2], chartColorPalettes.positive[2]],
    tooltip: {
      ...chartOptions.getBaseTooltipOptions(),
      y: {
        formatter: function(value) {
          return `${value} categories`;
        }
      }
    }
  });

  return (
    <Box className="space-y-6">
      {/* Summary Cards */}
      <Flex gap="4" wrap="wrap">
        <Card size="2" style={{ flex: '1 0 200px' }}>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Total Budget</Text>
            <Heading size="6">{formatCurrency(totalBudget)}</Heading>
            <Text size="1" color="gray">Allocated across {data.length} categories</Text>
          </Flex>
        </Card>
        
        <Card size="2" style={{ flex: '1 0 200px' }}>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Current Spending</Text>
            <Heading size="6">{formatCurrency(totalActual)}</Heading>
            <Flex align="center" gap="1">
              <Text size="1" color={totalVariance > 0 ? 'red' : totalVariance < 0 ? 'green' : 'gray'}>
                {totalVariance > 0 ? 'Over budget by ' : totalVariance < 0 ? 'Under budget by ' : ''}
                {formatCurrency(Math.abs(totalVariance))}
                {' '}({totalVariancePercent > 0 ? '+' : ''}{totalVariancePercent.toFixed(1)}%)
              </Text>
            </Flex>
          </Flex>
        </Card>
        
        <Card size="2" style={{ flex: '1 0 200px' }}>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Projected Spending</Text>
            <Heading size="6" color={totalProjectedVariance > 0 ? 'red' : 'green'}>
              {formatCurrency(totalProjected)}
            </Heading>
            <Flex align="center" gap="1">
              {totalProjectedVariance > 0 ? (
                <AlertTriangle size={14} className="text-red-600" />
              ) : (
                <BadgeCheck size={14} className="text-green-600" />
              )}
              <Text size="1" color={totalProjectedVariance > 0 ? 'red' : 'green'}>
                {totalProjectedVariance > 0 ? 'Projected overspend: ' : 'Projected savings: '}
                {formatCurrency(Math.abs(totalProjectedVariance))}
              </Text>
            </Flex>
          </Flex>
        </Card>
        
        <Card size="2" style={{ flex: '1 0 200px' }}>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Budget Categories</Text>
            <Heading size="6">{data.length}</Heading>
            <Flex align="center" gap="1">
              <Text size="1">
                <Text size="1" color="red">{categoriesOverBudget} over</Text>
                {' • '}
                <Text size="1" color="green">{categoriesUnderBudget} under</Text>
                {' • '}
                <Text size="1">{categoriesOnBudget} on target</Text>
              </Text>
            </Flex>
          </Flex>
        </Card>
      </Flex>

      {/* Charts */}
      <Flex gap="4" direction={{ initial: 'column', md: 'row' }}>
        <Card size="3" style={{ flex: 1 }}>
          <CardHeading title="Budget vs. Actual by Category" />
          <div className="h-[350px]">
            {isClient ? (
              chartsLoading ? (
                <ChartLoadingPlaceholder height={350} message="Loading budget data..." />
              ) : (
                <Chart
                  options={barChartOptions}
                  series={barChartSeries}
                  type="bar"
                  height={350}
                />
              )
            ) : (
              <ChartLoadingPlaceholder height={350} message="Loading budget data..." />
            )}
          </div>
        </Card>
        
        <Card size="3" style={{ flex: 1 }}>
          <CardHeading title="Budget Status Distribution" />
          <div className="h-[350px]">
            {isClient ? (
              chartsLoading ? (
                <ChartLoadingPlaceholder height={350} message="Loading status data..." />
              ) : (
                <Chart
                  options={pieChartOptions}
                  series={pieChartSeries}
                  type="pie"
                  height={350}
                />
              )
            ) : (
              <ChartLoadingPlaceholder height={350} message="Loading status data..." />
            )}
          </div>
        </Card>
      </Flex>

      {/* Detailed Table */}
      <Card size="3">
        <CardHeading title="Budget Status by Category" />
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Budget</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actual Spending</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Variance</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Remaining</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Projected Final</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>
                  <Text weight="medium">{item.name}</Text>
                </Table.Cell>
                <Table.Cell>{formatCurrency(item.budgetAmount)}</Table.Cell>
                <Table.Cell>{formatCurrency(item.actualSpending)}</Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="1">
                    {item.variance > 0 ? (
                      <TrendingUp size={16} className="text-red-600" />
                    ) : item.variance < 0 ? (
                      <TrendingDown size={16} className="text-green-600" />
                    ) : (
                      <Minus size={16} className="text-gray-500" />
                    )}
                    <Text color={item.variance > 0 ? 'red' : item.variance < 0 ? 'green' : 'gray'}>
                      {item.variance > 0 ? '+' : ''}{formatCurrency(item.variance)} ({item.variancePercent > 0 ? '+' : ''}{item.variancePercent.toFixed(1)}%)
                    </Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell>{formatCurrency(item.forecastRemaining)}</Table.Cell>
                <Table.Cell>{formatCurrency(item.projectedFinalSpending)}</Table.Cell>
                <Table.Cell>
                  {item.projectedVariance > 0 ? (
                    <Badge color="red">
                      Over Budget
                    </Badge>
                  ) : item.projectedVariance < 0 && item.projectedVariance >= (item.budgetAmount * -0.05) ? (
                    <Badge color="orange">
                      On Budget
                    </Badge>
                  ) : (
                    <Badge color="green">
                      Under Budget
                    </Badge>
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

export default PurchaseBudgetReport; 