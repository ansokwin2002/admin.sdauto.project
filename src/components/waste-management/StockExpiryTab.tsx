'use client';

import React from 'react';
import { Box, Card, Heading, Table, Flex, Text, Badge, Callout, Inset } from '@radix-ui/themes';
import { AlertTriangle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import CardHeading from '@/components/common/CardHeading';

interface ExpiringItem {
  id: string;
  name: string;
  batch: string;
  expiryDate: Date;
  quantity: number;
  unit: string;
  location: string;
}

interface StockExpiryTabProps {
  expiringItems: ExpiringItem[];
}

const StockExpiryTab: React.FC<StockExpiryTabProps> = ({ expiringItems }) => {
  return (
    <Box mt="4">
      <Card size="3">
        <CardHeading title="Items Expiring Soon" mb="8"/>
        <Inset>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Batch</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Expiry</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {expiringItems.map((item) => {
                const daysLeft = differenceInDays(item.expiryDate, new Date());
                return (
                  <Table.Row key={item.id}>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{item.batch}</Table.Cell>
                    <Table.Cell>
                      <Flex gap="2" align="center">
                        <Text>{format(item.expiryDate, 'MMM dd, yyyy')}</Text>
                        <Badge color={daysLeft <= 1 ? 'red' : daysLeft <= 3 ? 'amber' : 'green'}>
                          {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                        </Badge>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>{item.quantity} {item.unit}</Table.Cell>
                    <Table.Cell>{item.location}</Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </Inset>
              
        <Box mt="6">
          <Callout.Root color="amber">
            <Callout.Icon>
              <AlertTriangle size={16} />
            </Callout.Icon>
            <Callout.Text>
              <Text size="3" weight="bold">FIFO Recommendation</Text><br/>
              <Text>{"Move Milk batch #A23 to the front fridge for immediate use. It's expiring in 2 days."}</Text>
            </Callout.Text>
          </Callout.Root>
        </Box>
      </Card>
    </Box>
  );
};

export default StockExpiryTab; 