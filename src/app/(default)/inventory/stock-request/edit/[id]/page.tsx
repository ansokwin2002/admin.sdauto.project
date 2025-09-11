'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Text, 
  Button,
  Callout
} from '@radix-ui/themes';
import { 
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { 
  mockStockRequests, 
  StockRequest, 
  updateStockRequest
} from '@/data/StockRequestData';
import StockRequestForm from '@/components/inventory/StockRequestForm'; // Import the reusable form
import { PageHeading } from '@/components/common/PageHeading';

export default function EditStockRequestPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [request, setRequest] = useState<StockRequest | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  
  useEffect(() => {
    if (params.id) {
      const foundRequest = mockStockRequests.find(req => req.id === params.id);
      
      if (foundRequest) {
        setRequest(foundRequest);
        // Check if the request is editable (status is 'New')
        setIsEditable(foundRequest.status === 'New');
      } else {
        setRequest(null);
      }
      setIsLoading(false);
    }
  }, [params.id]);
  
  const handleSave = (updatedData: Omit<StockRequest, 'id'>) => {
    if (!request || !isEditable) return; // Don't save if not found or not editable
    
    const updatedRequest = updateStockRequest(request.id, updatedData);
    
    if (updatedRequest) {
      router.push(`/inventory/stock-request/${updatedRequest.id}`);
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
  
  return (
    <Box className="space-y-4">
      <PageHeading
        title="Edit Stock Request"
        description={`Update stock request #${request.requestNumber}`}
        showBackButton
        onBackClick={() => router.push(`/inventory/stock-request`)}
      />
      
      {!isEditable && (
        <Callout.Root color="yellow" role="alert">
          <Callout.Icon>
            <AlertTriangle />
          </Callout.Icon>
          <Callout.Text>
            This stock request cannot be edited because its status is not &apos;New&apos;.
          </Callout.Text>
        </Callout.Root>
      )}
      
      <StockRequestForm 
        request={request} 
        readOnly={!isEditable} 
        onSave={isEditable ? handleSave : undefined} 
        onCancel={() => router.back()}
      />
    </Box>
  );
} 