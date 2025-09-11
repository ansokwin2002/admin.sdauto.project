import React, { useState, useEffect } from 'react';
import { Card, Heading, Flex, Text, Grid, Table } from '@radix-ui/themes';
import dynamic from 'next/dynamic';
import { useChartOptions, chartColorPalettes } from '@/utilities/chartOptions';
import { formatCurrency } from '@/utilities/';
import ChartLoadingPlaceholder from '@/components/common/ChartLoadingPlaceholder';
import CardHeading from '@/components/common/CardHeading';
// Dynamically import ApexCharts with SSR disabled
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface BranchSalesItem {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  avgTicket: number;
  customerCount: number;
  growth: number;
  popularCategories: string;
}

interface BranchSalesReportProps {
  data: BranchSalesItem[];
  isClient: boolean;
}

const BranchSalesReport: React.FC<BranchSalesReportProps> = ({ data, isClient }) => {
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
            <CardHeading title="Revenue by Branch" />
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
                      categories: data.map(branch => branch.name),
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
                    colors: chartColorPalettes.cool,
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
                      data: data.map(branch => branch.revenue)
                    }
                  ]}
                />
              )}
            </div>
          </Card>
          
          <Card size="3">
            <CardHeading title="Average Ticket Size by Branch" />
            <div className="h-[350px]">
              {chartsLoading ? (
                <ChartLoadingPlaceholder height={350} />
              ) : (
                <ReactApexChart
                  type="line"
                  height={350}
                  options={chartOptions.getLineOptions({
                    xaxis: {
                      ...chartOptions.getBaseXAxisOptions(),
                      categories: data.map(branch => branch.name),
                    },
                    yaxis: {
                      title: {
                        text: 'Avg. Ticket ($)'
                      },
                      labels: {
                        ...chartOptions.getBaseYAxisLabels(),
                      },
                    },
                    colors: ['#60a5fa'],
                    markers: {
                      size: 6,
                    },
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
                      name: 'Avg. Ticket',
                      data: data.map(branch => branch.avgTicket)
                    }
                  ]}
                />
              )}
            </div>
          </Card>
        </Grid>
      )}

      <Card size="3" mt="4">
        <CardHeading title="Branch Performance Details" />
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Branch</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Customers</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Avg. Ticket</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Sales (Units)</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Revenue</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Growth</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Popular Categories</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((branch) => (
              <Table.Row key={branch.id}>
                <Table.Cell>{branch.name}</Table.Cell>
                <Table.Cell align="right">{branch.customerCount.toLocaleString()}</Table.Cell>
                <Table.Cell align="right">${branch.avgTicket.toFixed(2)}</Table.Cell>
                <Table.Cell align="right">{branch.sales.toLocaleString()}</Table.Cell>
                <Table.Cell align="right">${branch.revenue.toLocaleString()}</Table.Cell>
                <Table.Cell align="right">
                  <Text color={branch.growth >= 0 ? "green" : "red"}>
                    {branch.growth >= 0 ? "+" : ""}{branch.growth}%
                  </Text>
                </Table.Cell>
                <Table.Cell>{branch.popularCategories}</Table.Cell>
              </Table.Row>
            ))}
            <Table.Row className="bg-slate-50 dark:bg-neutral-800 font-semibold">
              <Table.Cell colSpan={3} className="p-2 text-right">Total:</Table.Cell>
              <Table.Cell align="right">{data.reduce((sum, branch) => sum + branch.sales, 0).toLocaleString()}</Table.Cell>
              <Table.Cell align="right">${data.reduce((sum, branch) => sum + branch.revenue, 0).toLocaleString()}</Table.Cell>
              <Table.Cell colSpan={2}></Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Card>
    </>
  );
};

export default BranchSalesReport; 