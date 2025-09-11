'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  Flex,
  Select,
  TextField,
} from '@radix-ui/themes';
import { Search, RefreshCcw } from 'lucide-react';
import { organization } from '@/data/CommonData';
import { StockTransferLog, mockTransferLogs } from '@/data/StockTransferLogData';
import StockTransferLogsTable from '@/components/inventory/StockTransferLogsTable';
import Pagination from '@/components/common/Pagination';
import { useRouter } from 'next/navigation';
import { PageHeading } from '@/components/common/PageHeading';
import { usePageTitle } from '@/hooks/usePageTitle';

const ITEMS_PER_PAGE = 10;

function StockTransferLogsContent() {
  const [allTransferLogs] = useState<StockTransferLog[]>(mockTransferLogs);
  const [filteredLogs, setFilteredLogs] = useState<StockTransferLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [originFilter, setOriginFilter] = useState<string>('all');
  const [destinationFilter, setDestinationFilter] = useState<string>('all');
  const [discrepancyFilter, setDiscrepancyFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  
  const router = useRouter();

  // Filter logs based on search, status, origin, destination, and discrepancies
  useEffect(() => {
    let result = [...allTransferLogs];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(log => 
        log.transferNumber.toLowerCase().includes(term) ||
        organization.find(org => org.id === log.originId)?.name.toLowerCase().includes(term) ||
        organization.find(org => org.id === log.destinationId)?.name.toLowerCase().includes(term)
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(log => log.status === statusFilter);
    }
    
    // Filter by origin
    if (originFilter !== 'all') {
      result = result.filter(log => log.originId === originFilter);
    }
    
    // Filter by destination
    if (destinationFilter !== 'all') {
      result = result.filter(log => log.destinationId === destinationFilter);
    }
    
    // Filter by discrepancies
    if (discrepancyFilter !== 'all') {
      result = result.filter(log => 
        discrepancyFilter === 'yes' ? log.hasDiscrepancies : !log.hasDiscrepancies
      );
    }
    
    setFilteredLogs(result);
    setCurrentPage(1);
  }, [allTransferLogs, searchTerm, statusFilter, originFilter, destinationFilter, discrepancyFilter]);

  // Handle view details button click
  const handleViewDetails = (log: StockTransferLog) => {
    router.push(`/inventory/stock-transfer-logs/${log.id}`);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setOriginFilter('all');
    setDestinationFilter('all');
    setDiscrepancyFilter('all');
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredLogs.length);
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  return (
    <Box className="space-y-4">
      <Flex justify="between" align="start" mb="5">
        <PageHeading 
          title="Stock Transfer Logs" 
          description="View history of stock transfers between branches (as HQ Admin)"
          noMarginBottom
        />
      </Flex>

      <Box>
        <Box className="flex-grow min-w-[250px]">
          <TextField.Root
            placeholder="Search by transfer # or branch name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          >
            <TextField.Slot>
              <Search size={16} />
            </TextField.Slot>
          </TextField.Root>
        </Box>
        <Flex gap="4" align="center" wrap="wrap" mt="2">
          <Flex align="center" gap="1" className="flex-shrink-0">
            <Text size="2">Status:</Text>
            <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="all">All Statuses</Select.Item>
                <Select.Item value="New">New</Select.Item>
                <Select.Item value="Rejected">Rejected</Select.Item>
                <Select.Item value="Approved">Approved</Select.Item>
                <Select.Item value="Delivering">Delivering</Select.Item>
                <Select.Item value="Completed">Completed</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>

          <Flex align="center" gap="1" className="flex-shrink-0">
            <Text size="2">From:</Text>
            <Select.Root value={originFilter} onValueChange={setOriginFilter}>
              <Select.Trigger placeholder="All Origins" />
              <Select.Content>
                <Select.Item value="all">All Origins</Select.Item>
                {organization.map(org => (
                  <Select.Item key={org.id} value={org.id}>
                    {org.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>

          <Flex align="center" gap="1" className="flex-shrink-0">
            <Text size="2">To:</Text>
            <Select.Root value={destinationFilter} onValueChange={setDestinationFilter}>
              <Select.Trigger placeholder="All Destinations" />
              <Select.Content>
                <Select.Item value="all">All Destinations</Select.Item>
                {organization.map(org => (
                  <Select.Item key={org.id} value={org.id}>
                    {org.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>

          <Flex align="center" gap="1" className="flex-shrink-0">
            <Text size="2">Discrepancies:</Text>
            <Select.Root value={discrepancyFilter} onValueChange={setDiscrepancyFilter}>
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="all">All Transfers</Select.Item>
                <Select.Item value="yes">With Discrepancies</Select.Item>
                <Select.Item value="no">Without Discrepancies</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>

          <Button 
            variant="soft" 
            color={(statusFilter !== 'all' || originFilter !== 'all' || destinationFilter !== 'all' || discrepancyFilter !== 'all' || searchTerm !== '') ? 'red' : 'gray'} 
            onClick={handleResetFilters} 
            disabled={(statusFilter === 'all' && originFilter === 'all' && destinationFilter === 'all' && discrepancyFilter === 'all' && searchTerm === '')}
          >
            <RefreshCcw size={16} />
            Reset Filters
          </Button>
        </Flex>
      </Box>

      <StockTransferLogsTable
        transferLogs={paginatedLogs}
        onViewDetails={handleViewDetails}
      />

      {filteredLogs.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredLogs.length}
          startIndex={startIndex}
          endIndex={Math.min(endIndex, filteredLogs.length)}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(newSize) => {
            setItemsPerPage(newSize);
            setCurrentPage(1);
          }}
        />
      )}
    </Box>
  );
}

export default function StockTransferLogsPage() {
  usePageTitle('Stock Transfer Logs');
  return <StockTransferLogsContent />;
}
