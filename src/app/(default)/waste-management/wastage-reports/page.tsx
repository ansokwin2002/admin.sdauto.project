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

// Import report components
import WastageSummaryReport from '@/components/waste-management/reports/WastageSummaryReport';
import WastageDetailsReport from '@/components/waste-management/reports/WastageDetailsReport';
import WastageCausesReport from '@/components/waste-management/reports/WastageCausesReport';
import WastageCostReport from '@/components/waste-management/reports/WastageCostReport';

// Import data sources
import { menuItems } from '@/data/MenuData';
import { ingredientItems } from '@/data/IngredientItemsData';

function WastageReportsContent() {
  usePageTitle('Wastage Reports');
  const [selectedReportType, setSelectedReportType] = useState('summary');
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

  // Report types
  const reportTypes = [
    { id: 'summary', name: 'Wastage Summary Report' },
    { id: 'details', name: 'Wastage Details Report' },
    { id: 'causes', name: 'Wastage Causes Analysis' },
    { id: 'cost', name: 'Wastage Cost Analysis' },
  ];

  // Set branch filter based on current branch context
  useEffect(() => {
    if (activeBranchFilter && activeBranchFilter.id !== 'hq') {
      setSelectedBranch(activeBranchFilter.id);
    }
  }, [activeBranchFilter]);

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

  const branches = organization.filter(org => org.id !== 'hq');

  // Mock wastage categories
  const wastageCategories = [
    { id: 'expired', name: 'Expired Food' },
    { id: 'spoiled', name: 'Spoiled/Damaged' },
    { id: 'overproduction', name: 'Overproduction' },
    { id: 'preparation', name: 'Preparation Loss' },
    { id: 'returned', name: 'Customer Returns' },
  ];

  // Mock data for Summary Report
  const mockSummaryData = wastageCategories.map((category) => {
    // Generate random value between $500 and $2500
    const value = Math.floor(Math.random() * 2000) + 500;
    
    // Generate random quantity between 20 and 150 kg
    const quantity = Math.floor(Math.random() * 130) + 20;
    
    // Generate random percentage of total waste (will be normalized later)
    const percentage = Math.floor(Math.random() * 30) + 5;
    
    // Generate random growth rate between -15% and 25%
    const growth = parseFloat((Math.random() * 40 - 15).toFixed(1));
    
    return {
      id: category.id,
      name: category.name,
      quantity,
      value,
      percentage,
      growth
    };
  });

  // Normalize percentages to sum to 100%
  const totalPercentage = mockSummaryData.reduce((sum, cat) => sum + cat.percentage, 0);
  mockSummaryData.forEach(cat => {
    cat.percentage = (cat.percentage / totalPercentage) * 100;
  });

  // Mock data for Details Report
  const wasteReasons = [
    'Expired', 'Spoiled', 'Preparation Error', 'Overproduction', 
    'Power Outage', 'Equipment Failure', 'Contamination', 'Customer Return'
  ];

  // Combine menu items and ingredient items for waste data sources
  const allItems = [
    ...menuItems.map(item => ({ id: `menu-${item.id}`, name: item.name, isMenu: true, category: item.category })),
    ...ingredientItems.map(item => ({ id: `ing-${item.id}`, name: item.name, isMenu: false, category: item.category }))
  ];

  const mockDetailsData = [];
  for (let i = 0; i < 35; i++) {
    // 60% chance of wasting a menu item, 40% chance of wasting an ingredient
    const isMenuWaste = Math.random() > 0.4;
    
    // Select a random item from either menu or ingredients
    const itemsPool = isMenuWaste 
      ? allItems.filter(item => item.isMenu)
      : allItems.filter(item => !item.isMenu);
    
    const randomItemIndex = Math.floor(Math.random() * itemsPool.length);
    const selectedItem = itemsPool[randomItemIndex];
    
    const categoryIndex = Math.floor(Math.random() * wastageCategories.length);
    const category = wastageCategories[categoryIndex];
    const reasonIndex = Math.floor(Math.random() * wasteReasons.length);
    const reason = wasteReasons[reasonIndex];
    const quantity = Math.floor(Math.random() * 20) + 1;
    const value = Math.floor(Math.random() * 150) + 20;
    const branchIndex = Math.floor(Math.random() * branches.length);
    const branch = branches[branchIndex];
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    mockDetailsData.push({
      id: `waste-${i}`,
      itemName: selectedItem.name,
      category: category.id,
      categoryName: category.name,
      quantity,
      value,
      date,
      reason,
      branch: branch.name,
      branchId: branch.id,
      action: ['Discarded', 'Composted', 'Donated', 'Used for Staff Meal'][Math.floor(Math.random() * 4)],
      unit: ['kg', 'liters', 'units'][Math.floor(Math.random() * 3)],
      preventable: Math.random() > 0.4, // 60% of waste is preventable
      isMenuItem: selectedItem.isMenu,
      originalCategory: selectedItem.category
    });
  }

  // Filter details data based on selected filters
  const filteredDetailsData = mockDetailsData
    .filter(item => !selectedCategory || item.category === selectedCategory)
    .filter(item => !selectedBranch || item.branchId === selectedBranch);

  // Mock data for Causes Report
  const wasteCauses = [
    'Improper Storage', 'Overstocking', 'Order Forecasting Errors', 
    'Poor Rotation Practices', 'Equipment Failure', 'Staff Training Issues',
    'Quality Control Problems', 'Menu Planning Issues'
  ];

  const mockCausesData = wasteCauses.map((cause, index) => {
    // Generate random count of incidents
    const count = Math.floor(Math.random() * 40) + 5;
    
    // Generate random value of waste
    const value = (Math.floor(Math.random() * 1500) + 300);
    
    // Generate random impact score (1-10)
    const impact = Math.floor(Math.random() * 10) + 1;
    
    // Generate random trend (-20% to +20%)
    const trend = parseFloat((Math.random() * 40 - 20).toFixed(1));
    
    // Generate primary category
    const primaryCategory = wastageCategories[Math.floor(Math.random() * wastageCategories.length)].name;
    
    // Generate 2-3 recommended actions
    const actions = [
      'Staff training',
      'Improve inventory management',
      'Adjust order quantities',
      'Implement better storage protocols',
      'Regular equipment maintenance',
      'Revise menu planning',
      'Improve forecasting methods',
      'Better quality control'
    ];
    
    const shuffled = [...actions].sort(() => 0.5 - Math.random());
    const selectedActions = shuffled.slice(0, Math.floor(Math.random() * 2) + 2);
    
    return {
      id: `cause-${index}`,
      cause,
      count,
      value,
      preventable: Math.random() > 0.25, // 75% of causes are preventable
      impact,
      trend,
      primaryCategory,
      actions: selectedActions
    };
  });

  // Mock data for Trends Report
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const lastSixMonths = months.slice(currentMonth - 5 >= 0 ? currentMonth - 5 : currentMonth + 7, currentMonth + 1);
  
  // Time series data
  const mockTimeData = [];
  lastSixMonths.forEach((month, index) => {
    // Generate base value with slight upward trend
    const baseValue = 5000 + (index * 200) + (Math.random() * 1000 - 500);
    
    // Add seasonal variation
    const value = Math.round(baseValue * (1 + Math.sin(index) * 0.1));
    
    // Generate incidents count
    const incidents = Math.floor(value / 100) + Math.floor(Math.random() * 10);
    
    // Calculate change from previous period
    const previousValue = index > 0 ? mockTimeData[index - 1].value : value * 0.9;
    const change = previousValue ? ((value - previousValue) / previousValue) * 100 : 0;
    
    mockTimeData.push({
      period: month,
      value,
      quantity: Math.floor(value / 10),
      change: parseFloat(change.toFixed(1)),
      incidents
    });
  });

  // Mock data for Cost Report
  const mockCostData = wastageCategories.map((category) => {
    // Generate current month's cost
    const currentCost = parseFloat((Math.random() * 1500 + 500).toFixed(2));
    
    // Generate previous month cost with variation
    const previousCost = parseFloat((currentCost * (Math.random() * 0.4 + 0.8)).toFixed(2));
    
    // Calculate change
    const costChange = parseFloat(((currentCost - previousCost) / previousCost * 100).toFixed(1));
    
    // Generate forecast for next month
    const forecastCost = parseFloat((currentCost * (Math.random() * 0.3 + 0.9)).toFixed(2));
    
    // Calculate forecast change
    const forecastChange = parseFloat(((forecastCost - currentCost) / currentCost * 100).toFixed(1));
    
    // Generate percent of revenue
    const percentOfRevenue = parseFloat((Math.random() * 2 + 0.2).toFixed(1));
    
    // Generate cost metrics
    const costPerIncident = parseFloat((Math.random() * 100 + 20).toFixed(2));
    const costPerKg = parseFloat((Math.random() * 15 + 5).toFixed(2));
    
    return {
      id: category.id,
      category: category.name,
      currentCost,
      previousCost,
      costChange,
      forecastCost,
      forecastChange,
      percentOfRevenue,
      costPerIncident,
      costPerKg
    };
  });
  
  // Monthly cost data for trends
  const mockMonthlyCostData = [
    { month: months[0], value: 5200, percentOfRevenue: 3.1, revenue: 167000 },
    { month: months[1], value: 5800, percentOfRevenue: 3.4, revenue: 170000 },
    { month: months[2], value: 6400, percentOfRevenue: 3.8, revenue: 168000 },
    { month: months[3], value: 5900, percentOfRevenue: 3.5, revenue: 171000 },
    { month: months[4], value: 6100, percentOfRevenue: 3.3, revenue: 185000 },
    { month: months[5], value: 5600, percentOfRevenue: 2.9, revenue: 193000 }
  ];

  // Render different report types
  const renderReport = () => {
    switch (selectedReportType) {
      case 'summary':
        return <WastageSummaryReport data={mockSummaryData} />;
      case 'details':
        return <WastageDetailsReport data={filteredDetailsData} />;
      case 'causes':
        return <WastageCausesReport data={mockCausesData} />;
      case 'cost':
        return <WastageCostReport data={mockCostData} monthlyCostData={mockMonthlyCostData} />;
      default:
        return <Text>Please select a report type</Text>;
    }
  };

  return (
    <Box className="space-y-4">
      <PageHeading title="Wastage Reports" description="View and analyze food waste data" />

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
                <Flex align="center" gap="2">
                  <Text size="2">Filter by category:</Text>
                  <Select.Root 
                    value={selectedCategory || ""} 
                    onValueChange={setSelectedCategory}
                  >
                    <Select.Trigger placeholder="Select Category" />
                    <Select.Content>
                      {wastageCategories.map((category) => (
                        <Select.Item key={category.id} value={category.id}>
                          {category.name}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Flex>
                
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

export default function WastageReportsPage() {
  usePageTitle('Wastage Reports');
  return (
    <FilterBranchProvider>
      <WastageReportsContent />
    </FilterBranchProvider>
  );
}
