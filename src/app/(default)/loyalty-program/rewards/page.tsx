"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Box,
  Flex,
  TextField,
  Button,
  Select,
  Table,
  Avatar,
  Text,
  Badge,
  IconButton,
} from "@radix-ui/themes";
import { Search, Plus, ImageIcon, RefreshCcw, Edit, Trash2 } from "lucide-react";
import { mockLoyaltyRewards } from '@/data/LoyaltyRewardsData';
import { RewardStatus } from '@/types/loyalty';
import { organization } from '@/data/CommonData';
import { membershipTiers } from '@/data/LoyaltyData';
import format from 'date-fns/format';
import Pagination from '@/components/common/Pagination';
import { useRouter } from 'next/navigation';
import { PageHeading } from '@/components/common/PageHeading';
import { usePageTitle } from '@/hooks/usePageTitle';
import { SortableHeader } from '@/components/common/SortableHeader';

const branches = organization.filter(org => org.id !== 'hq');

const formatDateRange = (start?: Date, end?: Date): string => {
  if (!start && !end) return "Always Active";
  const startDate = start ? format(start, "MMM dd, yyyy") : "From start";
  const endDate = end ? format(end, "MMM dd, yyyy") : "Ongoing";
  if (start && end && format(start, 'yyyyMMdd') === format(end, 'yyyyMMdd')) {
    return format(start, "MMM dd, yyyy");
  }
  return `${startDate} - ${endDate}`;
};

const formatBranchScope = (scope: 'All' | string[]): string => {
  if (scope === 'All') return "All Branches";
  if (Array.isArray(scope)) {
    if (scope.length === 0) return "No Branches";
    if (scope.length === 1) {
       const branch = branches.find(b => b.id === scope[0]);
       return branch ? branch.name : scope[0];
    }
    return `${scope.length} Branches`; // Consider showing names in a tooltip if needed
  }
  return "Unknown";
};

const getStatusColor = (status: RewardStatus): React.ComponentProps<typeof Badge>['color'] => {
  switch (status) {
    case 'Active': return 'green';
    case 'Inactive': return 'orange';
    case 'Expired': return 'gray';
    case 'Draft': return 'blue';
    default: return 'gray';
  }
};

