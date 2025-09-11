import React, { useState, useEffect } from 'react';
import {
  Flex, 
  Box, 
  Card, 
  Tabs, 
  Button, 
  Text,
  AlertDialog,
} from '@radix-ui/themes';
import { Recipe } from '@/types/inventory';
import RecipeGeneralInfo from '@/components/menu-management/recipes/RecipeGeneralInfo';
import RecipeIngredients from '@/components/menu-management/recipes/RecipeIngredients';
import RecipePreparation from '@/components/menu-management/recipes/RecipePreparation';
import RecipeNutrition from '@/components/menu-management/recipes/RecipeNutrition';
import { Pencil, Save, X, FileText, ListChecks, ChefHat, Apple, Trash2 } from 'lucide-react';
import { PageHeading } from '@/components/common/PageHeading';

interface RecipeDetailsProps {
  recipe: Recipe | null;
  onSave: (formData: Recipe) => void; 
  onBack: () => void;
  onDelete?: (recipeId: string) => void;
}

// Define a default empty recipe structure for add mode
const defaultRecipe: Recipe = {
  id: '',
  name: '',
  description: '',
  ingredients: [],
  imageUrl: '',
  category: '',
  steps: [],
  portionSize: '',
  cookingTime: '',
  servingSuggestions: '',
  preparationTime: '',
  costPerPortion: 0,
  sellingPrice: 0,
  nutrition: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
  },
};


const RecipeDetails = ({ recipe, onSave, onBack, onDelete }: RecipeDetailsProps) => {
  const isAddMode = recipe === null;
  const [formData, setFormData] = useState<Recipe>(recipe || defaultRecipe);
  const [isEditing, setIsEditing] = useState<boolean>(isAddMode); 
  const [activeTab, setActiveTab] = useState("general");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const newIsAddMode = recipe === null;
    setFormData(recipe || defaultRecipe);
    setIsEditing(newIsAddMode); 
    setActiveTab("general"); 
  }, [recipe]);


  const handleEditToggle = () => {
    if (!isAddMode) {
      setIsEditing(!isEditing);
      if (isEditing && recipe) { 
        setFormData(recipe); 
      }
    }
  };

  const handleSaveClick = () => {
    onSave(formData); 
    if (!isAddMode) {
      setIsEditing(false);
    }
  };

  const handleCancelClick = () => {
    if (isAddMode) {
      onBack(); 
    } else {
      setIsEditing(false);
      if (recipe) { 
        setFormData(recipe); 
      }
    }
  };

  const updateFormData = (updatedData: Partial<Recipe>) => {
    setFormData(prev => ({ ...prev, ...updatedData } as Recipe)); 
  };

  const handleDelete = () => {
    if (recipe && onDelete) {
      onDelete(recipe.id);
      setShowDeleteDialog(false);
    }
  };

  return (
    <Box>
      <Flex align="center" justify="between" gap="2" mb="4">
        <PageHeading
          title={isAddMode ? "New Recipe" : recipe?.name || 'Recipe Details'}
          description={isAddMode ? "Create a new recipe" : "View or edit recipe details"}
          showBackButton={true}
          onBackClick={onBack}
          noMarginBottom={true}
        />
      </Flex>

      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Trigger value="general">
            <Flex gap="2" align="center">
              <FileText size={16} />
              <Text>General Information</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="ingredients">
            <Flex gap="2" align="center">
              <ListChecks size={16} />
              <Text>Ingredients</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="preparation">
            <Flex gap="2" align="center">
              <ChefHat size={16} />
              <Text>Preparation</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="nutrition">
            <Flex gap="2" align="center">
              <Apple size={16} />
              <Text>Nutrition</Text>
            </Flex>
          </Tabs.Trigger>
        </Tabs.List>

        <Box pt="4" pb="2">
          <Tabs.Content value="general">
            <Card size="3">
              <RecipeGeneralInfo 
                recipe={formData} 
                updateRecipe={updateFormData} 
                isEditing={isEditing}
              />
            </Card>
          </Tabs.Content>
          
          <Tabs.Content value="ingredients">
            <RecipeIngredients 
              recipe={formData}
              updateIngredients={(ingredients) => updateFormData({ ingredients })} 
              isEditing={isEditing} 
            />
          </Tabs.Content>
          
          <Tabs.Content value="preparation">
            <RecipePreparation 
              recipe={formData}
              updatePreparation={(data) => updateFormData(data)}
              isEditing={isEditing}
            />
          </Tabs.Content>
          
          <Tabs.Content value="nutrition">
            <RecipeNutrition 
              recipe={formData}
              updateNutrition={(nutrition) => updateFormData({ nutrition })} 
              isEditing={isEditing} 
            />
          </Tabs.Content>
        </Box>
      </Tabs.Root>

      <Flex justify="between" mt="2">
        <Flex gap="4">
          {isEditing ? (
            <>
              <Button color="green" onClick={handleSaveClick}>
                <Save size={16} />
                <Text>{isAddMode ? 'Save Recipe' : 'Save Changes'}</Text> 
              </Button>
              <Button variant="soft" color="gray" onClick={handleCancelClick}>
                <X size={16} />
                <Text>Cancel</Text>
              </Button>
            </>
          ) : (
            <Button onClick={handleEditToggle}>
              <Pencil size={16} />
              <Text>Edit</Text>
            </Button>
          )}
        </Flex>
        {!isAddMode && (
          <Button variant="soft" color="red" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 size={16} />
            <Text>Delete Recipe</Text>
          </Button>
        )}
      </Flex>

      <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialog.Content>
          <AlertDialog.Title>Delete Recipe</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to delete this recipe? This action cannot be undone.
          </AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button variant="solid" color="red" onClick={handleDelete}>
                Delete
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Box>
  );
};

export default RecipeDetails;
