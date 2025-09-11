import React, { useState, useEffect } from 'react';
import { Box, Card, Heading, Text, Table, Flex, Badge } from '@radix-ui/themes';
import { AlertTriangle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { chartColorPalettes, useChartOptions } from '@/utilities/chartOptions';
import ChartLoadingPlaceholder from '@/components/common/ChartLoadingPlaceholder';
import { formatCurrency, formatDate, formatNumberThousand } from '@/utilities';
import CardHeading from '@/components/common/CardHeading';

// Dynamically import chart component to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface WastageDetailsReportProps {
  data: {
    id: string;
    itemName: string;
    category: string;
    categoryName: string;
    quantity: number;
    value: number;
    date: Date;
    reason: string;
    branch: string;
    branchId: string;
    action: string;
    unit: string;
    preventable: boolean;
    isMenuItem?: boolean;
    originalCategory?: string;
  }[];
}

const WastageDetailsReport: React.FC<WastageDetailsReportProps> = ({ data }) => {
  const chartOptions = useChartOptions();
  
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsClient(true), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  // Calculate total preventable waste value
  const preventableWaste = data.filter(item => item.preventable).reduce((sum, item) => sum + item.value, 0);
  
  // Calculate total value
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate preventable percentage
  const preventablePercentage = (preventableWaste / totalValue) * 100;
  
  // Group by reason
  const reasonCounts: {[key: string]: {count: number, value: number}} = {};
  data.forEach(item => {
    if (!reasonCounts[item.reason]) {
      reasonCounts[item.reason] = { count: 0, value: 0 };
    }
    reasonCounts[item.reason].count += 1;
    reasonCounts[item.reason].value += item.value;
  });
  
  // Group by item category
  const categoryCounts: {[key: string]: {count: number, value: number}} = {};
  data.forEach(item => {
    if (!categoryCounts[item.categoryName]) {
      categoryCounts[item.categoryName] = { count: 0, value: 0 };
    }
    categoryCounts[item.categoryName].count += 1;
    categoryCounts[item.categoryName].value += item.value;
  });
  
  // Most expensive wastage items
  const sortedItems = [...data].sort((a, b) => b.value - a.value);
  const topWastedItems = sortedItems.slice(0, 5);
  
  // Prepare data for reason chart
  const reasonChartSeries = [{
    name: 'Waste Value',
    data: Object.values(reasonCounts).map(item => item.value)
  }];
  
  const reasonChartOptions = chartOptions.getBarOptions({
    xaxis: {
      ...chartOptions.getBaseXAxisOptions(),
      categories: Object.keys(reasonCounts),
    },
    colors: [chartColorPalettes.negative[2]],
    tooltip: {
      ...chartOptions.getBaseTooltipOptions(),
      y: {
        formatter: (value: number) => formatCurrency(value)
      }
    }
  });
  
  // Prepare data for category chart
  const categoryChartSeries = Object.values(categoryCounts).map(item => item.value);
  const categoryChartLabels = Object.keys(categoryCounts);
  
  const categoryChartOptions = chartOptions.getPieOptions({
    labels: categoryChartLabels,
    colors: chartColorPalettes.negative,
    tooltip: {
      y: {
        formatter: (value: number) => formatCurrency(value)
      }
    }
  });

  return (
    <Box className="space-y-6">
      {/* Summary Cards */}
      <Flex gap="4" wrap="wrap">
        <Card size="2" style={{ flex: '1 0 250px' }}>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Total Items Wasted</Text>
            <Heading size="6">{data.length}</Heading>
            <Text size="1" color="gray">In the selected time period</Text>
          </Flex>
        </Card>
        
        <Card size="2" style={{ flex: '1 0 250px' }}>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Preventable Waste</Text>
            <Heading size="6" color="red">{formatCurrency(preventableWaste)}</Heading>
            <Flex align="center" gap="1">
              <AlertTriangle size={14} className="text-red-600" />
              <Text size="1" color="red">{preventablePercentage.toFixed(1)}% of total waste</Text>
            </Flex>
          </Flex>
        </Card>
        
        <Card size="2" style={{ flex: '1 0 250px' }}>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Top Waste Reason</Text>
            <Heading size="6">
              {Object.entries(reasonCounts).sort((a, b) => b[1].value - a[1].value)[0][0]}
            </Heading>
            <Text size="1" color="gray">
              {formatCurrency(Object.entries(reasonCounts).sort((a, b) => b[1].value - a[1].value)[0][1].value)}
            </Text>
          </Flex>
        </Card>
      </Flex>

      {/* Charts */}
      <Flex gap="4" direction={{ initial: 'column', md: 'row' }}>
        <Card size="3" style={{ flex: 1 }}>
          <CardHeading title="Waste by Reason" />
          {isClient ? (
            <Box height="300px">
              <Chart
                options={reasonChartOptions}
                series={reasonChartSeries}
                type="bar"
                height="100%"
              />
            </Box>
          ) : (
            <ChartLoadingPlaceholder height={300} message="Loading reason data..." />
          )}
        </Card>
        
        <Card size="3" style={{ flex: 1 }}>
          <CardHeading title="Waste by Category" />
          {isClient ? (
            <Box height="300px">
              <Chart
                options={categoryChartOptions}
                series={categoryChartSeries}
                type="pie"
                height="100%"
              />
            </Box>
          ) : (
            <ChartLoadingPlaceholder height={300} message="Loading category data..." />
          )}
        </Card>
      </Flex>

      {/* Top 5 Most Expensive Waste Items */}
      <Card size="3">
        <CardHeading title="Top 5 Most Expensive Waste Items" />
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Original Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Value</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Reason</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Preventable</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {topWastedItems.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>
                  <Text weight="medium">{item.itemName}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={item.isMenuItem ? 'blue' : 'purple'}>
                    {item.isMenuItem ? 'Menu Item' : 'Ingredient'}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{item.originalCategory ? item.originalCategory.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()) : '-'}</Table.Cell>
                <Table.Cell>{formatNumberThousand(item.quantity)} {item.unit}</Table.Cell>
                <Table.Cell>{formatCurrency(item.value)}</Table.Cell>
                <Table.Cell>{item.reason}</Table.Cell>
                <Table.Cell>
                  <Badge color={item.preventable ? 'red' : 'gray'}>
                    {item.preventable ? 'Yes' : 'No'}
                  </Badge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>

      {/* Detailed Table */}
      <Card size="3">
        <CardHeading title="Waste Items Detail" />
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Waste Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Branch</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Value</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Reason</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Action Taken</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.slice(0, 10).map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>
                  <Text weight="medium">{item.itemName}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={item.isMenuItem ? 'blue' : 'purple'}>
                    {item.isMenuItem ? 'Menu Item' : 'Ingredient'}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{item.categoryName}</Table.Cell>
                <Table.Cell>{item.branch}</Table.Cell>
                <Table.Cell>{formatDate(item.date)}</Table.Cell>
                <Table.Cell>
                  {formatNumberThousand(item.quantity)} {item.unit}
                </Table.Cell>
                <Table.Cell>{formatCurrency(item.value)}</Table.Cell>
                <Table.Cell>
                  <Badge color={item.preventable ? 'red' : 'gray'}>
                    {item.reason}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{item.action}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>
    </Box>
  );
};

export default WastageDetailsReport; 