'use client';

import { useRouter } from 'next/navigation';
import MenuForm from '@/components/menu-management/menu/MenuForm';
import { usePageTitle } from '@/hooks/usePageTitle';
import { toast } from 'sonner';

export default function AddMenuItemPage() {
  usePageTitle('Add Menu Item');
  const router = useRouter();

  const handleBackToList = () => {
    router.push('/menu-management/menu?tab=list');
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