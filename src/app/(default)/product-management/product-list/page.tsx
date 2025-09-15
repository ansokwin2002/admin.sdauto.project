'use client';

import { useState, useEffect, Suspense } from 'react';
import { Box, Tabs, Flex, Button, Text } from '@radix-ui/themes';
import { PlusIcon, LayoutDashboard, List } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterBranchProvider, useFilterBranch } from '@/contexts/FilterBranchContext';
import { useAppOrganization } from '@/contexts/AppOrganizationContext';
import BranchFilterInput from '@/components/common/BranchFilterInput';
import { organization } from '@/data/CommonData';
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
  const { activeBranchFilter, setActiveBranchFilter } = useFilterBranch();
  const { activeEntity } = useAppOrganization();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.push(`?${params.toString()}`);
  };
  
  useEffect(() => {
    setActiveBranchFilter(activeEntity.id === 'hq' ? null : activeEntity);
  }, [activeEntity, setActiveBranchFilter]);

  useEffect(() => {
    const shouldRefresh = searchParams.get('refresh');
    if (shouldRefresh === 'true') {
      setRefreshKey(prevKey => prevKey + 1);
      const params = new URLSearchParams(searchParams.toString());
      params.delete('refresh');
      router.replace(`?${params.toString()}`, undefined, { shallow: true });
    }
  }, [searchParams, router]);

  const handleAddProduct = () => {
    setAddModalOpen(true);
  };

  const handleProductAdd = async (product: Partial<Product> & { image_urls?: string[], images?: File[], videos?: string[] }) => {
    const formData = new FormData();

    Object.entries(product).forEach(([key, value]) => {
      if (key === 'is_active') {
        formData.append(key, value ? '1' : '0');
      } else if (key === 'category') {
        if (value !== '' && value !== null && value !== undefined) {
          formData.append(key, value as string);
        }
      }
      else if (key !== 'images' && key !== 'image_urls' && key !== 'videos') {
        formData.append(key, value as string);
      }
    });

    if (product.image_urls) {
      product.image_urls.forEach(url => {
        formData.append('image_urls[]', url);
      });
    }

    if (product.images) {
      product.images.forEach(file => {
        formData.append('images[]', file);
      });
    }

    if (product.videos) {
        product.videos.forEach(url => {
            formData.append('videos[]', url);
        });
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 422) {
          const messages = Object.values(errorData.errors).flat();
          toast.error(messages.join('\n'));
        } else {
          throw new Error(errorData.message || 'Failed to add product');
        }
        return;
      }

      const result = await response.json();
      toast.success(result.message || 'Product added successfully!', { duration: Infinity, closeButton: true });
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
            <BranchFilterInput 
              selectedBranch={activeBranchFilter?.id || ''} 
              setSelectedBranch={(id: string) => {
                const branch = organization.find(o => o.id === id);
                const params = new URLSearchParams(searchParams.toString());
                if (branch) {
                  setActiveBranchFilter(branch);
                } else {
                  setActiveBranchFilter(null);
                }
                router.push(`?${params.toString()}`);
              }}
              clearFilter={() => {
                const params = new URLSearchParams(searchParams.toString());
                setActiveBranchFilter(null);
                router.push(`?${params.toString()}`);
              }}
            />
          </Box>
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
