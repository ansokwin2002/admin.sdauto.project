'use client';

import React, { useState, useEffect } from 'react';
import { Card, Heading, Flex, Text, Grid, Table } from '@radix-ui/themes';
import dynamic from 'next/dynamic';
import { useChartOptions, chartColorPalettes } from '@/utilities/chartOptions';
import ChartLoadingPlaceholder from '@/components/common/ChartLoadingPlaceholder';
import CardHeading from '@/components/common/CardHeading';

// Dynamically import ApexCharts with SSR disabled
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface MemberActivityItem {
  id: string;
  period: string;
  newSignups: number;
  activeMembers: number;
  inactiveMembers: number;
  totalMembers: number;
  engagementRate: number;
  growth: number;
}

interface MemberActivityReportProps {
  data: MemberActivityItem[];
  isClient: boolean;
}

export default function MemberActivityReport({ data, isClient }: MemberActivityReportProps) {
  const [chartsLoading, setChartsLoading] = useState(true);
  const chartOptions = useChartOptions();

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
  const newSignups = data.map(item => item.newSignups);
  const activeMembers = data.map(item => item.activeMembers);
  const inactiveMembers = data.map(item => item.inactiveMembers);
  const engagementRates = data.map(item => item.engagementRate);
  
  return (
    <>
      {isClient && (
        <Grid columns={{ initial: "1", md: "2" }} gap="4" mt="4">
          <Card size="3">
            <CardHeading title="Member Growth Trends" />
            <div className="h-[350px]">
              {chartsLoading ? (
                <ChartLoadingPlaceholder height={350} message="Loading member growth data..." />
              ) : (
                <ReactApexChart
                  type="line"
                  height={350}
                  options={chartOptions.getLineOptions({
                    xaxis: {
                      ...chartOptions.getBaseXAxisOptions(),
                      categories: periods,
                    },
                    colors: [
                      chartColorPalettes.info[0], 
                      chartColorPalettes.positive[1], 
                      chartColorPalettes.negative[0]
                    ],
                    tooltip: {
                      ...chartOptions.getBaseTooltipOptions(),
                    },
                  })}
                  series={[
                    { name: 'Active Members', data: activeMembers },
                    { name: 'New Signups', data: newSignups },
                    { name: 'Inactive Members', data: inactiveMembers }
                  ]}
                />
              )}
            </div>
          </Card>
          
          <Card size="3">
            <CardHeading title="Engagement Rate by Period" />
            <div className="h-[350px]">
              {chartsLoading ? (
                <ChartLoadingPlaceholder height={350} message="Loading engagement rate data..." />
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
                        formatter: function (val) {
                          return val + "%"
                        }
                      },
                      min: 0,
                      max: 100,
                    },
                    colors: [chartColorPalettes.info[1]],
                    tooltip: {
                      ...chartOptions.getBaseTooltipOptions(),
                      y: {
                        formatter: function (val) {
                          return val + "%"
                        }
                      }
                    },
                  })}
                  series={[{ name: 'Engagement Rate', data: engagementRates }]}
                />
              )}
            </div>
          </Card>
        </Grid>
      )}

      <Card size="3" mt="4">
        <CardHeading title="Member Activity Details" />
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Period</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">New Signups</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Active Members</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Inactive Members</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Total Members</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Engagement Rate</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Growth</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.period}</Table.Cell>
                <Table.Cell align="right">{item.newSignups}</Table.Cell>
                <Table.Cell align="right">{item.activeMembers}</Table.Cell>
                <Table.Cell align="right">{item.inactiveMembers}</Table.Cell>
                <Table.Cell align="right">{item.totalMembers}</Table.Cell>
                <Table.Cell align="right">{item.engagementRate}%</Table.Cell>
                <Table.Cell align="right">
                  <Text color={item.growth >= 0 ? "green" : "red"}>
                    {item.growth >= 0 ? "+" : ""}{item.growth}%
                  </Text>
                </Table.Cell>
              </Table.Row>
            ))}
            <Table.Row className="bg-gray-100 dark:bg-neutral-800 font-semibold">
              <Table.Cell colSpan={3} className="p-2 text-right">Latest Total:</Table.Cell>
              <Table.Cell align="right">{data[data.length - 1].inactiveMembers}</Table.Cell>
              <Table.Cell align="right">{data[data.length - 1].totalMembers}</Table.Cell>
              <Table.Cell align="right">{data[data.length - 1].engagementRate}%</Table.Cell>
              <Table.Cell></Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Card>
    </>
  );
} 