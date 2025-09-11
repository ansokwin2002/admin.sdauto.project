'use client';

import React, { useEffect, useState } from 'react';
import { Box, Flex, Spinner, Text } from '@radix-ui/themes';
import IngredientItemForm from '@/components/inventory/IngredientItemForm';
import { useRouter, useParams } from 'next/navigation';
import { IngredientItem } from '@/types/inventory';
import { ingredientItems } from '@/data/IngredientItemsData';
import { toast } from 'sonner';

export default function EditIngredientItemPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.itemId as string;

  const [itemToEdit, setItemToEdit] = useState<IngredientItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    const item = ingredientItems.find(i => i.id === itemId);
    if (item) {
      setItemToEdit(item);
    } else {
      console.error(`Ingredient item with ID ${itemId} not found.`);
    }
    setLoading(false);
  }, [itemId, router]);

  const handleUpdateItem = (updatedData: Omit<IngredientItem, 'id'>) => {
    console.log('Updated Item Data (ID:', itemId, '):', updatedData);
    toast.success('Ingredient item updated successfully!');
    setTimeout(() => {
      router.push('/inventory/ingredient-items');
    }, 500);
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" style={{ height: '200px' }}>
        <Spinner size="3" />
      </Flex>
    );
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  if (!itemToEdit) {
    return <Box>Ingredient item not found.</Box>;
  }

  return (
    <Box className="space-y-4">
      <IngredientItemForm 
        onSubmit={handleUpdateItem} 
        onCancel={handleCancel} 
        editingItem={itemToEdit}
      />
    </Box>
  );
} 