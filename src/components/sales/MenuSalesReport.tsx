import React, { useState, useEffect } from 'react';
import { Card, Heading, Flex, Text, Grid, Table } from '@radix-ui/themes';
import dynamic from 'next/dynamic';
import { useChartOptions, chartColorPalettes } from '@/utilities/chartOptions';
import { formatCurrency } from '@/utilities/';
import ChartLoadingPlaceholder from '@/components/common/ChartLoadingPlaceholder';
import CardHeading from '@/components/common/CardHeading';
// Dynamically import ApexCharts with SSR disabled
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface MenuSalesItem {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  sales: number;
  revenue: number;
  price: number;
  imageUrl: string | null;
}

interface MenuSalesReportProps {
  data: MenuSalesItem[];
  isClient: boolean;
}

const MenuSalesReport: React.FC<MenuSalesReportProps> = ({ data, isClient }) => {
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

  // Top 10 menu items for chart
  const top10Items = data.slice(0, 10);
  
  return (
    <>
      {isClient && (
        <Grid columns={{ initial: "1", md: "2" }} gap="4" mt="4">
          <Card size="3">
            <CardHeading title="Top 10 Menu Items by Revenue" />
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
                      categories: top10Items.map(item => item.name),
                      labels: {
                        rotate: -45,
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
                    colors: chartColorPalettes.restaurant,
                    tooltip: {
                      ...chartOptions.getBaseTooltipOptions(),
                      y: {
                        formatter: function (val) {
                          return "$" + val.toLocaleString()
                        }
                      }
                    },
                  })}
                  series={[
                    {
                      name: 'Revenue',
                      data: top10Items.map(item => item.revenue)
                    }
                  ]}
                />
              )}
            </div>
          </Card>
          
          <Card size="3">
            <CardHeading title="Sales Volume by Menu Item" />
            <div className="h-[350px]">
              {chartsLoading ? (
                <ChartLoadingPlaceholder height={350} />
              ) : (
                <ReactApexChart
                  type="pie"
                  height={350}
                  options={chartOptions.getPieOptions({
                    labels: top10Items.map(item => item.name),
                    colors: chartColorPalettes.restaurant,
                    tooltip: {
                      y: {
                        formatter: function (val) {
                          return val.toLocaleString() + " units"
                        }
                      }
                    },
                  })}
                  series={top10Items.map(item => item.sales)}
                />
              )}
            </div>
          </Card>
        </Grid>
      )}

      <Card size="3" mt="4">
        <CardHeading title="Menu Sales Details" />
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Menu Item</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Unit Price</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Sales (Units)</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Revenue</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.category}</Table.Cell>
                <Table.Cell align="right">${item.price.toFixed(2)}</Table.Cell>
                <Table.Cell align="right">{item.sales}</Table.Cell>
                <Table.Cell align="right">${item.revenue.toLocaleString()}</Table.Cell>
              </Table.Row>
            ))}
            <Table.Row className="bg-slate-50 dark:bg-neutral-800 font-semibold">
              <Table.Cell colSpan={3} className="p-2 text-right">Total:</Table.Cell>
              <Table.Cell align="right">{data.reduce((sum, item) => sum + item.sales, 0).toLocaleString()}</Table.Cell>
              <Table.Cell align="right">${data.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Card>
    </>
  );
};

export default MenuSalesReport; 