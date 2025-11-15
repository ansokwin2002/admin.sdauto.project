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
import { menuItems } from '@/data/MenuData';
const menuCategories = [
  { id: 'starters', name: 'Starters' },
  { id: 'appetizers', name: 'Appetizers' },
  { id: 'sides', name: 'Sides' },
  { id: 'main-course', name: 'Main Course' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'beverages', name: 'Beverages' },
];
import { organization } from '@/data/CommonData';
import { PageHeading } from '@/components/common/PageHeading';
import { usePageTitle } from '@/hooks/usePageTitle'

// Import report components
import MenuSalesReport from '@/components/sales/MenuSalesReport';
import CategorySalesReport from '@/components/sales/CategorySalesReport';
import BranchSalesReport from '@/components/sales/BranchSalesReport';
import StaffSalesReport from '@/components/sales/StaffSalesReport';

// Report types
const reportTypes = [
  { id: 'menu', name: 'Sales by Menu' },
  { id: 'category', name: 'Sales by Category' },
  { id: 'branch', name: 'Sales by Branch' },
  { id: 'staff', name: 'Sales by Staff' },
];

const branches = organization.filter(org => org.id !== 'hq');

// Mock sales data for menu items
const mockMenuSalesData = menuItems.map(item => ({
  id: item.id,
  name: item.name,
  category: menuCategories.find(c => c.id === item.category)?.name || '',
  categoryId: item.category,
  sales: Math.floor(Math.random() * 200) + 50, // Random sales between 50-250
  revenue: 0, // Will be calculated
  price: item.price,
  imageUrl: item.imageUrl,
})).map(item => ({
  ...item,
  revenue: parseFloat((item.sales * item.price).toFixed(2))
}));

// Generate mock category sales data based on menu item sales
const mockCategorySalesData = menuCategories.map(category => {
  // Get all items in this category
  const categoryItems = mockMenuSalesData.filter(item => item.categoryId === category.id);
  
  // Calculate total sales and revenue for the category
  const totalSales = categoryItems.reduce((sum, item) => sum + item.sales, 0);
  const totalRevenue = parseFloat(categoryItems.reduce((sum, item) => sum + item.revenue, 0).toFixed(2));
  
  // Calculate average price
  const avgPrice = totalSales > 0 
    ? parseFloat((totalRevenue / totalSales).toFixed(2))
    : 0;
  
  // Count menu items in the category
  const itemCount = categoryItems.length;
  
  // Generate growth data (-10% to +25%)
  const growth = parseFloat((Math.random() * 35 - 10).toFixed(1));
  
  return {
    id: category.id,
    name: category.name,
    sales: totalSales,
    revenue: totalRevenue,
    avgPrice,
    itemCount,
    growth
  };
});

// Generate mock branch sales data
const mockBranchSalesData = branches.map(branch => {
  // Randomly distribute sales across branches
  const totalSales = Math.floor(Math.random() * 1000) + 500;
  const avgTicket = parseFloat((Math.random() * 30 + 15).toFixed(2));
  const totalRevenue = parseFloat((totalSales * avgTicket).toFixed(2));
  
  // Generate random customer count
  const customerCount = Math.floor(totalSales * (Math.random() * 0.3 + 0.8));
  
  // Generate growth data (-10% to +30%)
  const growth = parseFloat((Math.random() * 40 - 10).toFixed(1));
  
  // Calculate popular categories for this branch (top 2)
  const popularCategories = [...menuCategories]
    .sort(() => Math.random() - 0.5)
    .slice(0, 2)
    .map(cat => cat.name)
    .join(', ');
  
  return {
    id: branch.id,
    name: branch.name,
    sales: totalSales,
    revenue: totalRevenue,
    avgTicket,
    customerCount,
    growth,
    popularCategories
  };
});

