'use client';

import { useState } from 'react';
import { Card, Box, Table, Switch, TextField } from '@radix-ui/themes';
import { BusinessHours } from '@/types/inventory';

interface SupplierBusinessHoursProps {
  businessHours: BusinessHours[];
  onUpdate: (hours: BusinessHours[]) => void;
}

export default function SupplierBusinessHours({ businessHours, onUpdate }: SupplierBusinessHoursProps) {
  // Ensure we have all days of the week 
  const ensureAllDays = (hours: BusinessHours[]): BusinessHours[] => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const result = [...hours];
    
    days.forEach(day => {
      if (!result.some(hour => hour.day === day)) {
        result.push({
          day: day as BusinessHours['day'],
          open: '09:00',
          close: '17:00',
          isClosed: day === 'Sunday' // Default Sunday to closed
        });
      }
    });
    
    // Sort by day of week
    return result.sort((a, b) => {
      const dayOrder = {
        'Monday': 0,
        'Tuesday': 1,
        'Wednesday': 2,
        'Thursday': 3,
        'Friday': 4,
        'Saturday': 5,
        'Sunday': 6
      };
      return dayOrder[a.day] - dayOrder[b.day];
    });
  };
  
  const [hours, setHours] = useState<BusinessHours[]>(ensureAllDays(businessHours));

  const handleToggleClosed = (index: number) => {
    const updatedHours = [...hours];
    updatedHours[index] = {
      ...updatedHours[index],
      isClosed: !updatedHours[index].isClosed
    };
    setHours(updatedHours);
    onUpdate(updatedHours);
  };
  
  const handleTimeChange = (index: number, field: 'open' | 'close', value: string) => {
    const updatedHours = [...hours];
    updatedHours[index] = {
      ...updatedHours[index],
      [field]: value
    };
    setHours(updatedHours);
    onUpdate(updatedHours);
  };

  return (
    <Card size="3">
      <Box>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Day</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Opening Time</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Closing Time</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Closed</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {hours.map((hour, index) => (
              <Table.Row key={hour.day}>
                <Table.Cell>{hour.day}</Table.Cell>
                <Table.Cell>
                  <TextField.Root
                    type="time"
                    value={hour.open}
                    onChange={(e) => handleTimeChange(index, 'open', e.target.value)}
                    disabled={hour.isClosed}
                  />
                </Table.Cell>
                <Table.Cell>
                  <TextField.Root
                    type="time"
                    value={hour.close}
                    onChange={(e) => handleTimeChange(index, 'close', e.target.value)}
                    disabled={hour.isClosed}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Switch
                    color="green"
                    checked={hour.isClosed}
                    onCheckedChange={() => handleToggleClosed(index)}
                    size="1"
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Card>
  );
} 