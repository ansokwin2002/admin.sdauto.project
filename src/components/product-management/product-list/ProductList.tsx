import { Box, Button, Flex, Table, Text, Badge, TextField, Select, IconButton, Checkbox } from '@radix-ui/themes';
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
}

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
}: MenuListProps) {
  // Cache to store products by filter combination and page
  const [productCache, setProductCache] = useState<Map<string, Product[]>>(new Map());
  const [metaCache, setMetaCache] = useState<Map<string, PaginatedProductsResponse['meta']>>(new Map());
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Product | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ 
    key: 'created_at', 
    direction: 'desc' 
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = displayData.map(item => item.id);
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
        product.category.toLowerCase().includes(lowerCaseSearchTerm)
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

      const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data: PaginatedProductsResponse = await response.json();

      // Update product cache
      setProductCache(prevCache => {
        const newCache = new Map(prevCache);
        newCache.set(cacheKey, data.data); // Store all products for this API cache key
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
    if (!isApiFilterLoaded) {
      fetchProducts(currentApiCacheKey); // Removed currentPage
    } else {
      setLoading(false);
      setError(null);
    }
  }, [isApiFilterLoaded, currentApiCacheKey, fetchProducts]);

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

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      // Single item deletion logic
      console.log('Delete item:', itemToDelete);
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
      console.log('Delete selected items:', selectedProductIds);
      // TODO: Implement actual multiple delete API call
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
          disabled={selectedProductIds.length === 0}
        >
          <Trash2 size={16} />
          Delete Selected ({selectedProductIds.length})
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
              <Table.Row>
                <Table.ColumnHeaderCell width="40px">
                  <Checkbox
                    checked={selectedProductIds.length === displayData.length && displayData.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Image</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  <SortableHeader label="Product Name" sortKey="name" currentSort={sortConfig} onSort={handleSort} />
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  <SortableHeader label="Brand" sortKey="brand" currentSort={sortConfig} onSort={handleSort} />
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  <SortableHeader label="Category" sortKey="category" currentSort={sortConfig} onSort={handleSort} />
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="right">
                  <SortableHeader label="Price" sortKey="price" currentSort={sortConfig} onSort={handleSort} />
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="right">
                  <SortableHeader label="Quantity" sortKey="quantity" currentSort={sortConfig} onSort={handleSort} />
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  <SortableHeader label="Status" sortKey="is_active" currentSort={sortConfig} onSort={handleSort} />
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  <SortableHeader label="Stock Status" sortKey="stock_status" currentSort={sortConfig} onSort={handleSort} />
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="right">Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {displayData.map((item) => (
                <Table.Row key={item.id} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-neutral-800">
                  <Table.Cell> {/* Checkbox for individual item */}
                    <Checkbox
                      checked={selectedProductIds.includes(item.id)}
                      onCheckedChange={(checked) => handleSelectItem(item.id, checked)}
                    />
                  </Table.Cell>
                  <Table.Cell>{item.id}</Table.Cell> {/* Product ID */}
                  <Table.Cell> {/* Image Cell */}
                    <Flex align="center" justify="center" className="w-8 h-8">
                      {item.primary_image ? (
                        <Image
                          src={item.primary_image} 
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
                  </Table.Cell>
                  <Table.Cell> {/* Original Product Name Cell, now without image */}
                    <Flex align="center" gap="2">
                      {item.is_low_stock && <AlertCircle size={16} className="text-amber-500" />}
                      {item.name}
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>{item.brand}</Table.Cell>
                  <Table.Cell>{item.category}</Table.Cell>
                  <Table.Cell align="right">{item.formatted_price}</Table.Cell>
                  <Table.Cell align="right">{item.quantity}</Table.Cell>
                  <Table.Cell>
                    <Badge color={item.is_active ? 'green' : 'gray'} variant="soft">
                      {item.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge 
                      color={item.stock_status === 'in_stock' ? 'green' : item.stock_status === 'low_stock' ? 'amber' : 'red'} 
                      variant="soft"
                    >
                      {item.stock_status.replace('_', ' ')}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell align="right">
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
                  </Table.Cell>
                </Table.Row>
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
    </Box>
  );
}