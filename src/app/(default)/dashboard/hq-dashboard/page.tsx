'use client';

import React, { useState, useEffect } from 'react';
import { Card, Box, Heading, Flex, Text, Grid, Badge, Separator, Inset, Button, Table } from '@radix-ui/themes';
import {
  TrendingUp, 
  BarChart3, 
  Store, 
  AlertTriangle, 
  Activity,
  ChevronRight,
  RefreshCw,
  Package
} from 'lucide-react';
import MetricCard from '@/components/common/MetricCard';
import ChartLoadingPlaceholder from '@/components/common/ChartLoadingPlaceholder';
import dynamic from 'next/dynamic';
import { useChartOptions, chartColorPalettes } from '@/utilities/chartOptions';
import { StockMetrics } from '@/types/inventory';
import { ingredientItemCategories } from '@/data/CommonData';
import { formatCurrency } from '@/utilities/';
import { PageHeading } from '@/components/common/PageHeading';
import CardHeading from '@/components/common/CardHeading';
import { usePageTitle } from '@/hooks/usePageTitle'
// Dynamically import ApexCharts with SSR disabled
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Mock data for the HQ Dashboard
const mockBranches = [
  { id: 'br-1', name: 'Downtown Main', status: 'open', activeOrders: 22, salesToday: 4250, inventory: { total: 230, low: 5 } },
  { id: 'br-2', name: 'Westside Corner', status: 'open', activeOrders: 18, salesToday: 3120, inventory: { total: 185, low: 3 } },
  { id: 'br-3', name: 'Eastside Mall', status: 'open', activeOrders: 15, salesToday: 5340, inventory: { total: 210, low: 7 } },
];

const mockSalesData = [
  { month: 'Jan', downtown: 38000, westside: 28000, eastside: 42000, north: 32000 },
  { month: 'Feb', downtown: 42000, westside: 32000, eastside: 48000, north: 35000 },
  { month: 'Mar', downtown: 45000, westside: 34000, eastside: 52000, north: 37000 },
  { month: 'Apr', downtown: 39000, westside: 29000, eastside: 44000, north: 33000 },
  { month: 'May', downtown: 41000, westside: 31000, eastside: 46000, north: 36000 },
  { month: 'Jun', downtown: 47000, westside: 36000, eastside: 54000, north: 39000 },
];

const mockProductData = [
  { id: 'p1', name: 'Classic Burger', sales: 432, revenue: 6480, growth: 12, category: 'Main Dishes' },
  { id: 'p2', name: 'Margherita Pizza', sales: 387, revenue: 5805, growth: 8, category: 'Main Dishes' },
  { id: 'p3', name: 'Chicken Wings', sales: 356, revenue: 4628, growth: 15, category: 'Appetizers' },
  { id: 'p4', name: 'Garden Salad', sales: 289, revenue: 2890, growth: -3, category: 'Sides' },
  { id: 'p5', name: 'Seafood Pasta', sales: 245, revenue: 3675, growth: 5, category: 'Main Dishes' },
];

const mockHourlyTrends = [
  { hour: '8 AM', orders: 12 },
  { hour: '9 AM', orders: 15 },
  { hour: '10 AM', orders: 18 },
  { hour: '11 AM', orders: 25 },
  { hour: '12 PM', orders: 45 },
  { hour: '1 PM', orders: 52 },
  { hour: '2 PM', orders: 38 },
  { hour: '3 PM', orders: 27 },
  { hour: '4 PM', orders: 22 },
  { hour: '5 PM', orders: 32 },
  { hour: '6 PM', orders: 48 },
  { hour: '7 PM', orders: 53 },
  { hour: '8 PM', orders: 41 },
  { hour: '9 PM', orders: 35 },
];

const mockInventoryAlerts = [
  { branchId: 'br-1', item: 'Tomatoes', current: 2, reorderLevel: 5, unit: 'kg' },
  { branchId: 'br-1', item: 'Chicken Breast', current: 3, reorderLevel: 10, unit: 'kg' },
  { branchId: 'br-2', item: 'Fresh Pasta', current: 1, reorderLevel: 4, unit: 'kg' },
  { branchId: 'br-3', item: 'Hamburger Buns', current: 15, reorderLevel: 30, unit: 'pcs' },
  { branchId: 'br-3', item: 'Mozzarella Cheese', current: 2, reorderLevel: 5, unit: 'kg' },
];

