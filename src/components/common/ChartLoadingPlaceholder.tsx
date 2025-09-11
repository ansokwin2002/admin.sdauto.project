'use client';

import React from 'react';
import { Flex, Text } from '@radix-ui/themes';
import { Loader2 } from 'lucide-react';

interface ChartLoadingPlaceholderProps {
  height: number;
  message?: string;
}

export default function ChartLoadingPlaceholder({ 
  height, 
  message = 'Loading chart data...' 
}: ChartLoadingPlaceholderProps) {
  return (
    <Flex 
      direction="column" 
      align="center" 
      justify="center" 
      className="w-full" 
      style={{ height: `${height}px` }}
    >
      <Loader2 className="h-8 w-8 text-slate-400 dark:text-neutral-400 animate-spin mb-2" />
      <Text size="2" className="text-slate-600 dark:text-neutral-400">{message}</Text>
    </Flex>
  );
} 