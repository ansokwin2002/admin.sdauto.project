import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Badge,
} from '@radix-ui/themes';
import { StockRequest } from '@/data/StockRequestData';
import { organization } from '@/data/CommonData';
import { formatDate } from '@/utilities/index';
import { ChevronRight } from 'lucide-react';
import { SortableHeader } from '@/components/common/SortableHeader';

interface StockTransferInTableProps {
  stockRequests: StockRequest[];
  onProcess: (request: StockRequest) => void;
}

const StockTransferInTable: React.FC<StockTransferInTableProps> = ({
  stockRequests,
  onProcess,
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedRequests = useMemo(() => {
    if (!sortConfig) return stockRequests;

    return [...stockRequests].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortConfig.key) {
        case 'requestNumber':
          aValue = a.requestNumber;
          bValue = b.requestNumber;
          break;
        case 'origin':
          aValue = organization.find(org => org.id === a.originId)?.name || '';
          bValue = organization.find(org => org.id === b.originId)?.name || '';
          break;
        case 'expectedDate':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'items':
          aValue = a.items.length;
          bValue = b.items.length;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
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
  }, [stockRequests, sortConfig]);

  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>
            <SortableHeader
              label="Request Number"
              sortKey="requestNumber"
              currentSort={sortConfig}
              onSort={handleSort}
            />
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            <SortableHeader
              label="Origin"
              sortKey="origin"
              currentSort={sortConfig}
              onSort={handleSort}
            />
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            <SortableHeader
              label="Expected Date"
              sortKey="expectedDate"
              currentSort={sortConfig}
              onSort={handleSort}
            />
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            <SortableHeader
              label="Items"
              sortKey="items"
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
          <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {sortedRequests.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={6} align="center">No incoming transfers found.</Table.Cell>
          </Table.Row>
        ) : (
          sortedRequests.map((request) => (
            <Table.Row key={request.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800" onClick={() => onProcess(request)}>
              <Table.RowHeaderCell>{request.requestNumber}</Table.RowHeaderCell>
              <Table.Cell>
                {organization.find(org => org.id === request.originId)?.name || 'Unknown'}
              </Table.Cell>
              <Table.Cell>{formatDate(request.date)}</Table.Cell>
              <Table.Cell>{request.items.length}</Table.Cell>
              <Table.Cell>
                <Badge color="orange">
                  {request.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Button size="1" onClick={() => onProcess(request)}>
                  Process
                  <ChevronRight size={14} />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table.Root>
  );
};

export default StockTransferInTable; 