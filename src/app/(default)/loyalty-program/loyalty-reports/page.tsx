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
import MemberActivityReport from '@/components/loyalty-program/reports/MemberActivityReport';
import PointTransactionsReport from '@/components/loyalty-program/reports/PointTransactionsReport';
import RewardsRedemptionReport from '@/components/loyalty-program/reports/RewardsRedemptionReport';
import TierAnalysisReport from '@/components/loyalty-program/reports/TierAnalysisReport';
import ConversionReport from '@/components/loyalty-program/reports/ConversionReport';
import { PageHeading } from '@/components/common/PageHeading';
import { usePageTitle } from '@/hooks/usePageTitle';

// Report types
const reportTypes = [
  { id: 'member-activity', name: 'Member Activity' },
  { id: 'point-transactions', name: 'Point Transactions' },
  { id: 'rewards-redemption', name: 'Rewards Redemption' },
  { id: 'tier-analysis', name: 'Tier Analysis' },
  { id: 'conversion', name: 'Member Conversion' },
];

// Member tiers
const memberTiers = [
  { id: 'bronze', name: 'Bronze' },
  { id: 'silver', name: 'Silver' },
  { id: 'gold', name: 'Gold' },
  { id: 'platinum', name: 'Platinum' },
];

const branches = organization.filter(org => org.id !== 'hq');

// Mock data for member activity
const mockMemberActivityData = [
  { id: '1', period: 'Jan 2025', newSignups: 45, activeMembers: 320, inactiveMembers: 80, totalMembers: 400, engagementRate: 80.7, growth: 12.5 },
  { id: '2', period: 'Feb 2025', newSignups: 38, activeMembers: 345, inactiveMembers: 85, totalMembers: 430, engagementRate: 76.2, growth: 7.5 },
  { id: '3', period: 'Mar 2025', newSignups: 52, activeMembers: 380, inactiveMembers: 92, totalMembers: 472, engagementRate: 60.5, growth: 9.8 },
  { id: '4', period: 'Apr 2025', newSignups: 41, activeMembers: 410, inactiveMembers: 98, totalMembers: 508, engagementRate: 75.7, growth: 7.6 },
  { id: '5', period: 'May 2025', newSignups: 49, activeMembers: 445, inactiveMembers: 105, totalMembers: 550, engagementRate: 80.9, growth: 8.3 },
  { id: '6', period: 'Jun 2025', newSignups: 56, activeMembers: 487, inactiveMembers: 108, totalMembers: 595, engagementRate: 85.8, growth: 8.2 },
];

