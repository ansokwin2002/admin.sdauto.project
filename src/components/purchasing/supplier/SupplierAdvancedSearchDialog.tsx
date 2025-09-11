'use client';

import { useState } from 'react';
import { Dialog, Flex, Box, Button, TextField, Text, Select, Checkbox, Separator, Switch, Grid, Heading } from '@radix-ui/themes';
import { Search, X } from 'lucide-react';
import { ingredientItemCategories } from '@/data/CommonData';
import DateRangeInput from "@/components/common/DateRangeInput";
import { Range } from 'react-date-range';

interface AdvancedSearchFilters {
  name: string;
  category: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  orderStatus: string;
  hasRecurringOrders: boolean;
  dateRange: Range;
  active: boolean | null;
}

const initialFilters: AdvancedSearchFilters = {
  name: '',
  category: 'all',
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
  orderStatus: 'any',
  hasRecurringOrders: false,
  dateRange: {
    startDate: undefined,
    endDate: undefined,
    key: 'selection'
  },
  active: null,
};

interface SupplierAdvancedSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: (filters: AdvancedSearchFilters) => void;
}

export default function SupplierAdvancedSearchDialog({
  open,
  onOpenChange,
  onSearch
}: SupplierAdvancedSearchDialogProps) {
  const [filters, setFilters] = useState<AdvancedSearchFilters>(initialFilters);

  const handleInputChange = (field: keyof AdvancedSearchFilters) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [field]: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    setFilters({ ...filters, category: value });
  };

  const handleOrderStatusChange = (value: string) => {
    setFilters({ ...filters, orderStatus: value });
  };

  const handleRecurringOrdersChange = (checked: boolean) => {
    setFilters({ ...filters, hasRecurringOrders: checked });
  };

  const handleDateRangeChange = (range: Range) => {
    setFilters(prev => ({
      ...prev,
      dateRange: range
    }));
  };

  const handleCheckboxChange = (field: 'active') => (checked: boolean) => {
    // For three-state checkboxes: null (indeterminate), true, false
    const value = filters[field] === null ? checked : filters[field] === checked ? null : checked;
    setFilters({ ...filters, [field]: value });
  };

  const handleReset = () => {
    setFilters(initialFilters);
  };

  const handleSearch = () => {
    onSearch(filters);
    onOpenChange(false);
  };

  const isFilterActive = () => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === 'category' && value === 'all') return false;
      if (value === '' || value === null) return false;
      return true;
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 800, overflow: 'visible' }}>
        <Flex justify="between" align="center" gap="3">
          <Dialog.Title mb="0">Advanced Supplier Search</Dialog.Title>
          <Dialog.Close>
            <X className="h-4 w-4" />
          </Dialog.Close>
        </Flex>
        <Dialog.Description size="2" mb="4" className="text-stone-400">
          Use the options below to filter suppliers by various criteria.
        </Dialog.Description>

        <Flex gap="6">
          <Box flexGrow="1" className="space-y-4">
            {/* Basic Information */}
            <Box className="space-y-4">
              <Heading size="2" mb="2" className="text-slate-400 dark:text-neutral-600">Basic Information</Heading>
              <Flex direction="column" gap="3">
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Supplier Name</Text>
                  <TextField.Root 
                    placeholder="Supplier name" 
                    value={filters.name}
                    onChange={handleInputChange('name')}
                  />
                </Flex>
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Category</Text>
                  <Select.Root value={filters.category} onValueChange={handleCategoryChange}>
                    <Select.Trigger placeholder="Select category" />
                    <Select.Content>
                      <Select.Item value="all">All Categories</Select.Item>
                      {ingredientItemCategories.map(category => (
                        <Select.Item key={category} value={category}>{category}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Flex>
              </Flex>
            </Box>

            <Separator size="4" my="4" />

            {/* Contact Information */}
            <Box className="space-y-4">
              <Heading size="2" mb="2" className="text-slate-400 dark:text-neutral-600">Contact Information</Heading>
              <Flex gap="3" wrap="wrap">
                <Flex direction="column" gap="1" className="flex-1 min-w-[200px]">
                  <Text as="label" size="2" weight="medium">Contact Person</Text>
                  <TextField.Root 
                    placeholder="Contact person name" 
                    value={filters.contactPerson}
                    onChange={handleInputChange('contactPerson')}
                  />
                </Flex>
                <Flex direction="column" gap="1" className="flex-1 min-w-[200px]">
                  <Text as="label" size="2" weight="medium">Email</Text>
                  <TextField.Root 
                    placeholder="Email address" 
                    value={filters.email}
                    onChange={handleInputChange('email')}
                  />
                </Flex>
              </Flex>
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Phone Number</Text>
                <TextField.Root 
                  placeholder="Phone number" 
                  value={filters.phone}
                  onChange={handleInputChange('phone')}
                />
              </Flex>
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Address</Text>
                <TextField.Root 
                  placeholder="Address" 
                  value={filters.address}
                  onChange={handleInputChange('address')}
                />
              </Flex>
            </Box>
          </Box>
            
          <Box flexGrow="1" className="space-y-4">
            {/* Order Information */}
            <Box className="space-y-4">
              <Heading size="2" mb="2" className="text-slate-400 dark:text-neutral-600">Order Information</Heading>
              <Flex direction="column" gap="3">
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Order Status</Text>
                  <Select.Root 
                    value={filters.orderStatus} 
                    onValueChange={handleOrderStatusChange}
                  >
                    <Select.Trigger placeholder="Select order status" />
                    <Select.Content>
                      <Select.Item value="any">Any</Select.Item>
                      <Select.Item value="pending">Pending</Select.Item>
                      <Select.Item value="delivered">Delivered</Select.Item>
                      <Select.Item value="cancelled">Cancelled</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Flex>

                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Order Date Range</Text>
                  <DateRangeInput
                    value={filters.dateRange}
                    onChange={handleDateRangeChange}
                    placeholder="Select date range..."
                  />
                </Flex>
              </Flex>
                        
              <Flex align="center" gap="2">
                <Text as="label" size="2">
                  <Flex gap="2" align="center">
                    <Switch 
                      checked={filters.hasRecurringOrders} 
                      onCheckedChange={handleRecurringOrdersChange}
                    />
                    Has Recurring Orders
                  </Flex>
                </Text>
              </Flex>
            </Box>

            <Separator size="4" my="4" />

            {/* Status */}
            <Flex direction="column" gap="3">
              <Heading size="2" mb="2" className="text-slate-400 dark:text-neutral-600">Status</Heading>
              <Flex gap="5" mb="2">
                <Text as="label" size="2">
                  <Flex gap="2" align="center">
                    <Checkbox 
                      checked={filters.active === true}
                      onCheckedChange={() => handleCheckboxChange('active')(true)}
                    />
                    Active
                  </Flex>
                </Text>
                <Text as="label" size="2">
                  <Flex gap="2" align="center">
                    <Checkbox 
                      checked={filters.active === false}
                      onCheckedChange={() => handleCheckboxChange('active')(false)}
                    />
                    Inactive
                  </Flex>
                </Text>
              </Flex>
            </Flex>
          </Box>
        </Flex>

        <Flex gap="3" mt="6" justify="between" align="center">
          <Button variant="soft" onClick={handleReset}>
            <X className="h-4 w-4" />
            Reset Filters
          </Button>
          <Flex gap="3" justify="end">
            <Button variant="soft" color="gray" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSearch} variant="solid" color="green">
              <Search className="h-4 w-4" />
              Apply Filters
            </Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}