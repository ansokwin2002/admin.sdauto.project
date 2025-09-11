import React from 'react';
import { Select } from '@radix-ui/themes';

export type PeriodOption = 'day' | 'week' | 'month' | 'quarter' | 'year';

interface PeriodSelectProps {
  value: PeriodOption;
  onChange: (value: PeriodOption) => void;
  showLabel?: boolean;
}

export default function PeriodSelect({ 
  value, 
  onChange, 
  showLabel = false 
}: PeriodSelectProps) {
  return (
    <div className="flex items-center gap-2">
      {showLabel && <span className="text-sm text-gray-500">Period:</span>}
      <Select.Root value={value} onValueChange={onChange as (value: string) => void}>
        <Select.Trigger placeholder="Select time period" />
        <Select.Content>
          <Select.Item value="day">Today</Select.Item>
          <Select.Item value="week">Last 7 Days</Select.Item>
          <Select.Item value="month">This Month</Select.Item>
          <Select.Item value="quarter">This Quarter</Select.Item>
          <Select.Item value="year">This Year</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
} 