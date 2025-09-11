import React from 'react';
import { 
  Grid, 
  Box, 
  Flex, 
  Text, 
  Heading, 
  TextArea,
  AspectRatio,
  Separator,
  Select,
  Button,
  TextField
} from '@radix-ui/themes';
import { Recipe } from '@/types/inventory';
import { formatCurrency } from '@/utilities';
import { recipeCategories } from '@/data/CommonData';
import Image from 'next/image';
interface RecipeGeneralInfoProps {
  recipe: Recipe;
  updateRecipe: (data: Partial<Recipe>) => void;
  isEditing: boolean;
}

const RecipeGeneralInfo: React.FC<RecipeGeneralInfoProps> = ({
  recipe,
  updateRecipe,
  isEditing
}) => {
  const handleChange = (field: keyof Recipe) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateRecipe({ [field]: e.target.value });
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateRecipe({ description: e.target.value });
  };

  return (
    <Grid columns={{ initial: '1', md: '2' }} gap="4">
      <Box>
        <AspectRatio ratio={16/9}>
          {recipe.imageUrl ? (
            <Image 
              src={recipe.imageUrl}
              alt={recipe.name}
              width={564}
              height={317}
              className="mx-auto rounded-lg"
            />
          ) : (
            <Flex 
              align="center" 
              justify="center" 
              height="100%"
              className="bg-gray-100 dark:bg-neutral-800 rounded-md"
            >
              <Text color="gray">No image available</Text>
            </Flex>
          )}
        </AspectRatio>
        

        {isEditing && (
          <Flex gap="2" mt="3">
            <label className="flex-1">
              <Box 
                className="rt-reset rt-BaseButton rt-r-size-1 rt-variant-soft rt-Button cursor-pointer"
                data-accent-color="gray"
                role="button"
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        updateRecipe({ imageUrl: e.target?.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <Text>Upload Image</Text>
              </Box>
            </label>
            
            {recipe.imageUrl && (
              <Button variant="soft" color="red" size="1" onClick={() => updateRecipe({ imageUrl: '' })}>
                Remove Image
              </Button>
            )}
          </Flex>
        )}
      </Box>

      <Box>
        {isEditing ? (
          <Flex direction="column" gap="3">
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Recipe Name</Text>
              <TextField.Root 
                placeholder="Recipe Name"
                value={recipe.name}
                onChange={handleChange('name')}
              />
            </Flex>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Category</Text>
              <Select.Root 
                value={recipe.category}
                onValueChange={(value) => updateRecipe({ category: value })}
              >
                <Select.Trigger placeholder="Select Category" />
                <Select.Content>
                  {recipeCategories.map(category => (
                    <Select.Item key={category} value={category}>
                      {category}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Flex>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Portion Size</Text>
              <TextField.Root 
                placeholder="Portion Size (e.g. 100g, 4 cookies, 1 slice)"
                value={recipe.portionSize}
                onChange={handleChange('portionSize')}
              />
            </Flex>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Description</Text>
              <TextArea 
                placeholder="Description"
                value={recipe.description || ''}
                onChange={handleTextAreaChange}
                size="2"
              />
            </Flex>
          </Flex>
        ) : (
          <Flex direction="column" gap="2">
            <Heading size="5">{recipe.name}</Heading>
            <Box>
              <Text className="text-gray-400 dark:text-neutral-600">{recipe.description || 'No description available.'}</Text>
            </Box>
            <Separator size="4" my="3" />
            <Grid columns="2" gap="4">
              <Flex direction="column" gap="1">
                <Text size="1" color="gray">Category</Text>
                <Text size="2" weight="bold">{recipe.category}</Text>
              </Flex>
              
              <Flex direction="column" gap="1">
                <Text size="1" color="gray">Portion Size</Text>
                <Text size="2" weight="bold">{recipe.portionSize}</Text>
              </Flex>

              <Flex direction="column" gap="1">
                <Text size="1" color="gray">Preparation Time</Text>
                <Text size="2" weight="bold">{recipe.preparationTime}</Text>
              </Flex>

              <Flex direction="column" gap="1">
                <Text size="1" color="gray">Cooking Time</Text>
                <Text size="2" weight="bold">{recipe.cookingTime}</Text>
              </Flex>

              <Flex direction="column" gap="1">
                <Text size="1" color="gray">Serving Suggestions</Text>
                <Text size="2" weight="bold">{recipe.servingSuggestions}</Text>
              </Flex>

              <Flex direction="column" gap="1">
                <Text size="1" color="gray">Cost Per Portion</Text>
                <Text size="2" weight="bold">{formatCurrency(recipe.costPerPortion)}</Text>
              </Flex>

              <Flex direction="column" gap="1">
                <Text size="1" color="gray">Selling Price</Text>
                <Text size="2" weight="bold" color="green">{formatCurrency(recipe.sellingPrice)}</Text>
              </Flex>

              <Flex direction="column" gap="1">
                <Text size="1" color="gray">Profit Margin</Text>
                <Text weight="bold" color="green">{((recipe.sellingPrice - recipe.costPerPortion) / recipe.sellingPrice * 100).toFixed(0)}%</Text>
              </Flex>
            </Grid>
          </Flex>
        )}
      </Box>
    </Grid>
  );
};

export default RecipeGeneralInfo; 