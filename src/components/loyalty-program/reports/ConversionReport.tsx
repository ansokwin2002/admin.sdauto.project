import React, { useState, useEffect } from 'react';
import { Card, Heading, Flex, Text, Grid, Table } from '@radix-ui/themes';
import dynamic from 'next/dynamic';
import { useChartOptions, chartColorPalettes } from '@/utilities/chartOptions';
import { formatCurrency } from '@/utilities';
import ChartLoadingPlaceholder from '@/components/common/ChartLoadingPlaceholder';
import CardHeading from '@/components/common/CardHeading';

// Dynamically import ApexCharts with SSR disabled
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ConversionItem {
  id: string;
  period: string;
  memberTransactions: number;
  nonMemberTransactions: number;
  memberRevenue: number;
  nonMemberRevenue: number;
  memberAverageTicket: number;
  nonMemberAverageTicket: number;
  conversionRate: number;
}

interface ConversionReportProps {
  data: ConversionItem[];
  isClient: boolean;
}

const ConversionReport: React.FC<ConversionReportProps> = ({ data, isClient }) => {
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
  const periods = data.map(item => item.period);
  const conversionRates = data.map(item => item.conversionRate);
  const memberRevenue = data.map(item => item.memberRevenue);
  const nonMemberRevenue = data.map(item => item.nonMemberRevenue);
  const memberAvgTicket = data.map(item => item.memberAverageTicket);
  const nonMemberAvgTicket = data.map(item => item.nonMemberAverageTicket);
  
  // Calculate total metrics
  const totalMemberTransactions = data.reduce((sum, item) => sum + item.memberTransactions, 0);
  const totalNonMemberTransactions = data.reduce((sum, item) => sum + item.nonMemberTransactions, 0);
  const totalMemberRevenue = data.reduce((sum, item) => sum + item.memberRevenue, 0);
  const totalNonMemberRevenue = data.reduce((sum, item) => sum + item.nonMemberRevenue, 0);
  const totalTransactions = totalMemberTransactions + totalNonMemberTransactions;
  const totalRevenue = totalMemberRevenue + totalNonMemberRevenue;
  const avgConversionRate = totalMemberTransactions / totalTransactions * 100;
  
  return (
    <>
      {isClient && (
        <Grid columns={{ initial: "1", md: "2" }} gap="4" mt="4">
          <Card size="3">
            <CardHeading title="Member Conversion Rate Trend" />
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
                      categories: periods,
                    },
                    yaxis: {
                      labels: {
                        ...chartOptions.getBaseYAxisLabels(),
                        formatter: function(val) {
                          return val.toFixed(1) + "%";
                        }
                      },
                      min: 0,
                      max: 100,
                    },
                    colors: [chartColorPalettes.positive[1]],
                    tooltip: {
                      ...chartOptions.getBaseTooltipOptions(),
                      y: {
                        formatter: function(val) {
                          return val.toFixed(1) + "%";
                        }
                      }
                    },
                  })}
                  series={[{ name: 'Conversion Rate', data: conversionRates }]}
                />
              )}
            </div>
          </Card>
          
          <Card size="3">
            <CardHeading title="Member vs Non-Member Revenue" />
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
                      categories: periods,
                    },
                    yaxis: {                      
                      labels: {
                        ...chartOptions.getBaseYAxisLabels(),
                        formatter: function(val) {
                          return formatCurrency(val);
                        }
                      }
                    },
                    colors: [chartColorPalettes.info[0], chartColorPalettes.muted[0]],
                    tooltip: {
                      ...chartOptions.getBaseTooltipOptions(),
                      y: {
                        formatter: function(val) {
                          return formatCurrency(val);
                        }
                      }
                    },
                  })}
                  series={[
                    { name: 'Member Revenue', data: memberRevenue },
                    { name: 'Non-Member Revenue', data: nonMemberRevenue }
                  ]}
                />
              )}
            </div>
          </Card>
        </Grid>
      )}

      <Card size="3" mt="4">
        <CardHeading title="Member Conversion Details" />
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Period</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Member Transactions</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Non-Member Transactions</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Member Revenue</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Non-Member Revenue</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Member Avg. Ticket</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Non-Member Avg. Ticket</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Conversion Rate</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell className="whitespace-nowrap">{item.period}</Table.Cell>
                <Table.Cell align="right">{item.memberTransactions}</Table.Cell>
                <Table.Cell align="right">{item.nonMemberTransactions}</Table.Cell>
                <Table.Cell align="right">${item.memberRevenue.toLocaleString()}</Table.Cell>
                <Table.Cell align="right">${item.nonMemberRevenue.toLocaleString()}</Table.Cell>
                <Table.Cell align="right">${item.memberAverageTicket.toFixed(2)}</Table.Cell>
                <Table.Cell align="right">${item.nonMemberAverageTicket.toFixed(2)}</Table.Cell>
                <Table.Cell align="right">{item.conversionRate}%</Table.Cell>
              </Table.Row>
            ))}
            <Table.Row className="bg-gray-100 dark:bg-neutral-800 font-semibold">
              <Table.Cell className="p-2 text-right">Total:</Table.Cell>
              <Table.Cell align="right">{totalMemberTransactions}</Table.Cell>
              <Table.Cell align="right">{totalNonMemberTransactions}</Table.Cell>
              <Table.Cell align="right">${totalMemberRevenue.toLocaleString()}</Table.Cell>
              <Table.Cell align="right">${totalNonMemberRevenue.toLocaleString()}</Table.Cell>
              <Table.Cell align="right">${(totalMemberRevenue / totalMemberTransactions).toFixed(2)}</Table.Cell>
              <Table.Cell align="right">${(totalNonMemberRevenue / totalNonMemberTransactions).toFixed(2)}</Table.Cell>
              <Table.Cell align="right">{avgConversionRate.toFixed(1)}%</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Card>
    </>
  );
};

export default ConversionReport; 