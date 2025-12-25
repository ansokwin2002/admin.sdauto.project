'use client';

import { useState, useEffect, Suspense } from 'react';
import { Box, Tabs, Flex, Button, Text } from '@radix-ui/themes';
import { PlusIcon, LayoutDashboard, List } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterBranchProvider } from '@/contexts/FilterBranchContext';
import ProductDashboard from '@/components/product-management/product-list/ProductDashboard';
import ProductList from '@/components/product-management/product-list/ProductList';
import { PageHeading } from '@/components/common/PageHeading';
import { usePageTitle } from '@/hooks/usePageTitle';
import AddProductModal from '@/components/product-management/product-list/AddProductModal';
import { Product } from '@/types/product';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/utilities/constants';

// Mock data for dashboard - this should be replaced with API data in the future
const menuMetrics = {
  totalItems: 0,
  activeItems: 0,
  inactiveItems: 0,
  lowStockItems: 0,
};
const bestSellingItems: any[] = [];
const menuItems: any[] = [];

function MenuContent() {
  usePageTitle('Product List');
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'list'; // Default to list view
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.push(`?${params.toString()}`);
  };
  


  useEffect(() => {
    const shouldRefresh = searchParams.get('refresh');
    if (shouldRefresh === 'true') {
      setRefreshKey(prevKey => prevKey + 1);
      const params = new URLSearchParams(searchParams.toString());
      params.delete('refresh');
      router.replace(`?${params.toString()}`);
    }
  }, [searchParams, router]);

  const handleAddProduct = () => {
    setAddModalOpen(true);
  };

  const handleProductAdd = async (product: Partial<Product> & { image_urls?: string[]; uploaded_images?: File[]; videos?: string[] }) => {
    const formData = new FormData();

    formData.append('name', product.name || '');
    formData.append('brand', product.brand || '');
    if (product.category) {
      formData.append('category', product.category);
    }
    formData.append('part_number', product.part_number || '');
    formData.append('condition', product.condition || 'New');
    formData.append('quantity', product.quantity?.toString() || '0');
    formData.append('price', product.price || '0');
    formData.append('original_price', product.original_price || '0');
    formData.append('description', product.description || '');
    formData.append('is_active', product.is_active ? '1' : '0');

    if (product.image_urls) {
      product.image_urls.forEach(url => {
        formData.append('image_urls[]', url);
      });
    }

    if (product.uploaded_images) {
      product.uploaded_images.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });
    }

    if (product.videos) {
      const validVideos = product.videos.filter(url => url && url.trim() !== '');
      if (validVideos.length > 0) {
        validVideos.forEach(url => {
          formData.append('videos[]', url);
        });
      }
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const response = await fetch(`${API_BASE_URL}/api/admin/products`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(()=>null);
        if (response.status === 401) {
          throw new Error('Unauthorized. Please login again.');
        }
        if (response.status === 422 && errorData?.errors) {
          const messages = Object.values(errorData.errors).flat();
          toast.error(messages.join('\n'));
        } else {
          throw new Error(errorData?.message || 'Failed to add product');
        }
        return;
      }

      const result = await response.json();
      toast.success(result.message || 'Product added successfully!');
      setAddModalOpen(false);
      setRefreshKey(prevKey => prevKey + 1);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };
  
  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setStatusFilter('all');
  };

  return (
    <Box>
      <Flex 
        direction={{ initial: "column", sm: "row" }} 
        justify="between" 
        align={{ initial: "stretch", sm: "center" }}
        gap={{ initial: "4", sm: "0" }}
        mb="5"
      >
        <PageHeading title="Product List" description="Manage your products" noMarginBottom />
        <Flex 
          direction={{ initial: "column", sm: "row" }} 
          align={{ initial: "stretch", sm: "center" }} 
          gap="4"
          width={{ initial: "full", sm: "auto" }}
        >

          <Box width={{ initial: "full", sm: "auto" }}>
            <Button onClick={handleAddProduct} className="w-full sm:w-auto">
              <PlusIcon size={16} />
              Add Product
            </Button>
          </Box>
        </Flex>
      </Flex>

      <Tabs.Root value={activeTab} onValueChange={handleTabChange}>
        <Tabs.List>
          <Tabs.Trigger value="dashboard">
            <Flex gap="2" align="center">
              <LayoutDashboard size={16} />
              <Text>Dashboard</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="list">
            <Flex gap="2" align="center">
              <List size={16} />
              <Text>Product List</Text>
            </Flex>
          </Tabs.Trigger>
        </Tabs.List>
        
        <Tabs.Content value="dashboard">
          <ProductDashboard
            menuMetrics={menuMetrics}
            bestSellingItems={bestSellingItems}
            menuItems={menuItems}
          />
        </Tabs.Content>
        
        <Tabs.Content value="list">
          <ProductList
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            statusFilter={statusFilter}
            onCategoryFilterChange={setCategoryFilter}
            onStatusFilterChange={setStatusFilter}
            onResetFilters={handleResetFilters}
            refreshKey={refreshKey}
          />
        </Tabs.Content>
      </Tabs.Root>
      <AddProductModal 
        open={isAddModalOpen} 
        onOpenChange={setAddModalOpen} 
        onProductAdd={handleProductAdd} 
      />
    </Box>
  );
}

export default function MenuPage() {
  return (
    <FilterBranchProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <MenuContent />
      </Suspense>
    </FilterBranchProvider>
  );
}
