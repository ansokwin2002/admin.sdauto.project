import React, { useState, useEffect } from 'react';
import { Box, Card, Heading, Text, Table, Flex, Badge } from '@radix-ui/themes';
import { CheckCircle, AlertCircle, Clock, Award, ShieldCheck } from 'lucide-react';
import dynamic from 'next/dynamic';
import { chartColorPalettes, useChartOptions } from '@/utilities/chartOptions';
import ChartLoadingPlaceholder from '@/components/common/ChartLoadingPlaceholder';
import { formatCurrency, formatNumberThousand } from '@/utilities';
import CardHeading from '@/components/common/CardHeading';

// Dynamically import chart component to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface SupplierPerformanceReportProps {
  data: {
    id: string;
    name: string;
    category: string;
    reliability: number;
    deliverySpeed: number;
    qualityRating: number;
    priceCompetitiveness: number;
    overallScore: number;
    totalOrders: number;
    fulfillmentRate: number;
    onTimeDelivery: number;
    totalSpend: number;
  }[];
  isClient: boolean;
}

const SupplierPerformanceReport: React.FC<SupplierPerformanceReportProps> = ({ data, isClient }) => {
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
  
  // Calculate averages
  const avgReliability = data.reduce((sum, supplier) => sum + supplier.reliability, 0) / data.length;
  const avgDeliverySpeed = data.reduce((sum, supplier) => sum + supplier.deliverySpeed, 0) / data.length;
  const avgQualityRating = data.reduce((sum, supplier) => sum + supplier.qualityRating, 0) / data.length;
  const avgPriceCompetitiveness = data.reduce((sum, supplier) => sum + supplier.priceCompetitiveness, 0) / data.length;
  const totalSpend = data.reduce((sum, supplier) => sum + supplier.totalSpend, 0);
  
  // Get top performers
  const topPerformer = [...data].sort((a, b) => b.overallScore - a.overallScore)[0];
  const mostReliable = [...data].sort((a, b) => b.reliability - a.reliability)[0];
  const bestValue = [...data].sort((a, b) => b.priceCompetitiveness - a.priceCompetitiveness)[0];
  
  // Prepare data for radar chart (top 5 suppliers)
  const top5Suppliers = [...data].sort((a, b) => b.overallScore - a.overallScore).slice(0, 5);
  
  const radarChartSeries = top5Suppliers.map(supplier => ({
    name: supplier.name,
    data: [
      supplier.reliability,
      supplier.deliverySpeed,
      supplier.qualityRating,
      supplier.priceCompetitiveness,
      supplier.fulfillmentRate
    ]
  }));
  
  const radarChartOptions = chartOptions.getBaseOptions({
    chart: {
      type: 'radar',
      toolbar: {
        show: false
      }
    },
    xaxis: {
      categories: ['Reliability', 'Delivery Speed', 'Quality', 'Price Competitiveness', 'Fulfillment Rate']
    },
    yaxis: {
      show: false,
      min: 0,
      max: 100
    },
    colors: chartColorPalettes.default,
    tooltip: {
      ...chartOptions.getBaseTooltipOptions(),
    }
  });
  
  // Prepare data for horizontal bar chart (performance by category)
  const categoryData = [...new Set(data.map(supplier => supplier.category))].map(category => {
    const suppliersInCategory = data.filter(supplier => supplier.category === category);
    const avgScore = suppliersInCategory.reduce((sum, supplier) => sum + supplier.overallScore, 0) / suppliersInCategory.length;
    return {
      category,
      avgScore
    };
  }).sort((a, b) => b.avgScore - a.avgScore);
  
  const barChartSeries = [{
    name: 'Average Performance Score',
    data: categoryData.map(item => item.avgScore)
  }];
  
  const barChartOptions = chartOptions.getHorizontalBarOptions({
    xaxis: {
      ...chartOptions.getBaseXAxisOptions(),
      categories: categoryData.map(item => item.category),
    },
    yaxis: {
      min: 0,
      max: 100,
      title: {
        text: 'Performance Score'
      },
      labels: {
        ...chartOptions.getBaseYAxisLabels(),
      }
    },
    colors: [chartColorPalettes.info[2]],
    dataLabels: {
      enabled: true,
      formatter: (value: number) => value.toFixed(1)
    },
    tooltip: {
      ...chartOptions.getBaseTooltipOptions(),
    }
  });

  return (
    <Box className="space-y-6">
      {/* Summary Cards */}
      <Flex gap="4" wrap="wrap">
        <Card size="2" style={{ flex: '1 0 200px' }}>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Top Performer</Text>
            <Heading size="6">{topPerformer?.name || 'N/A'}</Heading>
            <Flex align="center" gap="1">
              <Award size={14} className="text-amber-500" />
              <Text size="1" color="orange">Score: {topPerformer?.overallScore || 0}/100</Text>
            </Flex>
          </Flex>
        </Card>
        
        <Card size="2" style={{ flex: '1 0 200px' }}>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Most Reliable</Text>
            <Heading size="6">{mostReliable?.name || 'N/A'}</Heading>
            <Flex align="center" gap="1">
              <ShieldCheck size={14} className="text-green-600" />
              <Text size="1" color="green">Reliability: {mostReliable?.reliability || 0}%</Text>
            </Flex>
          </Flex>
        </Card>
        
        <Card size="2" style={{ flex: '1 0 200px' }}>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Best Value</Text>
            <Heading size="6">{bestValue?.name || 'N/A'}</Heading>
            <Flex align="center" gap="1">
              <CheckCircle size={14} className="text-blue-600" />
              <Text size="1" color="blue">Price: {bestValue?.priceCompetitiveness || 0}/100</Text>
            </Flex>
          </Flex>
        </Card>
        
        <Card size="2" style={{ flex: '1 0 200px' }}>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Total Spend</Text>
            <Heading size="6">{formatCurrency(totalSpend)}</Heading>
            <Text size="1" color="gray">Across all suppliers</Text>
          </Flex>
        </Card>
      </Flex>

      {/* Charts */}
      <Flex gap="4" direction={{ initial: 'column', md: 'row' }}>
        <Card size="3" style={{ flex: 1 }}>
          <CardHeading title="Top 5 Supplier Performance" />
          <div className="h-[450px]">
            {chartsLoading ? (
              <ChartLoadingPlaceholder height={350} message="Loading supplier data..." />
            ) : (
              <Chart
                  options={radarChartOptions}
                  series={radarChartSeries}
                  type="radar"
                  height="100%"
                />
            )}
          </div>
        </Card>
        
        <Card size="3" style={{ flex: 1 }}>
          <CardHeading title="Performance by Supplier Category" />
          <div className="h-[450px]">
            {chartsLoading ? (
              <ChartLoadingPlaceholder height={400} message="Loading category data..." />
            ) : (
              <Chart
                options={barChartOptions}
                series={barChartSeries}
                type="bar"
                height="100%"
                />
            )}
          </div>
        </Card>
      </Flex>

      {/* Detailed Table */}
      <Card size="3">
        <CardHeading title="Supplier Performance Details" />
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Supplier</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Orders</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Fulfillment</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>On-Time Delivery</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Overall Score</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Total Spend</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((supplier) => (
              <Table.Row key={supplier.id}>
                <Table.Cell>
                  <Text weight="medium">{supplier.name}</Text>
                </Table.Cell>
                <Table.Cell>{supplier.category}</Table.Cell>
                <Table.Cell>{supplier.totalOrders}</Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="1">
                    {supplier.fulfillmentRate >= 90 ? (
                      <CheckCircle size={16} className="text-green-600" />
                    ) : supplier.fulfillmentRate >= 75 ? (
                      <Clock size={16} className="text-amber-500" />
                    ) : (
                      <AlertCircle size={16} className="text-red-600" />
                    )}
                    <Text>{supplier.fulfillmentRate}%</Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="1">
                    {supplier.onTimeDelivery >= 90 ? (
                      <CheckCircle size={16} className="text-green-600" />
                    ) : supplier.onTimeDelivery >= 75 ? (
                      <Clock size={16} className="text-amber-500" />
                    ) : (
                      <AlertCircle size={16} className="text-red-600" />
                    )}
                    <Text>{supplier.onTimeDelivery}%</Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={supplier.overallScore >= 90 ? 'green' : supplier.overallScore >= 75 ? 'orange' : 'red'}>
                    {supplier.overallScore}/100
                  </Badge>
                </Table.Cell>
                <Table.Cell>{formatCurrency(supplier.totalSpend)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>
    </Box>
  );
};

export default SupplierPerformanceReport; 