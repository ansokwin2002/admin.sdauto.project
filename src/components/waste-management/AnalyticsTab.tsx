'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Box, Card, Grid, Heading, Text, Table, Flex, Badge, Separator, Inset } from '@radix-ui/themes';
import { TrendingDown, Timer } from 'lucide-react';
import { useChartOptions, chartColorPalettes } from '@/utilities/chartOptions';
import { ApexOptions } from 'apexcharts';
import CardHeading from '@/components/common/CardHeading';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface AnalyticsTabProps {
  isMounted: boolean;
  topWastedItems: Array<{ name: string; quantity: number; unit: string; cost: number; count: number }>;
  wasteByReasonChartData: Array<{ name: string; value: number }>;
  wasteByReason: Array<{ reason: string; count: number; cost: number }>;
  wasteByTimeChartData: Array<{ name: string; data: number[] }>;
  wasteByTimeCategories: string[];
  insights: Array<{ item: string; insight: string; savings: number; priority: string }>;
  totalWasteCost: number;
  chartOptions: ReturnType<typeof useChartOptions>; // Pass the hook result
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  isMounted,
  topWastedItems,
  wasteByReasonChartData,
  wasteByReason,
  wasteByTimeChartData,
  wasteByTimeCategories,
  insights,
  totalWasteCost,
  chartOptions,
}) => {
  return (
    <Grid columns={{ xs: "1", md: "2" }} gap="4" mt="4">
      {/* Top 10 Wasted Items */}
      <Card size="3">
        <CardHeading title="Top Wasted Items" mb="8"/>
        <Inset>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {topWastedItems.map((item, index) => (
                <Table.Row key={index} className="hover:bg-slate-50 dark:hover:bg-neutral-800">
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.quantity} {item.unit}</Table.Cell>
                  <Table.Cell>${item.cost.toFixed(2)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Inset>
      </Card>
      
      {/* Waste by Reason */}
      <Card size="3">
        <CardHeading title="Waste by Reason"/>
        <Box height="250px">
          {isMounted && (
            <ReactApexChart
              options={chartOptions.getPieOptions({ 
                labels: wasteByReasonChartData.map(item => item.name),
                colors: chartColorPalettes.warm,
                tooltip: {
                  y: {
                    formatter: function (val: number) {
                      return "$" + val.toFixed(2)
                    }
                  }
                }
              })}
              series={wasteByReasonChartData.map(item => item.value)}
              type="pie"
              height="250px"
            />
          )}
        </Box>
        <Flex direction="column" gap="2" mt="3">
          {wasteByReason.sort((a, b) => b.cost - a.cost).map((reason, index) => (
            reason.cost > 0 && (
              <Flex key={index} justify="between" align="center" className="border-b border-slate-100 dark:border-neutral-800 pb-2">
                <Text size="2">{reason.reason}</Text>
                <Text size="2">${reason.cost.toFixed(2)}</Text>
              </Flex>
            )
          ))}
          <Flex justify="between" align="center">
            <Text size="2" weight="bold">Total waste cost</Text>
            <Text size="2" weight="bold">${totalWasteCost.toFixed(2)}</Text>
          </Flex>
        </Flex>
      </Card>
      
      {/* Waste by Day & Time */}
      <Card size="3">
        <CardHeading title="Waste by Day & Time"/>
        <Box height="400px">
          {isMounted && (
            <ReactApexChart
              options={chartOptions.getStackedBarOptions({
                xaxis: {
                  ...chartOptions.getBaseXAxisOptions(),
                  categories: wasteByTimeCategories,                      
                },
                yaxis: {
                  labels: {
                    ...chartOptions.getBaseYAxisLabels(),
                    formatter: function (val: number) {
                      return "$" + val.toFixed(2);
                    }
                  }
                },
                colors: [chartColorPalettes.monochrome[2], chartColorPalettes.monochrome[1], chartColorPalettes.monochrome[0]],
                tooltip: {
                  shared: true,
                  intersect: false,
                  y: { 
                    formatter: function (val: number) { 
                      return "$" + val.toFixed(2);
                    }
                  }
                },
                dataLabels: { 
                  enabled: true, 
                  style: {
                    colors: ['#0d0c22'] 
                  },
                  formatter: function (val: number | string) { 
                    if (typeof val === 'number' && val !== 0) {
                      return "$" + val.toFixed(0); 
                    }
                    return ""; 
                  },
                },
              })}
              series={wasteByTimeChartData}
              type="bar"
              height="100%"
            />
          )}
        </Box>
      </Card>
      
      {/* Insights & Recommendations */}
      <Box>
        <CardHeading title="Insights & Recommendations"/>
        <Flex direction="column" gap="3">
          {insights.map((insight, index) => (
            <Card key={index}>
              <Flex gap="3" align="start">
                <Box className={`p-2 rounded-full ${insight.priority === 'high' ? 'bg-red-100 dark:bg-red-900/50' : 'bg-amber-100 dark:bg-amber-900/50'}`}>
                  {insight.priority === 'high' ? <TrendingDown className="text-red-600 dark:text-red-400" size={16} /> : <Timer className="text-amber-600 dark:text-amber-400" size={16} />}
                </Box>
                <Box>
                  <Flex gap="2" align="center" justify="between">
                    <Text weight="bold">{insight.item}</Text>
                    <Badge color={insight.priority === 'high' ? 'red' : 'amber'}>
                      Save ${insight.savings.toFixed(2)}
                    </Badge>
                  </Flex>
                  <Text size="2" as="p" mt="1">{insight.insight}</Text>
                </Box>
              </Flex>
            </Card>
          ))}
        </Flex>
      </Box>
    </Grid>
  );
};

export default AnalyticsTab; 