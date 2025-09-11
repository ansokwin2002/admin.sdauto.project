'use client';

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Flex, 
  Grid, 
  Text, 
  Tabs,
} from '@radix-ui/themes';
import { wasteLogs, wasteReasons } from '@/data/WasteLogData';
import { startOfMonth, addDays, isAfter } from 'date-fns';
import { useChartOptions } from '@/utilities/chartOptions';
import { AlertTriangle, Trash, CookingPot, Banknote, BarChart2, Clock, Gauge } from 'lucide-react';
import MetricCard from '@/components/common/MetricCard';
import PeriodSelect, { PeriodOption } from '@/components/common/PeriodSelect';

// Import the new tab components
import AnalyticsTab from '@/components/waste-management/AnalyticsTab';
import StockExpiryTab from '@/components/waste-management/StockExpiryTab';
import ProductionTab from '@/components/waste-management/ProductionTab';
import { formatCurrency } from '@/utilities';
import { PageHeading } from '@/components/common/PageHeading';
import { usePageTitle } from '@/hooks/usePageTitle';

// Mock data for analytics
const getExpiringStockItems = () => [
  { id: '1', name: 'Milk', batch: 'A23', expiryDate: addDays(new Date(), 2), quantity: 5, unit: 'l', location: 'Main Storage' },
  { id: '2', name: 'Fresh Spinach', batch: 'B45', expiryDate: addDays(new Date(), 1), quantity: 2.5, unit: 'kg', location: 'Walk-in Cooler' },
  { id: '3', name: 'Chicken Breast', batch: 'C12', expiryDate: addDays(new Date(), 3), quantity: 3, unit: 'kg', location: 'Freezer 2' },
  { id: '4', name: 'Yogurt', batch: 'D78', expiryDate: addDays(new Date(), 2), quantity: 8, unit: 'pcs', location: 'Dairy Shelf' },
];

// Production data
const productionData = [
  { itemName: 'Penne Pasta', avgHourlySales: [0, 0, 0, 0, 0, 1, 2, 2, 3, 5, 8, 10, 12, 8, 6, 5, 4, 7, 12, 10, 6, 4, 2, 0] },
  { itemName: 'Caesar Salad', avgHourlySales: [0, 0, 0, 0, 0, 0, 1, 2, 4, 7, 9, 11, 8, 6, 4, 3, 2, 5, 9, 7, 4, 2, 1, 0] },
  { itemName: 'Margherita Pizza', avgHourlySales: [0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 5, 8, 10, 7, 4, 3, 5, 9, 15, 13, 10, 6, 3, 1] },
  { itemName: 'Beef Burger', avgHourlySales: [0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 6, 9, 11, 8, 5, 4, 6, 10, 14, 12, 8, 5, 2, 1] },
];

// Mock prep recommendations (can be fetched or calculated)
const prepRecommendations = [
    { item: 'Penne Pasta', currentPrep: '5 kg/batch', recommended: '3.5 kg/batch', savings: '$12.50/day' },
    { item: 'Caesar Salad', currentPrep: '10 portions', recommended: '8 portions', savings: '$8.20/day' },
    { item: 'Margherita Pizza Dough', currentPrep: '15 bases', recommended: '12 bases', savings: '$9.75/day' },
    { item: 'Beef Burger Patties', currentPrep: '20 patties', recommended: '15 patties', savings: '$18.30/day' },
];

// Helper function to calculate total waste cost
const calculateTotalWasteCost = (logs = wasteLogs, period = 'month') => {
  const now = new Date();
  let startDate;
  
  switch(period) {
    case 'week':
      startDate = addDays(now, -7);
      break;
    case 'month':
      startDate = startOfMonth(now);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = startOfMonth(now);
  }
  
  return logs
    .filter(log => isAfter(new Date(log.timestamp), startDate))
    .reduce((total, log) => total + (log.cost || 0), 0);
};

