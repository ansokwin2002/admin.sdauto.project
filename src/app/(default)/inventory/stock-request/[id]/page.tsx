'use client';

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Text, 
  Button, 
  Flex,
  Badge
} from '@radix-ui/themes';
import { ArrowLeft, Check, Edit, Trash2, X } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { 
  mockStockRequests, 
  StockRequest, 
  deleteStockRequest,
  updateStockRequest
} from '@/data/StockRequestData';
import StockRequestForm from '@/components/inventory/StockRequestForm';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { PageHeading } from '@/components/common/PageHeading';

export default function StockRequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [request, setRequest] = useState<StockRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  
  useEffect(() => {
    if (params.id) {
      const foundRequest = mockStockRequests.find(req => req.id === params.id);
      setRequest(foundRequest || null);
      setIsLoading(false);
    }
  }, [params.id]);

  const handleEditClick = () => {
    if (request && request.status === 'New') {
      router.push(`/inventory/stock-request/edit/${request.id}`);
    } else if (request) {
      alert('This request cannot be edited as its status is not New.');
    }
  };

  const handleDeleteClick = () => {
    if (request && request.status === 'New') {
      setDeleteDialogOpen(true);
    } else {
      alert('Cannot delete requests that are not in New status.');
    }
  };
  
  const confirmDelete = () => {
    if (request) {
      deleteStockRequest(request.id);
      router.push('/inventory/stock-request');
    }
  };

  const handleApproveClick = () => {
    if (request && request.status === 'New') {
      updateStockRequest(request.id, { status: 'Approved' });
      setRequest({ ...request, status: 'Approved' });
    }
  };

  const handleRejectClick = () => {
    if (request && request.status === 'New') {
      setRejectDialogOpen(true);
    }
  };

  const confirmReject = () => {
    if (request) {
      updateStockRequest(request.id, { status: 'Rejected' });
      setRequest({ ...request, status: 'Rejected' });
    }
  };
  
  const getStatusBadge = (status: StockRequest['status']) => {
    switch (status) {
      case 'New': return <Badge color="blue">New</Badge>;
      case 'Rejected': return <Badge color="red">Rejected</Badge>;
      case 'Approved': return <Badge color="green">Approved</Badge>;
      case 'Delivering': return <Badge color="orange">Delivering</Badge>;
      case 'Completed': return <Badge color="green">Completed</Badge>;
      default: return <Badge color="gray">{status}</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <Box className="p-8 text-center">
        <Text>Loading...</Text>
      </Box>
    );
  }
  
  if (!request) {
    return (
      <Box className="p-8 text-center">
        <Text>Stock request not found.</Text>
        <Button onClick={() => router.push('/inventory/stock-request')} mt="4">
          <ArrowLeft size={16} />
          Back to Stock Requests
        </Button>
      </Box>
    );
  }
  
  const canEdit = request.status === 'New';
  const canApproveReject = request.status === 'New';
  
  return (
    <Box className="space-y-4">
      <Flex justify="between" align="center" mb="5">
        <PageHeading
          title={`Stock Request #${request.requestNumber}`}
          description="View stock request details (HQ View)"
          noMarginBottom badge={getStatusBadge(request.status)}
          showBackButton
          onBackClick={() => router.push('/inventory/stock-request')}
        />
        <Flex gap="3">
          {canEdit && (
            <>
              <Button variant="soft" onClick={handleEditClick}>
                <Edit size={16} />
                Edit
              </Button>
              <Button variant="soft" color="red" onClick={handleDeleteClick}>
                <Trash2 size={16} />
                Delete
              </Button>
            </>
          )}
        </Flex>
      </Flex>
      
      <StockRequestForm 
        request={request} 
        readOnly={true} 
        onCancel={() => {}}
      />
      {canApproveReject && (
        <Flex gap="2" justify="end">
          <Button color="green" onClick={handleApproveClick}>
            <Check size={16} />
            Approve
          </Button>
          <Button color="red" onClick={handleRejectClick}>
            <X size={16} />
            Reject
          </Button>
        </Flex>
      )}
      
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        description={`Are you sure you want to delete stock request #${request?.requestNumber}? This action cannot be undone.`}
        confirmText="Delete"
        color="red"
      />
      
      <ConfirmDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        onConfirm={confirmReject}
        title="Confirm Reject"
        description={`Are you sure you want to reject stock request #${request?.requestNumber}?`}
        confirmText="Reject"
        color="red"
      />
    </Box>
  );
} 