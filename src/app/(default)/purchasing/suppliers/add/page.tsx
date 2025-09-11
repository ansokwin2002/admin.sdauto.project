'use client';

import SupplierDetails from '@/components/purchasing/supplier/SupplierDetails';
import { Supplier } from '@/types/inventory';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function AddSupplierPage() {
  usePageTitle('Add Supplier');
  const router = useRouter();

  const handleAddItem = (newSupplier: Supplier) => {
    // Implement API call to add the supplier
    console.log('Adding new supplier:', newSupplier); 
    
    toast.success('Supplier added successfully!');
    setTimeout(() => {
       router.push('/purchasing/suppliers'); 
    }, 500);
  };

  const handleCancel = () => {
    router.push('/purchasing/suppliers');
  };

  return <SupplierDetails
    onSubmit={handleAddItem} 
    onCancel={handleCancel} 
    editingItem={null} 
  />;
} 