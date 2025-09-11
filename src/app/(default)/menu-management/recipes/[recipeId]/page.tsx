'use client';

import RecipeDetails from "@/components/menu-management/recipes/RecipeDetails";
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Recipe } from '@/types/inventory';
import { recipes } from "@/data/RecipesData";
import { usePageTitle } from '@/hooks/usePageTitle';

async function fetchRecipeById(id: string): Promise<Recipe | null> {
  const recipe = recipes.find(r => r.id === id);
  return recipe || null;
}

export default function EditRecipePage() {
  const router = useRouter();
  const params = useParams();
  const recipeId = params.recipeId as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  usePageTitle(recipe?.name);

  useEffect(() => {
    if (recipeId) {
      setIsLoading(true);
      fetchRecipeById(recipeId)
        .then(data => {
          if (data) {
            setRecipe(data);
          } else {
            setError('Recipe not found');
          }
        })
        .catch(err => {
          console.error("Failed to fetch recipe:", err);
          setError('Failed to load recipe data.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [recipeId]);

  const handleSubmitForm = () => {
    // Add logic to update the existing recipe here
    console.log(`Saving recipe with id: ${recipeId}...`);
    router.push('/menu-management/recipes');
  };

  const handleBack = () => {
    router.push('/menu-management/recipes');
  };

  if (isLoading) {
    return <div>Loading recipe details...</div>;
  }

  if (error) {
    // TODO: Replace with a proper error component
    return <div>Error: {error}</div>;
  }

  if (!recipe) {
     // Handle case where recipe is null after loading (e.g., not found)
     return <div>Recipe not found. <button onClick={handleBack}>Go Back</button></div>;
  }

  return (
    <RecipeDetails
      recipe={recipe}
      onSave={handleSubmitForm}
      onBack={handleBack}
    />
  );
} 