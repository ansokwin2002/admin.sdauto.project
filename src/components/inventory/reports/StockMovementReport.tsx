import React, { useState, useEffect } from 'react';
import { Box, Card, Heading, Text, Table, Flex, Badge } from '@radix-ui/themes';
import { TrendingDown, TrendingUp, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import { chartColorPalettes, useChartOptions } from '@/utilities/chartOptions';
import ChartLoadingPlaceholder from '@/components/common/ChartLoadingPlaceholder';
import { formatNumberThousand } from '@/utilities';
import CardHeading from '@/components/common/CardHeading';

// Dynamically import chart component to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface StockMovementReportProps {
  data: {
    id: string;
    name: string;
    inbound: number;
    outbound: number;
    netChange: number;
    growth: number;
    topCategory: string;
  }[];
  isClient: boolean;
}

const StockMovementReport: React.FC<StockMovementReportProps> = ({ data, isClient }) => {
  const chartOptions = useChartOptions();
  const [chartsLoading, setChartsLoading] = useState(true);
  
  // Simulate chart loading effect
  useEffect(() => {
    if (isClient) {
      const timer = setTimeout(() => {
        setChartsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isClient]);
  
  // Calculate totals
  const totalInbound = data.reduce((sum, branch) => sum + branch.inbound, 0);
  const totalOutbound = data.reduce((sum, branch) => sum + branch.outbound, 0);
  const totalNetChange = totalInbound - totalOutbound;
  
  // Prepare data for bar chart
  const barChartSeries = [{
    name: 'Inbound',
    data: data.map(branch => branch.inbound)
  }, {
    name: 'Outbound',
    data: data.map(branch => branch.outbound)
  }];
  
  const barChartOptions = chartOptions.getBarOptions({
    xaxis: {
      ...chartOptions.getBaseXAxisOptions(),
      categories: data.map(branch => branch.name),
    },
    yaxis: {
      labels: chartOptions.getBaseYAxisLabels(),
      title: {
        text: 'Units'
      }
    },
    colors: [chartColorPalettes.positive[2], chartColorPalettes.negative[2]],
    tooltip: chartOptions.getBaseTooltipOptions()
  });
  
  // Prepare data for movement trend chart
  const trendChartSeries = [{
    name: 'Net Stock Change',
    data: [-120, 80, 40, -50, 150, totalNetChange]
  }];
  
  const trendChartOptions = chartOptions.getLineOptions({
    xaxis: {
      ...chartOptions.getBaseXAxisOptions(),
      categories: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
    },
    colors: [chartColorPalettes.positive[2]],
    yaxis: {
      labels: {
        ...chartOptions.getBaseYAxisLabels(),
        formatter: (value: number) => `${value} units`
      }
    },
    markers: {
      size: 5,
    },
    tooltip: chartOptions.getBaseTooltipOptions()
  });

  return (
    <Box className="space-y-6">
      {/* Summary Cards */}
      <Flex gap="4" wrap="wrap">
        <Card size="2" style={{ flex: '1 0 250px' }}>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Total Inbound</Text>
            <Heading size="6">{formatNumberThousand(totalInbound)} units</Heading>
            <Flex align="center" gap="1">
              <ArrowUpRight size={14} className="text-green-600" />
              <Text size="1" color="green">Incoming stock</Text>
            </Flex>
          </Flex>
        </Card>
        
        <Card size="2" style={{ flex: '1 0 250px' }}>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Total Outbound</Text>
            <Heading size="6">{formatNumberThousand(totalOutbound)} units</Heading>
            <Flex align="center" gap="1">
              <ArrowDownRight size={14} className="text-red-600" />
              <Text size="1" color="red">Consumed/transferred stock</Text>
            </Flex>
          </Flex>
        </Card>
        
        <Card size="2" style={{ flex: '1 0 250px' }}>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Net Stock Change</Text>
            <Heading size="6" color={totalNetChange >= 0 ? 'green' : 'red'}>
              {totalNetChange >= 0 ? '+' : ''}{formatNumberThousand(totalNetChange)} units
            </Heading>
            <Text size="1" color={totalNetChange >= 0 ? 'green' : 'red'}>
              {totalNetChange >= 0 ? 'Stock growth' : 'Stock reduction'}
            </Text>
          </Flex>
        </Card>
      </Flex>

      {/* Charts */}
      <Flex gap="4" direction={{ initial: 'column', md: 'row' }}>
        <Card size="3" style={{ flex: 1 }}>
          <CardHeading title="Inbound vs Outbound" />
          <div className="h-[350px]">
            {isClient ? (
              chartsLoading ? (
                <ChartLoadingPlaceholder height={350} message="Loading inbound/outbound data..." />
              ) : (
                <Chart
                  options={barChartOptions}
                  series={barChartSeries}
                  type="bar"
                  height={350}
                />
              )
            ) : (
              <ChartLoadingPlaceholder height={350} message="Loading inbound/outbound data..." />
            )}
          </div>
        </Card>
        
        <Card size="3" style={{ flex: 1 }}>
          <CardHeading title="Stock Movement Trend" />
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
        <CardHeading title="Stock Movement by Branch" />
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Branch</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Inbound</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Outbound</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Net Change</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Movement Growth</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Top Moving Category</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((branch) => (
              <Table.Row key={branch.id}>
                <Table.Cell>
                  <Text weight="medium">{branch.name}</Text>
                </Table.Cell>
                <Table.Cell>{formatNumberThousand(branch.inbound)} units</Table.Cell>
                <Table.Cell>{formatNumberThousand(branch.outbound)} units</Table.Cell>
                <Table.Cell>
                  <Text color={branch.netChange >= 0 ? 'green' : 'red'}>
                    {branch.netChange >= 0 ? '+' : ''}{formatNumberThousand(branch.netChange)} units
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="1">
                    {branch.growth > 0 ? (
                      <TrendingUp size={16} className="text-green-600" />
                    ) : branch.growth < 0 ? (
                      <TrendingDown size={16} className="text-red-600" />
                    ) : (
                      <Minus size={16} className="text-gray-500" />
                    )}
                    <Text color={branch.growth > 0 ? 'green' : branch.growth < 0 ? 'red' : 'gray'}>
                      {branch.growth > 0 ? '+' : ''}{branch.growth}%
                    </Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Badge color="orange">{branch.topCategory}</Badge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>
    </Box>
  );
};

export default StockMovementReport; 