'use client';

import { useState } from 'react';
import { 
  Dialog, 
  Flex, 
  TextField, 
  Select, 
  Button, 
  Text,
  Box,
  Heading,
  Separator
} from '@radix-ui/themes';
import { mockUsers } from '@/data/UserData';
import DateRangeInput from '@/components/common/DateRangeInput';
import { Range } from 'react-date-range';
import { X, Filter } from 'lucide-react';

interface PurchaseOrderAdvancedSearchFilters {
  poNumber: string;
  orderedBy: string;
  supplierName: string;
  contactName: string;
  orderDateRange: Range;
  orderStatus: string;
  trackingNumber: string;
  paymentStatus: string;
  invoiceNumber: string;
  datePaidRange: Range;
}

const initialFilters: PurchaseOrderAdvancedSearchFilters = {
  poNumber: '',
  orderedBy: '',
  supplierName: '',
  contactName: '',
  orderDateRange: {
    startDate: undefined,
    endDate: undefined,
    key: 'selection'
  },
  orderStatus: 'all',
  trackingNumber: '',
  paymentStatus: 'all',
  invoiceNumber: '',
  datePaidRange: {
    startDate: undefined,
    endDate: undefined,
    key: 'selection'
  }
};

interface PurchaseOrderAdvancedSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: (filters: any) => void;
}

