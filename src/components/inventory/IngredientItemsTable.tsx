'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Badge,
  Box,
  Flex,
  IconButton,
  Table,
  Text,
  Tooltip
} from '@radix-ui/themes';
import { IngredientItem } from '@/types/inventory';
import { formatCurrency } from '@/utilities';
import { Settings, Trash2, Edit } from 'lucide-react';
import { useFilterBranch } from '@/contexts/FilterBranchContext';
import IngredientItemsBranchDialog from '@/components/inventory/IngredientItemsBranchDialog';
import { useRouter } from 'next/navigation';
import { SortableHeader } from '@/components/common/SortableHeader';

interface IngredientItemsTableProps {
  items: IngredientItem[];
}

export default function IngredientItemsTable({ items }: IngredientItemsTableProps) {
  const { activeBranchFilter } = useFilterBranch();
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<IngredientItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getBranchSpecificData = useCallback((item: IngredientItem) => {
    if (activeBranchFilter && item.branchData && item.branchData[activeBranchFilter.id]) {
      return item.branchData[activeBranchFilter.id];
    }
    // Return default values if no branch-specific data found
    return {
      unitPrice: item.unitPrice || 0,
      minLevel: item.minLevel || 0,
      maxLevel: item.maxLevel || 0,
      reorderLevel: item.reorderLevel || 0,
      currentStock: 0
    };
  }, [activeBranchFilter]);

  const handleEditItem = (item: IngredientItem) => {
    router.push(`/inventory/ingredient-items/edit/${item.id}`);
  };

  const handleEditBranchData = (item: IngredientItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleDeleteItem = (item: IngredientItem) => {
    console.log('Deleting item:', item);
  };

  const sortedItems = useMemo(() => {
    if (!sortConfig) return items;

    return [...items].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortConfig.key) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'sku':
          aValue = a.sku;
          bValue = b.sku;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'unitPrice':
          aValue = getBranchSpecificData(a).unitPrice;
          bValue = getBranchSpecificData(b).unitPrice;
          break;
        case 'minLevel':
          aValue = getBranchSpecificData(a).minLevel;
          bValue = getBranchSpecificData(b).minLevel;
          break;
        case 'maxLevel':
          aValue = getBranchSpecificData(a).maxLevel;
          bValue = getBranchSpecificData(b).maxLevel;
          break;
        case 'reorderLevel':
          aValue = getBranchSpecificData(a).reorderLevel;
          bValue = getBranchSpecificData(b).reorderLevel;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [items, sortConfig, getBranchSpecificData]);

  return (
    <>
      <Box className="overflow-auto">
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="Name/Localized Name"
                  sortKey="name"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="SKU"
                  sortKey="sku"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="Category"
                  sortKey="category"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Storage → Item Units</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="Default Price"
                  sortKey="unitPrice"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="Min Level"
                  sortKey="minLevel"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="Max Level"
                  sortKey="maxLevel"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <SortableHeader
                  label="Reorder Level"
                  sortKey="reorderLevel"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="center">Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {sortedItems.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={9}>
                  <Text align="center" className="py-4 text-slate-500">No ingredient items found</Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              sortedItems.map(item => {
                const branchData = activeBranchFilter 
                  ? getBranchSpecificData(item)
                  : {
                      unitPrice: item.unitPrice || 0,
                      minLevel: item.minLevel || 0,
                      maxLevel: item.maxLevel || 0,
                      reorderLevel: item.reorderLevel || 0
                    };
                
                return (
                  <Table.Row key={item.id} className="align-middle cursor-pointer hover:bg-slate-50 dark:hover:bg-neutral-800" onClick={() => handleEditItem(item)}>
                    <Table.Cell>
                      <Box>
                        <Text weight="medium" as="div">{item.name}</Text>
                        {item.nameLocalized && (
                          <Badge color="gray" variant="soft" size="1">
                            {item.nameLocalized}
                          </Badge>
                        )}
                      </Box>
                    </Table.Cell>
                    <Table.Cell>{item.sku}</Table.Cell>
                    <Table.Cell>{item.category}</Table.Cell>
                    <Table.Cell>
                      <Tooltip content={`Storage in ${item.storageUnit}, used as ${item.ingredientUnit}`}>
                        <Text>{item.storageUnit} → {item.ingredientUnit}</Text>
                      </Tooltip>
                    </Table.Cell>
                    <Table.Cell>{formatCurrency(branchData.unitPrice)}</Table.Cell>
                    <Table.Cell>{branchData.minLevel} {item.storageUnit}</Table.Cell>
                    <Table.Cell>{branchData.maxLevel} {item.storageUnit}</Table.Cell>
                    <Table.Cell>{branchData.reorderLevel} {item.storageUnit}</Table.Cell>
                    <Table.Cell>
                      <Flex gap="3" justify="center">
                        <IconButton 
                          size="1" 
                          variant="ghost"
                          color="gray"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditItem(item);
                          }}
                        >
                          <Edit size={14} />
                        </IconButton>
                        <Tooltip content="Select branch first to configure branch-specific data (e.g., stock levels, reorder points)">
                          <IconButton 
                            size="1" 
                            variant="ghost"
                            disabled={!activeBranchFilter}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditBranchData(item);
                            }}
                          >
                            <Settings size={14} />
                          </IconButton>
                        </Tooltip>
                        <IconButton 
                          size="1" 
                          variant="ghost"
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(item);
                          }}
                        >
                          <Trash2 size={14} />
                        </IconButton>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                );
              })
            )}
          </Table.Body>
        </Table.Root>
      </Box>

      {selectedItem && (
        <IngredientItemsBranchDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          item={selectedItem}
          branchId={activeBranchFilter?.id || ''}
          branchName={activeBranchFilter?.name || ''}
        />
      )}
    </>
  );
}