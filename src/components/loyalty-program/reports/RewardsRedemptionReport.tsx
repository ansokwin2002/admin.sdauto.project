import React, { useState, useEffect } from 'react';
import { Card, Heading, Flex, Text, Grid, Table } from '@radix-ui/themes';
import dynamic from 'next/dynamic';
import { useChartOptions, chartColorPalettes } from '@/utilities/chartOptions';
import ChartLoadingPlaceholder from '@/components/common/ChartLoadingPlaceholder';
import CardHeading from '@/components/common/CardHeading';

// Dynamically import ApexCharts with SSR disabled
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface RewardRedemptionItem {
  id: string;
  rewardName: string;
  rewardType: string;
  pointsRequired: number;
  redemptionCount: number;
  totalPointsSpent: number;
  popularityScore: number;
  memberSatisfaction: number;
}

interface RewardsRedemptionReportProps {
  data: RewardRedemptionItem[];
  isClient: boolean;
}

const RewardsRedemptionReport: React.FC<RewardsRedemptionReportProps> = ({ data, isClient }) => {
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
  const rewardNames = data.map(item => item.rewardName);
  const redemptionCounts = data.map(item => item.redemptionCount);
  const satisfaction = data.map(item => item.memberSatisfaction);
  
  return (
    <>
      {isClient && (
        <Grid columns={{ initial: "1", md: "2" }} gap="4" mt="4">
          <Card size="3">
            <CardHeading title="Reward Redemption Distribution" />
            <div className="h-[350px]">
              {chartsLoading ? (
                <ChartLoadingPlaceholder height={350} />
              ) : (
                <ReactApexChart
                  type="pie"
                  height={350}
                  options={chartOptions.getPieOptions({
                    labels: rewardNames,
                    colors: chartColorPalettes.warm,
                    tooltip: {
                      ...chartOptions.getBaseTooltipOptions(),
                      y: {
                        formatter: function(val) {
                          return val + " redemptions";
                        }
                      }
                    },
                  })}
                  series={redemptionCounts}
                />
              )}
            </div>
          </Card>
          
          <Card size="3">
            <CardHeading title="Member Satisfaction by Reward" />
            <div className="h-[350px]">
              {chartsLoading ? (
                <ChartLoadingPlaceholder height={350} />
              ) : (
                <ReactApexChart
                  type="bar"
                  height={350}
                  options={chartOptions.getHorizontalBarOptions({
                    xaxis: {
                      ...chartOptions.getBaseXAxisOptions(),
                      categories: rewardNames,
                    },
                    yaxis: {
                      labels: {
                        ...chartOptions.getBaseYAxisLabels(),
                      },
                      min: 0,
                      max: 5,
                    },
                    colors: [chartColorPalettes.info[0]],
                    plotOptions: {
                      bar: {
                        horizontal: true,
                        dataLabels: {
                          position: 'top',
                        }
                      }
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: function(val) {
                        return Number(val).toFixed(1);
                      },
                      offsetX: 20,
                      style: {
                        fontSize: '12px',
                        colors: chartOptions.isDarkMode ? ['#e2e8f0'] : ['#334155']
                      }
                    },
                    tooltip: {
                      ...chartOptions.getBaseTooltipOptions()
                    }
                  })}
                  series={[{ name: 'Satisfaction', data: satisfaction }]}
                />
              )}
            </div>
          </Card>
        </Grid>
      )}

      <Card size="3" mt="4">
        <CardHeading title="Rewards Redemption Details" />
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Reward Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Points Required</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Redemptions</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Total Points Spent</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Popularity Score</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Member Satisfaction</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.rewardName}</Table.Cell>
                <Table.Cell>{item.rewardType}</Table.Cell>
                <Table.Cell align="right">{item.pointsRequired.toLocaleString()}</Table.Cell>
                <Table.Cell align="right">{item.redemptionCount}</Table.Cell>
                <Table.Cell align="right">{item.totalPointsSpent.toLocaleString()}</Table.Cell>
                <Table.Cell align="right">{item.popularityScore}/100</Table.Cell>
                <Table.Cell align="right">{item.memberSatisfaction.toFixed(1)}/5</Table.Cell>
              </Table.Row>
            ))}
            <Table.Row className="bg-gray-100 dark:bg-neutral-800 font-semibold">
              <Table.Cell colSpan={3} className="p-2 text-right">Total:</Table.Cell>
              <Table.Cell align="right">{data.reduce((sum, item) => sum + item.redemptionCount, 0)}</Table.Cell>
              <Table.Cell align="right">{data.reduce((sum, item) => sum + item.totalPointsSpent, 0).toLocaleString()}</Table.Cell>
              <Table.Cell colSpan={2}></Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Card>
    </>
  );
};

export default RewardsRedemptionReport; 