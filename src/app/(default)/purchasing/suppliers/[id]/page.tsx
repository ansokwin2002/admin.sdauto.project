'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SupplierDetails from '@/components/purchasing/supplier/SupplierDetails';
import { Supplier } from '@/types/inventory';
import { mockSuppliers } from '@/data/SupplierData';
import { Text } from '@radix-ui/themes';
import { toast } from 'sonner';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function SupplierDetailPage() {
  usePageTitle('Edit Supplier');
  const router = useRouter();
  const params = useParams();
  const supplierId = params.id as string;

  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Simulate fetching the supplier data
    const fetchedSupplier = mockSuppliers.find(s => s.id === supplierId);
    
    if (fetchedSupplier) {
      setSupplier(fetchedSupplier);
    } else {
      setError(`Supplier with ID ${supplierId} not found.`);
    }
    setLoading(false);
  }, [supplierId]);

  const handleUpdateItem = (updatedSupplier: Supplier) => {
    // Implement API call to update the supplier
    console.log('Updating supplier:', updatedSupplier);
    
    toast.success('Supplier updated successfully!');

    setTimeout(() => {
      router.push('/purchasing/suppliers');
    }, 500);
  };

  const handleCancel = () => {
    router.push('/purchasing/suppliers');
  };

  if (loading) {
    return <Text>Loading supplier details...</Text>;
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  return <SupplierDetails
    editingItem={supplier}
    onSubmit={handleUpdateItem}
    onCancel={handleCancel}
  />;
}
