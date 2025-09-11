import React, { useState, useEffect } from 'react';
import { Box, Card, Heading, Text, Table, Flex, Badge } from '@radix-ui/themes';
import { TrendingDown, TrendingUp, Minus, DollarSign } from 'lucide-react';
import dynamic from 'next/dynamic';
import { chartColorPalettes, useChartOptions } from '@/utilities/chartOptions';
import ChartLoadingPlaceholder from '@/components/common/ChartLoadingPlaceholder';
import { formatCurrency, formatNumberThousand } from '@/utilities';
import CardHeading from '@/components/common/CardHeading';

// Dynamically import chart component to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface PriceVarianceReportProps {
  data: {
    id: string;
    name: string;
    category: string;
    baselinePrice: number;
    currentPrice: number;
    priceVariance: number;
    marketPrice: number;
    marketVariance: number;
    forecastPrice: number;
  }[];
  isClient: boolean;
}

const PriceVarianceReport: React.FC<PriceVarianceReportProps> = ({ data, isClient }) => {
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
  const avgPriceVariance = data.reduce((sum, item) => sum + item.priceVariance, 0) / data.length;
  const avgMarketVariance = data.reduce((sum, item) => sum + item.marketVariance, 0) / data.length;
  
  // Get items with highest price increases and decreases
  const highestIncrease = [...data].sort((a, b) => b.priceVariance - a.priceVariance)[0];
  const highestDecrease = [...data].sort((a, b) => a.priceVariance - b.priceVariance)[0];
  
  // Prepare category data for bar chart
  const categoryData = [...new Set(data.map(item => item.category))].map(category => {
    const categoryItems = data.filter(item => item.category === category);
    const avgCategoryVariance = categoryItems.reduce((sum, item) => sum + item.priceVariance, 0) / categoryItems.length;
    
    return {
      category,
      avgVariance: avgCategoryVariance,
      itemCount: categoryItems.length
    };
  }).sort((a, b) => b.avgVariance - a.avgVariance);
  
  const barChartSeries = [{
    name: 'Price Variance (%)',
    data: categoryData.map(item => parseFloat(item.avgVariance.toFixed(1)))
  }];
  
  const barChartOptions = chartOptions.getBarOptions({
    xaxis: {
      categories: categoryData.map(item => item.category),
      ...chartOptions.getBaseXAxisOptions(),
    },
    yaxis: {
      labels: {
        ...chartOptions.getBaseYAxisLabels(),
        formatter: (value: number) => `${value.toFixed(0)}%`
      }
    },
    colors: [(avgPriceVariance >= 0) ? chartColorPalettes.negative[2] : chartColorPalettes.positive[2]],
    tooltip: {
      ...chartOptions.getBaseTooltipOptions(),
      y: {
        formatter: (value: number) => `${value.toFixed(1)}%`
      }
    }
  });
  
  // Prepare data for scatter chart (market comparison)
  const scatterChartSeries = [
    {
      name: 'Price vs. Market',
      data: data.map(item => ({
        x: item.marketPrice,
        y: item.currentPrice,
        name: item.name
      }))
    }
  ];
  
  const scatterChartOptions = chartOptions.getBaseOptions({
    chart: {
      type: 'scatter',
      zoom: {
        enabled: false,
        type: 'xy'
      },
      toolbar: {
        show: false
      }
    },
    xaxis: {
      ...chartOptions.getBaseXAxisOptions(),
      title: {
        text: 'Market Price'
      },
      labels: {
        ...chartOptions.getBaseYAxisLabels(),
        formatter: function(value) {
          return formatCurrency(Number(value));
        }
      }
    },
    yaxis: {
      title: {
        text: 'Our Price'
      },
      labels: {
        ...chartOptions.getBaseYAxisLabels(),
        formatter: function(value) {
          return formatCurrency(Number(value));
        }
      }
    },
    colors: [chartColorPalettes.info[2]],
    tooltip: {
      ...chartOptions.getBaseTooltipOptions(),
      custom: ({ series, seriesIndex, dataPointIndex, w }: any) => {
        const point = w.config.series[seriesIndex].data[dataPointIndex];
        return `<div class="p-2">
          <div class="text-xs font-bold">${point.name}</div>
          <div class="text-xs">Market: ${formatCurrency(point.x)}</div>
          <div class="text-xs">Our Price: ${formatCurrency(point.y)}</div>
          <div class="text-xs">Variance: ${((point.y - point.x) / point.x * 100).toFixed(1)}%</div>
        </div>`;
      }
    },
    markers: {
      size: 6,
    }
  });

  return (
    <Box className="space-y-6">
      {/* Summary Cards */}
      <Flex gap="4" wrap="wrap">
        <Card size="2" style={{ flex: '1 0 200px' }}>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Average Price Variance</Text>
            <Heading size="6" color={avgPriceVariance > 0 ? 'red' : avgPriceVariance < 0 ? 'green' : 'gray'}>
              {avgPriceVariance > 0 ? '+' : ''}{avgPriceVariance.toFixed(1)}%
            </Heading>
            <Flex align="center" gap="1">
              {avgPriceVariance > 0 ? (
                <TrendingUp size={14} className="text-red-600" />
              ) : avgPriceVariance < 0 ? (
                <TrendingDown size={14} className="text-green-600" />
              ) : (
                <Minus size={14} className="text-gray-500" />
              )}
              <Text size="1" color={avgPriceVariance > 0 ? 'red' : avgPriceVariance < 0 ? 'green' : 'gray'}>
                From baseline
              </Text>
            </Flex>
          </Flex>
        </Card>
        
        <Card size="2" style={{ flex: '1 0 200px' }}>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Market Comparison</Text>
            <Heading size="6" color={avgMarketVariance > 0 ? 'red' : avgMarketVariance < 0 ? 'green' : 'gray'}>
              {avgMarketVariance > 0 ? '+' : ''}{avgMarketVariance.toFixed(1)}%
            </Heading>
            <Flex align="center" gap="1">
              {avgMarketVariance > 0 ? (
                <TrendingUp size={14} className="text-red-600" />
              ) : avgMarketVariance < 0 ? (
                <TrendingDown size={14} className="text-green-600" />
              ) : (
                <Minus size={14} className="text-gray-500" />
              )}
              <Text size="1" color={avgMarketVariance > 0 ? 'red' : avgMarketVariance < 0 ? 'green' : 'gray'}>
                Vs. market average
              </Text>
            </Flex>
          </Flex>
        </Card>
        
        <Card size="2" style={{ flex: '1 0 200px' }}>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Highest Price Increase</Text>
            <Heading size="6">{highestIncrease?.name || 'N/A'}</Heading>
            <Flex align="center" gap="1">
              <TrendingUp size={14} className="text-red-600" />
              <Text size="1" color="red">+{highestIncrease?.priceVariance.toFixed(1) || 0}%</Text>
            </Flex>
          </Flex>
        </Card>
        
        <Card size="2" style={{ flex: '1 0 200px' }}>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">Highest Price Decrease</Text>
            <Heading size="6">{highestDecrease?.name || 'N/A'}</Heading>
            <Flex align="center" gap="1">
              <TrendingDown size={14} className="text-green-600" />
              <Text size="1" color="green">{highestDecrease?.priceVariance.toFixed(1) || 0}%</Text>
            </Flex>
          </Flex>
        </Card>
      </Flex>

      {/* Charts */}
      <Flex gap="4" direction={{ initial: 'column', md: 'row' }}>
        <Card size="3" style={{ flex: 1 }}>
          <CardHeading title="Price Variance by Category" />
          <div className="h-[350px]">
            {isClient ? (
              chartsLoading ? (
                <ChartLoadingPlaceholder height={350} message="Loading category data..." />
              ) : (
                <Chart
                  options={barChartOptions}
                  series={barChartSeries}
                  type="bar"
                  height={350}
                />
              )
            ) : (
              <ChartLoadingPlaceholder height={350} message="Loading category data..." />
            )}
          </div>
        </Card>
        
        <Card size="3" style={{ flex: 1 }}>
          <CardHeading title="Price vs. Market Comparison" />
          <div className="h-[350px]">
            {isClient ? (
              chartsLoading ? (
                <ChartLoadingPlaceholder height={350} message="Loading comparison data..." />
              ) : (
                <Chart
                  options={scatterChartOptions}
                  series={scatterChartSeries}
                  type="scatter"
                  height={350}
                />
              )
            ) : (
              <ChartLoadingPlaceholder height={350} message="Loading comparison data..." />
            )}
          </div>
        </Card>
      </Flex>

      {/* Detailed Table */}
      <Card size="3">
        <CardHeading title="Price Variance Details" />
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Supplier/Item</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Baseline Price</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Current Price</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Price Variance</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Market Price</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Market Variance</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Forecast Price</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>
                  <Text weight="medium">{item.name}</Text>
                </Table.Cell>
                <Table.Cell>{item.category}</Table.Cell>
                <Table.Cell>{formatCurrency(item.baselinePrice)}</Table.Cell>
                <Table.Cell>{formatCurrency(item.currentPrice)}</Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="1">
                    {item.priceVariance > 0 ? (
                      <TrendingUp size={16} className="text-red-600" />
                    ) : item.priceVariance < 0 ? (
                      <TrendingDown size={16} className="text-green-600" />
                    ) : (
                      <Minus size={16} className="text-gray-500" />
                    )}
                    <Text color={item.priceVariance > 0 ? 'red' : item.priceVariance < 0 ? 'green' : 'gray'}>
                      {item.priceVariance > 0 ? '+' : ''}{item.priceVariance}%
                    </Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell>{formatCurrency(item.marketPrice)}</Table.Cell>
                <Table.Cell>
                  <Badge color={item.marketVariance > 5 ? 'red' : item.marketVariance < -5 ? 'green' : 'gray'}>
                    {item.marketVariance > 0 ? '+' : ''}{item.marketVariance}%
                  </Badge>
                </Table.Cell>
                <Table.Cell>{formatCurrency(item.forecastPrice)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>
    </Box>
  );
};

export default PriceVarianceReport; 