// Generate mock staff sales data
const mockStaffData = [
  { id: 'staff-1', name: 'John Smith', position: 'Server', branch: branches[0].name, branchId: branches[0].id },
  { id: 'staff-2', name: 'Maria Garcia', position: 'Server', branch: branches[0].name, branchId: branches[0].id },
  { id: 'staff-3', name: 'Robert Chen', position: 'Server', branch: branches[1].name, branchId: branches[1].id },
  { id: 'staff-4', name: 'Sarah Johnson', position: 'Server', branch: branches[1].name, branchId: branches[1].id },
  { id: 'staff-5', name: 'David Wilson', position: 'Server', branch: branches[2].name, branchId: branches[2].id },
  { id: 'staff-6', name: 'Emily Brown', position: 'Cashier', branch: branches[0].name, branchId: branches[0].id },
  { id: 'staff-7', name: 'Michael Lee', position: 'Cashier', branch: branches[1].name, branchId: branches[1].id },
  { id: 'staff-8', name: 'Olivia Davis', position: 'Cashier', branch: branches[2].name, branchId: branches[2].id },
].map(staff => {
  // Generate random sales data
  const sales = Math.floor(Math.random() * 150) + 50;
  const avgTicket = parseFloat((Math.random() * 25 + 10).toFixed(2));
  const revenue = parseFloat((sales * avgTicket).toFixed(2));
  const customerCount = Math.floor(sales * (Math.random() * 0.3 + 0.8));
  
  // Generate top selling category
  const topSellingCategory = menuCategories[Math.floor(Math.random() * menuCategories.length)].name;
  
  // Generate performance score (1-100)
  const performanceScore = Math.floor(Math.random() * 30) + 70;
  
  return {
    ...staff,
    sales,
    revenue,
    avgTicket,
    customerCount,
    topSellingCategory,
    performanceScore
  };
});

function SalesReportsContent() {
  usePageTitle('Sales Reports')
  const [isClient, setIsClient] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('menu'); // Default to sales by menu
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

  // Filter the sales data based on selected filters
  const filteredMenuData = mockMenuSalesData
    .filter(item => !selectedCategory || menuItems.find(mi => mi.id === item.id)?.category === selectedCategory)
    .sort((a, b) => b.revenue - a.revenue);
    
  // Filter staff data by branch if needed
  const filteredStaffData = mockStaffData
    .filter(staff => !selectedBranch || staff.branchId === selectedBranch)
    .sort((a, b) => b.revenue - a.revenue);

  // Generate the report - in a real app, this would make an API call
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
      case 'menu':
        return <MenuSalesReport data={filteredMenuData} isClient={isClient} />;
      case 'category':
        return <CategorySalesReport data={mockCategorySalesData} isClient={isClient} />;
      case 'branch':
        return <BranchSalesReport data={mockBranchSalesData} isClient={isClient} />;
      case 'staff':
        return <StaffSalesReport data={filteredStaffData} isClient={isClient} />;
      default:
        return <Text>Please select a report type</Text>;
    }
  };

  return (
    <Box className="space-y-4">
      <Flex 
        direction={{ initial: "column", sm: "row" }} 
        justify="between" 
        align={{ initial: "stretch", sm: "center" }}
        gap={{ initial: "4", sm: "0" }}
        mb="5"
      >
        <PageHeading title="Sales Reports" description="View and analyze sales data" noMarginBottom/>
      </Flex>

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
            <Box mt="2" py="3" className="border-t border-slate-200 dark:border-neutral-800">
              <Flex direction={{ initial: 'column', md: 'row' }} gap="4" align={{ md: 'center' }}>
                {selectedReportType === 'menu' && (
                  <Flex align="center" gap="2">
                    <Text size="2">Filter by category:</Text>
                    <Select.Root 
                      value={selectedCategory || ""} 
                      onValueChange={setSelectedCategory}
                    >
                      <Select.Trigger placeholder="Select Category" />
                      <Select.Content>
                        {menuCategories.map((category) => (
                          <Select.Item key={category.id} value={category.id}>
                            {category.name}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </Flex>
                )}
                
                {selectedReportType !== 'branch' && (
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

export default function SalesReportsPage() {
  return (
    <FilterBranchProvider>
      <SalesReportsContent />
    </FilterBranchProvider>
  );
}
