import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Badge,
  Flex,
  Text
} from '@radix-ui/themes';
import { StockTransferLog } from '@/data/StockTransferLogData';
import { organization } from '@/data/CommonData';
import { formatDate } from '@/utilities/index';
import { getUserById } from '@/data/StockTransferLogData';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { getTransferStatusBadge } from '@/utilities/transferStatusBadge';
import { SortableHeader } from '@/components/common/SortableHeader';

interface StockTransferLogsTableProps {
  transferLogs: StockTransferLog[];
  onViewDetails: (transferLog: StockTransferLog) => void;
}

const StockTransferLogsTable: React.FC<StockTransferLogsTableProps> = ({
  transferLogs,
  onViewDetails,
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedLogs = useMemo(() => {
    if (!sortConfig) return transferLogs;

    return [...transferLogs].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortConfig.key) {
        case 'transferNumber':
          aValue = a.transferNumber;
          bValue = b.transferNumber;
          break;
        case 'dateCreated':
          aValue = new Date(a.dateCreated).getTime();
          bValue = new Date(b.dateCreated).getTime();
          break;
        case 'origin':
          aValue = organization.find(org => org.id === a.originId)?.name || '';
          bValue = organization.find(org => org.id === b.originId)?.name || '';
          break;
        case 'destination':
          aValue = organization.find(org => org.id === a.destinationId)?.name || '';
          bValue = organization.find(org => org.id === b.destinationId)?.name || '';
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'dateReceived':
          aValue = a.dateReceived ? new Date(a.dateReceived).getTime() : 0;
          bValue = b.dateReceived ? new Date(b.dateReceived).getTime() : 0;
          break;
        case 'discrepancies':
          aValue = a.hasDiscrepancies ? 1 : 0;
          bValue = b.hasDiscrepancies ? 1 : 0;
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
  }, [transferLogs, sortConfig]);

  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>
            <SortableHeader
              label="Transfer Number"
              sortKey="transferNumber"
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
              label="Origin"
              sortKey="origin"
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
              label="Status"
              sortKey="status"
              currentSort={sortConfig}
              onSort={handleSort}
            />
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            <SortableHeader
              label="Date Received"
              sortKey="dateReceived"
              currentSort={sortConfig}
              onSort={handleSort}
            />
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            <SortableHeader
              label="Discrepancies"
              sortKey="discrepancies"
              currentSort={sortConfig}
              onSort={handleSort}
            />
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {sortedLogs.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={10} align="center">No transfer logs found.</Table.Cell>
          </Table.Row>
        ) : (
          sortedLogs.map((log) => {
            const origin = organization.find(org => org.id === log.originId)?.name || 'Unknown';
            const destination = organization.find(org => org.id === log.destinationId)?.name || 'Unknown';
            const creator = getUserById(log.createdBy)?.name || 'Unknown';
            const approver = log.approvedBy ? getUserById(log.approvedBy)?.name || 'Unknown' : '-';
            
            return (
              <Table.Row key={log.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800" onClick={() => onViewDetails(log)}>
                <Table.RowHeaderCell>{log.transferNumber}</Table.RowHeaderCell>
                
                <Table.Cell>{formatDate(new Date(log.dateCreated))}</Table.Cell>
                
                <Table.Cell>{origin}</Table.Cell>
                
                <Table.Cell>{destination}</Table.Cell>
                
                <Table.Cell>
                  {getTransferStatusBadge({ status: log.status })}
                </Table.Cell>
                
                <Table.Cell>
                  {log.dateReceived ? formatDate(new Date(log.dateReceived)) : '-'}
                </Table.Cell>
                
                <Table.Cell>
                  {log.hasDiscrepancies && (
                    <Badge color="red" size="1">
                      <Flex gap="1" align="center">
                        <AlertTriangle size={12} />
                        <Text size="1">Yes</Text>
                      </Flex>
                    </Badge>
                  )}
                </Table.Cell>
                
                <Table.Cell>
                  <Button size="1" onClick={() => onViewDetails(log)}>
                    View
                    <ChevronRight size={14} />
                  </Button>
                </Table.Cell>
              </Table.Row>
            );
          })
        )}
      </Table.Body>
    </Table.Root>
  );
};

export default StockTransferLogsTable; 