'use client';

import { useState, useEffect, useCallback } from 'react';
import { Box, Flex, Button, Table, Text, Badge, Card, TextField, Select, IconButton } from '@radix-ui/themes';
import { PlusIcon, Trash, Search, RefreshCcw, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { WasteLog } from '@/types/inventory';
import { formatDate } from '@/utilities';
import { wasteLogs, wasteReasons, wasteSources } from '@/data/WasteLogData';
import Pagination from '@/components/common/Pagination';
import { PageHeading } from '@/components/common/PageHeading';
import { usePageTitle } from '@/hooks/usePageTitle';
import { SortableHeader } from '@/components/common/SortableHeader';

export default function WasteLoggingPage() {
  usePageTitle('Waste Logging');
  const router = useRouter();
  const [filteredLogs, setFilteredLogs] = useState<WasteLog[]>([]);
  const [displayedLogs, setDisplayedLogs] = useState<WasteLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [reasonFilter, setReasonFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setReasonFilter('all');
    setSourceFilter('all');
    setSortConfig(null);
  };

  // Get waste logs with optional filtering and pagination
  const getWasteLogs = useCallback((branchId?: string) => {
    setIsLoading(true);
    
    // Filter logs by branch if specified
    let logs = [...wasteLogs];
    if (branchId) {
      logs = logs.filter(log => log.branchId === branchId);
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      logs = logs.filter(log => 
        log.productName.toLowerCase().includes(term) ||
        log.staffName.toLowerCase().includes(term)
      );
    }
    
    // Apply reason filter
    if (reasonFilter !== 'all') {
      logs = logs.filter(log => log.reason === reasonFilter);
    }
    
    // Apply source filter
    if (sourceFilter !== 'all') {
      logs = logs.filter(log => log.source === sourceFilter);
    }
    
    // Apply sorting
    if (sortConfig) {
      logs.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortConfig.key) {
          case 'product':
            aValue = a.productName.toLowerCase();
            bValue = b.productName.toLowerCase();
            break;
          case 'quantity':
            aValue = a.quantity;
            bValue = b.quantity;
            break;
          case 'date':
            aValue = a.timestamp.getTime();
            bValue = b.timestamp.getTime();
            break;
          case 'cost':
            aValue = a.cost || 0;
            bValue = b.cost || 0;
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
    } else {
      // Default sort by most recent first
      logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
    
    setFilteredLogs(logs);
    setTotalItems(logs.length);
    
    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedLogs(logs.slice(startIndex, endIndex));
    
    setIsLoading(false);
  }, [searchTerm, reasonFilter, sourceFilter, sortConfig, currentPage, itemsPerPage]);

  useEffect(() => {
    getWasteLogs();
  }, [searchTerm, reasonFilter, sourceFilter, sortConfig, getWasteLogs]);
  
  useEffect(() => {
    // Re-paginate when page or items per page changes
    if (filteredLogs.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setDisplayedLogs(filteredLogs.slice(startIndex, endIndex));
    }
  }, [currentPage, itemsPerPage, filteredLogs]);

  const handleAddWasteLog = () => {
    router.push('/waste-management/waste-logging/add');
  };

  const handleEditWasteLog = (id: string) => {
    router.push(`/waste-management/waste-logging/${id}`);
  };

  const handleDeleteWasteLog = (id: string) => {
    console.log('Deleting waste log with ID:', id);
    // TODO: Implement actual deletion logic
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const renderReasonBadge = (reason: string) => {
    let color: 'red' | 'orange' | 'amber' | 'blue' | 'gray' = 'gray';
    
    switch (reason) {
      case 'spoiled':
        color = 'red';
        break;
      case 'overcooked':
        color = 'orange';
        break;
      case 'wrong-order':
        color = 'amber';
        break;
      case 'customer-return':
        color = 'blue';
        break;
      default:
        color = 'gray';
    }
    
    return (
      <Badge color={color} variant="soft">
        {wasteReasons.find(r => r.value === reason)?.label || reason}
      </Badge>
    );
  };

  const renderSourceBadge = (source: string) => {
    let color: 'green' | 'orange' | 'blue' | 'purple' | 'gray' = 'gray';
    
    switch (source) {
      case 'prep':
        color = 'green';
        break;
      case 'cooking':
        color = 'orange';
        break;
      case 'storage':
        color = 'blue';
        break;
      case 'service':
        color = 'purple';
        break;
      default:
        color = 'gray';
    }
    
    return (
      <Badge color={color} variant="soft">
        {wasteSources.find(s => s.value === source)?.label || source}
      </Badge>
    );
  };

  const renderWasteLogsTable = () => {
    if (isLoading) {
      return <Box p="4">Loading waste logs...</Box>;
    }

    if (displayedLogs.length === 0) {
      return (
        <Card className="p-6">
          <Flex direction="column" align="center" justify="center" gap="3" py="6">
            <Trash size={32} className="text-slate-400" />
            <Text size="3" weight="medium" className="text-slate-700">No waste logs found</Text>
            <Text size="2" className="text-slate-500">Start logging waste incidents to track and reduce waste.</Text>
            <Button mt="3" onClick={handleAddWasteLog}>
              <PlusIcon size={16} />
              Log New Waste
            </Button>
          </Flex>
        </Card>
      );
    }

    // Calculate pagination values
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + displayedLogs.length;

    return (
      <Box my="4">
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="Product"
                  sortKey="product"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="Quantity"
                  sortKey="quantity"
                  currentSort={sortConfig}
                  onSort={handleSort}
                  align="right"
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Reason</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Source</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Staff</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="Date & Time"
                  sortKey="date"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="Cost"
                  sortKey="cost"
                  currentSort={sortConfig}
                  onSort={handleSort}
                  align="right"
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {displayedLogs.map((log) => (
              <Table.Row key={log.id} className="align-middle cursor-pointer hover:bg-slate-50 dark:hover:bg-neutral-800" onClick={() => handleEditWasteLog(log.id)}>
                <Table.Cell>
                  <Text weight="medium">{log.productName}</Text>
                </Table.Cell>
                <Table.Cell align="right">
                  {log.quantity} {log.measureUnit}
                </Table.Cell>
                <Table.Cell>
                  {renderReasonBadge(log.reason)}
                </Table.Cell>
                <Table.Cell>
                  {renderSourceBadge(log.source)}
                </Table.Cell>
                <Table.Cell>
                  {log.staffName}
                </Table.Cell>
                <Table.Cell>
                  <Flex direction="column" gap="1">
                    <Text weight="medium">{formatDate(log.timestamp)}</Text>
                    <Text size="1" className="text-slate-400 dark:text-neutral-600">{log.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell align="right">
                  ${log.cost?.toFixed(2) || '0.00'}
                </Table.Cell>
                <Table.Cell>
                  <Flex gap="3">
                    <IconButton 
                      size="1" 
                      variant="ghost"
                      color="gray"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditWasteLog(log.id);
                      }}
                    >
                      <Edit size={14} />
                    </IconButton>
                    <IconButton
                      size="1"
                      variant="ghost"
                      color="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWasteLog(log.id);
                      }}
                    >
                      <Trash2 size={14} />
                    </IconButton>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        
        {totalItems > 0 && (
          <Box mt="4">
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
        )}
      </Box>
    );
  };

  return (
    <Box>
      <Flex 
        direction={{ initial: "column", sm: "row" }} 
        justify="between" 
        align={{ initial: "stretch", sm: "center" }}
        gap={{ initial: "4", sm: "0" }}
        mb="5"
      >
        <PageHeading 
          title="Waste Logging" 
          description="Track and manage kitchen waste"
          noMarginBottom
        />
        <Flex gap="3" width={{ initial: "full", sm: "auto" }}>
          <Box width={{ initial: "full", sm: "auto" }}>
            <Button onClick={handleAddWasteLog}>
              <PlusIcon size={16} />
              Log New Waste
            </Button>
          </Box>
        </Flex>
      </Flex>
      
      <Flex gap="4" align="center" wrap="wrap" mb="4">
        <Box className="flex-grow min-w-[250px]">
          <TextField.Root
            placeholder="Search by product or staff name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          >
            <TextField.Slot>
              <Search size={16} />
            </TextField.Slot>
          </TextField.Root>
        </Box>
        
        <Flex align="center" gap="2" className="flex-shrink-0">
          <Select.Root value={reasonFilter} onValueChange={setReasonFilter}>
            <Select.Trigger placeholder="All Reasons" />
            <Select.Content>
              <Select.Item value="all">All Reasons</Select.Item>
              {wasteReasons.map(reason => (
                <Select.Item key={reason.value} value={reason.value}>{reason.label}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>
        
        <Flex align="center" gap="2" className="flex-shrink-0">
          <Select.Root value={sourceFilter} onValueChange={setSourceFilter}>
            <Select.Trigger placeholder="All Sources" />
            <Select.Content>
              <Select.Item value="all">All Sources</Select.Item>
              {wasteSources.map(source => (
                <Select.Item key={source.value} value={source.value}>{source.label}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>
        
        <Button 
          variant="soft" 
          color={(reasonFilter !== 'all' || sourceFilter !== 'all' || searchTerm !== '') ? 'red' : 'gray'} 
          onClick={handleResetFilters}
          className="flex-shrink-0"
          disabled={(reasonFilter === 'all' && sourceFilter === 'all' && searchTerm === '')}
        >
          <RefreshCcw size={16} />
          Reset Filters
        </Button>
      </Flex>

      <Box>
        {renderWasteLogsTable()}
      </Box>
    </Box>
  );
}
