'use client';

import { useState, useMemo } from 'react';
import { Flex, Box, Table, Text, Button, Select, TextField, Badge, IconButton } from '@radix-ui/themes';
import { Search, RefreshCcw, Edit } from 'lucide-react';
import { loyaltyMembers } from '@/data/LoyaltyData';
import { useRouter } from 'next/navigation';
import Pagination from '@/components/common/Pagination';
import { formatDate } from '@/utilities';
import Link from 'next/link';
import { SortableHeader } from '@/components/common/SortableHeader';

const ITEMS_PER_PAGE = 10;

export default function MemberList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [pointsRangeFilter, setPointsRangeFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort members with useMemo
  const filteredMembers = useMemo(() => {
    let filtered = loyaltyMembers.filter(member => {
      // Apply search term filter
      let matchesSearch = true;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const phoneDigitsOnly = member.phone.replace(/\D/g, '');
        const searchDigitsOnly = searchTerm.replace(/\D/g, '');
        
        matchesSearch = 
          member.name.toLowerCase().includes(term) ||
          member.email.toLowerCase().includes(term) ||
          member.phone.includes(searchTerm) ||
          (phoneDigitsOnly.includes(searchDigitsOnly) && searchDigitsOnly.length > 0);
      }

      // Apply status filter
      const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
      
      // Apply tier filter
      const matchesTier = tierFilter === 'all' || member.tier.name === tierFilter;

      // Apply points range filter
      let matchesPoints = true;
      if (pointsRangeFilter !== 'all') {
        switch (pointsRangeFilter) {
          case 'less500':
            matchesPoints = member.points < 500;
            break;
          case '500to1000':
            matchesPoints = member.points >= 500 && member.points < 1000;
            break;
          case '1000to2000':
            matchesPoints = member.points >= 1000 && member.points < 2000;
            break;
          case 'more2000':
            matchesPoints = member.points >= 2000;
            break;
        }
      }

      return matchesSearch && matchesTier && matchesPoints;
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
          case 'email':
            aValue = a.email;
            bValue = b.email;
            break;
          case 'phone':
            aValue = a.phone;
            bValue = b.phone;
            break;
          case 'tier':
            aValue = a.tier.name;
            bValue = b.tier.name;
            break;
          case 'points':
            aValue = a.points;
            bValue = b.points;
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          case 'joinDate':
            aValue = new Date(a.joinDate).getTime();
            bValue = new Date(b.joinDate).getTime();
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
  }, [searchTerm, tierFilter, pointsRangeFilter, sortConfig, statusFilter]);

  // Calculate pagination
  const totalItems = filteredMembers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentMembers = filteredMembers.slice(startIndex, endIndex);

  const handleViewMember = (memberId: string) => {
    router.push(`/loyalty-program/members/${memberId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTierFilter('all');
    setPointsRangeFilter('all');
  };

  return (
    <Box className="space-y-4">
      {/* Search and Filter Row */}
      <Flex gap="4" align="center" wrap="wrap">
        <Box style={{ width: '300px' }}>
          <TextField.Root
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          >
            <TextField.Slot>
              <Search size={16} />
            </TextField.Slot>
          </TextField.Root>
        </Box>

        <Flex gap="3" align="center">
          <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
            <Select.Trigger placeholder="Status" />
            <Select.Content>
              <Select.Item value="all">All Status</Select.Item>
              <Select.Item value="Active">Active</Select.Item>
              <Select.Item value="Inactive">Inactive</Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root value={tierFilter} onValueChange={setTierFilter}>
            <Select.Trigger placeholder="Tier" />
            <Select.Content>
              <Select.Item value="all">All Tiers</Select.Item>
              <Select.Item value="Bronze">Bronze</Select.Item>
              <Select.Item value="Silver">Silver</Select.Item>
              <Select.Item value="Gold">Gold</Select.Item>
              <Select.Item value="Platinum">Platinum</Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root value={pointsRangeFilter} onValueChange={setPointsRangeFilter}>
            <Select.Trigger placeholder="Points Range" />
            <Select.Content>
              <Select.Item value="all">All Points</Select.Item>
              <Select.Item value="less500">&lt; 500</Select.Item>
              <Select.Item value="500to1000">500 - 999</Select.Item>
              <Select.Item value="1000to2000">1000 - 1999</Select.Item>
              <Select.Item value="more2000">≥ 2000</Select.Item>
            </Select.Content>
          </Select.Root>

          <Button
            variant="soft"
            color={(statusFilter !== 'all' || tierFilter !== 'all' || pointsRangeFilter !== 'all' || searchTerm !== '') ? 'red' : 'gray'}
            onClick={resetFilters} disabled={(statusFilter === 'all' && tierFilter === 'all' && pointsRangeFilter === 'all' && searchTerm === '')}
          >
            <RefreshCcw size={16} />
            Reset Filters
          </Button>
        </Flex>
      </Flex>

      {/* Members Table */}
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Name"
                sortKey="name"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Email"
                sortKey="email"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Phone"
                sortKey="phone"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Tier"
                sortKey="tier"
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
                label="Join Date"
                sortKey="joinDate"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell align="center">Action</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {currentMembers.length > 0 ? (
            currentMembers.map((member) => (
              <Table.Row key={member.id} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-neutral-800" onClick={() => handleViewMember(member.id)}>
                <Table.Cell>{member.name}</Table.Cell>
                <Table.Cell>{member.email}</Table.Cell>
                <Table.Cell>{member.phone}</Table.Cell>
                <Table.Cell>
                  <Badge
                    variant="soft"
                    color={
                      member.tier.name === 'Platinum'
                        ? 'purple'
                        : member.tier.name === 'Gold'
                        ? 'yellow'
                        : member.tier.name === 'Silver'
                        ? 'gray'
                        : 'bronze'
                    }
                  >
                    {member.tier.name}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{member.points.toLocaleString()}</Table.Cell>
                <Table.Cell>
                  <Badge variant="soft" color={member.status === 'Active' ? 'green' : 'red'}>
                    {member.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{formatDate(new Date(member.joinDate))}</Table.Cell>
                <Table.Cell align="center">
                  <Link href={`/loyalty-program/members/${member.id}`}>
                    <IconButton 
                      variant="ghost" 
                      size="1"
                      color="gray"
                    >
                      <Edit size={14} />
                    </IconButton>
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={8}>
                <Text align="center" className="py-3">No members found</Text>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>

      {/* Pagination */}
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
    </Box>
  );
} 