// Mock inventory category data
const mockInventoryCategories = [
  { id: 'cat-1', name: 'Proteins', totalItems: 24, lowStockItems: 5, criticalItems: 2 },
  { id: 'cat-2', name: 'Produce', totalItems: 32, lowStockItems: 8, criticalItems: 3 },
  { id: 'cat-3', name: 'Dairy', totalItems: 18, lowStockItems: 2, criticalItems: 0 },
  { id: 'cat-4', name: 'Dry Goods', totalItems: 45, lowStockItems: 3, criticalItems: 1 },
  { id: 'cat-5', name: 'Beverages', totalItems: 29, lowStockItems: 4, criticalItems: 0 },
];

// Mock inventory health by branch
const mockBranchInventoryHealth = [
  { branch: 'Downtown Main', healthScore: 78, lowItems: 5, criticalItems: 2, lastUpdated: '2023-06-15 08:45 AM' },
  { branch: 'Westside Corner', healthScore: 85, lowItems: 3, criticalItems: 0, lastUpdated: '2023-06-15 09:20 AM' },
  { branch: 'Eastside Mall', healthScore: 72, lowItems: 7, criticalItems: 3, lastUpdated: '2023-06-15 07:50 AM' },
  { branch: 'North Station', healthScore: 90, lowItems: 2, criticalItems: 0, lastUpdated: '2023-06-14 06:20 PM' },
];

// Mock stock metrics
const mockMetrics: StockMetrics = {
  totalValue: 25000,
  lowStockItems: 5,
  outOfStockItems: 2,
  expiringItems: 3,
};

