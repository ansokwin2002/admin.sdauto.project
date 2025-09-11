'use client';

import React from 'react';
import { Box } from '@radix-ui/themes';
import IngredientItemForm from '@/components/inventory/IngredientItemForm';
import { useRouter } from 'next/navigation';
import { IngredientItem } from '@/types/inventory';
import { toast } from 'sonner';

export default function AddIngredientItemPage() {
  const router = useRouter();

  const handleAddItem = (newItem: IngredientItem) => {
    // TODO: Implement API call to add the ingredient item
    console.log('Adding new ingredient item:', newItem);

    // Assuming success for now
    toast.success('Ingredient item added successfully!');

    // Navigate back to the list page after a short delay
    setTimeout(() => {
      router.push('/inventory/ingredient-items');
    }, 500);
  };

  const handleCancel = () => {
    router.push('/inventory/ingredient-items');
  };

  return (
    <Box className="space-y-4">
      <IngredientItemForm 
        onSubmit={handleAddItem} 
        onCancel={handleCancel} 
        editingItem={null}
      />
    </Box>
  );
} 