'use client';

import RecipeList from "@/components/menu-management/recipes/RecipeList";
import { useRouter } from 'next/navigation';
import { Recipe } from "@/types/inventory";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function RecipesPage() {
  const router = useRouter();
  usePageTitle('Recipes');

  const handleRecipeClick = (recipe: Recipe) => {
    // Assuming recipe has an 'id' property
    router.push(`/menu-management/recipes/${recipe.id}`);
  };

  const handleAddRecipe = () => {
    router.push('/menu-management/recipes/add');
  };

  return (
    <div>
      <RecipeList
        onRecipeClick={handleRecipeClick}
        onAddRecipe={handleAddRecipe}
      />
    </div>
  );
}