// Helper to get top wasted items
const getTopWastedItems = (logs = wasteLogs, limit = 10) => {
  const itemMap = new Map();
  
  logs.forEach(log => {
    const key = log.productName;
    if (itemMap.has(key)) {
      const item = itemMap.get(key);
      item.quantity += log.quantity;
      item.cost += log.cost || 0;
      item.count += 1;
    } else {
      itemMap.set(key, {
        name: log.productName,
        quantity: log.quantity,
        unit: log.measureUnit,
        cost: log.cost || 0,
        count: 1
      });
    }
  });
  
  return Array.from(itemMap.values())
    .sort((a, b) => b.cost - a.cost)
    .slice(0, limit);
};

// Helper to get waste by reason
const getWasteByReason = (logs = wasteLogs) => {
  const reasonMap = new Map();
  
  wasteReasons.forEach(reason => {
    reasonMap.set(reason.value, {
      reason: reason.label,
      count: 0,
      cost: 0
    });
  });
  
  logs.forEach(log => {
    const reasonItem = reasonMap.get(log.reason);
    // Check if reasonItem exists before updating
    if (reasonItem) {
      reasonItem.count += 1;
      reasonItem.cost += log.cost || 0;
    } else {
      // Handle case where log.reason might not be in wasteReasons
      console.warn(`Unknown waste reason found: ${log.reason}`);
    }
  });
  
  return Array.from(reasonMap.values());
};

// Helper to get waste by day/time
const getWasteByTime = (logs = wasteLogs) => {
  const timeMap = new Map();
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  days.forEach(day => {
    timeMap.set(day, {
      day,
      morning: 0,
      afternoon: 0,
      evening: 0,
      total: 0
    });
  });
  
  logs.forEach(log => {
    const date = new Date(log.timestamp);
    const day = days[date.getDay()];
    const hour = date.getHours();
    const cost = log.cost || 0;
    
    const timeData = timeMap.get(day);
    timeData.total += cost;
    
    if (hour < 12) {
      timeData.morning += cost;
    } else if (hour < 17) {
      timeData.afternoon += cost;
    } else {
      timeData.evening += cost;
    }
  });
  
  return Array.from(timeMap.values());
};

// Prepare chart data
const prepareWasteByReasonChart = (wasteByReason) => {
  return wasteByReason.map(item => ({
    name: item.reason,
    value: item.cost
  }));
};

const prepareWasteByTimeChart = (wasteByTime) => {
  return [
    { name: 'Morning', data: wasteByTime.map(day => day.morning) },
    { name: 'Afternoon', data: wasteByTime.map(day => day.afternoon) },
    { name: 'Evening', data: wasteByTime.map(day => day.evening) }
  ];
};

// Get inventory usage insights 
const getInventoryInsights = () => {
  // In real app, this would analyze actual inventory data and wastage patterns
  return [
    {
      item: 'Cheese',
      insight: 'You waste 4.2kg of cheese weekly, mostly from spoilage. Recommend reducing reorder quantity by 15%.',
      savings: 68.50,
      priority: 'high'
    },
    {
      item: 'Tomatoes',
      insight: 'Tomato waste has increased 23% this month. Consider adjusting storage conditions to extend shelf life.',
      savings: 42.20,
      priority: 'medium'
    },
    {
      item: 'Chicken Breast',
      insight: 'Highest waste cost items (chicken breast) are wasted during evening shift. Review evening food prep quantities.',
      savings: 87.30,
      priority: 'high'
    },
    {
      item: 'Fresh Herbs',
      insight: 'Fresh herbs are consistently wasted on Mondays. Consider reducing weekend ordering.',
      savings: 32.10,
      priority: 'medium'
    }
  ];
};

