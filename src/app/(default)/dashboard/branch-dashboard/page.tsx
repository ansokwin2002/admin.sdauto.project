'use client';

import React, { useState, useEffect } from 'react';
import { Card, Box, Flex, Text, Grid, Badge, Inset, Button, Table, Avatar } from '@radix-ui/themes';
import { 
  ArrowRight,
  FileText,
  Package, 
  ReceiptText, 
  ShoppingBag, 
  User, 
  Users,
  Wallet,
  ChevronRight,
  HandHelping,
  SquarePen
} from 'lucide-react';
import MetricCard from '@/components/common/MetricCard';
import ChartLoadingPlaceholder from '@/components/common/ChartLoadingPlaceholder';
import dynamic from 'next/dynamic';
import { useChartOptions, chartColorPalettes } from '@/utilities/chartOptions';
import { liveOrdersData } from '@/data/LiveOrdersData';
import OrderTimer from '@/components/common/OrderTimer';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { PageHeading } from '@/components/common/PageHeading';
import CardHeading from '@/components/common/CardHeading';
import { usePageTitle } from '@/hooks/usePageTitle'

// Dynamically import ApexCharts with SSR disabled
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Mock data for inventory
const mockInventory = [
  { id: 'inv-001', name: 'Hamburger Buns', available: 45, total: 200, unit: 'pcs', status: 'normal' },
  { id: 'inv-002', name: 'Beef Patties', available: 32, total: 150, unit: 'pcs', status: 'normal' },
  { id: 'inv-003', name: 'Tomatoes', available: 2, total: 20, unit: 'kg', status: 'low' },
  { id: 'inv-004', name: 'Lettuce', available: 3, total: 15, unit: 'kg', status: 'normal' },
  { id: 'inv-005', name: 'Cheddar Cheese', available: 1, total: 10, unit: 'kg', status: 'low' },
];

// Mock data for staff
const mockStaff = [
  { id: 'emp-001', name: 'David Key', position: 'Shift Manager', status: 'active', checkIn: '08:00 AM', photo: '/images/staff/male1.jpg' },
  { id: 'emp-002', name: 'Lisa Cherry', position: 'Chef', status: 'active', checkIn: '08:15 AM', photo: '' },
  { id: 'emp-003', name: 'Robert Jones', position: 'Server', status: 'active', checkIn: '08:30 AM', photo: '/images/staff/male2.jpg' },
  { id: 'emp-004', name: 'Emily Davis', position: 'Server', status: 'break', checkIn: '08:45 AM', photo: '/images/staff/female2.jpg' },
  { id: 'emp-005', name: 'Carlos Rodriguez', position: 'Cashier', status: 'active', checkIn: '09:00 AM', photo: '/images/staff/male3.jpg' },
];

// Mock notifications
const mockNotifications = [
  { id: 'not-001', type: 'order', message: 'New takeout order #12346 ready for pickup', time: '5 min ago', read: false },
  { id: 'not-002', type: 'inventory', message: 'Tomatoes inventory low (2kg remaining)', time: '15 min ago', read: false },
  { id: 'not-003', type: 'staff', message: 'Emily Davis started break period', time: '22 min ago', read: true },
  { id: 'not-004', type: 'order', message: 'Table #8 requested assistance', time: '35 min ago', read: true },
  { id: 'not-005', type: 'inventory', message: 'Cheddar Cheese inventory low (1kg remaining)', time: '45 min ago', read: false },
];

// Daily report data
const mockDailyReport = {
  sales: 2678.50,
  transactions: 87,
  averageOrder: 30.79,
  refunds: 2,
  voidedOrders: 1,
  paymentMethods: [
    { method: 'Credit Card', amount: 1750.25, count: 58 },
    { method: 'Cash', amount: 675.50, count: 22 },
    { method: 'Mobile Pay', amount: 252.75, count: 7 },
  ]
};

