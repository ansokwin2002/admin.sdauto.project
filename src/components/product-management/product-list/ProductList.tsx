import { Box, Button, Flex, Table, Text, Badge, TextField, Select, IconButton, Checkbox, Dialog } from '@radix-ui/themes';
import { Search, AlertCircle, RefreshCcw, Utensils, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Pagination from '@/components/common/Pagination';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { SortableHeader } from '@/components/common/SortableHeader';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Product, PaginatedProductsResponse } from '@/types/product';
import { API_BASE_URL } from '@/utilities/constants';
import NProgress from 'nprogress';
import { toast } from 'sonner';
import ProductDetailModal from './ProductDetailModal';

interface MenuListProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter?: string;
  statusFilter?: string;
  availabilityFilter?: string;
  onCategoryFilterChange?: (value: string) => void;
  onStatusFilterChange?: (value: string) => void;
  onAvailabilityFilterChange?: (value: string) => void;
  onResetFilters?: () => void;
  refreshKey?: number;
}

const getAbsoluteImageUrl = (relativePath: string) => {
  if (!relativePath) return ''; // Handle cases where relativePath might be empty or null
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath; // Already an absolute URL
  }
  // Ensure API_BASE_URL does not end with a slash and relativePath does not start with one
  const cleanedBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const cleanedRelativePath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
  return `${cleanedBaseUrl}/${cleanedRelativePath}`;
};