export default function RewardsPage() {
  usePageTitle('Loyalty Rewards');
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all'); // 'all', 'Active', 'Inactive', 'Expired', 'Draft'
  const [typeFilter, setTypeFilter] = useState<string>('all'); // 'all', 'Free Item', '% Discount', 'Cashback'
  const [branchFilter, setBranchFilter] = useState<string>('all'); // 'all', specific branch id
  const [tierFilter, setTierFilter] = useState<string>('all'); // 'all', specific tier id
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page

  const rewards = mockLoyaltyRewards;

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredRewards = useMemo(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
    let filtered = rewards.filter(reward => {
      const matchesSearch = reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (reward.description && reward.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || reward.status === statusFilter;
      const matchesType = typeFilter === 'all' || reward.type === typeFilter;
      const matchesBranch = branchFilter === 'all' ||
                          reward.branchScope === 'All' ||
                          (Array.isArray(reward.branchScope) && reward.branchScope.includes(branchFilter));
      const matchesTier = tierFilter === 'all' || reward.applicableTiers.includes(tierFilter);

      return matchesSearch && matchesStatus && matchesType && matchesBranch && matchesTier;
    });

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortConfig.key) {
          case 'name':
            aValue = a.name;
            bValue = b.name;
            break;
          case 'type':
            aValue = a.type;
            bValue = b.type;
            break;
          case 'points':
            aValue = a.pointsRequired;
            bValue = b.pointsRequired;
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          case 'validity':
            aValue = a.validityStartDate ? new Date(a.validityStartDate).getTime() : 0;
            bValue = b.validityStartDate ? new Date(b.validityStartDate).getTime() : 0;
            break;
          case 'branchScope':
            aValue = Array.isArray(a.branchScope) ? a.branchScope.length : 0;
            bValue = Array.isArray(b.branchScope) ? b.branchScope.length : 0;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [rewards, searchTerm, statusFilter, typeFilter, branchFilter, tierFilter, sortConfig]);

  // Pagination Calculations
  const totalItems = filteredRewards.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRewards = filteredRewards.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to page 1 when items per page changes
  };

  const handleDisable = (rewardId: string) => {
    console.log(`Disabling reward ${rewardId}`);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setBranchFilter('all');
    setTierFilter('all');
  };

  const handleEditReward = (rewardId: string) => {
    router.push(`/loyalty-program/rewards/edit/${rewardId}`);
  };

  return (
    <Box className="space-y-4">
      {/* Filters and Search */}
      <Flex direction="column" gap="5" mb="5">
        <Flex 
          direction={{ initial: "column", sm: "row" }} 
          justify="between" 
          align={{ initial: "stretch", sm: "center" }}
          gap={{ initial: "4", sm: "0" }}
        >
          <PageHeading title="Rewards Management" description="Manage and track your loyalty program rewards" noMarginBottom />
          <Box width={{ initial: "full", sm: "auto" }}>
            <Link href="/loyalty-program/rewards/add">
              <Button>
                <Plus size={16}/> Add New Reward
              </Button>
            </Link>
          </Box>
        </Flex>
        <Flex gap="3" align="end" wrap="wrap">
          <Box style={{ flexGrow: '1' }}>
            <TextField.Root
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            >
              <TextField.Slot>
                <Search size={16} />
              </TextField.Slot>
            </TextField.Root>
          </Box>
          <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
            <Select.Trigger placeholder="Filter by status..." />
            <Select.Content>
              <Select.Item value="all">All Statuses</Select.Item>
              <Select.Item value="Active">Active</Select.Item>
              <Select.Item value="Inactive">Inactive</Select.Item>
              <Select.Item value="Expired">Expired</Select.Item>
              <Select.Item value="Draft">Draft</Select.Item>
            </Select.Content>
          </Select.Root>
          <Select.Root value={typeFilter} onValueChange={setTypeFilter}>
            <Select.Trigger placeholder="Filter by type..." />
            <Select.Content>
              <Select.Item value="all">All Types</Select.Item>
              <Select.Item value="Free Item">Free Item</Select.Item>
              <Select.Item value="% Discount">% Discount</Select.Item>
              <Select.Item value="Cashback">Cashback</Select.Item>
            </Select.Content>
          </Select.Root>
          <Select.Root value={branchFilter} onValueChange={setBranchFilter}>
            <Select.Trigger placeholder="Filter by branch..." />
            <Select.Content>
              <Select.Item value="all">All Branches</Select.Item>
              {branches.map(branch => (
                  <Select.Item key={branch.id} value={branch.id}>{branch.name}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          <Select.Root value={tierFilter} onValueChange={setTierFilter}>
            <Select.Trigger placeholder="Filter by tier..." />
            <Select.Content>
              <Select.Item value="all">All Tiers</Select.Item>
              {membershipTiers.map(tier => (
                  <Select.Item key={tier.id} value={tier.id}>{tier.name}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          <Button 
            variant="soft" 
            color={(statusFilter !== 'all' || typeFilter !== 'all' || branchFilter !== 'all' || tierFilter !== 'all' || searchTerm !== '') ? 'red' : 'gray'} 
            onClick={resetFilters} 
            disabled={(statusFilter === 'all' && typeFilter === 'all' && branchFilter === 'all' && tierFilter === 'all' && searchTerm === '')}
          >
            <RefreshCcw size={16} />
            Reset Filters
          </Button>
        </Flex>
      </Flex>

      {/* Rewards Table */}
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Reward"
                sortKey="name"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Type"
                sortKey="type"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Points"
                sortKey="points"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Status"
                sortKey="status"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Validity"
                sortKey="validity"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Branch Scope"
                sortKey="branchScope"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {paginatedRewards.map((reward) => (
            <Table.Row key={reward.id} className="align-middle cursor-pointer hover:bg-slate-50 dark:hover:bg-neutral-800" onClick={() => handleEditReward(reward.id)}>
              <Table.Cell>
                <Flex gap="3" align="center">
                  {reward.imageUrl ? (
                    <Avatar src={reward.imageUrl} fallback={reward.name.charAt(0)} size="3" radius="small" />
                  ) : (
                    <Flex align="center" justify="center" className="w-10 h-10 rounded bg-gray-100 dark:bg-neutral-800">
                      <ImageIcon size={18} className="text-slate-400 dark:text-neutral-500" />
                    </Flex>
                  )}
                  <Box>
                    <Text as="div" size="2" weight="bold">
                      {reward.name}
                    </Text>
                    <Text as="div" size="1" color="gray" truncate>
                      {reward.description}
                    </Text>
                  </Box>
                </Flex>
              </Table.Cell>
              <Table.Cell>{reward.type}</Table.Cell>
              <Table.Cell>{reward.pointsRequired}</Table.Cell>
              <Table.Cell>
                <Badge color={getStatusColor(reward.status)}>{reward.status}</Badge>
              </Table.Cell>
              <Table.Cell>
                {formatDateRange(reward.validityStartDate, reward.validityEndDate)}
              </Table.Cell>
              <Table.Cell>
                {formatBranchScope(reward.branchScope)}
              </Table.Cell>
              <Table.Cell>
                <Flex gap="3">
                  <IconButton 
                    variant="ghost" 
                    size="1"
                    color="gray"
                    onClick={(e) => {e.stopPropagation(); handleEditReward(reward.id)}}
                  >
                    <Edit size={14} />
                  </IconButton>
                  <IconButton 
                      variant="ghost" 
                      color="red" 
                      size="1" 
                      onClick={(e) => {e.stopPropagation(); handleDisable(reward.id)}}
                      disabled={reward.status === 'Inactive' || reward.status === 'Expired'}
                    >
                      <Trash2 size={14} />
                    </IconButton>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
           {filteredRewards.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={7} align="center">
                <Text className="text-slate-500 dark:text-neutral-600" size="2">No rewards found matching your criteria.</Text>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>

       {/* Pagination Component */}
       { totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
       )}
    </Box>
  );
}