// Mock hourly data for peak hours chart
const mockHourlyData = [
  { hour: '8 AM', orders: 5 },
  { hour: '9 AM', orders: 7 },
  { hour: '10 AM', orders: 8 },
  { hour: '11 AM', orders: 12 },
  { hour: '12 PM', orders: 22 },
  { hour: '1 PM', orders: 18 },
  { hour: '2 PM', orders: 14 },
  { hour: '3 PM', orders: 9 },
  { hour: '4 PM', orders: 7 },
  { hour: '5 PM', orders: 11 },
  { hour: '6 PM', orders: 19 },
  { hour: '7 PM', orders: 15 },
  { hour: '8 PM', orders: 10 },
  { hour: '9 PM', orders: 6 },
];

export default function BranchDashboard() {
  usePageTitle('Downtown Branch Dashboard')
  const [isClient, setIsClient] = useState(false);
  const [chartsLoading, setChartsLoading] = useState(true);
  const chartOptions = useChartOptions();
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  useEffect(() => {
    setIsClient(true);
    // Add a small delay to simulate chart loading
    const timer = setTimeout(() => {
      setChartsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Get the 5 most recent orders that aren't completed or cancelled
  const activeOrders = liveOrdersData
    .filter(order => order.status !== 'completed' && order.status !== 'cancelled')
    .sort((a, b) => b.timeReceived.getTime() - a.timeReceived.getTime())
    .slice(0, 5);

  // Calculate inventory stats
  const lowStockItems = mockInventory.filter(item => item.status === 'low').length;
  const inventoryPercentage = Math.round(
    (mockInventory.reduce((sum, item) => sum + item.available, 0) / 
     mockInventory.reduce((sum, item) => sum + item.total, 0)) * 100
  );

  // Update styles to support dark mode
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return isDarkMode ? 'sky' : 'blue';
      case 'preparing': return isDarkMode ? 'amber' : 'yellow';
      case 'cooking': return isDarkMode ? 'orange' : 'orange';
      case 'ready': return isDarkMode ? 'green' : 'green';
      case 'completed': return isDarkMode ? 'green' : 'green';
      case 'cancelled': return isDarkMode ? 'red' : 'red';
      default: return isDarkMode ? 'gray' : 'gray';
    }
  };

  const navigateToOrderDetails = (orderId: string) => {
    router.push(`/sales/live-orders/${orderId}`);
  };

  // Calculate order stats - update to use live orders data
  const ordersInQueue = liveOrdersData.filter(order => !order.isCompleted).length;
  const ordersServedToday = mockDailyReport.transactions;

  // Calculate staff stats
  const staffOnShift = mockStaff.filter(staff => staff.status === 'active' || staff.status === 'break').length;

  return (
    <div className="space-y-6">
      <PageHeading title="Downtown Branch Dashboard" description="Example of branch specific dashboard view" />

      {/* Branch KPIs */}
      <Grid columns={{ initial: "1", md: "2", lg: "5" }} gap="4">
        <MetricCard
          title="Orders in Queue"
          value={`${ordersInQueue}/${ordersServedToday}`}
          description="Active vs. served today"
          icon={<ShoppingBag size={18} color="blue" />}
          variant="flat"
          tooltip="Number of currently active orders compared to total orders served today"
        />
        <MetricCard
          title="Average Order"
          value={`$${mockDailyReport.averageOrder}`}
          description="Per transaction today"
          icon={<ReceiptText size={18} color="green" />}
          variant="flat"
          tooltip="Average transaction amount for today's orders"
        />
        <MetricCard
          title="Inventory"
          value={`${inventoryPercentage}%`}
          description={`Remaining, ${lowStockItems} items low`}
          icon={<Package size={18} color="red" />}
          trend={lowStockItems > 0 ? 'down' : undefined}
          trendValue={lowStockItems > 0 ? `${lowStockItems} low` : undefined}
          variant="flat"
          tooltip="Percentage of inventory remaining across all items, with count of low stock items"
        />
        <MetricCard
          title="Staff On Shift"
          value={staffOnShift}
          description={`${mockStaff.filter(s => s.status === 'active').length} active`}
          icon={<Users size={18} color="orange" />}
          variant="flat"
          tooltip="Total staff currently on shift, including those on break"
        />
        <MetricCard
          title="Sales Today"
          value={`$${mockDailyReport.sales.toLocaleString()}`}
          description={`${mockDailyReport.transactions} transactions`}
          icon={<Wallet size={18} color="green" />}
          trend="up"
          trendValue="8.5%"
          variant="flat"
          tooltip="Total sales amount for today with transaction count and growth compared to previous day"
        />
      </Grid>

      {/* Peak Hours Chart */}
      <Card mt="4" size="3">
        <Flex justify="between" align="center" mb="4">
          <CardHeading title="Peak Hours Today" mb="0" />
          <Badge color="gray">Based on order timestamps</Badge>
        </Flex>
        <div className="h-[250px]">
          {isClient ? (
            chartsLoading ? (
              <ChartLoadingPlaceholder height={250} />
            ) : (
              <ReactApexChart
                type="line"
                height={250}
                options={chartOptions.getLineOptions({
                  colors: [chartColorPalettes.cool[3]],
                  xaxis: {
                    ...chartOptions.getBaseXAxisOptions(),
                    categories: mockHourlyData.map(data => data.hour),
                  },
                  yaxis: {
                    labels: {
                      ...chartOptions.getBaseYAxisLabels(),
                    },
                    title: {
                      text: 'Orders'
                    },
                  },
                  tooltip: {
                    ...chartOptions.getBaseTooltipOptions(),
                    y: {
                      formatter: function (val) {
                        return val + " orders"
                      }
                    }
                  }
                })}
                series={[
                  {
                    name: 'Orders',
                    data: mockHourlyData.map(data => data.orders),
                  }
                ]}
              />
            )
          ) : (
            <ChartLoadingPlaceholder height={250} />
          )}
        </div>
      </Card>

      {/* Live Orders Section */}
      <Card size="3">
        <Flex justify="between" align="center" mb="6">
          <CardHeading title="Live Orders" mb="0" />
          <Button variant="ghost" size="2" onClick={() => router.push('/sales/live-orders')}>
            <Text>View all orders</Text>
            <ArrowRight size={16} />
          </Button>
        </Flex>
        <Inset>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Order #</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Customer</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Items</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Total</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Time</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {activeOrders.map((order) => (
                <Table.Row key={order.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800 cursor-pointer align-middle" onClick={() => navigateToOrderDetails(order.id)}>
                  <Table.Cell>
                    <Text weight="bold">#{order.orderNumber}</Text>
                  </Table.Cell>
                  <Table.Cell>{order.customer}</Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap="1">
                      {order.type === 'Dine-in' ? (
                        <Text size="2">Table {order.table}</Text>
                      ) : (
                        <Text size="2">{order.type}</Text>
                      )}
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>{order.items.length}</Table.Cell>
                  <Table.Cell>${order.total.toFixed(2)}</Table.Cell>
                  <Table.Cell>
                    <Badge color={getStatusColor(order.status)} className={`capitalize ${isDarkMode ? 'bg-dark' : 'bg-light'}`}>
                      {order.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <OrderTimer 
                      timeReceived={order.timeReceived} 
                      isCompleted={order.isCompleted}
                      color={order.isCompleted ? "green" : undefined}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Button variant="soft" size="1" onClick={(e) => {
                      e.stopPropagation();
                      navigateToOrderDetails(order.id);
                    }}>
                      Details
                      <ChevronRight size={14} />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Inset>
      </Card>

      {/* Inventory Management Section */}
      <Card size="3">
        <Flex justify="between" align="center" mb="6">
          <CardHeading title="Inventory Management" mb="0" />
          <Flex gap="2">
            <Button variant="ghost" size="2" onClick={() => router.push('/inventory/stock-request')}>
              <Text>Stock Request</Text>
              <ArrowRight size={16} />
            </Button>
          </Flex>
        </Flex>
        <Inset>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Available</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Total</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Unit</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {mockInventory.map((item) => (
                <Table.Row key={item.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800 cursor-pointer align-middle">
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.available}</Table.Cell>
                  <Table.Cell>{item.total}</Table.Cell>
                  <Table.Cell>{item.unit}</Table.Cell>
                  <Table.Cell>
                    <Badge color={item.status === 'low' ? 'red' : 'green'} className={`capitalize ${isDarkMode ? 'bg-dark' : 'bg-light'}`}>
                      {item.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap="2">
                      <Button variant="soft" size="1">
                        <SquarePen size={14} />
                        Adjust
                      </Button>
                      {item.status === 'low' && (
                        <Button variant="soft" size="1" color="green">
                          <HandHelping size={16} />
                          Request
                        </Button>
                      )}
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Inset>
      </Card>

      {/* Staff Management Section */}
      <Card size="3">
        <Flex justify="between" align="center" mb="4">
          <CardHeading title="Staff On Shift" mb="0" />
          <Badge color="gray">{staffOnShift} staff members</Badge>
        </Flex>
        
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Employee</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Position</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Check-In Time</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {mockStaff.map((staff) => (
              <Table.Row key={staff.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800 cursor-pointer align-middle">
                <Table.Cell>
                  <Flex align="center" gap="2">
                    <Avatar size="2" src={staff.photo} fallback={staff.name.charAt(0)} />
                    <Text>{staff.name}</Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell>{staff.position}</Table.Cell>
                <Table.Cell>
                  <Badge color={
                    staff.status === 'active' ? 'green' : 
                    staff.status === 'break' ? 'yellow' : 'gray'
                  }
                  className={`capitalize ${isDarkMode ? 'bg-dark' : 'bg-light'}`}
                  >
                    {staff.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{staff.checkIn}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>

      {/* Reports Section */}
      <Card size="3">
        <Flex justify="between" align="center" mb="4">
          <CardHeading title="Daily Report" mb="0" />
          <Button variant="soft" size="2">
            <FileText className="h-4 w-4 mr-1" />
            <Text>Download Report</Text>
          </Button>
        </Flex>
        
        <Grid columns={{ initial: "1", sm: "2" }} gap="8">
          <Box>
            <Card variant="ghost">
              <CardHeading title="Sales Summary" mb="2" />
              <Flex direction="column" gap="3">
                <Flex justify="between">
                  <Text size="2">Total Sales:</Text>
                  <Text size="2" weight="bold">${mockDailyReport.sales.toFixed(2)}</Text>
                </Flex>
                <Flex justify="between">
                  <Text size="2">Transactions:</Text>
                  <Text size="2">{mockDailyReport.transactions}</Text>
                </Flex>
                <Flex justify="between">
                  <Text size="2">Average Order Value:</Text>
                  <Text size="2">${mockDailyReport.averageOrder.toFixed(2)}</Text>
                </Flex>
                <Flex justify="between">
                  <Text size="2">Refunds:</Text>
                  <Text size="2" color="red">{mockDailyReport.refunds}</Text>
                </Flex>
                <Flex justify="between">
                  <Text size="2">Voided Orders:</Text>
                  <Text size="2" color="red">{mockDailyReport.voidedOrders}</Text>
                </Flex>
              </Flex>
            </Card>

            <Card mt="6" variant="ghost">
              <CardHeading title="Payment Methods" mb="2" />
              <Flex direction="column" gap="3">
                {mockDailyReport.paymentMethods.map((method, index) => (
                  <Flex key={index} justify="between">
                    <Text size="2">{method.method}:</Text>
                    <Text size="2">${method.amount.toFixed(2)} ({method.count})</Text>
                  </Flex>
                ))}
              </Flex>
            </Card>
          </Box>

          <Card variant="ghost">
            <CardHeading title="Payment Methods Distribution" mb="2" /> 
            <div className="h-[300px]">
              {isClient ? (
                <ReactApexChart
                  type="pie"
                  height={300}
                  options={chartOptions.getPieOptions({
                    labels: mockDailyReport.paymentMethods.map(p => p.method),
                    colors: chartColorPalettes.warm.slice(1, 4),
                    tooltip: {
                      y: {
                        formatter: function (val) {
                          return "$" + val.toFixed(2)
                        }
                      }
                    }
                  })}
                  series={mockDailyReport.paymentMethods.map(p => p.amount)}
                />
              ) : (
                <ChartLoadingPlaceholder height={300} />
              )}
            </div>
          </Card>
        </Grid>
      </Card>

      {/* Recent Orders and Notifications */}
      <Grid columns={{ initial: "1", md: "2" }} gap="4" mt="4">
        <Card size="3">
          <CardHeading title="Loyalty Program" />
          <Box>
            <Grid columns="2" gap="3">
              <Card className="p-3" variant="ghost">
                <Flex direction="column" gap="1">
                  <Text size="1" color="gray">Total Members</Text>
                  <Flex align="baseline" gap="1">
                    <Text size="5" weight="bold">247</Text>
                    <Badge color="green">+12</Badge>
                  </Flex>
                </Flex>
              </Card>
              
              <Card className="p-3" variant="ghost">
                <Flex direction="column" gap="1">
                  <Text size="1" color="gray">Active This Month</Text>
                  <Flex align="baseline" gap="1">
                    <Text size="5" weight="bold">156</Text>
                    <Text size="1" color="gray">63%</Text>
                  </Flex>
                </Flex>
              </Card>
            </Grid>
            
            <Box mt="6">
              <Flex justify="between" mb="2">
                <Text size="2" weight="medium">Top Rewards Redeemed</Text>
                <Text size="2" color="gray">This Month</Text>
              </Flex>
              <Flex direction="column">
                <Flex justify="between" align="center" p="2" className="border-b border-gray-100 dark:border-zinc-800">
                  <Text size="2">Free Dessert</Text>
                  <Badge color="blue">32 redeemed</Badge>
                </Flex>
                <Flex justify="between" align="center" p="2" className="border-b border-gray-100 dark:border-zinc-800">
                  <Text size="2">10% Discount</Text>
                  <Badge color="blue">25 redeemed</Badge>
                </Flex>
                <Flex justify="between" align="center" p="2" className="border-b border-gray-100 dark:border-zinc-800">
                  <Text size="2">Free Beverage</Text>
                  <Badge color="blue">18 redeemed</Badge>
                </Flex>
                <Flex justify="between" align="center" p="2" className="border-b border-gray-100 dark:border-zinc-800">
                  <Text size="2">Free Dessert</Text>
                  <Badge color="blue">70 redeemed</Badge>
                </Flex>
                <Flex justify="between" align="center" p="2">
                  <Text size="2">Free Drink</Text>
                  <Badge color="blue">15 redeemed</Badge>
                </Flex>
              </Flex>
            </Box>
          </Box>
        </Card>

        <Card size="3">
          <Flex justify="between" align="center" mb="4">
            <CardHeading title="Notifications" mb="0" />
            <Badge color="red" variant="solid">
              {mockNotifications.filter(n => !n.read).length} unread
            </Badge>
          </Flex>

          <Flex direction="column" gap="2">
            {mockNotifications.map((notification) => (
              <Flex key={notification.id} align="start" gap="3" p="2" className={`rounded ${!notification.read ? 'bg-gray-50 dark:bg-neutral-800' : ''}`}>
                <Box className="mt-1">
                  {notification.type === 'order' ? (
                    <ShoppingBag className="h-4 w-4 text-blue-500" />
                  ) : notification.type === 'inventory' ? (
                    <Package className="h-4 w-4 text-red-500" />
                  ) : (
                    <User className="h-4 w-4 text-green-500" />
                  )}
                </Box>
                <Box>
                  <Text as="p" size="2" weight={!notification.read ? 'bold' : 'regular'}>
                    {notification.message}
                  </Text>
                  <Text as="p" size="1" color="gray">
                    {notification.time}
                  </Text>
                </Box>
              </Flex>
            ))}
          </Flex>
        </Card>
      </Grid>
    </div>
  );
}