import React, { useState, useEffect } from 'react';
import { Card, Heading, Flex, Text, Grid, Table } from '@radix-ui/themes';
import dynamic from 'next/dynamic';
import { useChartOptions, chartColorPalettes } from '@/utilities/chartOptions';
import ChartLoadingPlaceholder from '@/components/common/ChartLoadingPlaceholder';
import CardHeading from '@/components/common/CardHeading';
// Dynamically import ApexCharts with SSR disabled
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface PointTransactionItem {
  id: string;
  period: string;
  pointsEarned: number;
  pointsRedeemed: number;
  netPoints: number;
  transactionCount: number;
  averagePointsPerTransaction: number;
  branchId: string;
  branchName: string;
}

interface PointTransactionsReportProps {
  data: PointTransactionItem[];
  isClient: boolean;
}

const PointTransactionsReport: React.FC<PointTransactionsReportProps> = ({ data, isClient }) => {
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
  
  // Define month order for proper sorting
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Get unique branches
  const branches = [...new Set(data.map(item => item.branchName))];
  
  // Extract unique periods and sort them chronologically
  const periods = [...new Set(data.map(item => item.period))];
  periods.sort((a, b) => {
    const aMonth = a.split(' ')[0];
    const bMonth = b.split(' ')[0];
    const aYear = parseInt(a.split(' ')[1]);
    const bYear = parseInt(b.split(' ')[1]);
    
    if (aYear !== bYear) return aYear - bYear;
    return monthOrder.indexOf(aMonth) - monthOrder.indexOf(bMonth);
  });
  
  // Total points earned and redeemed by period (all branches combined)
  const totalPointsEarnedByPeriod = periods.map(period => {
    const periodData = data.filter(item => item.period === period);
    return periodData.reduce((sum, item) => sum + item.pointsEarned, 0);
  });
  
  const totalPointsRedeemedByPeriod = periods.map(period => {
    const periodData = data.filter(item => item.period === period);
    return periodData.reduce((sum, item) => sum + item.pointsRedeemed, 0);
  });
  
  // Calculate totals
  const totalPointsEarned = data.reduce((sum, item) => sum + item.pointsEarned, 0);
  const totalPointsRedeemed = data.reduce((sum, item) => sum + item.pointsRedeemed, 0);
  const totalNetPoints = totalPointsEarned - totalPointsRedeemed;
  
  // Chart series for earned vs redeemed points
  const chartSeries = [
    {
      name: 'Points Earned',
      type: 'line',
      data: totalPointsEarnedByPeriod
    },
    {
      name: 'Points Redeemed',
      type: 'line',
      data: totalPointsRedeemedByPeriod
    }
  ];
  
  return (
    <>
      {isClient && (
        <Card size="3" mt="4">
          <CardHeading title="Points Earned vs Redeemed" />
          <div className="h-[400px]">
            {chartsLoading ? (
              <ChartLoadingPlaceholder height={400} />
            ) : (
              <ReactApexChart
                type="line"
                height={400}
                options={chartOptions.getLineOptions({
                  xaxis: {
                    ...chartOptions.getBaseXAxisOptions(),
                    categories: periods,
                    tickPlacement: 'on',
                  },
                  yaxis: {
                    labels: {
                      ...chartOptions.getBaseYAxisLabels(),
                      formatter: function(val) {
                        return Math.round(val).toLocaleString();
                      }
                    }
                  },
                  colors: [chartColorPalettes.positive[1], chartColorPalettes.negative[0]],
                  tooltip: {
                    ...chartOptions.getBaseTooltipOptions(),
                    y: {
                      formatter: function(val) {
                        return Math.round(val).toLocaleString() + " points";
                      }
                    }
                  },
                })}
                series={chartSeries}
              />
            )}
          </div>
        </Card>
      )}

      <Card size="3" mt="4">
        <CardHeading title="Point Transactions Details (Jan - Jun 2025)" />
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Branch</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Period</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Points Earned</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Points Redeemed</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Net Points</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Transactions</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Avg. Points/Transaction</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.branchName}</Table.Cell>
                <Table.Cell>{item.period}</Table.Cell>
                <Table.Cell align="right">{item.pointsEarned.toLocaleString()}</Table.Cell>
                <Table.Cell align="right">{item.pointsRedeemed.toLocaleString()}</Table.Cell>
                <Table.Cell align="right">
                  <Text color={item.netPoints >= 0 ? "green" : "red"}>
                    {item.netPoints.toLocaleString()}
                  </Text>
                </Table.Cell>
                <Table.Cell align="right">{item.transactionCount.toLocaleString()}</Table.Cell>
                <Table.Cell align="right">{item.averagePointsPerTransaction}</Table.Cell>
              </Table.Row>
            ))}
            <Table.Row className="bg-gray-100 dark:bg-neutral-800 font-semibold">
              <Table.Cell colSpan={2} className="p-2 text-right">Total:</Table.Cell>
              <Table.Cell align="right">{totalPointsEarned.toLocaleString()}</Table.Cell>
              <Table.Cell align="right">{totalPointsRedeemed.toLocaleString()}</Table.Cell>
              <Table.Cell align="right">
                <Text color={totalNetPoints >= 0 ? "green" : "red"}>
                  {totalNetPoints.toLocaleString()}
                </Text>
              </Table.Cell>
              <Table.Cell align="right">
                {data.reduce((sum, item) => sum + item.transactionCount, 0).toLocaleString()}
              </Table.Cell>
              <Table.Cell></Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Card>
    </>
  );
};

export default PointTransactionsReport; 