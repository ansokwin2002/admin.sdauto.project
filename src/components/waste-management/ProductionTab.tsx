'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Box, Card, Flex, Heading, Text, Select, Table, Callout, Inset } from '@radix-ui/themes';
import { Utensils, Scale, DollarSign, ArrowUpRight } from 'lucide-react';
import { useChartOptions, chartColorPalettes } from '@/utilities/chartOptions';
import { ApexOptions } from 'apexcharts';
import ChartLoadingPlaceholder from '@/components/common/ChartLoadingPlaceholder';
import CardHeading from '@/components/common/CardHeading';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ProductionItem {
  itemName: string;
  avgHourlySales: number[];
}

interface PrepRecommendation {
  item: string;
  currentPrep: string;
  recommended: string;
  savings: string;
}

interface ProductionTabProps {
  isMounted: boolean;
  productionData: ProductionItem[];
  prepRecommendations: PrepRecommendation[];
  chartOptions: ReturnType<typeof useChartOptions>;
}

const ProductionTab: React.FC<ProductionTabProps> = ({
  isMounted,
  productionData,
  prepRecommendations,
  chartOptions,
}) => {
  const [selectedItem, setSelectedItem] = useState<string>(productionData[0]?.itemName || '');
  const [chartsLoading, setChartsLoading] = useState(true);

  const selectedItemData = productionData.find(item => item.itemName === selectedItem);
  const seriesData = selectedItemData ? [{ name: 'Sales', data: selectedItemData.avgHourlySales }] : [];

  // Simulate chart loading
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isMounted) {
      setChartsLoading(true);
      timer = setTimeout(() => {
        setChartsLoading(false);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isMounted, selectedItem]);

  // Mock data for Preparation Recommendations (replace with actual data if needed)
  const recommendations: PrepRecommendation[] = prepRecommendations || [
    { item: 'Penne Pasta', currentPrep: '5 kg/batch', recommended: '3.5 kg/batch', savings: '$12.50/day' },
    { item: 'Caesar Salad', currentPrep: '10 portions', recommended: '8 portions', savings: '$8.20/day' },
    { item: 'Margherita Pizza Dough', currentPrep: '15 bases', recommended: '12 bases', savings: '$9.75/day' },
    { item: 'Beef Burger Patties', currentPrep: '20 patties', recommended: '15 patties', savings: '$18.30/day' },
  ];

  return (
    <Box mt="4" className="space-y-4">
      <Card size="3">
        <Flex justify="between" align="center" mb="3">
          <CardHeading title="Hourly Sales Patterns" mb="0"/>
          <Flex gap="2" align="center">
            <Text as="label" size="2">Select Menu:</Text>
            <Select.Root 
              defaultValue={selectedItem} 
              onValueChange={setSelectedItem}
              value={selectedItem}
            >
              <Select.Trigger />
              <Select.Content>
                {productionData.map(item => (
                  <Select.Item key={item.itemName} value={item.itemName}>{item.itemName}</Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>
        </Flex>
        <Text size="2" mb="4">Review hourly demand to optimize food preparation and reduce waste.</Text>
               
        <Box height="350px" mt="3">
          {!isMounted || chartsLoading ? (
            <ChartLoadingPlaceholder height={350} />
          ) : selectedItemData ? (
            <ReactApexChart
              options={{
                ...chartOptions.getLineOptions({
                  chart: {
                    type: 'area',
                    toolbar: {
                      show: false,
                    },
                  },
                  colors: [chartColorPalettes.default[0]], 
                  stroke: {
                    curve: 'smooth',
                    width: 2,
                  },
                  xaxis: {
                    ...chartOptions.getBaseXAxisOptions(),
                    categories: Array.from({length: 24}, (_, i) => `${i}:00`),
                  },
                  yaxis: {
                    labels: {
                      ...chartOptions.getBaseYAxisLabels(),
                      formatter: (val: number) => `${val}`
                    }
                  },
                  fill: {
                    type: 'gradient',
                    gradient: {
                      shadeIntensity: 1,
                      opacityFrom: 0.7,
                      opacityTo: 0.2,
                      stops: [0, 90, 100],
                    },
                  },
                }),
                tooltip: {
                  theme: chartOptions.isDarkMode ? 'dark' : 'light',
                  y: {
                    formatter: (val: number) => `${val} sales`
                  }
                }
              }}
              series={seriesData}
              type="area"
              height="100%"
            />
          ) : (
            <Flex align="center" justify="center" height="100%">
              <Text>Select an item to view sales patterns.</Text>
            </Flex>
          )}
        </Box>
        
        <Flex justify="center" gap="6" mt="4">
          <Flex direction="column" align="center" p="2">
            <Utensils size={20} className="text-violet-500 mb-1" />
            <Text size="1" weight="bold">Peak Hours</Text>
            <Text size="2">12-1 PM, 7-8 PM</Text> 
          </Flex>
        
          <Flex direction="column" align="center" p="2">
            <Scale size={20} className="text-emerald-500 mb-1" />
            <Text size="1" weight="bold">Recommended Batch</Text>
            <Text size="2">10 servings/hr</Text> 
          </Flex>
        
          <Flex direction="column" align="center" p="2">
            <DollarSign size={20} className="text-amber-500 mb-1" />
            <Text size="1" weight="bold">Waste Reduction</Text>
            <Text size="2">Est. 15% savings</Text> 
          </Flex>
        </Flex>
      </Card>
      <Card size="3">
        <CardHeading title="Preparation Recommendations" mb="8"/>
        <Inset>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Current Prep</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Recommended</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Savings</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {recommendations.map((rec, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{rec.item}</Table.Cell>
                  <Table.Cell>{rec.currentPrep}</Table.Cell>
                  <Table.Cell>{rec.recommended}</Table.Cell>
                  <Table.Cell>{rec.savings}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Inset>
        <Box mt="6">
          <Callout.Root color="green">
            <Callout.Icon>
              <ArrowUpRight size={16} />
            </Callout.Icon>
            <Callout.Text>
              <Text weight="bold">Prep Schedule Optimization</Text><br/>
              <Text>Implementing these recommendations could save approximately $49.75 per day or $1,492 per month.</Text>
            </Callout.Text>
          </Callout.Root>
        </Box>
      </Card>
    </Box>
  );
};

export default ProductionTab; 