// Mock data for point transactions
const mockPointTransactionsData = branches.flatMap(branch => {
  return [
    { 
      id: `${branch.id}-1`, 
      period: 'Jan 2025', 
      pointsEarned: Math.floor(Math.random() * 50000) + 20000, 
      pointsRedeemed: Math.floor(Math.random() * 20000) + 5000, 
      netPoints: 0, // Will be calculated
      transactionCount: Math.floor(Math.random() * 500) + 200,
      averagePointsPerTransaction: 0, // Will be calculated
      branchId: branch.id,
      branchName: branch.name
    },
    { 
      id: `${branch.id}-2`, 
      period: 'Feb 2025', 
      pointsEarned: Math.floor(Math.random() * 52000) + 22000, 
      pointsRedeemed: Math.floor(Math.random() * 21000) + 6000, 
      netPoints: 0, // Will be calculated
      transactionCount: Math.floor(Math.random() * 520) + 210,
      averagePointsPerTransaction: 0, // Will be calculated
      branchId: branch.id,
      branchName: branch.name
    },
    { 
      id: `${branch.id}-3`, 
      period: 'Mar 2025', 
      pointsEarned: Math.floor(Math.random() * 55000) + 25000, 
      pointsRedeemed: Math.floor(Math.random() * 22000) + 7000, 
      netPoints: 0, // Will be calculated
      transactionCount: Math.floor(Math.random() * 540) + 220,
      averagePointsPerTransaction: 0, // Will be calculated
      branchId: branch.id,
      branchName: branch.name
    },
    { 
      id: `${branch.id}-4`, 
      period: 'Apr 2025', 
      pointsEarned: Math.floor(Math.random() * 58000) + 28000, 
      pointsRedeemed: Math.floor(Math.random() * 23000) + 7500, 
      netPoints: 0, // Will be calculated
      transactionCount: Math.floor(Math.random() * 560) + 230,
      averagePointsPerTransaction: 0, // Will be calculated
      branchId: branch.id,
      branchName: branch.name
    },
    { 
      id: `${branch.id}-5`, 
      period: 'May 2025', 
      pointsEarned: Math.floor(Math.random() * 60000) + 30000, 
      pointsRedeemed: Math.floor(Math.random() * 24000) + 8000, 
      netPoints: 0, // Will be calculated
      transactionCount: Math.floor(Math.random() * 580) + 240,
      averagePointsPerTransaction: 0, // Will be calculated
      branchId: branch.id,
      branchName: branch.name
    },
    { 
      id: `${branch.id}-6`, 
      period: 'Jun 2025', 
      pointsEarned: Math.floor(Math.random() * 62000) + 32000, 
      pointsRedeemed: Math.floor(Math.random() * 25000) + 8500, 
      netPoints: 0, // Will be calculated
      transactionCount: Math.floor(Math.random() * 600) + 250,
      averagePointsPerTransaction: 0, // Will be calculated
      branchId: branch.id,
      branchName: branch.name
    },
  ];
}).map(item => ({
  ...item,
  netPoints: item.pointsEarned - item.pointsRedeemed,
  averagePointsPerTransaction: Math.round(item.pointsEarned / item.transactionCount)
}));

// Mock data for rewards redemption
const mockRewardsRedemptionData = [
  { id: '1', rewardName: 'Free Appetizer', rewardType: 'Food Item', pointsRequired: 500, redemptionCount: 124, totalPointsSpent: 62000, popularityScore: 85, memberSatisfaction: 4.2 },
  { id: '2', rewardName: 'Free Dessert', rewardType: 'Food Item', pointsRequired: 400, redemptionCount: 187, totalPointsSpent: 74800, popularityScore: 92, memberSatisfaction: 4.5 },
  { id: '3', rewardName: '10% Off Total Bill', rewardType: 'Discount', pointsRequired: 750, redemptionCount: 98, totalPointsSpent: 73500, popularityScore: 78, memberSatisfaction: 4.0 },
  { id: '4', rewardName: 'Free Beverage', rewardType: 'Drink Item', pointsRequired: 300, redemptionCount: 215, totalPointsSpent: 64500, popularityScore: 90, memberSatisfaction: 4.3 },
  { id: '5', rewardName: 'BOGO Main Course', rewardType: 'Promotion', pointsRequired: 1200, redemptionCount: 56, totalPointsSpent: 67200, popularityScore: 75, memberSatisfaction: 4.7 },
  { id: '6', rewardName: 'VIP Seating', rewardType: 'Experience', pointsRequired: 350, redemptionCount: 42, totalPointsSpent: 14700, popularityScore: 62, memberSatisfaction: 3.9 },
];

// Mock data for tier analysis
const mockTierAnalysisData = [
  { id: '1', tierName: 'Bronze', memberCount: 320, percentOfTotal: 58, averageSpend: 45.75, averageVisits: 1.2, retentionRate: 65, upgradePotential: 85 },
  { id: '2', tierName: 'Silver', memberCount: 180, percentOfTotal: 32, averageSpend: 72.50, averageVisits: 2.5, retentionRate: 78, upgradePotential: 62 },
  { id: '3', tierName: 'Gold', memberCount: 45, percentOfTotal: 8, averageSpend: 120.25, averageVisits: 4.2, retentionRate: 88, upgradePotential: 35 },
  { id: '4', tierName: 'Platinum', memberCount: 12, percentOfTotal: 2, averageSpend: 220.80, averageVisits: 8.0, retentionRate: 95, upgradePotential: 0 },
];

