import React, { useState, useEffect } from 'react';
import { Box, Card, Heading, Text, Table, Flex, Badge, Grid } from '@radix-ui/themes';
import { AlertTriangle, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import dynamic from 'next/dynamic';
import { chartColorPalettes, useChartOptions } from '@/utilities/chartOptions';
import ChartLoadingPlaceholder from '@/components/common/ChartLoadingPlaceholder';
import { formatCurrency, formatNumberThousand } from '@/utilities';
import CardHeading from '@/components/common/CardHeading';

// Dynamically import chart component to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface WastageCausesReportProps {
  data: {
    id: string;
    cause: string;
    count: number;
    value: number;
    preventable: boolean;
    impact: number;
    trend: number;
    primaryCategory: string;
    actions: string[];
  }[];
}

const WastageCausesReport: React.FC<WastageCausesReportProps> = ({ data }) => {
  const chartOptions = useChartOptions();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsClient(true), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  // Calculate total preventable waste
  const preventableWaste = data
    .filter(cause => cause.preventable)
    .reduce((sum, cause) => sum + cause.value, 0);
  
  // Calculate total waste value
  const totalWasteValue = data.reduce((sum, cause) => sum + cause.value, 0);
  
  // Sort causes by value for chart display
  const sortedCauses = [...data].sort((a, b) => b.value - a.value);
  
  // Prepare data for cause value chart
  const causeValueSeries = [{
    name: 'Waste Value',
    data: sortedCauses.map(cause => cause.value)
  }];
  
  const causeValueOptions = chartOptions.getBarOptions({
    xaxis: {
      ...chartOptions.getBaseXAxisOptions(),
      categories: sortedCauses.map(cause => cause.cause),
    },
    yaxis: {
      labels: {
        ...chartOptions.getBaseYAxisLabels(),
        formatter: (value: number) => formatCurrency(value)
      }
    },
    colors: [chartColorPalettes.negative[2]],
    tooltip: {
      ...chartOptions.getBaseTooltipOptions(),
      y: {
        formatter: (value: number) => formatCurrency(value)
      }
    }
  });
  
  // Prepare data for preventable vs. non-preventable
  const preventabilityData = [
    preventableWaste,
    totalWasteValue - preventableWaste
  ];
  
  const preventabilityOptions = chartOptions.getPieOptions({
    labels: ['Preventable', 'Non-Preventable'],
    colors: [chartColorPalettes.negative[2], chartColorPalettes.info[2]],
    tooltip: {
      ...chartOptions.getBaseTooltipOptions(),
      y: {
        formatter: (value: number) => formatCurrency(value)
      }
    }
  });
  
  // Count occurrences by primary category
  const categoryCounts: { [key: string]: number } = {};
  data.forEach(cause => {
    categoryCounts[cause.primaryCategory] = (categoryCounts[cause.primaryCategory] || 0) + cause.count;
  });
  
  // Prepare data for category distribution
  const categoryChartSeries = [{
    name: 'Incident Count',
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
    colors: [chartColorPalettes.restaurant[3]],
    tooltip: chartOptions.getBaseTooltipOptions()
  });

  return (
    <Box className="space-y-6">
      {/* Summary Cards */}
      <Grid gap="4" columns={{ initial: '1', md: '3' }}>
        <Card size="2">
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Top Waste Cause</Text>
            <Heading size="6">{sortedCauses[0]?.cause}</Heading>
            <Text size="1" color="gray">{formatCurrency(sortedCauses[0]?.value)} in losses</Text>
          </Flex>
        </Card>
        
        <Card size="2">
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Preventable Waste</Text>
            <Heading size="6">{formatCurrency(preventableWaste)}</Heading>
            <Text size="1" color="gray">
              {((preventableWaste / totalWasteValue) * 100).toFixed(1)}% of total waste
            </Text>
          </Flex>
        </Card>
        
        <Card size="2">
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Most Affected Category</Text>
            <Heading size="6">
              {Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'}
            </Heading>
            <Text size="1" color="gray">
              {Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[1] || 0} incidents
            </Text>
          </Flex>
        </Card>
      </Grid>

      {/* Charts */}
      <Grid gap="4" columns={{ initial: '1', md: '2' }}>
        <Card size="3">
          <CardHeading title="Waste Value by Cause" />
          <Box height="350px">
            {isClient ? (
              <Chart
                options={causeValueOptions}
                series={causeValueSeries}
                type="bar"
                height={350}
              />
            ) : (
              <ChartLoadingPlaceholder height={350} message="Loading causes data..." />
            )}
          </Box>
        </Card>
        
        <Card size="3">
          <CardHeading title="Preventable vs. Non-Preventable Waste" />
          <Box height="350px">
            {isClient ? (
              <Chart
                options={preventabilityOptions}
                series={preventabilityData}
                type="pie"
                height={350}
              />
            ) : (
              <ChartLoadingPlaceholder height={350} message="Loading preventability data..." />
            )}
          </Box>
        </Card>
      </Grid>

      <Card size="3">
        <CardHeading title="Category Distribution of Wastage Causes" />
        <Box height="300px">
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
        </Box>
      </Card>

      {/* Detailed Table */}
      <Card size="2">
        <CardHeading title="Waste Causes Analysis" />
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Cause</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Incidents</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Value</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Primary Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Preventable</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Impact Level</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Trend</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Recommended Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((cause) => (
              <Table.Row key={cause.id}>
                <Table.Cell>
                  <Text weight="medium">{cause.cause}</Text>
                </Table.Cell>
                <Table.Cell>{cause.count} incidents</Table.Cell>
                <Table.Cell>{formatCurrency(cause.value)}</Table.Cell>
                <Table.Cell>{cause.primaryCategory}</Table.Cell>
                <Table.Cell>
                  <Badge color={cause.preventable ? 'red' : 'gray'}>
                    {cause.preventable ? 'Yes' : 'No'}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={
                    cause.impact >= 8 ? 'red' : 
                    cause.impact >= 5 ? 'orange' : 
                    'green'
                  }>
                    {cause.impact >= 8 ? 'High' : cause.impact >= 5 ? 'Medium' : 'Low'}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="1">
                    {cause.trend > 0 ? (
                      <TrendingUp size={16} className="text-red-600" />
                    ) : cause.trend < 0 ? (
                      <TrendingDown size={16} className="text-green-600" />
                    ) : (
                      <Minus size={16} className="text-gray-500" />
                    )}
                    <Text color={cause.trend > 0 ? 'red' : cause.trend < 0 ? 'green' : 'gray'}>
                      {cause.trend > 0 ? '+' : ''}{cause.trend}%
                    </Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <ul className="list-disc pl-4 text-sm">
                    {cause.actions.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>
    </Box>
  );
};

export default WastageCausesReport; 