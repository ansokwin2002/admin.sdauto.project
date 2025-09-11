'use client';

import { useRouter } from 'next/navigation';
import { Box } from '@radix-ui/themes';
import PurchaseOrderForm from '@/components/purchasing/purchase-order/PurchaseOrderForm';
import { PurchaseOrder } from '@/data/PurchaseOrderData';
import { toast } from 'sonner';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function AddPurchaseOrderPage() {
  const router = useRouter();
  usePageTitle('Create Purchase Order');

  const handleSavePurchaseOrder = (poData: Partial<PurchaseOrder>) => {
    console.log('Saving new purchase order:', poData);

    toast.success('Purchase order created successfully!');

    setTimeout(() => {
       router.push('/purchasing/purchase-orders?tab=list'); 
    }, 500);
  };

  const handleCancel = () => {
    router.push('/purchasing/purchase-orders?tab=list');
  };

  return (
    <Box>
      <PurchaseOrderForm 
        onSubmit={handleSavePurchaseOrder} 
        onCancel={handleCancel} 
        editingItem={null} 
      />
    </Box>
  );
} 