export default function WasteAnalyticsDashboard() {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<PeriodOption>('month');
  const [isMounted, setIsMounted] = useState(false);
  const chartOptions = useChartOptions();
  usePageTitle('Waste Analytics Dashboard');
  
  // Client-side rendering guard
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Calculate metrics
  const totalWasteCost = calculateTotalWasteCost(wasteLogs, selectedTimePeriod);
  const topWastedItems = getTopWastedItems(wasteLogs);
  const wasteByReason = getWasteByReason(wasteLogs);
  const wasteByTime = getWasteByTime(wasteLogs);
  const expiringItems = getExpiringStockItems();
  const insights = getInventoryInsights();
  
  // Prepare chart data
  const wasteByReasonChartData = prepareWasteByReasonChart(wasteByReason);
  const wasteByTimeChartData = prepareWasteByTimeChart(wasteByTime);
  const wasteByTimeCategories = wasteByTime.map(day => day.day);
  
  // Get time period for display
  const getTimePeriodDisplay = () => {
    switch(selectedTimePeriod) {
      case 'day': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'quarter': return 'This Quarter';
      case 'year': return 'This Year';
      default: return 'This Month';
    }
  };
  
  if (!isMounted) {
    return null;
  }

  // --- Find top waste reason for metric card --- 
  const sortedWasteByReason = [...wasteByReason].sort((a, b) => b.cost - a.cost);
  const topWasteReason = sortedWasteByReason[0] || { reason: 'N/A', cost: 0 };
  const topReasonPercentage = totalWasteCost > 0 ? Math.round((topWasteReason.cost / totalWasteCost) * 100) : 0;

  return (
    <Box>
      <Flex 
        direction={{ initial: "column", sm: "row" }} 
        justify="between" 
        align={{ initial: "stretch", sm: "center" }}
        gap={{ initial: "4", sm: "0" }}
        mb="5"
      >
        <PageHeading title="Waste Analytics Dashboard" description="Track, analyze, and reduce food waste" noMarginBottom />
        <PeriodSelect 
          value={selectedTimePeriod} 
          onChange={setSelectedTimePeriod} 
          showLabel={true}
        />
      </Flex>
      
      {/* Key Metrics */}
      <Grid columns={{ xs: "1", sm: "2", md: "4" }} gap="4" mb="6">
        <MetricCard
          title="Total Waste Cost"
          value={<Text color="red">${totalWasteCost.toFixed(2)}</Text>}
          description={getTimePeriodDisplay().charAt(0).toUpperCase() + getTimePeriodDisplay().slice(1).toLowerCase() + ' vs. previous period'}
          trend="up"
          trendValue={`12%`}
          icon={<Banknote size={18} className="text-red-700" />}
        />
        
        <MetricCard
          title="Top Waste Reason"
          value={topWasteReason.reason}
          description={`${topReasonPercentage}% of total waste cost`}
          icon={<CookingPot size={18} />}
        />
        
        <MetricCard
          title="Most Wasted Item"
          value={topWastedItems[0]?.name || 'N/A'}
          description={`${formatCurrency(topWastedItems[0]?.cost || 0)} in waste`}
          icon={<Trash size={18} color="blue" />}
        />
        
        <MetricCard
          title="Items Expiring Soon"
          value={expiringItems.length}
          description="Need immediate attention"
          trend="down"
          trendValue={`3%`}
          icon={<AlertTriangle size={18} color="orange" />}
        />
      </Grid>
      
      {/* Main Content with Tabs */}
      <Tabs.Root defaultValue="analytics">
        <Tabs.List>
          <Tabs.Trigger value="analytics">
            <Flex gap="2" align="center">
              <BarChart2 size={16} />
              <Text>Analytics & Insights</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="expiry">
            <Flex gap="2" align="center">
              <Clock size={16} />
              <Text>Stock Expiry Alerts</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="production">
            <Flex gap="2" align="center">
              <Gauge size={16} />
              <Text>Overproduction Controls</Text>
            </Flex>
          </Tabs.Trigger>
        </Tabs.List>
        
        {/* --- Render Tab Components --- */}
        <Tabs.Content value="analytics">
          <AnalyticsTab 
            isMounted={isMounted}
            topWastedItems={topWastedItems}
            wasteByReasonChartData={wasteByReasonChartData}
            wasteByReason={wasteByReason}
            wasteByTimeChartData={wasteByTimeChartData}
            wasteByTimeCategories={wasteByTimeCategories}
            insights={insights}
            totalWasteCost={totalWasteCost}
            chartOptions={chartOptions}
          />
        </Tabs.Content>
        
        <Tabs.Content value="expiry">
          <StockExpiryTab expiringItems={expiringItems} />
        </Tabs.Content>
        
        <Tabs.Content value="production">
           <ProductionTab 
             isMounted={isMounted} 
             productionData={productionData} 
             prepRecommendations={prepRecommendations}
             chartOptions={chartOptions} 
           />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
