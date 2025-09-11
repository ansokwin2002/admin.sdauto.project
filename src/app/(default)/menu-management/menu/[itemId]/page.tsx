'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Box, Text } from '@radix-ui/themes';
import MenuForm from '@/components/menu-management/menu/MenuForm';
import { menuItems, MenuItem } from '@/data/MenuData';
import { toast } from 'sonner';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function EditMenuItemPage() {
  usePageTitle('Edit Menu Item');
  const router = useRouter();
  const params = useParams();
  const itemId = params.itemId as string;
  const [selectedItem, setSelectedItem] = useState<MenuItem | null | undefined>(undefined);

  useEffect(() => {
    if (itemId) {
      const item = menuItems.find(item => item.id === itemId);
      setSelectedItem(item || null);
    }
  }, [itemId]);

  const handleBackToList = () => {
    router.push('/menu-management/menu?tab=list');
  };

  const handleSubmitForm = () => {
    // TODO: Implement form submission logic for updating an existing item
    console.log('Submit updated item form for ID:', itemId);
    toast.success('Item updated successfully!');
    handleBackToList();
  };

  if (selectedItem === undefined) {
    return <Box p="4"><Text>Loading...</Text></Box>; 
  }

  if (selectedItem === null) {
    return (
      <Box p="4">
        <Text color="red">Menu item not found.</Text>
      </Box>
    );
  }

  return (
    <MenuForm
      selectedItem={selectedItem}
      onBack={handleBackToList}
      onSubmit={handleSubmitForm}
    />
  );
} 