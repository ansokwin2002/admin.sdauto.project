'use client';

import { Card, Box, Flex, Text, Heading, Tooltip } from '@radix-ui/themes';
import { ArrowDownIcon, ArrowUpIcon, HelpCircle } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { useEffect, useState } from 'react';

export interface MetricCardProps {
  title: string;
  value: string | number | React.ReactNode;
  description: string | React.ReactNode;
  image?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
  variant?: 'default' | 'flat';
  className?: string;
  tooltip?: string;
}

export default function MetricCard({ 
  title, 
  value, 
  description, 
  image,
  icon, 
  trend, 
  trendValue,
  variant = 'default',
  className = '',
  tooltip = ''
}: MetricCardProps) {
  // Use client-side only rendering for the component to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Return a placeholder with the same structure during server-side rendering
  if (!isClient) {
    return (
      <Box
        className={`px-6 py-[18px] rounded-lg ${className} ${variant === 'flat' ? 'bg-gray-100/85 dark:bg-neutral-900' : 'bg-white dark:bg-neutral-900'}`}
        style={{ boxShadow: variant === 'flat' ? 'none' : 'var(--base-card-surface-box-shadow)' }}
      >
        <Box className="animate-pulse">
          <Flex direction="column" gap="2">
            <Flex justify="between" align="center" gap="2">
              <Box className="h-4 w-24 bg-gray-200 rounded"></Box>
              {trend && (
                <Box className="h-4 w-12 bg-gray-200 rounded"></Box>
              )}
            </Flex>
            <Box className="h-8 w-32 bg-gray-200 rounded mt-2"></Box>
            <Box className="h-4 w-full bg-gray-200 rounded mt-2"></Box>
          </Flex>
        </Box>
      </Box>
    );
  }

  // Actual component render on client side
  return (
    <Box
      className={`relative overflow-hidden px-6 py-[18px] rounded-lg ${className} ${variant === 'flat' ? 'bg-gray-100/85 dark:bg-neutral-900' : 'bg-white dark:bg-neutral-900'}`}
      style={{ boxShadow: variant === 'flat' ? 'none' : 'var(--base-card-surface-box-shadow)' }}
    >
      <Box>
        <Flex direction="column" gap="3">
          <Flex justify="between" align="center" gap="2">
            <Flex align="center">
              <Text as="p" size="1" className="font-semibold">{title}</Text>
              {tooltip && (
                <Tooltip content={tooltip}>
                  <HelpCircle className="h-4 w-4 text-gray-400 dark:text-neutral-600 ml-1" />
                </Tooltip>
              )}
            </Flex>
            {trend && (
              <Flex align="center">
                {trend === 'up' ? 
                  <ArrowUpIcon className="h-4 w-4" color="green" /> : 
                  <ArrowDownIcon className="h-4 w-4" color="red" />
                }
                <Text as="p" size="1" weight="bold" color={trend === 'up' ? 'green' : 'red'}>
                  {trendValue}
                </Text>
              </Flex>
            )}
          </Flex>
          
          {icon ? (
            <Flex align="center" gap="2">
              <Box className="text-slate-500">{icon}</Box>
              <Heading as="h3" size="5">{value}</Heading>
            </Flex>
          ) : (
            <Heading as="h3" size="5">{value}</Heading>
          )}
          
          <Text as="p" size="1" className="text-gray-400 dark:text-neutral-600">{description}</Text>
        </Flex>
      </Box>
      {image && (
        <Box className="absolute -right-2 -bottom-1">
          <Image src={image} alt={title} width={70} height={70} />
        </Box>
      )}
    </Box>
  );
} 