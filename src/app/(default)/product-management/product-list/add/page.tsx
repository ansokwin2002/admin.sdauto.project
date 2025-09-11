'use client';

import { useRouter } from 'next/navigation';
import ProductForm from '@/components/product-management/product-list/ProductForm';
import { usePageTitle } from '@/hooks/usePageTitle';
import { toast } from 'sonner';

export default function AddMenuItemPage() {
  usePageTitle('Add Product');
  const router = useRouter();

  const handleBackToList = () => {
    router.push('/product-management/product-list?tab=list');
  };

  const handleSubmitForm = () => {
    // TODO: Implement form submission logic for adding a new item
    console.log('Submit new item form');
    toast.success('Item added successfully!');
    handleBackToList();
  };

  return (
    <MenuForm
      selectedItem={null}
      onBack={handleBackToList}
      onSubmit={handleSubmitForm}
    />
  );
} 