import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
} from '@radix-ui/themes';
import { StockRequest } from '@/data/StockRequestData';
import { organization } from '@/data/CommonData';
import { formatDate } from '@/utilities/index';
import { getTransferStatusBadge } from '@/utilities/transferStatusBadge';
import { ChevronRight, PackageOpen } from 'lucide-react';
import { SortableHeader } from '@/components/common/SortableHeader';

interface StockTransferOutTableProps {
  stockRequests: StockRequest[];
  onView: (request: StockRequest) => void;
}

const StockTransferOutTable: React.FC<StockTransferOutTableProps> = ({
  stockRequests,
  onView,
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
        case 'destination':
          aValue = organization.find(org => org.id === a.destinationId)?.name || '';
          bValue = organization.find(org => org.id === b.destinationId)?.name || '';
          break;
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
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
              label="Destination"
              sortKey="destination"
              currentSort={sortConfig}
              onSort={handleSort}
            />
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            <SortableHeader
              label="Date"
              sortKey="date"
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
            <Table.Cell colSpan={6} align="center">No transfers to process found.</Table.Cell>
          </Table.Row>
        ) : (
          sortedRequests.map((request) => (
            <Table.Row key={request.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800" onClick={() => onView(request)}>
              <Table.RowHeaderCell>{request.requestNumber}</Table.RowHeaderCell>
              <Table.Cell>
                {organization.find(org => org.id === request.destinationId)?.name || 'N/A'}
              </Table.Cell>
              <Table.Cell>{formatDate(request.date)}</Table.Cell>
              <Table.Cell>
                {getTransferStatusBadge({ status: request.status })}
              </Table.Cell>
              <Table.Cell>
                <Button size="1" onClick={() => onView(request)} disabled={request.status !== 'Approved'}>
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

export default StockTransferOutTable;