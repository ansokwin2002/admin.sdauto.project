import React, { useState, useEffect } from 'react';
import { Card, Heading, Flex, Text, Grid, Table } from '@radix-ui/themes';
import dynamic from 'next/dynamic';
import { useChartOptions, chartColorPalettes } from '@/utilities/chartOptions';
import { formatCurrency } from '@/utilities';
import ChartLoadingPlaceholder from '@/components/common/ChartLoadingPlaceholder';
import CardHeading from '@/components/common/CardHeading';

// Dynamically import ApexCharts with SSR disabled
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface TierAnalysisItem {
  id: string;
  tierName: string;
  memberCount: number;
  percentOfTotal: number;
  averageSpend: number;
  averageVisits: number;
  retentionRate: number;
  upgradePotential: number;
}

interface TierAnalysisReportProps {
  data: TierAnalysisItem[];
  isClient: boolean;
}

const TierAnalysisReport: React.FC<TierAnalysisReportProps> = ({ data, isClient }) => {
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
  
  // Prepare data for charts
  const tierNames = data.map(item => item.tierName);
  const memberCounts = data.map(item => item.memberCount);
  const avgSpend = data.map(item => item.averageSpend);
  const avgVisits = data.map(item => item.averageVisits);
  
  return (
    <>
      {isClient && (
        <Grid columns={{ initial: "1", md: "2" }} gap="4" mt="4">
          <Card size="3">
            <CardHeading title="Member Distribution by Tier" />
            <div className="h-[350px]">
              {chartsLoading ? (
                <ChartLoadingPlaceholder height={350} />
              ) : (
                <ReactApexChart
                  type="donut"
                  height={350}
                  options={chartOptions.getPieOptions({
                    labels: tierNames,
                    colors: chartColorPalettes.default,
                    tooltip: {
                      ...chartOptions.getBaseTooltipOptions(),
                    },
                    plotOptions: {
                      pie: {
                        donut: {
                          size: '55%',
                          labels: {
                            show: true,
                            name: {
                              show: true,
                              color: chartOptions.isDarkMode ? 'var(--slate-12)' : 'var(--slate-12)',
                            },
                            value: {
                              show: true,
                              color: chartOptions.isDarkMode ? 'var(--slate-12)' : 'var(--slate-12)',
                              formatter: function(val) {
                                return val + ' members';
                              }
                            },
                            total: {
                              show: true,
                              color: chartOptions.isDarkMode ? 'var(--slate-12)' : 'var(--slate-12)',
                              label: 'Total Members',
                              formatter: function(w) {
                                return w.globals.seriesTotals.reduce((a, b) => a + b, 0) + ' members';
                              }
                            }
                          }
                        }
                      }
                    },
                  })}
                  series={memberCounts}
                />
              )}
            </div>
          </Card>
          
          <Card size="3">
            <CardHeading title="Key Metrics by Tier" />
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
                      categories: tierNames,
                    },
                    colors: [chartColorPalettes.restaurant[1], chartColorPalettes.info[0]],
                    dataLabels: {
                      enabled: false,
                    },
                    yaxis: [
                      {
                        title: {
                          text: 'Avg. Spend',
                        },
                        labels: {
                          ...chartOptions.getBaseYAxisLabels(),
                          formatter: function(val) {
                            return formatCurrency(val);
                          }
                        }
                      },
                      {
                        opposite: true,
                        title: {
                          text: 'Avg. Visits (per month)',
                        },
                        labels: {
                          style: chartOptions.getBaseYAxisLabels().style,
                          formatter: function(val) {
                            return val.toFixed(1);
                          }
                        }
                      },
                    ],
                    tooltip: {
                      ...chartOptions.getBaseTooltipOptions(),
                      y: {
                        formatter: function(val, { seriesIndex }) {
                          return seriesIndex === 0 
                            ? formatCurrency(val)
                            : val + " visits/month";
                        }
                      }
                    },
                  })}
                  series={[
                    { name: 'Avg. Spend', data: avgSpend, type: 'column' },
                    { name: 'Avg. Visits', data: avgVisits, type: 'column' },
                  ]}
                />
              )}
            </div>
          </Card>
        </Grid>
      )}

      <Card size="3" mt="4">
        <CardHeading title="Tier Analysis Details" />
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Tier</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Member Count</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">% of Total</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Avg. Spend</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Avg. Visits</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Retention Rate</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Upgrade Potential</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.tierName}</Table.Cell>
                <Table.Cell align="right">{item.memberCount}</Table.Cell>
                <Table.Cell align="right">{item.percentOfTotal}%</Table.Cell>
                <Table.Cell align="right">${item.averageSpend.toFixed(2)}</Table.Cell>
                <Table.Cell align="right">{item.averageVisits}/month</Table.Cell>
                <Table.Cell align="right">{item.retentionRate}%</Table.Cell>
                <Table.Cell align="right">
                  {item.upgradePotential > 0 ? `${item.upgradePotential}%` : 'N/A'}
                </Table.Cell>
              </Table.Row>
            ))}
            <Table.Row className="bg-gray-100 dark:bg-neutral-800 font-semibold">
              <Table.Cell>
                <Text weight="bold">Total:</Text>
              </Table.Cell>
              <Table.Cell align="right">
                <Text weight="bold">{data.reduce((sum, item) => sum + item.memberCount, 0)}</Text>
              </Table.Cell>
              <Table.Cell align="right">
                <Text weight="bold">100%</Text>
              </Table.Cell>
              <Table.Cell colSpan={4}></Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Card>
    </>
  );
};

export default TierAnalysisReport; 