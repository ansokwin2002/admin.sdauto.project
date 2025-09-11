import React, { useState, useEffect } from 'react';
import { Card, Heading, Flex, Text, Grid, Table } from '@radix-ui/themes';
import dynamic from 'next/dynamic';
import { useChartOptions, chartColorPalettes } from '@/utilities/chartOptions';
import { formatCurrency } from '@/utilities/';
import ChartLoadingPlaceholder from '@/components/common/ChartLoadingPlaceholder';
import CardHeading from '@/components/common/CardHeading';
// Dynamically import ApexCharts with SSR disabled
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface CategorySalesItem {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  avgPrice: number;
  itemCount: number;
  growth: number;
}

interface CategorySalesReportProps {
  data: CategorySalesItem[];
  isClient: boolean;
}

const CategorySalesReport: React.FC<CategorySalesReportProps> = ({ data, isClient }) => {
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

  if (data.length === 0) {
    return (
      <Card size="3" mt="4">
        <Flex direction="column" align="center" justify="center" gap="3" p="6">
          <Text size="5">No data available</Text>
          <Text size="2" color="gray">Try adjusting your filters or date range</Text>
        </Flex>
      </Card>
    );
  }
  
  return (
    <>
      {isClient && (
        <Grid columns={{ initial: "1", md: "2" }} gap="4" mt="4">
          <Card size="3">
            <CardHeading title="Revenue by Category" />
            <div className="h-[350px]">
              {chartsLoading ? (
                <ChartLoadingPlaceholder height={350} />
              ) : (
                <ReactApexChart
                  type="bar"
                  height={350}
                  options={chartOptions.getBarOptions({
                    xaxis: {
                      ...chartOptions.getBaseXAxisOptions(),
                      categories: data.map(cat => cat.name),
                      labels: {
                        ...chartOptions.getBaseXAxisLabels(),
                      }
                    },
                    yaxis: {
                      title: {
                        text: 'Revenue'
                      },
                      labels: {
                        ...chartOptions.getBaseYAxisLabels(),
                        formatter: function(val) {
                          return formatCurrency(val);
                        }
                      }
                    },
                    colors: chartColorPalettes.positive,
                    tooltip: {
                      ...chartOptions.getBaseTooltipOptions(),
                      y: {
                        formatter: function (val) {
                          return formatCurrency(val);
                        }
                      }
                    },
                  })}
                  series={[
                    {
                      name: 'Revenue',
                      data: data.map(cat => cat.revenue)
                    }
                  ]}
                />
              )}
            </div>
          </Card>
          
          <Card size="3">
            <CardHeading title="Sales Volume Distribution" />
            <div className="h-[350px]">
              {chartsLoading ? (
                <ChartLoadingPlaceholder height={350} />
              ) : (
                <ReactApexChart
                  type="pie"
                  height={350}
                  options={chartOptions.getPieOptions({
                    labels: data.map(cat => cat.name),
                    colors: chartColorPalettes.default,
                    tooltip: {
                      y: {
                        formatter: function (val) {
                          return val.toLocaleString() + " units"
                        }
                      }
                    },
                  })}
                  series={data.map(cat => cat.sales)}
                />
              )}
            </div>
          </Card>
        </Grid>
      )}

      <Card size="3" mt="4">
        <CardHeading title="Category Sales Details" />
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Items Count</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Avg. Price</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Sales (Units)</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Revenue</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Growth</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((category) => (
              <Table.Row key={category.id}>
                <Table.Cell>{category.name}</Table.Cell>
                <Table.Cell align="right">{category.itemCount}</Table.Cell>
                <Table.Cell align="right">${category.avgPrice.toFixed(2)}</Table.Cell>
                <Table.Cell align="right">{category.sales.toLocaleString()}</Table.Cell>
                <Table.Cell align="right">${category.revenue.toLocaleString()}</Table.Cell>
                <Table.Cell align="right">
                  <Text color={category.growth >= 0 ? "green" : "red"}>
                    {category.growth >= 0 ? "+" : ""}{category.growth}%
                  </Text>
                </Table.Cell>
              </Table.Row>
            ))}
            <Table.Row className="bg-slate-50 dark:bg-neutral-800 font-semibold">
              <Table.Cell colSpan={3} className="p-2 text-right">Total:</Table.Cell>
              <Table.Cell align="right">{data.reduce((sum, cat) => sum + cat.sales, 0).toLocaleString()}</Table.Cell>
              <Table.Cell align="right">${data.reduce((sum, cat) => sum + cat.revenue, 0).toLocaleString()}</Table.Cell>
              <Table.Cell></Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Card>
    </>
  );
};

export default CategorySalesReport; 