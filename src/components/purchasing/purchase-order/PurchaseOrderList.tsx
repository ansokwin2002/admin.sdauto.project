'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Button, 
  Flex,
  Table, 
  Text, 
  TextField, 
  Select, 
  Badge,
  Callout
} from '@radix-ui/themes';
import { Search, Filter, X, RefreshCcw } from 'lucide-react';
import { PurchaseOrder, mockPurchaseOrders, filterPurchaseOrders, getPurchaseOrdersByOrganization } from '@/data/PurchaseOrderData';
import Pagination from '@/components/common/Pagination';
import PurchaseOrderAdvancedSearchDialog from './PurchaseOrderAdvancedSearchDialog';
import { formatDate } from '@/utilities';
import { useFilterBranch } from '@/contexts/FilterBranchContext';
import { organization } from '@/data/CommonData';
import { SortableHeader } from '@/components/common/SortableHeader';

export default function PurchaseOrderList() {
  const router = useRouter();
  const { activeBranchFilter } = useFilterBranch();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [filteredPOs, setFilteredPOs] = useState<PurchaseOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<any>(null);
  const [filters, setFilters] = useState({
    orderStatus: 'all',
    paymentStatus: 'all',
  });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get initial data based on branch filter
  useEffect(() => {
    // Get purchase orders based on selected branch filter
    const branchPOs = activeBranchFilter
      ? getPurchaseOrdersByOrganization(activeBranchFilter.id)
      : mockPurchaseOrders; // Show all if no filter
      
    setPurchaseOrders(branchPOs);
    setFilteredPOs(branchPOs);
    
    // Reset pagination when branch filter changes
    setCurrentPage(1);
    
  }, [activeBranchFilter]);
  
  // Handle search and filters
  useEffect(() => {
    let result = purchaseOrders;
    
    // Apply search
    if (searchQuery) {
      result = filterPurchaseOrders(result, searchQuery, null);
    }
    
    // Apply simple filters
    if (filters.orderStatus !== 'all') {
      result = result.filter(po => po.orderStatus === filters.orderStatus);
    }
    
    if (filters.paymentStatus !== 'all') {
      result = result.filter(po => po.paymentStatus === filters.paymentStatus);
    }
    
    // Apply advanced filters if they exist
    if (advancedFilters) {
      if (advancedFilters.poNumber) {
        result = result.filter(po => po.poNumber.toLowerCase().includes(advancedFilters.poNumber.toLowerCase()));
      }
      
      if (advancedFilters.orderedBy && advancedFilters.orderedBy !== 'all') {
        result = result.filter(po => po.orderedBy.toLowerCase().includes(advancedFilters.orderedBy.toLowerCase()));
      }
      
      if (advancedFilters.supplierName) {
        result = result.filter(po => po.supplierName.toLowerCase().includes(advancedFilters.supplierName.toLowerCase()));
      }
      
      if (advancedFilters.contactName) {
        result = result.filter(po => 
          po.supplierDetails?.contactName?.toLowerCase().includes(advancedFilters.contactName.toLowerCase())
        );
      }
      
      if (advancedFilters.orderDateFrom) {
        const fromDate = new Date(advancedFilters.orderDateFrom);
        result = result.filter(po => new Date(po.dateCreated) >= fromDate);
      }
      
      if (advancedFilters.orderDateTo) {
        const toDate = new Date(advancedFilters.orderDateTo);
        toDate.setHours(23, 59, 59, 999); // End of the day
        result = result.filter(po => new Date(po.dateCreated) <= toDate);
      }
      
      if (advancedFilters.orderStatus && advancedFilters.orderStatus !== 'all') {
        result = result.filter(po => po.orderStatus === advancedFilters.orderStatus);
      }
      
      if (advancedFilters.trackingNumber) {
        result = result.filter(po => 
          po.shippingDetails?.trackingNumber?.toLowerCase().includes(advancedFilters.trackingNumber.toLowerCase())
        );
      }
      
      if (advancedFilters.paymentStatus && advancedFilters.paymentStatus !== 'all') {
        result = result.filter(po => po.paymentStatus === advancedFilters.paymentStatus);
      }
      
      if (advancedFilters.invoiceNumber) {
        result = result.filter(po => 
          po.paymentDetails?.invoiceNumber?.toLowerCase().includes(advancedFilters.invoiceNumber.toLowerCase())
        );
      }
      
      if (advancedFilters.datePaidFrom) {
        const fromDate = new Date(advancedFilters.datePaidFrom);
        result = result.filter(po => 
          po.paymentDetails?.datePaid ? new Date(po.paymentDetails.datePaid) >= fromDate : false
        );
      }
      
      if (advancedFilters.datePaidTo) {
        const toDate = new Date(advancedFilters.datePaidTo);
        toDate.setHours(23, 59, 59, 999); // End of the day
        result = result.filter(po => 
          po.paymentDetails?.datePaid ? new Date(po.paymentDetails.datePaid) <= toDate : false
        );
      }
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortConfig.key) {
          case 'poNumber':
            aValue = a.poNumber.toLowerCase();
            bValue = b.poNumber.toLowerCase();
            break;
          case 'branch':
            aValue = organization.find(o => o.id === a.organizationId)?.name || '';
            bValue = organization.find(o => o.id === b.organizationId)?.name || '';
            break;
          case 'dateCreated':
            aValue = new Date(a.dateCreated).getTime();
            bValue = new Date(b.dateCreated).getTime();
            break;
          case 'supplier':
            aValue = a.supplierName.toLowerCase();
            bValue = b.supplierName.toLowerCase();
            break;
          case 'orderStatus':
            aValue = a.orderStatus;
            bValue = b.orderStatus;
            break;
          case 'totalValue':
            aValue = a.totalOrderValue;
            bValue = b.totalOrderValue;
            break;
          case 'expectedDelivery':
            aValue = new Date(a.expectedDeliveryDate).getTime();
            bValue = new Date(b.expectedDeliveryDate).getTime();
            break;
          case 'paymentStatus':
            aValue = a.paymentStatus;
            bValue = b.paymentStatus;
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
    
    setFilteredPOs(result);
    setCurrentPage(1); // Reset to first page when filters change

  }, [searchQuery, filters, advancedFilters, purchaseOrders, sortConfig]);
  
  // Pagination calculations
  const totalPages = Math.ceil(filteredPOs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPOs = filteredPOs.slice(startIndex, endIndex);
  
  const handleRowClick = (poId: string) => {
    router.push(`/purchasing/purchase-orders/${poId}`);
  };
  
  const handleAdvancedSearch = (filters: any) => {
    setAdvancedFilters(filters);
  };
  
  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({
      orderStatus: 'all',
      paymentStatus: 'all',
    });
    setAdvancedFilters(null);
  };
  
  const getStatusColor = (status: PurchaseOrder['orderStatus']) => {
    switch (status) {
      case 'Draft': return 'gray';
      case 'Pending': return 'amber';
      case 'In Progress': return 'blue';
      case 'Delivered': return 'green';
      case 'Partially Received': return 'purple';
      case 'Canceled': return 'red';
      default: return 'gray';
    }
  };
  
  const getPaymentStatusColor = (status: PurchaseOrder['paymentStatus']) => {
    switch (status) {
      case 'Paid': return 'green';
      case 'Partially Paid': return 'amber';
      case 'Unpaid': return 'red';
      default: return 'gray';
    }
  };
  
  // Format date strings to more readable format
  const formatDateString = (dateString: string) => {
    return formatDate(new Date(dateString));
  };
  
  return (
    <Box>
      {/* Branch filter indicator */}
      {activeBranchFilter ? (
        <Callout.Root color="blue" size="1" mb="4">
          <Callout.Text>
            Viewing purchase orders for <Badge variant="solid" color="blue">{activeBranchFilter.name}</Badge>
          </Callout.Text>
        </Callout.Root>
      ) : (
        <Callout.Root color="gray" size="1" mb="4">
          <Callout.Text>
            Viewing purchase orders from all branches. Use the branch filter in the header to filter by branch.
          </Callout.Text>
        </Callout.Root>
      )}
      
      {/* Search and Filter Bar */}
      <Flex gap="3" mb="4" wrap="wrap">
        <Box style={{ minWidth: '200px', flexGrow: 1 }}>
          <TextField.Root 
            placeholder="Search by PO number, supplier, status..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          >
            <TextField.Slot>
              <Search className="h-4 w-4" />
            </TextField.Slot>
            {searchQuery && (
              <TextField.Slot>
                <Button variant="ghost" size="1" onClick={() => setSearchQuery('')}>
                  <X className="h-4 w-4" />
                </Button>
              </TextField.Slot>
            )}
          </TextField.Root>
        </Box>
        
        <Select.Root 
          value={filters.orderStatus} 
          onValueChange={(value) => setFilters({...filters, orderStatus: value})}
        >
          <Select.Trigger placeholder="Order Status" />
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
        
        <Select.Root 
          value={filters.paymentStatus} 
          onValueChange={(value) => setFilters({...filters, paymentStatus: value})}
        >
          <Select.Trigger placeholder="Payment Status" />
          <Select.Content>
            <Select.Item value="all">All Payment Statuses</Select.Item>
            <Select.Item value="Paid">Paid</Select.Item>
            <Select.Item value="Partially Paid">Partially Paid</Select.Item>
            <Select.Item value="Unpaid">Unpaid</Select.Item>
          </Select.Content>
        </Select.Root>

        <Button 
          variant="soft" 
          color={(filters.orderStatus !== 'all' || filters.paymentStatus !== 'all' || searchQuery !== '' || advancedFilters !== null) ? 'red' : 'gray'} 
          onClick={handleResetFilters}
          disabled={(filters.orderStatus === 'all' && filters.paymentStatus === 'all' && searchQuery === '' && advancedFilters === null)}
        >
          <RefreshCcw size={16} />
          Reset Filters
        </Button>
        
        <Button 
          variant='outline' 
          onClick={() => setIsAdvancedSearchOpen(true)}
        >
          <Filter className="h-4 w-4" />
          Advanced Filters {advancedFilters ? '(Active)' : ''}
        </Button>
      </Flex>
      
      {/* Show indicator when advanced filters are active */}
      {advancedFilters && (
        <Callout.Root color="orange" size="1" mb="2">
          <Callout.Text className="flex gap-2 align-center leading-[1.6]">
            Advanced filters are active
            <Button 
              size="1"
              onClick={() => setAdvancedFilters(null)}
            >
              Clear Filters
            </Button>
          </Callout.Text>            
        </Callout.Root>
      )}
      
      {/* Purchase Orders Table */}
      <Box>
        <Table.Root variant='surface'>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="PO Number"
                  sortKey="poNumber"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="Branch"
                  sortKey="branch"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="Date Created"
                  sortKey="dateCreated"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="Supplier"
                  sortKey="supplier"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="Order Status"
                  sortKey="orderStatus"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="Total Value"
                  sortKey="totalValue"
                  currentSort={sortConfig}
                  onSort={handleSort}
                  align="right"
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="Expected Delivery"
                  sortKey="expectedDelivery"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="Payment Status"
                  sortKey="paymentStatus"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {paginatedPOs.length > 0 ? (
              paginatedPOs.map((po) => (
                <Table.Row 
                  key={po.id} 
                  onClick={() => handleRowClick(po.id)}
                  className="cursor-pointer hover:bg-slate-50 dark:hover:bg-neutral-800"
                >
                  <Table.Cell>
                    <Text weight="bold">{po.poNumber}</Text>
                  </Table.Cell>
                  <Table.Cell>{organization.find(o => o.id === po.organizationId)?.name}</Table.Cell>
                  <Table.Cell>{formatDateString(po.dateCreated)}</Table.Cell>
                  <Table.Cell>{po.supplierName}</Table.Cell>
                  <Table.Cell>
                    <Badge color={getStatusColor(po.orderStatus)}>
                      {po.orderStatus}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell align="right">${po.totalOrderValue.toFixed(2)}</Table.Cell>
                  <Table.Cell>{formatDateString(po.expectedDeliveryDate)}</Table.Cell>
                  <Table.Cell>
                    <Badge color={getPaymentStatusColor(po.paymentStatus)}>
                      {po.paymentStatus}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={8}>
                  <Text align="center" className="mt-4 mb-4">No purchase orders found</Text>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Box>
      
      {/* Pagination */}
      {filteredPOs.length > 0 && (
        <Box className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredPOs.length}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(newSize) => {
              setItemsPerPage(newSize);
              setCurrentPage(1); // Reset to first page when changing items per page
            }}
          />
        </Box>
      )}
      
      {/* Advanced Search Dialog */}
      <PurchaseOrderAdvancedSearchDialog
        open={isAdvancedSearchOpen}
        onOpenChange={setIsAdvancedSearchOpen}
        onSearch={handleAdvancedSearch}
      />
    </Box>
  );
} 