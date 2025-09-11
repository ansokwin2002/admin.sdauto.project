import React from 'react';
import {
  Grid,
  Box,
  Card,
  Text,
  Heading,
  Flex,
  Separator,
  Progress,
  TextField
} from '@radix-ui/themes';
import { Recipe } from '@/types/inventory';

interface RecipeNutritionProps {
  recipe: Recipe;
  updateNutrition: (nutrition: Recipe['nutrition']) => void;
  isEditing: boolean;
}

const RecipeNutrition: React.FC<RecipeNutritionProps> = ({
  recipe,
  updateNutrition,
  isEditing
}) => {
  const handleNutritionChange = (field: keyof Recipe['nutrition']) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!recipe.nutrition) {
      // Create a new nutrition object if it doesn't exist
      const newNutrition: Recipe['nutrition'] = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      };
      newNutrition[field] = Number(e.target.value);
      updateNutrition(newNutrition);
    } else {
      // Update existing nutrition object
      updateNutrition({
        ...recipe.nutrition,
        [field]: Number(e.target.value)
      });
    }
  };

  const getNutrientPercentage = (value: number) => {
    // This is just an example calculation, adjust as needed
    const total = recipe.nutrition ? (recipe.nutrition.protein + recipe.nutrition.carbs + recipe.nutrition.fat) : 0;
    return total > 0 ? (value / total) * 100 : 0;
  };

  if (!recipe.nutrition && !isEditing) {
    return (
      <Card>
        <Flex align="center" justify="center" p="4">
          <Text color="gray">No nutritional information available for this recipe.</Text>
        </Flex>
      </Card>
    );
  }

  return (
    <Box>
      <Heading size="4" mb="4">Nutritional Information (per serving)</Heading>
      
      {isEditing ? (
        <Card size="3">
          <Grid columns={{ initial: '1', sm: '2', md: '3' }} gap="4">
            <Box>
              <Text size="2" mb="2">Calories</Text>
              <TextField.Root
                type="number"
                value={recipe.nutrition?.calories || ''}
                onChange={handleNutritionChange('calories')}
                min={0}
                placeholder="Calories"
                className="rt-reset rt-TextFieldInput"
                />
              <Text size="1" color="gray" mt="1">kcal</Text>
            </Box>
            
            <Box>
              <Text size="2" mb="2">Protein</Text>
              <TextField.Root
                type="number"
                value={recipe.nutrition?.protein || ''}
                onChange={handleNutritionChange('protein')}
                min={0}
                step={0.1}
                placeholder="Protein"
                className="rt-reset rt-TextFieldInput"
              />
              <Text size="1" color="gray" mt="1">grams</Text>
            </Box>
            
            <Box>
              <Text size="2" mb="2">Carbs</Text>
              <TextField.Root
                type="number"
                value={recipe.nutrition?.carbs || ''}
                onChange={handleNutritionChange('carbs')}
                min={0}
                step={0.1}
                placeholder="Carbs"
                className="rt-reset rt-TextFieldInput"
              />
              <Text size="1" color="gray" mt="1">grams</Text>
            </Box>
            
            <Box>
              <Text size="2" mb="2">Fat</Text>
              <TextField.Root
                type="number"
                value={recipe.nutrition?.fat || ''}
                onChange={handleNutritionChange('fat')}
                min={0}
                step={0.1}
                placeholder="Fat"
                className="rt-reset rt-TextFieldInput"
              />
              <Text size="1" color="gray" mt="1">grams</Text>
            </Box>
            
            <Box>
              <Text size="2" mb="2">Fiber</Text>
              <TextField.Root
                type="number"
                value={recipe.nutrition?.fiber || ''}
                onChange={handleNutritionChange('fiber')}
                min={0}
                step={0.1}
                placeholder="Fiber"
                className="rt-reset rt-TextFieldInput"
              />
              <Text size="1" color="gray" mt="1">grams</Text>
            </Box>
            
            <Box>
              <Text size="2" mb="2">Sugar</Text>
              <TextField.Root
                type="number"
                value={recipe.nutrition?.sugar || ''}
                onChange={handleNutritionChange('sugar')}
                min={0}
                step={0.1}
                placeholder="Sugar"
                className="rt-reset rt-TextFieldInput"
              />
              <Text size="1" color="gray" mt="1">grams</Text>
            </Box>
          </Grid>
        </Card>
      ) : (
        <Grid columns={{ initial: '1', md: '2' }} gap="4">
          <Card size="3">
            <Flex direction="column" align="center" mb="3">
              <Heading size="8">{recipe.nutrition?.calories}</Heading>
              <Text>Calories per serving</Text>
            </Flex>
            
            <Separator size="4" my="3" />
            
            <Grid columns="3" gap="3">
              <Box>
                <Text size="1">Protein</Text>
                <Heading size="4">{recipe.nutrition?.protein}g</Heading>
                <Progress 
                  value={getNutrientPercentage(recipe.nutrition?.protein || 0)} 
                  max={100}
                  color="blue"
                  mt="1"
                />
              </Box>
              
              <Box>
                <Text size="1">Carbs</Text>
                <Heading size="4">{recipe.nutrition?.carbs}g</Heading>
                <Progress 
                  value={getNutrientPercentage(recipe.nutrition?.carbs || 0)} 
                  max={100}
                  color="purple"
                  mt="1"
                />
              </Box>
              
              <Box>
                <Text size="1">Fat</Text>
                <Heading size="4">{recipe.nutrition?.fat}g</Heading>
                <Progress 
                  value={getNutrientPercentage(recipe.nutrition?.fat || 0)} 
                  max={100}
                  color="orange"
                  mt="1"
                />
              </Box>
            </Grid>
          </Card>
          
          <Card size="3">
            <Heading size="4" mb="3">Additional Nutrients</Heading>
            
            <Grid columns="2" gap="4">
              <Box>
                <Text size="2">Fiber</Text>
                <Heading size="4">{recipe.nutrition?.fiber || 'N/A'}</Heading>
                {recipe.nutrition?.fiber && recipe.nutrition.carbs > 0 && (
                  <Text size="1" color="gray">
                    {Math.round((recipe.nutrition.fiber / recipe.nutrition.carbs) * 100)}% of carbs
                  </Text>
                )}
              </Box>
              
              <Box>
                <Text size="2">Sugar</Text>
                <Heading size="4">{recipe.nutrition?.sugar || 'N/A'}</Heading>
                {recipe.nutrition?.sugar && recipe.nutrition.carbs > 0 && (
                  <Text size="1" color="gray">
                    {Math.round((recipe.nutrition.sugar / recipe.nutrition.carbs) * 100)}% of carbs
                  </Text>
                )}
              </Box>
            </Grid>
          </Card>
        </Grid>
      )}
    </Box>
  );
};

export default RecipeNutrition; 