export default function PurchaseOrderAdvancedSearchDialog({
  open,
  onOpenChange,
  onSearch
}: PurchaseOrderAdvancedSearchDialogProps) {
  const [filters, setFilters] = useState<PurchaseOrderAdvancedSearchFilters>(initialFilters);

  const handleSearch = () => {
    // Convert date ranges to from/to format for compatibility with the List component
    const formattedFilters = {
      ...filters,
      orderDateFrom: filters.orderDateRange.startDate ? filters.orderDateRange.startDate.toISOString().split('T')[0] : '',
      orderDateTo: filters.orderDateRange.endDate ? filters.orderDateRange.endDate.toISOString().split('T')[0] : '',
      datePaidFrom: filters.datePaidRange.startDate ? filters.datePaidRange.startDate.toISOString().split('T')[0] : '',
      datePaidTo: filters.datePaidRange.endDate ? filters.datePaidRange.endDate.toISOString().split('T')[0] : '',
    };

    // Remove the Range objects as they're not needed in the filter criteria
    const { orderDateRange, datePaidRange, ...finalFilters } = formattedFilters;
    
    onSearch(finalFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters(initialFilters);
  };

  const handleOrderDateRangeChange = (range: Range) => {
    setFilters(prev => ({
      ...prev,
      orderDateRange: range
    }));
  };

  const handleDatePaidRangeChange = (range: Range) => {
    setFilters(prev => ({
      ...prev,
      datePaidRange: range
    }));
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 800, overflow: 'visible' }}>
        <Flex justify="between" align="center" gap="3">
          <Dialog.Title mb="0">Advanced Purchase Order Search</Dialog.Title>
          <Dialog.Close>
            <X className="h-4 w-4" />
          </Dialog.Close>
        </Flex>
        <Dialog.Description size="2" mb="4" className="text-stone-400">
          Filter purchase orders using multiple criteria.
        </Dialog.Description>
        
        <Flex gap="6">
          {/* Left Column */}
          <Box flexGrow="1" className="space-y-4">
            <Heading size="2" mb="2" className="text-gray-800 dark:text-white">Basic Information</Heading>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">PO Number</Text>
              <TextField.Root 
                placeholder="Enter PO number"
                value={filters.poNumber}
                onChange={(e) => setFilters({...filters, poNumber: e.target.value})}
              />
            </Flex>

            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Order Status</Text>
              <Select.Root 
                value={filters.orderStatus} 
                onValueChange={(value) => setFilters({...filters, orderStatus: value})}
              >
                <Select.Trigger placeholder="Select status" />
                <Select.Content>
                  <Select.Item value="all">All Statuses</Select.Item>
                  <Select.Item value="Draft">Draft</Select.Item>
                  <Select.Item value="Pending">Pending</Select.Item>
                  <Select.Item value="In Progress">In Progress</Select.Item>
                  <Select.Item value="Delivered">Delivered</Select.Item>
                  <Select.Item value="Partially Received">Partially Received</Select.Item>
                  <Select.Item value="Canceled">Canceled</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Ordered By</Text>
              <Select.Root 
                value={filters.orderedBy} 
                onValueChange={(value) => setFilters({...filters, orderedBy: value})}
              >
                <Select.Trigger placeholder="Select user" />
                <Select.Content>
                  <Select.Item value="all">All Users</Select.Item>
                  {mockUsers?.map(user => (
                    <Select.Item key={user.id} value={user.id}>{user.name}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Flex>
            
            <Separator size="4" my="4" />
            
            <Heading size="2" mb="2" className="text-gray-800 dark:text-white">Supplier Information</Heading>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Supplier</Text>
              <TextField.Root 
                placeholder="Enter supplier name"
                value={filters.supplierName}
                onChange={(e) => setFilters({...filters, supplierName: e.target.value})}
              />
            </Flex>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Contact Name</Text>
              <TextField.Root 
                placeholder="Enter contact name"
                value={filters.contactName}
                onChange={(e) => setFilters({...filters, contactName: e.target.value})}
              />
            </Flex>
          </Box>
          
          {/* Right Column */}
          <Box flexGrow="1" className="space-y-4">
            <Heading size="2" mb="2" className="text-gray-800 dark:text-white">Dates</Heading>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Order Date Range</Text>
              <Flex gap="2">
                <Box flexGrow="1">
                  <DateRangeInput 
                    value={filters.orderDateRange}
                    onChange={handleOrderDateRangeChange}
                    placeholder="Select order date range..."
                  />
                </Box>
                {filters.orderDateRange.startDate && filters.orderDateRange.endDate && (
                  <Button variant="soft" onClick={() => setFilters({...filters, orderDateRange: {startDate: undefined, endDate: undefined}})}>Clear</Button>
                )}
              </Flex>
            </Flex>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Date Paid Range</Text>
              <Flex gap="2">
                <Box flexGrow="1">
                  <DateRangeInput 
                    value={filters.datePaidRange}
                    onChange={handleDatePaidRangeChange}
                    placeholder="Select payment date range..."
                  />
                </Box>
                {filters.datePaidRange.startDate && filters.datePaidRange.endDate && (
                  <Button variant="soft" onClick={() => setFilters({...filters, datePaidRange: {startDate: undefined, endDate: undefined}})}>Clear</Button>
                )}
              </Flex>
            </Flex>
            
            <Separator size="4" my="4" />
            
            <Heading size="2" mb="2" className="text-gray-800 dark:text-white">Shipping & Payment</Heading>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Tracking Number</Text>
              <TextField.Root 
                placeholder="Enter tracking number"
                value={filters.trackingNumber}
                onChange={(e) => setFilters({...filters, trackingNumber: e.target.value})}
              />
            </Flex>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Payment Status</Text>
              <Select.Root 
                value={filters.paymentStatus} 
                onValueChange={(value) => setFilters({...filters, paymentStatus: value})}
              >
                <Select.Trigger placeholder="Select payment status" />
                <Select.Content>
                  <Select.Item value="all">All Payment Statuses</Select.Item>
                  <Select.Item value="Paid">Paid</Select.Item>
                  <Select.Item value="Partially Paid">Partially Paid</Select.Item>
                  <Select.Item value="Unpaid">Unpaid</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Invoice Number</Text>
              <TextField.Root 
                placeholder="Enter invoice number"
                value={filters.invoiceNumber}
                onChange={(e) => setFilters({...filters, invoiceNumber: e.target.value})}
              />
            </Flex>
          </Box>
        </Flex>
        
        <Flex gap="3" mt="6" justify="between">
          <Button 
            variant="soft"
            onClick={handleReset}
          >
            <X className="h-4 w-4" />
            Reset Filters
          </Button>
          
          <Flex gap="2">
            <Button 
              variant="soft" 
              color="gray" 
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSearch} variant="solid" color="green">
              <Filter className="h-4 w-4" />
              Apply Filters
            </Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
