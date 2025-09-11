'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  Flex,
  Select,
  TextField,
  Badge,
} from '@radix-ui/themes';
import { Search, RefreshCcw } from 'lucide-react';
import { organization } from '@/data/CommonData';
import { StockRequest, mockStockRequests } from '@/data/StockRequestData';
import StockTransferOutTable from '@/components/inventory/StockTransferOutTable';
import Pagination from '@/components/common/Pagination';
import { useRouter } from 'next/navigation';
import { PageHeading } from '@/components/common/PageHeading';
import { usePageTitle } from '@/hooks/usePageTitle';

const ITEMS_PER_PAGE = 10;
const RELEVANT_STATUSES = ['Approved', 'Delivering'];
const ASSUMED_ORIGIN = 'br-1';

function StockTransferOutContent() {
  const [allStockRequests] = useState<StockRequest[]>(mockStockRequests);
  const [filteredRequests, setFilteredRequests] = useState<StockRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [originFilter] = useState<string>('all');
  const [destinationFilter, setDestinationFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  const router = useRouter();

  useEffect(() => {
    let result = allStockRequests.filter(req => RELEVANT_STATUSES.includes(req.status) && req.originId === ASSUMED_ORIGIN);

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        request =>
          request.requestNumber.toLowerCase().includes(term) ||
          (organization.find(org => org.id === request.originId)?.name.toLowerCase() || '').includes(term) ||
          (organization.find(org => org.id === request.destinationId)?.name.toLowerCase() || '').includes(term)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(request => request.status === statusFilter);
    }

    if (destinationFilter !== 'all') {
      result = result.filter(request => request.destinationId === destinationFilter);
    }

    setFilteredRequests(result);
    setCurrentPage(1);
  }, [allStockRequests, searchTerm, statusFilter, originFilter, destinationFilter]);

  const handleViewClick = (request: StockRequest) => {
    router.push(`/inventory/stock-transfer-out/${request.id}`);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDestinationFilter('all');
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredRequests.length);
  const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

  return (
    <Box className="space-y-4">
      <Flex justify="between" align="start" mb="5">
        <PageHeading 
          title="Stock Transfer Out" 
          description="Process and manage stock transfer out requests."
          badge={<Badge>Origin: {organization.find(org => org.id === ASSUMED_ORIGIN)?.name}</Badge>}
          noMarginBottom
        />
      </Flex>

      <Box>
        <Flex gap="4" align="center" wrap="wrap">
          <Box className="flex-grow min-w-[250px]">
            <TextField.Root
              placeholder="Search by request # or branch name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            >
              <TextField.Slot>
                <Search size={16} />
              </TextField.Slot>
            </TextField.Root>
          </Box>

          <Flex align="center" gap="1" className="flex-shrink-0">
            <Select.Root value={statusFilter} onValueChange={(value) => setStatusFilter(value || 'all')}>
              <Select.Trigger placeholder="Filter by Status" />
              <Select.Content>
                <Select.Item value="all">All Statuses</Select.Item>
                <Select.Item value="Approved">Approved</Select.Item>
                <Select.Item value="Delivering">Delivering</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>

          <Flex align="center" gap="1" className="flex-shrink-0">
            <Text size="2">To:</Text>
            <Select.Root value={destinationFilter} onValueChange={setDestinationFilter}>
              <Select.Trigger placeholder="All Destinations" />
              <Select.Content>
                <Select.Item value="all">All Destinations</Select.Item>
                {organization.filter(org => org.id !== ASSUMED_ORIGIN).map(org => (
                  <Select.Item key={org.id} value={org.id}>
                    {org.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>

          <Button 
            variant="soft" 
            color={(statusFilter !== 'all' || destinationFilter !== 'all' || searchTerm !== '') ? 'red' : 'gray'} 
            onClick={handleResetFilters} 
            disabled={(statusFilter === 'all' && destinationFilter === 'all' && searchTerm === '')}
          >
            <RefreshCcw size={16} />
            Reset Filters
          </Button>
        </Flex>
      </Box>

      <StockTransferOutTable
        stockRequests={paginatedRequests}
        onView={handleViewClick}
      />

      {filteredRequests.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredRequests.length}
          startIndex={startIndex}
          endIndex={endIndex}
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

export default function StockTransferOutPage() {
  usePageTitle('Stock Transfer Out');
  return (
    <StockTransferOutContent />
  );
}

