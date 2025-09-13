
'use client';

import { Dialog, Button, Flex } from '@radix-ui/themes';
import ProductForm from './ProductForm';
import { Product } from '@/types/product';

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductAdd: (product: Partial<Product>) => void;
}

export default function AddProductModal({ open, onOpenChange, onProductAdd }: AddProductModalProps) {
  const handleFormSubmit = (formData: Partial<Product>) => {
    onProductAdd(formData);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 1200 }}>
        <Dialog.Title>Add New Product</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Fill in the details to create a new product.
        </Dialog.Description>

        <ProductForm
          selectedItem={null}
          onBack={() => onOpenChange(false)}
          onSubmit={handleFormSubmit}
        />
      </Dialog.Content>
    </Dialog.Root>
  );
}
