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

// Import report components
import InventoryValueReport from '@/components/inventory/reports/InventoryValueReport';
import StockMovementReport from '@/components/inventory/reports/StockMovementReport';
import LowStockReport from '@/components/inventory/reports/LowStockReport';
import IngredientUsageReport from '@/components/inventory/reports/IngredientUsageReport';
import InventoryCostAnalysisReport from '@/components/inventory/reports/InventoryCostAnalysisReport';
import { PageHeading } from '@/components/common/PageHeading';
import { usePageTitle } from '@/hooks/usePageTitle';


// Report types
const reportTypes = [
  { id: 'value', name: 'Inventory Value Report' },
  { id: 'movement', name: 'Stock Movement Report' },
  { id: 'lowstock', name: 'Low Stock Report' },
  { id: 'usage', name: 'Ingredient Usage Report' },
  { id: 'cost', name: 'Inventory Cost Analysis' },
];

const branches = organization.filter(org => org.id !== 'hq');

// Mock ingredient categories
const ingredientCategories = [
  { id: 'meat', name: 'Meat & Poultry' },
  { id: 'dairy', name: 'Dairy' },
  { id: 'produce', name: 'Produce' },
  { id: 'dry', name: 'Dry Goods' },
  { id: 'spices', name: 'Spices & Seasonings' },
  { id: 'beverages', name: 'Beverages' },
];

// Mock ingredient items with categories
const mockIngredientItems = [
  { id: 'ing-1', name: 'Chicken Breast', category: 'meat', price: 5.99, stockQuantity: 45, unit: 'kg', reorderLevel: 15 },
  { id: 'ing-2', name: 'Ground Beef', category: 'meat', price: 4.50, stockQuantity: 28, unit: 'kg', reorderLevel: 10 },
  { id: 'ing-3', name: 'Cheddar Cheese', category: 'dairy', price: 3.75, stockQuantity: 12, unit: 'kg', reorderLevel: 8 },
  { id: 'ing-4', name: 'Milk', category: 'dairy', price: 2.29, stockQuantity: 35, unit: 'liter', reorderLevel: 12 },
  { id: 'ing-5', name: 'Tomatoes', category: 'produce', price: 2.99, stockQuantity: 18, unit: 'kg', reorderLevel: 10 },
  { id: 'ing-6', name: 'Lettuce', category: 'produce', price: 1.99, stockQuantity: 6, unit: 'kg', reorderLevel: 8 },
  { id: 'ing-7', name: 'Rice', category: 'dry', price: 1.25, stockQuantity: 52, unit: 'kg', reorderLevel: 20 },
  { id: 'ing-8', name: 'Flour', category: 'dry', price: 0.89, stockQuantity: 40, unit: 'kg', reorderLevel: 15 },
  { id: 'ing-9', name: 'Black Pepper', category: 'spices', price: 4.99, stockQuantity: 8, unit: 'kg', reorderLevel: 3 },
  { id: 'ing-10', name: 'Salt', category: 'spices', price: 0.99, stockQuantity: 15, unit: 'kg', reorderLevel: 5 },
  { id: 'ing-11', name: 'Coffee Beans', category: 'beverages', price: 12.99, stockQuantity: 22, unit: 'kg', reorderLevel: 8 },
  { id: 'ing-12', name: 'Tea Leaves', category: 'beverages', price: 7.99, stockQuantity: 5, unit: 'kg', reorderLevel: 4 },
];

// Generate inventory value data
const mockInventoryValueData = ingredientCategories.map(category => {
  const categoryItems = mockIngredientItems.filter(item => item.category === category.id);
  
  // Calculate total value and quantity for the category
  const totalValue = parseFloat(categoryItems.reduce((sum, item) => sum + (item.price * item.stockQuantity), 0).toFixed(2));
  const totalQuantity = categoryItems.reduce((sum, item) => sum + item.stockQuantity, 0);
  
  // Generate random growth rate between -15% and 25%
  const monthlyGrowth = parseFloat((Math.random() * 40 - 15).toFixed(1));
  
  // Calculate items below threshold
  const lowStockItems = categoryItems.filter(item => item.stockQuantity < item.reorderLevel).length;
  
  return {
    id: category.id,
    name: category.name,
    value: totalValue,
    quantity: totalQuantity,
    itemCount: categoryItems.length,
    growth: monthlyGrowth,
    lowStockCount: lowStockItems
  };
});

// Generate mock stock movement data
const mockStockMovementData = branches.map(branch => {
  // Generate random inbound and outbound values
  const inbound = Math.floor(Math.random() * 500) + 200;
  const outbound = Math.floor(Math.random() * 400) + 150;
  
  // Calculate net change
  const netChange = inbound - outbound;
  
  // Generate random growth rate (-10% to 20%)
  const movementGrowth = parseFloat((Math.random() * 30 - 10).toFixed(1));
  
  // Generate top moving category
  const topCategory = ingredientCategories[Math.floor(Math.random() * ingredientCategories.length)].name;
  
  return {
    id: branch.id,
    name: branch.name,
    inbound,
    outbound,
    netChange,
    growth: movementGrowth,
    topCategory
  };
});

