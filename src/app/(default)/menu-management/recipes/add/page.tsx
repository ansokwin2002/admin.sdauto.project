'use client';

import RecipeDetails from "@/components/menu-management/recipes/RecipeDetails";
import { useRouter } from 'next/navigation';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function AddRecipePage() {
  usePageTitle('Add Recipe');
  const router = useRouter();

  const handleSave = () => {
    // Add logic to save the new recipe here
    console.log("Saving new recipe...");
    router.push('/menu-management/recipes');
  };

  const handleBack = () => {
    router.push('/menu-management/recipes');
  };

  return (
    <RecipeDetails
      recipe={null}
      onSave={handleSave}
      onBack={handleBack}
    />
  );
} 