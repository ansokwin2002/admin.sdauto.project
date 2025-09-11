'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Text, 
  Button, 
  Flex,
  Select,
  TextField
} from '@radix-ui/themes';
import { Plus, Search, RefreshCcw } from 'lucide-react';
import { organization } from '@/data/CommonData';
import { 
  mockStockRequests, 
  StockRequest,
} from '@/data/StockRequestData';
import StockRequestTable from '@/components/inventory/StockRequestTable';
import Pagination from '@/components/common/Pagination';
import { useRouter } from 'next/navigation';
import { PageHeading } from '@/components/common/PageHeading';
import { usePageTitle } from '@/hooks/usePageTitle';

const ITEMS_PER_PAGE = 10;

function StockRequestContent() {
  const [stockRequests, setStockRequests] = useState<StockRequest[]>(mockStockRequests);
  const [filteredRequests, setFilteredRequests] = useState<StockRequest[]>(mockStockRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [originFilter, setOriginFilter] = useState<string>('all');
  const [destinationFilter, setDestinationFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  
  const router = useRouter();
  
  useEffect(() => {
    let result = [...stockRequests];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        request => 
          request.requestNumber.toLowerCase().includes(term) ||
          organization.find(org => org.id === request.originId)?.name.toLowerCase().includes(term) ||
          organization.find(org => org.id === request.destinationId)?.name.toLowerCase().includes(term)
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(request => request.status === statusFilter);
    }

    if (originFilter !== 'all') {
      result = result.filter(request => request.originId === originFilter);
    }

    if (destinationFilter !== 'all') {
      result = result.filter(request => request.destinationId === destinationFilter);
    }
    
    setFilteredRequests(result);
    setCurrentPage(1);
  }, [stockRequests, searchTerm, statusFilter, originFilter, destinationFilter]);
  
  const handleAddClick = () => {
    router.push('/inventory/stock-request/add');
  };
  
  const handleEditClick = (request: StockRequest) => {
    router.push(`/inventory/stock-request/edit/${request.id}`);
  };
  
  const handleViewClick = (request: StockRequest) => {
    router.push(`/inventory/stock-request/${request.id}`);
  };
  
  const handleDeleteClick = (id: string) => {
    setStockRequests(prevRequests => prevRequests.filter(req => req.id !== id));
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setOriginFilter('all');
    setDestinationFilter('all');
  };

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, endIndex);
  
  return (
    <Box className="space-y-4">
      <Flex 
        direction={{ initial: "column", sm: "row" }} 
        justify="between" 
        align={{ initial: "stretch", sm: "center" }}
        gap={{ initial: "4", sm: "0" }}
        mb="5"
      >
        <PageHeading title="Stock Requests" description="Manage stock transfers between branches and HQ (as HQ Admin)" noMarginBottom /> 
        <Flex gap="3">
          <Button onClick={handleAddClick}>
            <Plus size={16} />
            New Request
          </Button>
        </Flex>
      </Flex>
      
      <Box>
        <Flex 
          direction={{ initial: "column", sm: "row" }}
          gap={{ initial: "3", sm: "4" }}
          align={{ initial: "stretch", sm: "center" }}
          wrap="wrap"
        >
          <Box className="flex-grow min-w-[250px]">
            <TextField.Root
              placeholder="Search by request number or branch name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            >
              <TextField.Slot>
                <Search size={16} />
              </TextField.Slot>
            </TextField.Root>
          </Box>
          
          <Flex 
            direction={{ initial: "column", sm: "row" }}
            gap={{ initial: "3", sm: "4" }}
            align={{ initial: "stretch", sm: "center" }}
            wrap="wrap"
          >
            <Flex align="center" gap="1" className="flex-shrink-0">
              <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="all">All Statuses</Select.Item>
                  <Select.Item value="New">New</Select.Item>
                  <Select.Item value="Rejected">Rejected</Select.Item>
                  <Select.Item value="Approved">Approved</Select.Item>
                  <Select.Item value="Authorized">Authorized</Select.Item>
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

            <Button 
              variant="soft" 
              color={(statusFilter !== 'all' || originFilter !== 'all' || destinationFilter !== 'all' || searchTerm !== '') ? 'red' : 'gray'} 
              onClick={handleResetFilters} 
              disabled={(statusFilter === 'all' && originFilter === 'all' && destinationFilter === 'all' && searchTerm === '')}
              className="flex-shrink-0"
            >
              <RefreshCcw size={16} />
              Reset Filters
            </Button>
          </Flex>
        </Flex>
      </Box>
      
      <StockRequestTable 
        stockRequests={paginatedRequests}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onView={handleViewClick}
      />
      
      {filteredRequests.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredRequests.length}
          startIndex={startIndex + 1}
          endIndex={Math.min(endIndex, filteredRequests.length)}
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

export default function StockRequestPage() {
  usePageTitle('Stock Request');
  return (
    <StockRequestContent />
  );
}
