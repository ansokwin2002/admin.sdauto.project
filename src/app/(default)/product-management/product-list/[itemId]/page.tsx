'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Box, Text } from '@radix-ui/themes';
import ProductForm from '@/components/product-management/product-list/ProductForm';
import { Product } from '@/types/product';
import { toast } from 'sonner';
import { usePageTitle } from '@/hooks/usePageTitle';
import { API_BASE_URL } from '@/utilities/constants';
import NProgress from 'nprogress';

export default function EditMenuItemPage() {
  usePageTitle('Edit Product');
  const router = useRouter();
  const params = useParams();
  const itemId = params.itemId as string;
  const [selectedItem, setSelectedItem] = useState<Product | null | undefined>(undefined);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!itemId) return;

      NProgress.start();
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/${itemId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setSelectedItem(data.data); // Assuming API returns { data: Product }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'An unknown error occurred', { duration: Infinity, closeButton: true });
        setSelectedItem(null); // Indicate not found or error
      } finally {
        NProgress.done();
      }
    };

    fetchProduct();
  }, [itemId]);

  const handleBackToList = () => {
    router.push('/product-management/product-list?tab=list&refresh=true');
  };

  const handleSubmitForm = async (formData: Partial<Product> & { image_urls?: string[], images?: File[], videos?: string[], deleted_images?: string[] }) => {
    NProgress.start();
    try {
      const productFormData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'is_active') {
          productFormData.append(key, value ? '1' : '0');
        } else if (key === 'category') {
          if (value !== '' && value !== null && value !== undefined) {
            productFormData.append(key, value as string);
          }
        } else if (key !== 'images' && key !== 'image_urls' && key !== 'videos' && key !== 'deleted_images') {
          productFormData.append(key, value as string);
        }
      });

      if (formData.image_urls) {
        formData.image_urls.forEach(url => {
          productFormData.append('image_urls[]', url);
        });
      }

      if (formData.images) {
        formData.images.forEach(file => {
          productFormData.append('images[]', file);
        });
      }

      if (formData.videos) {
        formData.videos.forEach(url => {
          productFormData.append('videos[]', url);
        });
      }

      if (formData.deleted_images) {
        formData.deleted_images.forEach(url => {
          productFormData.append('deleted_images[]', url);
        });
      }

      const response = await fetch(`${API_BASE_URL}/api/products/${itemId}`, {
        method: 'POST', // Use POST for FormData with PUT/PATCH method override
        headers: {
          'Accept': 'application/json',
          'X-HTTP-Method-Override': 'PUT', // Laravel expects this for PUT/PATCH with FormData
        },
        body: productFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 422) {
          const messages = Object.values(errorData.errors).flat();
          toast.error(messages.join('\n'), { duration: Infinity, closeButton: true });
        } else {
          throw new Error(errorData.message || 'Failed to update product');
        }
        return;
      }

      const result = await response.json();
      toast.success(result.message || 'Product updated successfully!', { duration: Infinity, closeButton: true });
      handleBackToList();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred', { duration: Infinity, closeButton: true });
    } finally {
      NProgress.done();
    }
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
    <ProductForm
      selectedItem={selectedItem}
      onBack={handleBackToList}
      onSubmit={handleSubmitForm}
    />
  );
} 