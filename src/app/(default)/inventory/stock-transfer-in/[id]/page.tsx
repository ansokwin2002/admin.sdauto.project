'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Heading,
  Text,
  Button,
  Flex,
  Table,
  Badge,
  IconButton,
  TextArea,
  TextField,
  Select,
  Callout,
} from '@radix-ui/themes';
import { ArrowLeft, CheckCircle, AlertTriangle, Camera, X, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { StockRequest, mockStockRequests } from '@/data/StockRequestData';
import { organization } from '@/data/CommonData';
import { getStockItemById } from '@/data/StockRequestData';
import { formatDate } from '@/utilities/index';
import { toast } from 'sonner';
import Image from 'next/image';
import { getTransferStatusBadge } from '@/utilities/transferStatusBadge';
import { PageHeading } from '@/components/common/PageHeading';

// Only 'Delivering' status is relevant for receiving
const RELEVANT_STATUS = 'Delivering';
// Assumed Los Angeles branch ID
const ASSUMED_DESTINATION = 'br-1';

// Interface for received item count and condition
interface ReceivedItemState {
  id: string;
  stockItemId: string;
  expectedQuantity: number;
  receivedQuantity: number;
  condition: 'good' | 'damaged' | 'partial' | '';
  notes: string;
}

// Interface for uploaded photos
interface UploadedPhoto {
  id: string;
  url: string;
  file: File;
}

export default function StockTransferInDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const requestId = params.id as string;

  const [stockRequest, setStockRequest] = useState<StockRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [receivedItems, setReceivedItems] = useState<ReceivedItemState[]>([]);
  const [generalNotes, setGeneralNotes] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);

  // Fetch the stock request details
  useEffect(() => {
    setLoading(true);
    // In a real app, this would be an API call
    // For now, we'll simulate by finding the request in our mock data
    try {
      const foundRequest = mockStockRequests.find(req => req.id === requestId);
      
      if (!foundRequest) {
        setError('Stock transfer request not found');
        setStockRequest(null);
      } else if (foundRequest.status !== RELEVANT_STATUS || foundRequest.destinationId !== ASSUMED_DESTINATION) {
        setError('This request is not available for processing');
        setStockRequest(null);
      } else {
        setStockRequest(foundRequest);
        
        // Initialize received items with expected quantities
        const initialItems = foundRequest.items.map(item => ({
          id: item.id,
          stockItemId: item.stockItemId,
          expectedQuantity: item.quantity,
          receivedQuantity: item.quantity, // Default to expected (can be adjusted)
          condition: 'good' as const,
          notes: '',
        }));
        setReceivedItems(initialItems);
        
        setError(null);
      }
    } catch (err) {
      setError(`Failed to load stock transfer details: ${err}`);
      setStockRequest(null);
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  // Update received quantity for an item
  const handleQuantityChange = (id: string, value: number) => {
    setReceivedItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { 
              ...item, 
              receivedQuantity: value,
              // Auto-update condition based on quantity
              condition: 
                value === 0 ? 'damaged' : 
                value < item.expectedQuantity ? 'partial' : 
                'good'
            } 
          : item
      )
    );
  };

  // Update condition of an item
  const handleConditionChange = (id: string, condition: 'good' | 'damaged' | 'partial') => {
    setReceivedItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, condition } : item
      )
    );
  };

  // Update notes for an item
  const handleNotesChange = (id: string, notes: string) => {
    setReceivedItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, notes } : item
      )
    );
  };

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      
      filesArray.forEach(file => {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          if (event.target?.result) {
            const newPhoto: UploadedPhoto = {
              id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              url: event.target.result as string,
              file: file
            };
            
            setUploadedPhotos(prev => [...prev, newPhoto]);
          }
        };
        
        reader.readAsDataURL(file);
      });
    }
  };

  // Remove a photo
  const handleRemovePhoto = (id: string) => {
    setUploadedPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  // Confirm receipt of the transfer
  const handleConfirmReceipt = () => {
    if (!stockRequest) return;
    
    // Check for discrepancies
    const hasDiscrepancies = receivedItems.some(item => 
      item.receivedQuantity !== item.expectedQuantity || 
      item.condition !== 'good' || 
      item.notes.trim() !== ''
    );
    
    // In a real app, this would be an API call
    console.log(`Confirming receipt of transfer ${stockRequest.requestNumber}`);
    console.log('Received items:', receivedItems);
    console.log('General notes:', generalNotes);
    console.log('Photos uploaded:', uploadedPhotos.length);
    
    // Update local state
    setStockRequest({
      ...stockRequest,
      status: 'Completed',
      // In a real app, we would store the receipt details
      notes: stockRequest.notes 
        ? `${stockRequest.notes}\nReceipt Notes: ${generalNotes}` 
        : `Receipt Notes: ${generalNotes}`
    });
    
    // Show success message
    if (hasDiscrepancies) {
      toast.success('Transfer received with discrepancies noted.');
    } else {
      toast.success('Transfer received successfully.');
    }
    
    // Navigate back to the list
    router.push('/inventory/stock-transfer-in');
  };

  // Navigate back to the main stock transfer in page
  const handleBack = () => {
    router.push('/inventory/stock-transfer-in');
  };

  if (loading) {
    return (
      <Box className="p-6">
        <Text>Loading stock transfer details...</Text>
      </Box>
    );
  }

  if (error || !stockRequest) {
    return (
      <Box className="p-6">
        <Flex align="center" gap="3" mb="4">
          <IconButton variant="ghost" onClick={handleBack}>
            <ArrowLeft size={20} />
          </IconButton>
          <Heading size="6">Stock Transfer In Error</Heading>
        </Flex>
        <Card>
          <Text color="red">{error || 'Stock transfer not found'}</Text>
          <Button mt="4" onClick={handleBack}>Back to Incoming Transfers</Button>
        </Card>
      </Box>
    );
  }

  // Get origin and destination names
  const originName = organization.find(org => org.id === stockRequest.originId)?.name || 'Unknown';
  const destinationName = organization.find(org => org.id === stockRequest.destinationId)?.name || 'Unknown';

  // Check if all items have been processed
  const allItemsProcessed = receivedItems.every(item => item.condition !== '');
  
  // Check if there are any discrepancies
  const hasDiscrepancies = receivedItems.some(item => 
    item.receivedQuantity !== item.expectedQuantity || 
    item.condition !== 'good'
  );

  return (
    <Box className="space-y-4">
      {/* Header section with back button */}
      <PageHeading 
        title={`Receive Stock: ${stockRequest.requestNumber}`}
        description={`Process receipt of transfer from ${originName}`}
        showBackButton
        onBackClick={handleBack}
      />

      {/* Request details card */}
      <Card size="3">
        <Flex direction="column" gap="3">
          <Flex justify="between" wrap="wrap" gap="4">
            <Box>
              <Text as="p" size="2" className="text-slate-500 dark:text-neutral-500">Request Number</Text>
              <Text as="p" size="2" weight="medium" className="text-slate-800 dark:text-neutral-200">{stockRequest.requestNumber}</Text>
            </Box>
            <Box>
              <Text as="p" size="2" className="text-slate-500 dark:text-neutral-500">Status</Text>
              {getTransferStatusBadge({ status: stockRequest.status })}
            </Box>
            <Box>
              <Text as="p" size="2" className="text-slate-500 dark:text-neutral-500">Expected Date</Text>
              <Text as="p" size="2" weight="medium" className="text-slate-800 dark:text-neutral-200">{formatDate(stockRequest.date)}</Text>
            </Box>
            <Box>
              <Text as="p" size="2" className="text-slate-500 dark:text-neutral-500">From</Text>
              <Text as="p" size="2" weight="medium" className="text-slate-800 dark:text-neutral-200">{originName}</Text>
            </Box>
            <Box>
              <Text as="p" size="2" className="text-slate-500 dark:text-neutral-500">To</Text>
              <Text as="p" size="2" weight="medium" className="text-slate-800 dark:text-neutral-200">{destinationName}</Text>
            </Box>
          </Flex>

          {stockRequest.notes && (
            <Box className="bg-slate-50 dark:bg-neutral-800 p-4 rounded-md mt-2">
              <Text as="p" size="2" className="text-slate-500 dark:text-neutral-500 mb-1">Transfer Notes</Text>
              <Text as="p" size="2" className="text-slate-800 dark:text-neutral-200">{stockRequest.notes}</Text>
            </Box>
          )}
        </Flex>
      </Card>

      {/* Items verification section */}
      <Box>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Expected</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Received</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Condition</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Notes</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {receivedItems.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={5} align="center">No items found in this transfer.</Table.Cell>
              </Table.Row>
            ) : (
              receivedItems.map((item) => {
                const stockItem = getStockItemById(item.stockItemId);
                const hasDiscrepancy = item.receivedQuantity !== item.expectedQuantity;
                
                return (
                  <Table.Row key={item.id}>
                    <Table.RowHeaderCell>
                      <Flex direction="column">
                        <Text weight="bold">{stockItem?.name || 'Unknown Item'}</Text>
                        <Text size="1" color="gray">{stockItem?.sku || ''}</Text>
                      </Flex>
                    </Table.RowHeaderCell>
                    
                    <Table.Cell>
                      {item.expectedQuantity} {stockItem?.storageUnit || 'units'}
                    </Table.Cell>
                    
                    <Table.Cell>
                      <Flex gap="2" align="center">
                        <TextField.Root 
                          type="number" 
                          size="2"
                          value={item.receivedQuantity.toString()}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                        <Text size="1">{stockItem?.storageUnit || 'units'}</Text>
                        
                        {hasDiscrepancy && (
                          <Badge color="red" size="1">
                            <Flex gap="1" align="center">
                              <AlertTriangle size={12} />
                              {item.receivedQuantity < item.expectedQuantity 
                                ? `Missing ${item.expectedQuantity - item.receivedQuantity}` 
                                : `Extra ${item.receivedQuantity - item.expectedQuantity}`}
                            </Flex>
                          </Badge>
                        )}
                      </Flex>
                    </Table.Cell>
                    
                    <Table.Cell>
                      <Select.Root 
                        value={item.condition} 
                        onValueChange={(value) => handleConditionChange(item.id, value as 'good' | 'damaged' | 'partial')}
                        size="2"
                      >
                        <Select.Trigger />
                        <Select.Content>
                          <Select.Item value="good">Good</Select.Item>
                          <Select.Item value="damaged">Damaged</Select.Item>
                          <Select.Item value="partial">Partial</Select.Item>
                        </Select.Content>
                      </Select.Root>
                    </Table.Cell>
                    
                    <Table.Cell>
                      <TextArea 
                        placeholder="Enter any issues..." 
                        value={item.notes}
                        onChange={(e) => handleNotesChange(item.id, e.target.value)}
                        size="2"
                        className="min-w-[150px]"
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })
            )}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* Additional notes and photo upload */}
      <Card size="3">
        <Flex direction="column" gap="4">         
          <Box>
            <Text as="p" weight="bold" size="2" mb="1">General Notes</Text>
            <TextArea
              placeholder="Enter any general notes about this receipt..."
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
            />
          </Box>
          
          <Box>
            <Text as="p" weight="bold" size="2" mb="1">Upload Photos (optional)</Text>
            <Flex gap="3" align="center">
              <label htmlFor="photo-upload">
                <Button size="2" variant="soft" onClick={() => document.getElementById('photo-upload')?.click()}>
                  <Camera size={16} />
                  Add Photos
                </Button>
              </label>
              <input 
                id="photo-upload" 
                type="file" 
                accept="image/*" 
                multiple
                style={{ display: 'none' }} 
                onChange={handlePhotoUpload}
              />
            </Flex>
            
            {uploadedPhotos.length > 0 && (
              <Box mt="3">
                <Flex gap="3" wrap="wrap">
                  {uploadedPhotos.map(photo => (
                    <Box key={photo.id} position="relative" className="border border-gray-200 group">
                      <Image 
                        src={photo.url} 
                        alt="Preview" 
                        width={120}
                        height={90}
                        style={{ 
                          width: '120px', 
                          height: '90px', 
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }} 
                      />
                      <IconButton 
                        size="1" 
                        color="red" 
                        variant="solid" 
                        onClick={() => handleRemovePhoto(photo.id)}
                        className="!absolute !top-1 !right-1"
                      >
                        <Trash2 size={14} />
                      </IconButton>
                    </Box>
                  ))}
                </Flex>
              </Box>
            )}
          </Box>
        </Flex>
      </Card>

      {/* Action buttons */}      
      {hasDiscrepancies && (
        <Callout.Root color="amber">
          <Flex gap="2" align="center">
            <AlertTriangle size={16} className="text-orange-700" />
            <Text weight="bold" className="text-orange-700">Discrepancies Detected</Text>
          </Flex>
          <Text as="p" size="2">
            There are differences between expected and received items. Please make sure to document these issues before confirming receipt.
          </Text>
        </Callout.Root>
      )}
      
      <Flex gap="3">
        <Button 
          color="green" 
          onClick={handleConfirmReceipt}
          disabled={!allItemsProcessed}
        >
          <CheckCircle size={16} />
          Confirm Receipt
        </Button>
        <Button variant="soft" color="gray" onClick={handleBack}>
          <X size={16} />
          Cancel
        </Button>
      </Flex>
    </Box>
  );
} 