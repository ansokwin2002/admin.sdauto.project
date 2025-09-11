'use client';

import { Box, Grid } from '@radix-ui/themes';
import { BarChart, Clock, CheckSquare, Star } from 'lucide-react';
import { Supplier } from '@/types/inventory';
import MetricCard from '@/components/common/MetricCard';
interface SupplierMetricsPanelProps {
  supplier: Supplier;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color?: string;
  tooltip?: string;
}

export default function SupplierMetricsPanel({ supplier }: SupplierMetricsPanelProps) {
  const performance = supplier.performance || {
    onTimeDeliveryRate: 0,
    averageLeadTime: 0,
    orderAccuracy: 0,
    customerRating: 0
  };

  return (
    <Box className="mt-4">
      <Grid columns={{ initial: '1', sm: '2', md: '4' }} gap="4">
        <MetricCard
          title="On-Time Delivery"
          value={`${performance.onTimeDeliveryRate.toFixed(1)}%`}
          description="Orders delivered on schedule"
          tooltip="Percentage of orders delivered on time."
          icon={<Clock size={16} className="text-green-500"/>}
          variant="flat"
        />
        <MetricCard
          title="Average Lead Time"
          value={`${performance.averageLeadTime.toFixed(1)} days`}
          description="Order to delivery time"
          tooltip="Average time taken from order placement to delivery."
          icon={<BarChart size={16} className="text-blue-500"/>}
          variant="flat"
        />
        <MetricCard
          title="Order Accuracy"
          value={`${performance.orderAccuracy.toFixed(1)}%`}
          description="Items received correctly"
          tooltip="Percentage of orders delivered correctly without missing or damaged items."
          icon={<CheckSquare size={16} className="text-amber-500"/>}
          variant="flat"
        />
        <MetricCard
          title="Customer Rating"
          value={performance.customerRating}
          description="Internal quality rating"
          tooltip="Internal rating based on service quality and pricing."
          icon={<Star size={16} className="text-yellow-500"/>}
          variant="flat"
        />
      </Grid>
    </Box>
  );
} 