export default function HQDashboard() {
  usePageTitle('Headquarters Dashboard')
  const [isClient, setIsClient] = useState(false);
  const [isRefreshingInventory, setIsRefreshingInventory] = useState(false);
  const [chartsLoading, setChartsLoading] = useState(true);
  const chartOptions = useChartOptions();
  
  useEffect(() => {
    setIsClient(true);
    // Add a small delay to simulate chart loading
    const timer = setTimeout(() => {
      setChartsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Calculate total values
  const totalSalesToday = mockBranches.reduce((sum, branch) => sum + branch.salesToday, 0);
  const totalActiveOrders = mockBranches.reduce((sum, branch) => sum + branch.activeOrders, 0);
  const totalLowStock = mockBranches.reduce((sum, branch) => sum + branch.inventory.low, 0);
  
  // Calculate inventory health summary
  const totalInventoryItems = mockInventoryCategories.reduce((sum, cat) => sum + cat.totalItems, 0);
  const totalLowStockItems = mockInventoryCategories.reduce((sum, cat) => sum + cat.lowStockItems, 0);
  const totalCriticalItems = mockInventoryCategories.reduce((sum, cat) => sum + cat.criticalItems, 0);
  const inventoryHealthPercentage = Math.round(((totalInventoryItems - totalLowStockItems) / totalInventoryItems) * 100);
  
  const handleRefreshInventory = () => {
    setIsRefreshingInventory(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsRefreshingInventory(false);
    }, 1500);
  };
  
  return (
    <Box className="space-y-6">
      <PageHeading title="Headquarters Dashboard" description="Example of HQ dashboard view" />

      {/* Sales Overview Section */}
      <Box>
        <Grid columns={{ initial: "1", md: "2", lg: "4" }} gap="4">
          <MetricCard
            title="Total Sales Today"
            value={`$${totalSalesToday.toLocaleString()}`}
            description="Across all branches"
            image="/images/illustrations/cash-register.png"
            trend="up"
            trendValue="15%"
            variant="flat"
          />
          <MetricCard
            title="Active Orders"
            value={totalActiveOrders}
            description="At all branches"
            image="/images/illustrations/cooking.png"
            variant="flat"
          />
          <MetricCard
            title="Today&apos;s Customers"
            value="487"
            description="Total customer count"
            image="/images/illustrations/customer.png"
            trend="up"
            trendValue="8%"
            variant="flat"
          />
          <MetricCard
            title="Monthly Revenue"
            value="$24,598"
            description="Current month"
            image="/images/illustrations/money-bag.png"
            trend="up"
            trendValue="12.5%"
            variant="flat"
          />
        </Grid>
        
        <Card mt="4" size="3">
          <CardHeading title="Monthly Sales by Branch" />
          <div className="h-[350px]">
            {isClient ? (
              chartsLoading ? (
                <ChartLoadingPlaceholder height={350} />
              ) : (
                <ReactApexChart
                  type="bar"
                  height={350}
                  options={chartOptions.getBarOptions({
                    xaxis: {
                      ...chartOptions.getBaseXAxisOptions(),
                      categories: mockSalesData.map(item => item.month),
                    },
                    yaxis: {
                      labels: {
                        ...chartOptions.getBaseYAxisLabels(),
                        formatter: function(val) {
                          return formatCurrency(val);
                        }
                      }
                    },
                    colors: chartColorPalettes.warm,
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
                      name: 'Downtown Main',
                      data: mockSalesData.map(item => item.downtown),
                    },
                    {
                      name: 'Westside Corner',
                      data: mockSalesData.map(item => item.westside),
                    },
                    {
                      name: 'Eastside Mall',
                      data: mockSalesData.map(item => item.eastside),
                    },
                    {
                      name: 'North Station',
                      data: mockSalesData.map(item => item.north),
                    }
                  ]}
                />
              )
            ) : (
              <ChartLoadingPlaceholder height={350} />
            )}
          </div>
        </Card>
      </Box>

      {/* Branch Monitoring Section */}
      <Box>        
        <Grid columns={{ initial: "1", md: "2" }} gap="4">
          <Card size="3">
            <CardHeading title="Branch Status" mb="8" />
            <Inset>
              {mockBranches.map((branch, index) => (
                <React.Fragment key={branch.id}>
                  <Flex align="center" justify="between" px="5" py="3" className="cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800">
                    <Flex align="center" gap="3">
                      <Store className="h-5 w-5 text-gray-400 dark:text-neutral-600" />
                      <Box>
                        <Text as="p" size="2" weight="medium" mb="1">{branch.name}</Text>
                        <Flex align="center" gap="1">
                          <Badge color={branch.status === 'open' ? 'green' : 'gray'} radius="full">
                            {branch.status === 'open' ? 'Open' : 'Closed'}
                          </Badge>
                          {branch.status === 'open' && (
                            <Text as="p" size="1" color="gray">{branch.activeOrders} active orders</Text>
                          )}
                        </Flex>
                      </Box>
                    </Flex>
                    <Flex align="center" gap="3">
                      <Box>
                        <Text as="p" size="1" color="gray">Today&apos;s Sales</Text>
                        <Text as="p" size="3" weight="bold">${branch.salesToday.toLocaleString()}</Text>
                      </Box>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </Flex>
                  </Flex>
                  {index < mockBranches.length - 1 && (
                    <Separator size="4" style={{ backgroundColor: 'var(--gray-4)' }} />
                  )}
                </React.Fragment>
              ))}
            </Inset>
          </Card>
          
          <Card size="3">
            <CardHeading title="Hourly Order Trends" />
            <div className="h-[220px]">
              {isClient ? (
                chartsLoading ? (
                  <ChartLoadingPlaceholder height={220} />
                ) : (
                  <ReactApexChart
                    type="line"
                    height={220}
                    options={chartOptions.getLineOptions({
                      colors: [chartColorPalettes.cool[3]],
                      xaxis: {
                        ...chartOptions.getBaseXAxisOptions(),
                        categories: mockHourlyTrends.map(item => item.hour),
                      },
                      tooltip: {
                        ...chartOptions.getBaseTooltipOptions(),
                      },
                    })}
                    series={[
                      {
                        name: 'Orders',
                        data: mockHourlyTrends.map(item => item.orders),
                      }
                    ]}
                  />
                )
              ) : (
                <ChartLoadingPlaceholder height={300} />
              )}
            </div>
          </Card>
        </Grid>
      </Box>

      {/* Menu Insights Section */}
      <Box>
        <Card size="3">
          <CardHeading title="Top Performing Menu Items" mb="8" />
          <Inset>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Sales (Units)</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Revenue</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Growth</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {mockProductData.map((product) => (
                  <Table.Row key={product.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800">
                    <Table.Cell>{product.name}</Table.Cell>
                    <Table.Cell>{product.category}</Table.Cell>
                    <Table.Cell>{product.sales}</Table.Cell>
                    <Table.Cell>${product.revenue.toLocaleString()}</Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="1">
                        {product.growth > 0 ? 
                          <TrendingUp className="h-4 w-4 text-green-500" /> : 
                          <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />
                        }
                        <Text color={product.growth > 0 ? 'green' : 'red'}>
                          {Math.abs(product.growth)}%
                        </Text>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Inset>
        </Card>
        
        <Grid columns={{ initial: "1", md: "2" }} gap="4" mt="4">
          <Card size="3">
            <CardHeading title="Category Distribution" />
            <div className="h-[300px]">
              {isClient ? (
                chartsLoading ? (
                  <ChartLoadingPlaceholder height={300} />
                ) : (
                  <ReactApexChart
                    type="donut"
                    height={300}
                    options={chartOptions.getPieOptions({
                      labels: ['Main Dishes', 'Appetizers', 'Desserts', 'Beverages', 'Sides'],
                      colors: chartColorPalettes.cool,
                      tooltip: {
                        ...chartOptions.getBaseTooltipOptions(),
                        y: {
                          formatter: function (val) {
                            return formatCurrency(val);
                          }
                        }
                      },
                      plotOptions: {
                        pie: {
                          donut: {
                            labels: {
                              show: true,
                              value: {
                                color: 'var(--gray-12)',
                                formatter: function(val) {
                                  return formatCurrency(parseFloat(val));
                                }
                              },
                              total: {
                                show: true,
                                color: 'var(--gray-12)',
                                label: 'Total Sales',
                                formatter: function(w) {
                                  return formatCurrency(w.globals.seriesTotals.reduce((a, b) => a + b, 0))
                                }
                              }
                            }
                          }
                        }
                      }
                    })}
                    series={[12500, 8300, 5400, 7800, 3200]}
                  />
                )
              ) : (
                <ChartLoadingPlaceholder height={300} />
              )}
            </div>
          </Card>
          
          <Card size="3">
            <CardHeading title="Menu Optimization" />
            <Flex direction="column" gap="3">
              <Box p="3" className="bg-slate-50 dark:bg-neutral-800 rounded-md">
                <Flex align="center" gap="3">
                  <BarChart3 className="h-5 w-5 text-amber-500" />
                  <Box>
                    <Text as="p" size="2" weight="medium">Top Performing Items</Text>
                    <Text as="p" size="2" color="gray">Classic Burger, Margherita Pizza, Chicken Wings</Text>
                  </Box>
                </Flex>
              </Box>
              
              <Box p="3" className="bg-slate-50 dark:bg-neutral-800 rounded-md">
                <Flex align="center" gap="3">
                  <Activity className="h-5 w-5 text-green-500" />
                  <Box>
                    <Text as="p" size="2" weight="medium">Trending Items</Text>
                    <Text as="p" size="2" color="gray">Seafood Pasta (+15%), Grilled Salmon (+12%)</Text>
                  </Box>
                </Flex>
              </Box>
              
              <Box p="3" className="bg-slate-50 dark:bg-neutral-800 rounded-md">
                <Flex align="center" gap="3">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <Box>
                    <Text as="p" size="2" weight="medium">Underperforming Items</Text>
                    <Text as="p" size="2" color="gray">Garden Salad (-3%), Vegetable Soup (-5%)</Text>
                  </Box>
                </Flex>
              </Box>

              <Box p="3" className="bg-slate-50 dark:bg-neutral-800 rounded-md">
                <Flex align="center" gap="3">
                  <BarChart3 className="h-5 w-5 text-amber-500" />
                  <Box>
                    <Text as="p" size="2" weight="medium">Top Performing Categories</Text>
                    <Text as="p" size="2" color="gray">Main Dishes, Desserts, Beverages</Text>
                  </Box>
                </Flex>
              </Box>
            </Flex>
          </Card>
        </Grid>
      </Box>

      {/* Consumable Inventory Summary Section */}
      <Box>
        <Grid columns={{ initial: "1", md: "2" }} gap="4">
          <Card size="3" className="p-0 overflow-hidden">
            <Flex justify="between" align="center" mb="5">
              <CardHeading title="Low Stock Alerts" mb="0" />
              <Flex align="center" gap="1">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <Text as="p" size="2" weight="medium" className="text-orange-600">{totalLowStock} items below reorder level</Text>
              </Flex>
            </Flex>
            <Box>
              <Box className="space-y-6">
                {mockBranches.filter(branch => branch.inventory.low > 0).map((branch) => (
                  <Box key={branch.id}>
                    <Text as="p" size="2" mb="2" weight="bold">{branch.name}</Text>
                    <Box className="space-y-2">
                      {mockInventoryAlerts
                        .filter(alert => alert.branchId === branch.id)
                        .map((alert, index) => (
                          <Text as="p" size="2" mb="2" color="gray" key={index}>
                            • {alert.item} - Only {alert.current}{alert.unit} remaining (Reorder level: {alert.reorderLevel}{alert.unit})
                          </Text>
                        ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Card>
          <Box>
            <Card size="3">
              <Flex justify="between" align="center" gap="4">
                <Flex align="center" gap="2">
                  <Box className="p-3 bg-green-50 dark:bg-green-900/30 rounded-full">
                    <Package className="h-6 w-6 text-green-500" />
                  </Box>
                  <Flex gap="1" direction="column">
                    <Heading as="h3" size="2">Inventory Health</Heading>
                    <Box>
                      <Text size="2" color="red">{totalLowStockItems} items low</Text>, <Text size="2" color="amber">{totalCriticalItems} critical</Text>
                    </Box>
                  </Flex>
                </Flex>
                <Text size="8" weight="bold" color={inventoryHealthPercentage >= 85 ? 'green' : inventoryHealthPercentage >= 75 ? 'yellow' : 'red'}>{inventoryHealthPercentage}%</Text>  
              </Flex>
            </Card>
            <Grid columns="2" gap="4" mt="4">
              <MetricCard
                title="Total Stock Value"
                value={`$${mockMetrics.totalValue.toLocaleString()}`}
                description="Current inventory value"
                trend="up"
                trendValue="12%"
              />
              <MetricCard
                title="Low Stock Items"
                value={mockMetrics.lowStockItems}
                description="Items needing restock"
                trend="down"
                trendValue="2"
              />
              <MetricCard
                title="Out of Stock"
                value={mockMetrics.outOfStockItems}
                description="Items completely depleted"
              />
              <MetricCard
                title="Expiring Soon"
                value={mockMetrics.expiringItems}
                description="Items near expiration"
              />
            </Grid>
          </Box>
        </Grid>
        
        <Grid columns={{ initial: "1", md: "2" }} gap="4" mt="4">
          <Card size="3">
            <CardHeading title="Inventory by Category" />
            <div className="h-[450px]">
              {isClient ? (
                chartsLoading ? (
                  <ChartLoadingPlaceholder height={450} />
                ) : (
                  <ReactApexChart
                    type="bar"
                    height={450}
                    options={chartOptions.getHorizontalBarOptions({
                      chart: {
                        stacked: true,
                        toolbar: {
                          show: false,
                        },
                      },
                      tooltip: {
                        ...chartOptions.getBaseTooltipOptions(),
                      },
                      xaxis: {
                        ...chartOptions.getBaseXAxisOptions(),
                        categories: ingredientItemCategories,
                      },
                      dataLabels: {
                        enabled: false,
                      },
                      colors: [chartColorPalettes.positive[4], chartColorPalettes.warm[4], chartColorPalettes.negative[2]],
                    })}
                    series={[
                      {
                        name: 'Normal',
                        data: ingredientItemCategories.map(() => Math.floor(Math.random() * 100) + 20),
                      },
                      {
                        name: 'Low Stock',
                        data: ingredientItemCategories.map(() => Math.floor(Math.random() * 20) + 5),
                      },
                      {
                        name: 'Critical',
                        data: ingredientItemCategories.map(() => Math.floor(Math.random() * 5)),
                      },
                    ]}
                  />
                )
              ) : (
                <ChartLoadingPlaceholder height={450} />
              )}
            </div>
          </Card>
          
          <Card size="3">
            <Flex justify="between" align="center" mb="6">
              <CardHeading title="Branch Inventory Health" mb="0" />
              <Button variant="soft" color="gray" size="1" onClick={handleRefreshInventory} disabled={isRefreshingInventory}>
                <RefreshCw size={13} className={isRefreshingInventory ? 'animate-spin' : ''} />
                {isRefreshingInventory ? 'Refreshing...' : 'Refresh'}
              </Button>
            </Flex>
            <Box className="space-y-3">
              {mockBranchInventoryHealth.map((branch) => (
                <Box key={branch.branch} p="3" className="bg-slate-50 dark:bg-neutral-800 rounded-md">
                  <Flex justify="between" mb="2">
                    <Text weight="medium">{branch.branch}</Text>
                    <Badge color={
                      branch.healthScore >= 85 ? 'green' : 
                      branch.healthScore >= 75 ? 'yellow' : 
                      'red'
                    }>
                      {branch.healthScore}%
                    </Badge>
                  </Flex>
                  <Box className="w-full bg-slate-200 dark:bg-neutral-700 rounded-full h-2">
                    <Box 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${branch.healthScore}%`,
                        backgroundColor: branch.healthScore >= 85 ? 'var(--green-9)' : 
                                      branch.healthScore >= 75 ? 'var(--amber-9)' : 
                                      'var(--red-9)'
                      }}
                    />
                  </Box>
                  <Flex justify="between" mt="2">
                    <Text size="1" color="gray">{branch.lowItems} items low</Text>
                    <Text size="1" color="gray">Updated {branch.lastUpdated}</Text>
                  </Flex>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Box>
    </Box>
  );
}