// Helper to create a cache key for the current filter state
const createApiCacheKey = (
  categoryFilter: string,
  statusFilter: string,
  sortKey: string,
  sortDirection: string
) => {
  return `${categoryFilter}-${statusFilter}-${sortKey}-${sortDirection}`;
};

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function ProductList({
  searchTerm,
  onSearchChange,
  categoryFilter = 'all',
  statusFilter = 'all',
  onCategoryFilterChange = () => {},
  onStatusFilterChange = () => {},
  onResetFilters = () => {},
  refreshKey = 0,
}: MenuListProps) {
  // Cache to store products by filter combination and page
  const [productCache, setProductCache] = useState<Map<string, Product[]>>(new Map());
  const [metaCache, setMetaCache] = useState<Map<string, PaginatedProductsResponse['meta']>>(new Map());
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingSingle, setDeletingSingle] = useState(false);
  const [deletingBulk, setDeletingBulk] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Product | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ 
    key: 'created_at', 
    direction: 'desc' 
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredProducts.map(item => item.id);
      setSelectedProductIds(allIds);
    } else {
      setSelectedProductIds([]);
    }
  };

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Track the current filter state for API calls
  const currentApiCacheKey = useMemo(() => 
    createApiCacheKey(categoryFilter, statusFilter, sortConfig.key, sortConfig.direction),
    [categoryFilter, statusFilter, sortConfig.key, sortConfig.direction]
  );

  const prevCacheKey = useRef<string>('');

  // Reset to page 1 when API filters change
  useEffect(() => {
    if (prevCacheKey.current !== currentApiCacheKey) {
      setCurrentPage(1);
      prevCacheKey.current = currentApiCacheKey;
    }
  }, [currentApiCacheKey]);

  // Get all products for the current API filter combination from cache
  const allProductsForApiFilter = useMemo(() => {
    return productCache.get(currentApiCacheKey) || [];
  }, [productCache, currentApiCacheKey]);

  // Get metadata from cache
  const currentMeta = useMemo(() => {
    return metaCache.get(currentApiCacheKey);
  }, [metaCache, currentApiCacheKey]);

  // Check if current API filter combination is already loaded
  const isApiFilterLoaded = useMemo(() => {
    return productCache.has(currentApiCacheKey);
  }, [productCache, currentApiCacheKey]);

  // Determine if we should show loading state
  const shouldShowLoading = useMemo(() => {
    return loading && !isApiFilterLoaded;
  }, [loading, isApiFilterLoaded]);

  // Apply client-side search and filters
  const filteredProducts = useMemo(() => {
    let filtered = allProductsForApiFilter;

    // Apply search term
    if (debouncedSearchTerm) {
      const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.brand.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.category?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // Apply status filter (already handled by API, but keeping for consistency if API changes)
    // if (statusFilter !== 'all') {
    //   filtered = filtered.filter(product =>
    //     statusFilter === 'active' ? product.is_active : !product.is_active
    //   );
    // }

    // Apply category filter (already handled by API, but keeping for consistency if API changes)
    // if (categoryFilter !== 'all') {
    //   filtered = filtered.filter(product => product.category === categoryFilter);
    // }

    return filtered;
  }, [allProductsForApiFilter, debouncedSearchTerm]); // Removed categoryFilter and statusFilter as they are handled by API for now

  // Apply client-side sorting
  const sortedProducts = useMemo(() => {
    if (!sortConfig.key) {
      return filteredProducts;
    }

    return [...filteredProducts].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Product];
      const bValue = b[sortConfig.key as keyof Product];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      // Fallback for other types or if values are not comparable
      return 0;
    });
  }, [filteredProducts, sortConfig]);

  // Client-side pagination
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedProducts.slice(startIndex, endIndex);
  }, [sortedProducts, currentPage, itemsPerPage]);

  // Display data (now paginatedProducts)
  const displayData = paginatedProducts;

  const fetchProducts = useCallback(async (cacheKey: string) => { // Removed 'page' parameter
    NProgress.start();
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      // params.append('page', page.toString()); // Page is now handled client-side
      params.append('per_page', '1000'); // Fetch a larger set for client-side filtering
      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter);
      }
      if (statusFilter !== 'all') {
        params.append('active', statusFilter === 'active' ? 'true' : 'false');
      }
      if (sortConfig) {
        params.append('sort_by', sortConfig.key);
        params.append('sort_order', sortConfig.direction);
      }

      let response;
      let apiUrl;

      // Try a direct database query endpoint as a workaround
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        apiUrl = `${API_BASE_URL}/api/admin/products/raw?${params.toString()}`;
        console.log('Trying raw endpoint:', apiUrl);

        response = await fetch(apiUrl, {
          headers: {
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          credentials: 'include',
        });

        if (!response.ok && response.status === 404) {
          throw new Error('Raw endpoint not found, trying regular endpoints');
        }
      } catch (rawError) {
        console.log('Raw endpoint failed, trying public endpoint...');

        // Try public endpoint
        try {
          apiUrl = `${API_BASE_URL}/api/public/products?${params.toString()}`;
          console.log('Trying public endpoint:', apiUrl);

          response = await fetch(apiUrl, {
            headers: {
              'Accept': 'application/json',
            },
            credentials: 'include',
          });

          if (!response.ok && response.status === 404) {
            throw new Error('Public endpoint not found');
          }
        } catch (publicError) {
          console.log('Public endpoint failed, trying admin endpoint...');

          // Fallback to admin endpoint with authentication
          const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
          apiUrl = `${API_BASE_URL}/api/admin/products?${params.toString()}`;
          console.log('Trying admin endpoint:', apiUrl);

          response = await fetch(apiUrl, {
            headers: {
              'Accept': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            credentials: 'include',
          });
        }
      }

      console.log('Final response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);

        if (response.status === 401) {
          throw new Error('Unauthorized. Please login again.');
        }
        if (response.status === 500 && errorText.includes('ProductResource')) {
          throw new Error('Backend ProductResource error. Please fix the ProductResource.php file at line 18. The error suggests a relationship issue where a string is being treated as an object.');
        }
        throw new Error(`Failed to fetch products (${response.status}): ${errorText}`);
      }
      
      const data: PaginatedProductsResponse = await response.json();

      // Sort products by created_at in descending order
      const sortedData = data.data.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      // Update product cache
      setProductCache(prevCache => {
        const newCache = new Map(prevCache);
        newCache.set(cacheKey, sortedData); // Store sorted products for this API cache key
        return newCache;
      });

      // Update meta cache (only needs to be stored once per filter combination)
      setMetaCache(prevMetaCache => {
        const newMetaCache = new Map(prevMetaCache);
        newMetaCache.set(cacheKey, data.meta);
        return newMetaCache;
      });

    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
      NProgress.done();
    }
  }, [categoryFilter, statusFilter, sortConfig]); // Removed debouncedSearchTerm as it's client-side

  // Fetch data when API filters change (if not already cached)
  useEffect(() => {
    // Clear cache for the current API key to force a fresh fetch
    setProductCache(prevCache => {
      const newCache = new Map(prevCache);
      newCache.delete(currentApiCacheKey);
      return newCache;
    });
    setMetaCache(prevMetaCache => {
      const newMetaCache = new Map(prevMetaCache);
      newMetaCache.delete(currentApiCacheKey);
      return newMetaCache;
    });
    fetchProducts(currentApiCacheKey); // Removed currentPage
  }, [currentApiCacheKey, fetchProducts, refreshKey]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    // Note: This doesn't affect API calls since we always fetch 10 per page
    // It only affects how many items are displayed from the cached data
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleDeleteClick = (e: React.MouseEvent, item: Product) => {
    e.stopPropagation();
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteSelected = () => {
    setItemToDelete(null); // Indicate multiple deletion
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      // Single item deletion logic
      try {
        setDeletingSingle(true);
        NProgress.start();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        const response = await fetch(`${API_BASE_URL}/api/admin/products/${itemToDelete.id}`, {
          method: 'DELETE',
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            'Accept': 'application/json',
          },
          credentials: 'include',
        });
        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = 'Failed to delete product';
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorMessage;
          } catch {
            // If not JSON, use the text as is
            errorMessage = errorText || errorMessage;
          }
          throw new Error(errorMessage);
        }
        toast.success('Product deleted successfully!');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setDeletingSingle(false);
        NProgress.done();
      }
      // After successful deletion, invalidate cache for current filter
      setProductCache(prevCache => {
        const newCache = new Map(prevCache);
        newCache.delete(currentApiCacheKey);
        return newCache;
      });
      setMetaCache(prevMetaCache => {
        const newMetaCache = new Map(prevMetaCache);
        newMetaCache.delete(currentApiCacheKey);
        return newMetaCache;
      });
      
      // Re-fetch current page
      fetchProducts(currentApiCacheKey);
      
      setItemToDelete(null);
    } else if (selectedProductIds.length > 0) {
      // Multiple items deletion logic
      try {
        setDeletingBulk(true);
        NProgress.start();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        const response = await fetch(`${API_BASE_URL}/api/admin/products/bulk`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            'Accept': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ product_ids: selectedProductIds, action: 'delete' }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.message || 'Failed to delete selected products';
          throw new Error(errorMessage);
        }
        toast.success('Selected products deleted successfully!');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'An unknown error occurred', { duration: Infinity, closeButton: true });
      } finally {
        setDeletingBulk(false);
        NProgress.done();
      }
      // After successful deletion, invalidate cache for current filter
      setProductCache(prevCache => {
        const newCache = new Map(prevCache);
        newCache.delete(currentApiCacheKey);
        return newCache;
      });
      setMetaCache(prevMetaCache => {
        const newMetaCache = new Map(prevMetaCache);
        newMetaCache.delete(currentApiCacheKey);
        return newMetaCache;
      });
      
      // Re-fetch current page
      fetchProducts(currentApiCacheKey);
      
      setSelectedProductIds([]); // Clear selected items
    }
    setDeleteConfirmOpen(false);
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    setSelectedProductIds(prev =>
      checked ? [...prev, id] : prev.filter(productId => productId !== id)
    );
  };

  const handleRowClick = (item: Product) => {
    setSelectedProductForDetail(item);
    setIsDetailModalOpen(true);
  };

  // Clear cache when filters reset
  const handleResetFilters = () => {
    onResetFilters();
    // Clear all caches as filters are being reset
    setProductCache(new Map());
    setMetaCache(new Map());
  };

  return (
    <Box className="mt-6 space-y-4">
      <Flex gap="4" align="center" wrap="wrap">
        <Box className="flex-grow min-w-[250px]">
          <TextField.Root
            type="text"
            placeholder="Search by product name, brand, or category..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          >
            <TextField.Slot>
              <Search size={16} />
            </TextField.Slot>
          </TextField.Root>
        </Box>

        <Flex align="center" gap="2" className="flex-shrink-0">
          <Select.Root value={categoryFilter} onValueChange={onCategoryFilterChange}>
            <Select.Trigger placeholder="All Categories" />
            <Select.Content>
              <Select.Item value="all">All Categories</Select.Item>
              {/* TODO: Populate categories from API */}
            </Select.Content>
          </Select.Root>
        </Flex>

        <Flex align="center" gap="2" className="flex-shrink-0">
          <Select.Root value={statusFilter} onValueChange={onStatusFilterChange}>
            <Select.Trigger placeholder="All Statuses" />
            <Select.Content>
              <Select.Item value="all">All Statuses</Select.Item>
              <Select.Item value="active">Active</Select.Item>
              <Select.Item value="inactive">Inactive</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>

        <Button 
          variant="soft" 
          color={(categoryFilter !== 'all' || statusFilter !== 'all' || searchTerm !== '') ? 'red' : 'gray'} 
          onClick={handleResetFilters}
          className="flex-shrink-0"
          disabled={(categoryFilter === 'all' && statusFilter === 'all' && searchTerm === '')}
        >
          <RefreshCcw size={16} />
          Reset Filters
        </Button>

        <Button
          variant="soft"
          color="red"
          onClick={handleDeleteSelected}
          className="flex-shrink-0"
          disabled={selectedProductIds.length === 0 || deletingBulk}
        >
          {deletingBulk ? <RefreshCcw className="animate-spin" size={16} /> : <Trash2 size={16} />}
          {deletingBulk ? 'Deleting...' : `Delete Selected (${selectedProductIds.length})`}
        </Button>
      </Flex>
      
      {shouldShowLoading ? (
        <Box className="py-8 text-center">
          <Text size="3" color="gray">Loading products...</Text>
        </Box>
      ) : error ? (
        <Box className="py-8 text-center">
          <Text size="3" color="red">Error: {error}</Text>
        </Box>
      
      ) : (
        <>
          {/* Show search indicator if actively searching */}
          {debouncedSearchTerm !== searchTerm && searchTerm !== '' && (
            <Box className="py-2 px-4 bg-blue-50 dark:bg-blue-950 rounded-md border border-blue-200 dark:border-blue-800">
              <Text size="2" color="blue">Searching for "{searchTerm}"...</Text>
            </Box>
          )}
          
          <Table.Root variant="surface">
            <Table.Header>
              <tr className="rt-TableRow">
                <th className="rt-TableCell" style={{ width: "40px" }}>
                  <Checkbox
                    checked={selectedProductIds.length === displayData.length && displayData.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="rt-TableCell">
                  <SortableHeader label="ID" sortKey="id" currentSort={sortConfig} onSort={handleSort} />
                </th>
                <th className="rt-TableCell">Image</th>
                <th className="rt-TableCell">
                  <SortableHeader label="Product Name" sortKey="name" currentSort={sortConfig} onSort={handleSort} />
                </th>
                <th className="rt-TableCell">
                  <SortableHeader label="Brand" sortKey="brand" currentSort={sortConfig} onSort={handleSort} />
                </th>
                <th className="rt-TableCell">
                  <SortableHeader label="Category" sortKey="category" currentSort={sortConfig} onSort={handleSort} />
                </th>
                <th className="rt-TableCell" style={{ textAlign: "left" }}>
                  <SortableHeader label="Price" sortKey="price" currentSort={sortConfig} onSort={handleSort} />
                </th>
                <th className="rt-TableCell" style={{ textAlign: "left" }}>
                  <SortableHeader label="Quantity" sortKey="quantity" currentSort={sortConfig} onSort={handleSort} />
                </th>
                <th className="rt-TableCell">
                  <SortableHeader label="Status" sortKey="is_active" currentSort={sortConfig} onSort={handleSort} />
                </th>
                <th className="rt-TableCell">
                  <SortableHeader label="Stock Status" sortKey="stock_status" currentSort={sortConfig} onSort={handleSort} />
                </th>
                <th className="rt-TableCell" style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </Table.Header>
            <Table.Body>
              {displayData.map((item) => (
                <tr key={item.id} className="rt-TableRow cursor-pointer hover:bg-slate-50 dark:hover:bg-neutral-800" onClick={() => handleRowClick(item)}>
                  <td className="rt-TableCell" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedProductIds.includes(item.id)}
                      onCheckedChange={(checked) => handleSelectItem(item.id, checked)}
                    />
                  </td>
                  <td className="rt-TableCell">{item.id}</td>
                  <td className="rt-TableCell">
                    <Flex align="center" justify="center" className="w-8 h-8">
                      {item.primary_image && typeof item.primary_image === 'string' && item.primary_image !== '' ? (
                        <Image
                          src={getAbsoluteImageUrl(item.primary_image)} 
                          alt={item.name} 
                          width={32} 
                          height={32}
                          className="rounded object-cover w-full h-full"
                        />
                      ) : (
                        <Flex align="center" justify="center" className="w-full h-full rounded bg-slate-200 dark:bg-neutral-600">
                          <Utensils size={16} className="text-gray-500 dark:text-gray-300" />
                        </Flex>
                      )}
                    </Flex>
                  </td>
                  <td className="rt-TableCell">
                    <Flex align="center" gap="2">
                      {item.is_low_stock && <AlertCircle size={16} className="text-amber-500" />}
                      {item.name}
                    </Flex>
                  </td>
                  <td className="rt-TableCell">{item.brand}</td>
                  <td className="rt-TableCell">{item.category}</td>
                  <td className="rt-TableCell" align="left">{item.formatted_price}</td>
                  <td className="rt-TableCell" align="left">{item.quantity}</td>
                  <td className="rt-TableCell">
                    <Badge color={item.is_active ? 'green' : 'gray'} variant="soft">
                      {item.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="rt-TableCell">
                    <Badge 
                      color={item.stock_status === 'in_stock' ? 'green' : item.stock_status === 'low_stock' ? 'amber' : 'red'} 
                      variant="soft"
                    >
                      {item.stock_status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="rt-TableCell" align="right" onClick={(e) => e.stopPropagation()}>
                    <Flex gap="3" justify="end">
                      <Link href={`/product-management/product-list/${item.id}`}>
                        <IconButton variant="ghost" size="1" color="gray">
                          <Edit size={14} />
                        </IconButton>
                      </Link>
                      <IconButton 
                        variant="ghost" 
                        color="red" 
                        size="1" 
                        onClick={(e) => handleDeleteClick(e, item)}
                      >
                        <Trash2 size={14} />
                      </IconButton>
                    </Flex>
                  </td>
                </tr>
              ))}
            </Table.Body>
          </Table.Root>
          
          {displayData.length === 0 && !shouldShowLoading ? (
            <Box className="py-8 text-center">
              <Text size="3" color="gray">No products found matching your search criteria.</Text>
            </Box>
          ) : (
            currentMeta && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredProducts.length / itemsPerPage)}
                itemsPerPage={itemsPerPage}
                totalItems={filteredProducts.length}
                startIndex={(currentPage - 1) * itemsPerPage + 1}
                endIndex={Math.min(currentPage * itemsPerPage, filteredProducts.length)}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            )
          )}
        </>
      )}

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
        title={itemToDelete ? "Delete Product" : "Delete Selected Products"}
        description={itemToDelete
          ? `Are you sure you want to delete "${itemToDelete.name}"? This action cannot be undone.`
          : `Are you sure you want to delete ${selectedProductIds.length} selected products? This action cannot be undone.`
        }
        confirmText="Delete"
        cancelText="Cancel"
        color="red"
      />

      <ProductDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        productId={selectedProductForDetail?.id || null}
      />
    </Box>
  );
}