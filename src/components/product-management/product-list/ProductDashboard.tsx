import { Box, Card, Grid, Table, Flex, Badge, Inset, Progress } from '@radix-ui/themes';
import { ChefHat, AlertCircle, Image as ImageIcon, CookingPot, CircleX, Utensils } from 'lucide-react';
import MetricCard from '@/components/common/MetricCard';
import { MenuItem } from '@/data/MenuData';
import Image from 'next/image';
import CardHeading from '@/components/common/CardHeading';

interface MenuDashboardProps {
  menuMetrics: {
    totalItems: number;
    activeItems: number;
    inactiveItems: number;
    lowStockItems: number;
  };
  bestSellingItems: Array<{
    name: string;
    sales: number;
    image: string;
  }>;
  menuItems: MenuItem[];
}

export default function ProductDashboard({ menuMetrics, bestSellingItems, menuItems }: MenuDashboardProps) {
  return (
    <Box className="mt-6 space-y-6">
      <Grid columns={{ initial: '1', sm: '2', md: '4' }} gap="4">
        <MetricCard 
          title="Total Menu Items" 
          value={menuMetrics.totalItems.toString()} 
          icon={<ChefHat size={18} color="blue" />}
          description="Total items in your menu"
          variant="flat"
        />
        <MetricCard 
          title="Active Items" 
          value={menuMetrics.activeItems.toString()} 
          icon={<CookingPot size={18} color="green" />}
          description="Currently available items" 
          variant="flat"
        />
        <MetricCard 
          title="Inactive Items" 
          value={menuMetrics.inactiveItems.toString()}
          icon={<CircleX size={18} color="gray" />}
          description="Temporarily unavailable items" 
          variant="flat"
        />
        <MetricCard 
          title="Low Stock Warning" 
          value={menuMetrics.lowStockItems.toString()} 
          icon={<AlertCircle size={18} color="orange" />}
          description="Items with ingredient shortages" 
          variant="flat"
        />
      </Grid>
      
      <Card size="3" className="p-6">
        <CardHeading title="Best-Selling Items" mb="8" />
        <Inset>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Item Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Sales</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Performance</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {bestSellingItems.map((item, index) => (
                <Table.Row key={index} className="align-middle">
                  <Table.Cell>
                    <Flex align="center" gap="2">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={32}
                          height={32}
                          className="object-cover rounded w-6 h-6"
                        />
                      ) : (
                        <Flex align="center" justify="center" className="w-6 h-6 rounded bg-slate-200 dark:bg-neutral-600">
                          <Utensils className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                        </Flex>
                      )}
                      {item.name}
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>{item.sales} orders</Table.Cell>
                  <Table.Cell>
                    <Progress color="green" value={Math.min(100, (item.sales / 250) * 100)} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Inset>
      </Card>
      
      <Card size="3" className="p-6">
        <CardHeading title="Low Stock Warnings" mb="8" />
        <Inset>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Item Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Missing Ingredients</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {menuItems.filter(item => item.stockWarning).map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>
                  <Flex align="center" gap="2">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={32}
                        height={32}
                        className="object-cover rounded w-6 h-6"
                      />
                    ) : (
                      <Flex align="center" justify="center" className="w-6 h-6 rounded bg-slate-200 dark:bg-neutral-600">
                        <Utensils className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                      </Flex>
                    )}
                    {item.name}
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  {item.ingredients.map(ing => ing.name).join(', ')}
                </Table.Cell>
                <Table.Cell>
                  <Badge color="red" variant="soft">Low Stock</Badge>
                </Table.Cell>
              </Table.Row>
            ))}
            </Table.Body>
          </Table.Root>
        </Inset>
      </Card>
    </Box>
  );
} 