// Mock data for conversion
const mockConversionData = [
  { id: '1', period: 'Jan 2025', memberTransactions: 420, nonMemberTransactions: 850, memberRevenue: 26250, nonMemberRevenue: 38250, memberAverageTicket: 62.50, nonMemberAverageTicket: 45.00, conversionRate: 38.9 },
  { id: '2', period: 'Feb 2025', memberTransactions: 455, nonMemberTransactions: 810, memberRevenue: 29575, nonMemberRevenue: 37260, memberAverageTicket: 65.00, nonMemberAverageTicket: 46.00, conversionRate: 42.7 },
  { id: '3', period: 'Mar 2025', memberTransactions: 512, nonMemberTransactions: 790, memberRevenue: 35840, nonMemberRevenue: 37130, memberAverageTicket: 70.00, nonMemberAverageTicket: 47.00, conversionRate: 49.1 },
  { id: '4', period: 'Apr 2025', memberTransactions: 575, nonMemberTransactions: 760, memberRevenue: 42375, nonMemberRevenue: 36480, memberAverageTicket: 73.70, nonMemberAverageTicket: 48.00, conversionRate: 53.7 },
  { id: '5', period: 'May 2025', memberTransactions: 620, nonMemberTransactions: 740, memberRevenue: 48360, nonMemberRevenue: 36260, memberAverageTicket: 78.00, nonMemberAverageTicket: 49.00, conversionRate: 57.2 },
  { id: '6', period: 'Jun 2025', memberTransactions: 685, nonMemberTransactions: 715, memberRevenue: 54800, nonMemberRevenue: 35750, memberAverageTicket: 80.00, nonMemberAverageTicket: 50.00, conversionRate: 60.5 },
];

function LoyaltyReportsContent() {
  usePageTitle('Loyalty Reports');
  const [isClient, setIsClient] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('member-activity'); // Default report type
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
    endDate: new Date(),
    key: 'selection'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
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

  // Filter point transactions data by branch if needed
  const filteredPointTransactionsData = mockPointTransactionsData
    .filter(transaction => !selectedBranch || transaction.branchId === selectedBranch);

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
    setSelectedTier(null);
    setSelectedBranch(null);
  };

  // Render different report types
  const renderReport = () => {
    switch (selectedReportType) {
      case 'member-activity':
        return <MemberActivityReport data={mockMemberActivityData} isClient={isClient} />;
      case 'point-transactions':
        return <PointTransactionsReport data={filteredPointTransactionsData} isClient={isClient} />;
      case 'rewards-redemption':
        return <RewardsRedemptionReport data={mockRewardsRedemptionData} isClient={isClient} />;
      case 'tier-analysis':
        return <TierAnalysisReport data={mockTierAnalysisData} isClient={isClient} />;
      case 'conversion':
        return <ConversionReport data={mockConversionData} isClient={isClient} />;
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
        <PageHeading
          title="Loyalty Reports"
          description="View and analyze loyalty program performance"
          noMarginBottom
        />
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
            <Box mt="2" py="3" className="border-t border-slate-200 dark:border-neutral-800" >
              <Flex direction={{ initial: 'column', md: 'row' }} gap="4" align={{ md: 'center' }}>
                {(selectedReportType === 'tier-analysis' || selectedReportType === 'member-activity') && (
                  <Flex align="center" gap="2">
                    <Text size="2">Filter by tier:</Text>
                    <Select.Root 
                      value={selectedTier || ""} 
                      onValueChange={setSelectedTier}
                    >
                      <Select.Trigger placeholder="Select Tier" />
                      <Select.Content>
                        {memberTiers.map((tier) => (
                          <Select.Item key={tier.id} value={tier.id}>
                            {tier.name}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </Flex>
                )}
                
                {(selectedReportType === 'point-transactions' || selectedReportType === 'rewards-redemption' || selectedReportType === 'conversion') && (
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
                
                <Button variant="soft" color={selectedTier || selectedBranch ? "red" : "gray"} onClick={clearFilters}>
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

export default function LoyaltyReportsPage() {
  return (
    <FilterBranchProvider>
      <LoyaltyReportsContent />
    </FilterBranchProvider>
  );
}