// Generate low stock items data
const mockLowStockData = mockIngredientItems
  .filter(item => item.stockQuantity < (item.reorderLevel * 1.5))
  .map(item => ({
    ...item,
    categoryName: ingredientCategories.find(c => c.id === item.category)?.name || '',
    daysUntilStockout: Math.floor(Math.random() * 14) + 1,
    branch: branches[Math.floor(Math.random() * branches.length)].name,
    branchId: branches[Math.floor(Math.random() * branches.length)].id,
    lastOrderDate: new Date(Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000)), // Random date in last 30 days
    suggestedOrderQuantity: Math.ceil(item.reorderLevel * 1.5),
    value: parseFloat((item.price * item.stockQuantity).toFixed(2))
  }));

// Generate ingredient usage data
const mockIngredientUsageData = mockIngredientItems.map(item => {
  // Random usage numbers
  const weeklyUsage = Math.floor(Math.random() * 10) + 1;
  const monthlyUsage = weeklyUsage * (Math.random() * 1.5 + 2.5); // 3-4x weekly with some variance
  
  // Calculate variance (difference between expected and actual usage)
  const expectedUsage = monthlyUsage * 0.9; // Expected slightly lower than actual for most
  const variance = parseFloat(((monthlyUsage - expectedUsage) / expectedUsage * 100).toFixed(1));
  
  // Calculate cost
  const monthlyCost = parseFloat((monthlyUsage * item.price).toFixed(2));
  
  return {
    id: item.id,
    name: item.name,
    category: ingredientCategories.find(c => c.id === item.category)?.name || '',
    weeklyUsage: parseFloat(weeklyUsage.toFixed(2)),
    monthlyUsage: parseFloat(monthlyUsage.toFixed(2)),
    variance,
    monthlyCost,
    unit: item.unit
  };
});

// Generate cost analysis data
const mockCostAnalysisData = ingredientCategories.map(category => {
  // Calculate current month's cost
  const currentCost = parseFloat((Math.random() * 1500 + 500).toFixed(2));
  
  // Generate previous month cost with variation
  const previousCost = parseFloat((currentCost * (Math.random() * 0.4 + 0.8)).toFixed(2));
  
  // Calculate change
  const costChange = parseFloat(((currentCost - previousCost) / previousCost * 100).toFixed(1));
  
  // Generate forecast for next month
  const forecastCost = parseFloat((currentCost * (Math.random() * 0.3 + 0.9)).toFixed(2));
  
  // Calculate forecast change
  const forecastChange = parseFloat(((forecastCost - currentCost) / currentCost * 100).toFixed(1));
  
  // Calculate average item cost
  const avgItemCost = parseFloat((currentCost / (Math.floor(Math.random() * 6) + 3)).toFixed(2));
  
  return {
    id: category.id,
    name: category.name,
    currentCost,
    previousCost,
    costChange,
    forecastCost,
    forecastChange,
    avgItemCost
  };
});

function InventoryReportsContent() {
  const [isClient, setIsClient] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('value'); // Default to inventory value
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
  const filteredLowStockData = mockLowStockData
    .filter(item => !selectedCategory || item.category === selectedCategory)
    .filter(item => !selectedBranch || item.branchId === selectedBranch)
    .sort((a, b) => a.daysUntilStockout - b.daysUntilStockout);

  const filteredUsageData = mockIngredientUsageData
    .filter(item => !selectedCategory || item.category === selectedCategory)
    .sort((a, b) => b.monthlyCost - a.monthlyCost);

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
      case 'value':
        return <InventoryValueReport data={mockInventoryValueData} isClient={isClient} />;
      case 'movement':
        return <StockMovementReport data={mockStockMovementData} isClient={isClient} />;
      case 'lowstock':
        return <LowStockReport data={filteredLowStockData} isClient={isClient} />;
      case 'usage':
        return <IngredientUsageReport data={filteredUsageData} isClient={isClient} />;
      case 'cost':
        return <InventoryCostAnalysisReport data={mockCostAnalysisData} isClient={isClient} />;
      default:
        return <Text>Please select a report type</Text>;
    }
  };

  return (
    <Box className="space-y-4">
      <PageHeading title="Inventory Reports" description="View and analyze inventory data" />

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
                {['value', 'lowstock', 'usage', 'cost'].includes(selectedReportType) && (
                  <Flex align="center" gap="2">
                    <Text size="2">Filter by category:</Text>
                    <Select.Root 
                      value={selectedCategory || ""} 
                      onValueChange={setSelectedCategory}
                    >
                      <Select.Trigger placeholder="Select Category" />
                      <Select.Content>
                        {ingredientCategories.map((category) => (
                          <Select.Item key={category.id} value={category.id}>
                            {category.name}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </Flex>
                )}
                
                {['movement', 'lowstock'].includes(selectedReportType) && (
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

export default function InventoryReportsPage() {
  usePageTitle('Inventory Reports');
  return (
    <FilterBranchProvider>
      <InventoryReportsContent />
    </FilterBranchProvider>
  );
}
