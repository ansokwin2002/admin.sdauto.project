'use client';

import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Card, Button, Select } from '@radix-ui/themes';
import { 
  FileSpreadsheet, 
  FileText, 
  Filter, 
  RefreshCw,
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import DateRangeInput from '@/components/common/DateRangeInput';
import { Range } from 'react-date-range';
import { useFilterBranch, FilterBranchProvider } from '@/contexts/FilterBranchContext';
import { organization } from '@/data/CommonData';
import { PageHeading } from '@/components/common/PageHeading';
import { usePageTitle } from '@/hooks/usePageTitle';

// Import report components - these will be created next
import PurchaseSpendingReport from '@/components/purchasing/reports/PurchaseSpendingReport';
import SupplierPerformanceReport from '@/components/purchasing/reports/SupplierPerformanceReport';
import PurchaseOrderStatusReport from '@/components/purchasing/reports/PurchaseOrderStatusReport';
import PriceVarianceReport from '@/components/purchasing/reports/PriceVarianceReport';
import PurchaseBudgetReport from '@/components/purchasing/reports/PurchaseBudgetReport';

// Report types
const reportTypes = [
  { id: 'spending', name: 'Purchase Spending Report' },
  { id: 'supplier', name: 'Supplier Performance Report' },
  { id: 'order', name: 'Purchase Order Status Report' },
  { id: 'price', name: 'Price Variance Report' },
  { id: 'budget', name: 'Purchase Budget Analysis' },
];

const branches = organization.filter(org => org.id !== 'hq');

// Mock supplier categories
const supplierCategories = [
  { id: 'meat', name: 'Meat & Poultry Suppliers' },
  { id: 'dairy', name: 'Dairy Suppliers' },
  { id: 'produce', name: 'Produce Suppliers' },
  { id: 'dry', name: 'Dry Goods Suppliers' },
  { id: 'beverage', name: 'Beverage Suppliers' },
  { id: 'packaging', name: 'Packaging Suppliers' },
];

// Mock suppliers with categories
const mockSuppliers = [
  { id: 'sup-1', name: 'Prime Meats', category: 'meat', reliability: 92, deliverySpeed: 95, qualityRating: 90, priceCompetitiveness: 85 },
  { id: 'sup-2', name: 'Valley Dairy', category: 'dairy', reliability: 88, deliverySpeed: 82, qualityRating: 93, priceCompetitiveness: 78 },
  { id: 'sup-3', name: 'Fresh Farms Produce', category: 'produce', reliability: 85, deliverySpeed: 92, qualityRating: 95, priceCompetitiveness: 82 },
  { id: 'sup-4', name: 'Bulk Basics', category: 'dry', reliability: 96, deliverySpeed: 85, qualityRating: 87, priceCompetitiveness: 90 },
  { id: 'sup-5', name: 'Premier Beverages', category: 'beverage', reliability: 91, deliverySpeed: 88, qualityRating: 92, priceCompetitiveness: 79 },
  { id: 'sup-6', name: 'SafeWrap Packaging', category: 'packaging', reliability: 94, deliverySpeed: 91, qualityRating: 88, priceCompetitiveness: 84 },
];

// Generate purchase spending data
const mockPurchaseSpendingData = supplierCategories.map(category => {
  const categorySuppliers = mockSuppliers.filter(supplier => supplier.category === category.id);
  
  // Calculate total spending for the category
  const totalSpending = parseFloat((Math.random() * 15000 + 5000).toFixed(2));
  
  // Generate monthly growth rate between -10% and 20%
  const monthlyGrowth = parseFloat((Math.random() * 30 - 10).toFixed(1));
  
  // Calculate average order value
  const avgOrderValue = parseFloat((totalSpending / (Math.floor(Math.random() * 30) + 10)).toFixed(2));
  
  return {
    id: category.id,
    name: category.name,
    spending: totalSpending,
    supplierCount: categorySuppliers.length,
    growth: monthlyGrowth,
    avgOrderValue,
    pendingOrdersValue: parseFloat((totalSpending * (Math.random() * 0.3)).toFixed(2))
  };
});

// Generate supplier performance data
const mockSupplierPerformanceData = mockSuppliers.map(supplier => {
  // Calculate overall score
  const overallScore = Math.round((supplier.reliability + supplier.deliverySpeed + supplier.qualityRating + supplier.priceCompetitiveness) / 4);
  
  // Generate total orders and fulfillment rate
  const totalOrders = Math.floor(Math.random() * 100) + 20;
  const fulfillmentRate = parseFloat((85 + Math.random() * 15).toFixed(1));
  
  // Calculate on-time delivery percentage
  const onTimeDelivery = parseFloat((supplier.deliverySpeed * 0.95).toFixed(1));
  
  // Generate total spend with supplier
  const totalSpend = parseFloat((Math.random() * 8000 + 2000).toFixed(2));
  
  return {
    id: supplier.id,
    name: supplier.name,
    category: supplierCategories.find(c => c.id === supplier.category)?.name || '',
    reliability: supplier.reliability,
    deliverySpeed: supplier.deliverySpeed,
    qualityRating: supplier.qualityRating,
    priceCompetitiveness: supplier.priceCompetitiveness,
    overallScore,
    totalOrders,
    fulfillmentRate,
    onTimeDelivery,
    totalSpend
  };
});

// Generate purchase order status data
const mockPurchaseOrderStatusData = branches.map(branch => {
  // Generate random order counts
  const completedOrders = Math.floor(Math.random() * 40) + 10;
  const pendingOrders = Math.floor(Math.random() * 15) + 5;
  const inTransitOrders = Math.floor(Math.random() * 10) + 2;
  const cancelledOrders = Math.floor(Math.random() * 5);
  
  // Calculate total orders
  const totalOrders = completedOrders + pendingOrders + inTransitOrders + cancelledOrders;
  
  // Generate order values
  const completedValue = parseFloat((Math.random() * 7000 + 3000).toFixed(2));
  const pendingValue = parseFloat((Math.random() * 3000 + 1000).toFixed(2));
  const inTransitValue = parseFloat((Math.random() * 2000 + 500).toFixed(2));
  
  // Calculate average processing time (in days)
  const avgProcessingTime = parseFloat((Math.random() * 3 + 1).toFixed(1));
  
  return {
    id: branch.id,
    name: branch.name,
    completedOrders,
    pendingOrders,
    inTransitOrders,
    cancelledOrders,
    totalOrders,
    completedValue,
    pendingValue,
    inTransitValue,
    avgProcessingTime
  };
});

// Generate price variance data
const mockPriceVarianceData = mockSuppliers.map(supplier => {
  // Generate current price and baseline price
  const baselinePrice = parseFloat((Math.random() * 50 + 20).toFixed(2));
  const currentPrice = parseFloat((baselinePrice * (Math.random() * 0.4 + 0.8)).toFixed(2));
  
  // Calculate price variance
  const priceVariance = parseFloat(((currentPrice - baselinePrice) / baselinePrice * 100).toFixed(1));
  
  // Generate average market price
  const marketPrice = parseFloat((baselinePrice * (Math.random() * 0.3 + 0.9)).toFixed(2));
  
  // Calculate market variance
  const marketVariance = parseFloat(((currentPrice - marketPrice) / marketPrice * 100).toFixed(1));
  
  // Generate forecast price
  const forecastPrice = parseFloat((currentPrice * (Math.random() * 0.2 + 0.9)).toFixed(2));
  
  return {
    id: supplier.id,
    name: supplier.name,
    category: supplierCategories.find(c => c.id === supplier.category)?.name || '',
    baselinePrice,
    currentPrice,
    priceVariance,
    marketPrice,
    marketVariance,
    forecastPrice
  };
});

// Generate purchase budget data
const mockPurchaseBudgetData = supplierCategories.map(category => {
  // Generate budget amount and actual spending
  const budgetAmount = parseFloat((Math.random() * 12000 + 5000).toFixed(2));
  const actualSpending = parseFloat((budgetAmount * (Math.random() * 0.4 + 0.7)).toFixed(2));
  
  // Calculate variance
  const variance = parseFloat((actualSpending - budgetAmount).toFixed(2));
  const variancePercent = parseFloat(((variance / budgetAmount) * 100).toFixed(1));
  
  // Generate forecast remaining
  const forecastRemaining = parseFloat((budgetAmount - actualSpending).toFixed(2));
  
  // Calculate projected overspend/underspend
  const projectedFinalSpending = parseFloat((actualSpending * (Math.random() * 0.5 + 1.2)).toFixed(2));
  const projectedVariance = parseFloat((projectedFinalSpending - budgetAmount).toFixed(2));
  
  return {
    id: category.id,
    name: category.name,
    budgetAmount,
    actualSpending,
    variance,
    variancePercent,
    forecastRemaining,
    projectedFinalSpending,
    projectedVariance
  };
});

function PurchasingReportsContent() {
  usePageTitle('Purchasing Reports');
  const [isClient, setIsClient] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('spending'); // Default to purchase spending
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
    endDate: new Date(),
    key: 'selection'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const { activeBranchFilter } = useFilterBranch();

  // Set branch filter based on current branch context
  useEffect(() => {
    if (activeBranchFilter && activeBranchFilter.id !== 'hq') {
      setSelectedBranch(activeBranchFilter.id);
    }
  }, [activeBranchFilter]);

  // Set isClient to true on component mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter the data based on selected filters
  const filteredSupplierData = mockSupplierPerformanceData
    .filter(item => !selectedCategory || item.category === supplierCategories.find(c => c.id === selectedCategory)?.name)
    .sort((a, b) => b.overallScore - a.overallScore);

  const filteredOrderStatusData = mockPurchaseOrderStatusData
    .filter(item => !selectedBranch || item.id === selectedBranch)
    .sort((a, b) => b.totalOrders - a.totalOrders);

  // Generate the report
  const generateReport = () => {
    setIsGenerating(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsGenerating(false);
    }, 1000);
  };

  // Export report functions
  const exportToPDF = () => {
    console.log('Exporting to PDF...');
    // Implementation would depend on PDF generation library
  };

  const exportToSpreadsheet = () => {
    console.log('Exporting to spreadsheet...');
    // Implementation would depend on spreadsheet export library
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedBranch(null);
  };

  // Render different report types
  const renderReport = () => {
    switch (selectedReportType) {
      case 'spending':
        return <PurchaseSpendingReport data={mockPurchaseSpendingData} isClient={isClient} />;
      case 'supplier':
        return <SupplierPerformanceReport data={filteredSupplierData} isClient={isClient} />;
      case 'order':
        return <PurchaseOrderStatusReport data={filteredOrderStatusData} isClient={isClient} />;
      case 'price':
        return <PriceVarianceReport data={mockPriceVarianceData} isClient={isClient} />;
      case 'budget':
        return <PurchaseBudgetReport data={mockPurchaseBudgetData} isClient={isClient} />;
      default:
        return <Text>Please select a report type</Text>;
    }
  };

  return (
    <Box className="space-y-4">
      <PageHeading 
        title="Purchasing Reports" 
        description="View and analyze purchasing data" 
      />

      {/* Report Configuration */}
      <Card size="3">
        <Flex direction="column" gap="2">
          <Flex justify="between" align="center" wrap={{ initial: 'wrap', sm: 'nowrap' }} gap="3">
            <Flex direction="column" gap="1">
              <Text weight="medium" size="2">Report Type</Text>
              <Select.Root 
                value={selectedReportType} 
                onValueChange={setSelectedReportType}
              >
                <Select.Trigger />
                <Select.Content>
                  {reportTypes.map((type) => (
                    <Select.Item key={type.id} value={type.id}>
                      {type.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Flex>

            <Flex direction="column" gap="1" style={{ flexGrow: 1, maxWidth: '300px' }}>
              <Text weight="medium" size="2">Date Range</Text>
              <DateRangeInput 
                value={dateRange} 
                onChange={setDateRange}
              />
            </Flex>

            <Flex gap="2" ml={{ md: 'auto' }}>
              <Button 
                variant="soft"
                color={showFilters ? "orange" : "gray"}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
                Filters
                <ChevronDown size={16} className={showFilters ? "rotate-180" : ""} />
              </Button>
              
              <Button 
                onClick={generateReport} 
                disabled={isGenerating}
                color="green"
              >
                {isGenerating ? <RefreshCw size={16} className="animate-spin" /> : null}
                Generate Report
              </Button>
            </Flex>
          </Flex>

          {/* Filters Section */}
          {showFilters && (
            <Box mt="2" py="3" className="border-t border-slate-200 dark:border-neutral-800" >
              <Flex direction={{ initial: 'column', md: 'row' }} gap="4" align={{ md: 'center' }}>
                {['spending', 'supplier', 'price'].includes(selectedReportType) && (
                  <Flex align="center" gap="2">
                    <Text size="2">Filter by supplier category:</Text>
                    <Select.Root 
                      value={selectedCategory || ""} 
                      onValueChange={setSelectedCategory}
                    >
                      <Select.Trigger placeholder="Select Category" />
                      <Select.Content>
                        {supplierCategories.map((category) => (
                          <Select.Item key={category.id} value={category.id}>
                            {category.name}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </Flex>
                )}
                
                {['order'].includes(selectedReportType) && (
                  <Flex align="center" gap="2">
                    <Text size="2">Filter by branch:</Text>
                    <Select.Root
                      value={selectedBranch || ""} 
                      onValueChange={setSelectedBranch}
                    >
                      <Select.Trigger placeholder="Select Branch" />
                      <Select.Content>
                        {branches.map((branch) => (
                          <Select.Item key={branch.id} value={branch.id}>
                            {branch.name}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </Flex>
                )}
                
                <Button variant="soft" color={selectedCategory || selectedBranch ? "red" : "gray"} onClick={clearFilters}>
                  <RotateCcw size={16} />
                  Clear All Filters
                </Button>
              </Flex>
            </Box>
          )}
        </Flex>
      </Card>

      {/* Export Options */}
      <Flex justify="end" gap="2">
        <Button variant="soft" color="gray" size="1" onClick={exportToSpreadsheet}>
          <FileSpreadsheet size={16} />
          Export to Spreadsheet
        </Button>
        <Button variant="soft" color="gray" size="1" onClick={exportToPDF}>
          <FileText size={16} />
          Export to PDF
        </Button>
      </Flex>
      
      {/* Report Content */}
      {renderReport()}
    </Box>
  );
}

export default function PurchasingReportsPage() {
  return (
    <FilterBranchProvider>
      <PurchasingReportsContent />
    </FilterBranchProvider>
  );
}
