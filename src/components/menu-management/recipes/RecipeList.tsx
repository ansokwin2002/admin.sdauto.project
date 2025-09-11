"use client";

import { useState } from "react";
import { TextField, Button, Table, Select, Flex, Box, IconButton } from "@radix-ui/themes";
import { ingredientItems } from "@/data/IngredientItemsData";
import { recipes } from "@/data/RecipesData";
import Pagination from "@/components/common/Pagination";
import Image from "next/image";
import { NotepadText, Plus, Edit, Trash2 } from "lucide-react";
import { Recipe } from "@/types/inventory";
import { recipeCategories } from "@/data/CommonData";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { PageHeading } from "@/components/common/PageHeading";
import { SortableHeader } from "@/components/common/SortableHeader";

// Helper function to get ingredient names from IDs
const getIngredientNames = (ingredientIds: { id: string; amount: number }[]) => {
  return ingredientIds.map(item => {
    const ingredient = ingredientItems.find(ing => ing.id === item.id);
    return ingredient ? `${ingredient.name} (${item.amount}${ingredient.ingredientUnit})` : "";
  }).join(", ");
};

// Number of items per page
const ITEMS_PER_PAGE = 10;

interface RecipeListProps {
  onRecipeClick: (recipe: Recipe) => void;
  onAddRecipe: () => void;
}

const RecipeList = ({ onRecipeClick, onAddRecipe }: RecipeListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort recipes
  const filteredRecipes = recipes
    .filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || recipe.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;

      let aValue: any;
      let bValue: any;

      switch (sortConfig.key) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'portionSize':
          aValue = a.portionSize;
          bValue = b.portionSize;
          break;
        case 'preparationTime':
          aValue = a.preparationTime;
          bValue = b.preparationTime;
          break;
        case 'costPerPortion':
          aValue = a.costPerPortion;
          bValue = b.costPerPortion;
          break;
        case 'sellingPrice':
          aValue = a.sellingPrice;
          bValue = b.sellingPrice;
          break;
        case 'margin':
          aValue = (a.sellingPrice - a.costPerPortion) / a.sellingPrice;
          bValue = (b.sellingPrice - b.costPerPortion) / b.sellingPrice;
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

  // Pagination logic
  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredRecipes.length);
  const paginatedRecipes = filteredRecipes.slice(startIndex, endIndex);

  const handleDeleteClick = (e: React.MouseEvent, recipe: Recipe) => {
    e.stopPropagation(); // Prevent row click from triggering
    setRecipeToDelete(recipe);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    // Here you would implement the actual delete functionality
    console.log(`Deleting recipe: ${recipeToDelete?.name}`);
    // After successful deletion, you might want to refresh the data
    setDeleteDialogOpen(false);
    setRecipeToDelete(null);
  };

  return (
    <Box className="space-y-4">
      <Flex justify="between" align="center" mb="5">
        <PageHeading title="Recipes" description="Manage your recipes" noMarginBottom/>     
        <Button onClick={onAddRecipe}>
          <Plus size={16} />
          Add Recipe
        </Button>
      </Flex>
      <Flex gap="4">
        <TextField.Root
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="min-w-64"
        />
        <Select.Root value={categoryFilter} onValueChange={setCategoryFilter}>
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="all">All Categories</Select.Item>
            {recipeCategories.map(category => (
              <Select.Item key={category} value={category}>
                {category}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Recipe Name"
                sortKey="name"
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
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Portion Size"
                sortKey="portionSize"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Prep Time"
                sortKey="preparationTime"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Cost"
                sortKey="costPerPortion"
                currentSort={sortConfig}
                onSort={handleSort}
                align="right"
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Price"
                sortKey="sellingPrice"
                currentSort={sortConfig}
                onSort={handleSort}
                align="right"
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <SortableHeader
                label="Margin"
                sortKey="margin"
                currentSort={sortConfig}
                onSort={handleSort}
                align="right"
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell align="right">Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredRecipes.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={9} className="text-center py-4">
                No recipes found
              </Table.Cell>
            </Table.Row>
          ) : (
            paginatedRecipes.map(recipe => (
              <Table.Row
                key={recipe.id}
                onClick={() => onRecipeClick(recipe)}
                className="cursor-pointer hover:bg-slate-50 dark:hover:bg-neutral-800"
              >
                <Table.Cell className="font-medium">
                  <Flex align="center" gap="2">
                    {recipe.imageUrl ? (
                      <Image
                        src={recipe.imageUrl} 
                        alt={recipe.name} 
                        width={24}
                        height={24}
                        className="w-6 h-6 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-slate-200 dark:bg-neutral-600 rounded-md flex items-center justify-center">
                        <NotepadText className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                      </div>
                    )}
                    <span>{recipe.name}</span>
                  </Flex>
                  
                </Table.Cell>
                <Table.Cell>{recipe.category}</Table.Cell>
                <Table.Cell>{recipe.portionSize}</Table.Cell>
                <Table.Cell>{recipe.preparationTime}</Table.Cell>
                <Table.Cell align="right">${recipe.costPerPortion.toFixed(2)}</Table.Cell>
                <Table.Cell align="right">${recipe.sellingPrice.toFixed(2)}</Table.Cell>
                <Table.Cell align="right">{((recipe.sellingPrice - recipe.costPerPortion) / recipe.sellingPrice * 100).toFixed(0)}%</Table.Cell>
                <Table.Cell align="right">
                  <Flex justify="end" gap="3">
                    <IconButton 
                      variant="ghost" 
                      size="1"
                      color="gray"
                    >
                      <Edit size={14} />
                    </IconButton>
                    <IconButton 
                      variant="ghost" 
                      color="red" 
                      size="1" 
                      onClick={(e) => handleDeleteClick(e, recipe)}
                    >
                      <Trash2 size={14} />
                    </IconButton>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      {filteredRecipes.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredRecipes.length}
          startIndex={startIndex + 1}
          endIndex={endIndex}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(newSize) => {
            setItemsPerPage(newSize);
            setCurrentPage(1); // Reset to first page when changing items per page
          }}
        />
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Recipe"
        description={`Are you sure you want to delete "${recipeToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        color="red"
      />
    </Box>
  );
};

export default RecipeList;