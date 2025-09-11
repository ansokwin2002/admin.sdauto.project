import React, { useState, useEffect } from 'react';
import { Card, Heading, Flex, Text, Grid, Table } from '@radix-ui/themes';
import dynamic from 'next/dynamic';
import { useChartOptions, chartColorPalettes } from '@/utilities/chartOptions';
import { formatCurrency } from '@/utilities';
import ChartLoadingPlaceholder from '@/components/common/ChartLoadingPlaceholder';
import CardHeading from '@/components/common/CardHeading';

// Dynamically import ApexCharts with SSR disabled
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface StaffSalesItem {
  id: string;
  name: string;
  position: string;
  branch: string;
  branchId: string;
  sales: number;
  revenue: number;
  avgTicket: number;
  customerCount: number;
  topSellingCategory: string;
  performanceScore: number;
}

interface StaffSalesReportProps {
  data: StaffSalesItem[];
  isClient: boolean;
}

const StaffSalesReport: React.FC<StaffSalesReportProps> = ({ data, isClient }) => {
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
            <CardHeading title="Top Staff by Revenue"/>
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
                      categories: data.map(staff => staff.name),
                      labels: {
                        ...chartOptions.getBaseXAxisLabels(),
                        rotate: -45,
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
                      data: data.map(staff => staff.revenue)
                    }
                  ]}
                />
              )}
            </div>
          </Card>
          
          <Card size="3">
            <CardHeading title="Staff Performance Score"/>
            <div className="h-[350px]">
              {chartsLoading ? (
                <ChartLoadingPlaceholder height={350} />
              ) : (
                <ReactApexChart
                  type="radar"
                  height={350}
                  options={chartOptions.getBaseOptions({
                    xaxis: {
                      categories: data.slice(0, 6).map(staff => staff.name),
                    },
                    yaxis: {
                      min: 0,
                      max: 100,
                    },
                    plotOptions: {
                      radar: {
                        size: 140,
                        polygons: {
                          strokeColors: 'var(--slate-a6)',
                          fill: {
                            colors: ['var(--slate-a2)', 'var(--slate-a1)']
                          }
                        }
                      }
                    },
                    colors: ['#60a5fa'],
                    markers: {
                      size: 5,
                      hover: {
                        size: 8
                      }
                    },
                    tooltip: {
                      ...chartOptions.getBaseTooltipOptions(),
                      y: {
                        formatter: function (val) {
                          return val.toFixed(0) + " / 100"
                        }
                      }
                    },
                  })}
                  series={[
                    {
                      name: 'Performance Score',
                      data: data.slice(0, 6).map(staff => staff.performanceScore)
                    }
                  ]}
                />
              )}
            </div>
          </Card>
        </Grid>
      )}

      <Card size="3" mt="4">
        <CardHeading title="Staff Sales Details"/>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Staff Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Position</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Branch</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Customers</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Avg. Ticket</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Sales (Units)</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Revenue</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Top Selling</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((staff) => (
              <Table.Row key={staff.id}>
                <Table.Cell>{staff.name}</Table.Cell>
                <Table.Cell>{staff.position}</Table.Cell>
                <Table.Cell>{staff.branch}</Table.Cell>
                <Table.Cell align="right">{staff.customerCount}</Table.Cell>
                <Table.Cell align="right">${staff.avgTicket.toFixed(2)}</Table.Cell>
                <Table.Cell align="right">{staff.sales}</Table.Cell>
                <Table.Cell align="right">${staff.revenue.toLocaleString()}</Table.Cell>
                <Table.Cell>{staff.topSellingCategory}</Table.Cell>
              </Table.Row>
            ))}
            <Table.Row className="bg-slate-50 dark:bg-neutral-800 font-semibold">
              <Table.Cell colSpan={5} className="p-2 text-right">Total:</Table.Cell>
              <Table.Cell align="right">{data.reduce((sum, staff) => sum + staff.sales, 0).toLocaleString()}</Table.Cell>
              <Table.Cell align="right">${data.reduce((sum, staff) => sum + staff.revenue, 0).toLocaleString()}</Table.Cell>
              <Table.Cell></Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Card>
    </>
  );
};

export default StaffSalesReport;