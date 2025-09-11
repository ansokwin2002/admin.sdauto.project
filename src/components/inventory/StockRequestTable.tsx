'use client';

import React, { useState, useMemo } from 'react';
import { Table, Flex, Text, Badge, IconButton } from '@radix-ui/themes';
import { Trash2, FileText, Edit } from 'lucide-react';
import { StockRequest, StockRequestStatus } from '@/data/StockRequestData';
import { organization } from '@/data/CommonData';
import { formatDate } from '@/utilities';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { SortableHeader } from '@/components/common/SortableHeader';

interface StockRequestTableProps {
  stockRequests: StockRequest[];
  onEdit: (request: StockRequest) => void;
  onDelete: (id: string) => void;
  onView: (request: StockRequest) => void;
}

const StockRequestTable: React.FC<StockRequestTableProps> = ({
  stockRequests,
  onEdit,
  onDelete,
  onView
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<StockRequest | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getBranchName = (id: string) => {
    const entity = organization.find(org => org.id === id);
    return entity ? entity.name : 'Unknown';
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
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'origin':
          aValue = getBranchName(a.originId);
          bValue = getBranchName(b.originId);
          break;
        case 'destination':
          aValue = getBranchName(a.destinationId);
          bValue = getBranchName(b.destinationId);
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
  
  const handleDeleteClick = (request: StockRequest) => {
    setRequestToDelete(request);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (requestToDelete) {
      onDelete(requestToDelete.id);
    }
  };
  
  const getStatusBadge = (status: StockRequestStatus) => {
    switch (status) {
      case 'New':
        return <Badge color="blue">New</Badge>;
      case 'Rejected':
        return <Badge color="red">Rejected</Badge>;
      case 'Approved':
        return <Badge color="green">Approved</Badge>;
      case 'Delivering':
        return <Badge color="orange">Delivering</Badge>;
      case 'Completed':
        return <Badge color="green">Completed</Badge>;
      default:
        return <Badge color="gray">{status}</Badge>;
    }
  };
  
  return (
    <>
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
                label="Date"
                sortKey="date"
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
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        
        <Table.Body>
          {sortedRequests.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={6}>
                <Text align="center" className="py-4">No stock requests found</Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            sortedRequests.map(request => (
              <Table.Row key={request.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800" onClick={() => onView(request)}>
                <Table.Cell>{request.requestNumber}</Table.Cell>
                <Table.Cell>{formatDate(request.date)}</Table.Cell>
                <Table.Cell>{getBranchName(request.originId)}</Table.Cell>
                <Table.Cell>{getBranchName(request.destinationId)}</Table.Cell>
                <Table.Cell>{getStatusBadge(request.status)}</Table.Cell>
                <Table.Cell>
                  <Flex gap="3" justify="center">
                    <IconButton 
                      size="1" 
                      variant="ghost"
                      color="gray"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        onView(request); 
                      }}
                    >
                      <FileText size={14} />
                    </IconButton>
                    <IconButton
                      size="1"
                      variant="ghost"
                      color="gray"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(request);
                      }}
                      disabled={request.status !== 'New'}
                      title={request.status !== 'New' ? "Cannot edit non-'New' requests" : "Edit Request"}
                    >
                      <Edit size={14} />
                    </IconButton>
                    <IconButton 
                      size="1" 
                      variant="ghost" 
                      color="red" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(request);
                      }}
                      disabled={request.status !== 'New'}
                      title={request.status !== 'New' ? "Cannot delete non-'New' requests" : "Delete Request"}
                    >
                      <Trash2 size={14} />
                    </IconButton>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
      
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        description={`Are you sure you want to delete stock request #${requestToDelete?.requestNumber}? This action cannot be undone.`}
        confirmText="Delete"
        color="red"
      />
    </>
  );
};

export default StockRequestTable; 