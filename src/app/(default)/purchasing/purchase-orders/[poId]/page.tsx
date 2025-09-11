'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PurchaseOrderForm from '@/components/purchasing/purchase-order/PurchaseOrderForm';
import { Box, Callout } from '@radix-ui/themes';
import { PurchaseOrder, getPurchaseOrderById, updatePurchaseOrder } from '@/data/PurchaseOrderData';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function PurchaseOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const poId = params.poId as string;
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  usePageTitle(purchaseOrder?.poNumber);

  useEffect(() => {
    // Fetch purchase order data
    const fetchPurchaseOrder = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const po = getPurchaseOrderById(poId);
        if (!po) {
          setError("Purchase order not found");
        } else {
          setPurchaseOrder(po);
        }
      } catch (error) {
        console.error('Error fetching purchase order:', error);
        setError("Error loading purchase order");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchaseOrder();
  }, [poId]);

  const handleCancel = () => {
    router.push('/purchasing/purchase-orders?tab=list');
  };

  const handleUpdateItem = (formData: Partial<PurchaseOrder>) => {
    if (!purchaseOrder) {
      setError("Cannot update: Purchase order not found");
      return;
    }
    
    if (purchaseOrder.orderStatus !== 'Draft') {
      toast.error("Only purchase orders in Draft status can be edited.");
      return;
    }
    
    // Update the purchase order
    try {
      const updatedPO = updatePurchaseOrder(purchaseOrder.id, formData);
      if (updatedPO) {
        setPurchaseOrder(updatedPO);
        toast.success('Purchase order updated successfully!');
        setTimeout(() => {
          router.push('/purchasing/purchase-orders?tab=list');
        }, 500);
      } else {
        toast.error("Failed to update purchase order");
      }
    } catch (error) {
      console.error('Error updating purchase order:', error);
      toast.error("An error occurred while updating the purchase order.");
    }
  };

  if (isLoading) {
    return <Box p="4">Loading purchase order...</Box>;
  }

  return (
    <Box>
      {error && (
        <Callout.Root color="red" size="2" mb="4">
          <Callout.Icon>
            <AlertTriangle />
          </Callout.Icon>
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <PurchaseOrderForm 
        editingItem={purchaseOrder}
        onSubmit={handleUpdateItem}
        onCancel={handleCancel}
      />
    </Box>
  );
} 