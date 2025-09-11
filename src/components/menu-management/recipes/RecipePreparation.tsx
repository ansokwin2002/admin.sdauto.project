import React, { useState } from 'react';
import {
  Heading,
  Box,
  Flex,
  Text,
  Button,
  Card,
  TextArea,
  Dialog,
  IconButton,
  TextField
} from '@radix-ui/themes';
import { Trash2, Plus, Edit, Save, X } from 'lucide-react';
import { PreparationStep, Recipe } from '@/types/inventory';

interface RecipePreparationProps {
  recipe: Recipe;
  updatePreparation: (data: Partial<Recipe>) => void;
  isEditing: boolean;
}

const RecipePreparation: React.FC<RecipePreparationProps> = ({
  recipe,
  updatePreparation,
  isEditing
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStep, setEditingStep] = useState<PreparationStep | null>(null);
  const [newStep, setNewStep] = useState<Partial<PreparationStep>>({
    instruction: ''
  });

  const handleAddStep = () => {
    if (newStep.instruction) {
      const step: PreparationStep = {
        id: Date.now().toString(),
        stepNumber: recipe.steps.length + 1,
        instruction: newStep.instruction || ''
      };
      
      updatePreparation({ steps: [...recipe.steps, step] });
      setOpenDialog(false);
      setNewStep({ instruction: '' });
    }
  };

  const handleDeleteStep = (id: string) => {
    // Filter out the deleted step
    const filteredSteps = recipe.steps.filter(step => step.id !== id);
    
    // Renumber steps to maintain sequential order
    const updatedSteps = filteredSteps.map((step, index) => ({
      ...step,
      stepNumber: index + 1
    }));
    
    updatePreparation({ steps: updatedSteps });
  };

  const handleEditStep = (step: PreparationStep) => {
    setEditingStep(step);
    setOpenDialog(true);
    setNewStep({
      instruction: step.instruction
    });
  };

  const handleSaveEditedStep = () => {
    if (editingStep && newStep.instruction) {
      const updatedSteps = recipe.steps.map(step => {
        if (step.id === editingStep.id) {
          return {
            ...step,
            instruction: newStep.instruction || ''
          };
        }
        return step;
      });
      
      updatePreparation({ steps: updatedSteps });
      setOpenDialog(false);
      setEditingStep(null);
      setNewStep({ instruction: '' });
    }
  };

  const handleCookingTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePreparation({ cookingTime: e.target.value });
  };

  const handleServingSuggestionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updatePreparation({ servingSuggestions: e.target.value });
  };

  const handlePortionSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePreparation({ portionSize: e.target.value });
  };

  return (
    <Flex 
      direction={{ initial: "column", md: "row" }} 
      gap="4"
    >
      <Box className="w-full md:basis-3/4">
        <Flex 
          direction={{ initial: "column", sm: "row" }}
          justify="between" 
          align={{ initial: "stretch", sm: "center" }}
          gap={{ initial: "3", sm: "0" }}
          mb="3"
        >
          <Heading size="4">Preparation Steps</Heading>
          {isEditing && (
            <Button
              variant="soft"
              onClick={() => {
                setEditingStep(null);
                setNewStep({ instruction: '' });
                setOpenDialog(true);
              }}
              className="w-full sm:w-auto"
            >
              <Plus size={16} />
              <Text>Add Step</Text>
            </Button>
          )}
        </Flex>

        {recipe.steps.length > 0 ? (
          <Flex direction="column" gap="3">
            {recipe.steps.map((step) => (
              <Card key={step.id}>
                <Flex 
                  direction={{ initial: "column", sm: "row" }}
                  justify="between" 
                  align={{ initial: "start", sm: "center" }}
                  gap={{ initial: "3", sm: "2" }}
                >
                  <Flex direction="column" gap="2" style={{ flex: 1 }}>
                    <Heading size="3">Step {step.stepNumber}</Heading>
                    <Text>{step.instruction}</Text>
                  </Flex>
                  
                  {isEditing && (
                    <Flex gap="2">
                      <IconButton variant="ghost" size="1" onClick={() => handleEditStep(step)}>
                        <Edit size={16} />
                      </IconButton>
                      <IconButton variant="ghost" color="red" size="1" onClick={() => handleDeleteStep(step.id)}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Flex>
                  )}
                </Flex>
              </Card>
            ))}
          </Flex>
        ) : (
          <Card>
            <Flex align="center" justify="center" p="4">
              <Text color="gray">No preparation steps added yet</Text>
            </Flex>
          </Card>
        )}

        {/* Add/Edit Step Dialog */}
        <Dialog.Root open={openDialog} onOpenChange={setOpenDialog}>
          <Dialog.Content>
            <Flex justify="between" mb="2">
              <Dialog.Title>{editingStep ? 'Edit Step' : 'Add New Step'}</Dialog.Title>
              <Dialog.Close>
                <IconButton variant="ghost" color="gray">
                  <X size={18} />
                </IconButton>
              </Dialog.Close>
            </Flex>
            
            <Box mt="4">
              <TextArea
                placeholder="Step Instructions"
                value={newStep.instruction || ''}
                onChange={(e) => setNewStep({ ...newStep, instruction: e.target.value })}
                size="3"
              />
            </Box>
            
            <Flex 
              direction={{ initial: "column", sm: "row" }}
              gap="3" 
              mt="4" 
              justify="end"
            >
              <Dialog.Close>
                <Button variant="soft" color="gray" className="w-full sm:w-auto">
                  <X size={16} />
                  Cancel
                </Button>
              </Dialog.Close>
              <Button 
                color="green" 
                onClick={editingStep ? handleSaveEditedStep : handleAddStep}
                className="w-full sm:w-auto"
              >
                <Save size={16} />
                {editingStep ? 'Save' : 'Add'}
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Box>
      <Box className="w-full md:basis-1/4">
        <Heading size="4" mb="3">Preparation Info</Heading>
        <Card className="space-y-4">
          <Flex direction="column" gap="1">
            <Text size="2">Cooking Time</Text>
            {isEditing ? (
              <TextField.Root
                value={recipe.cookingTime || ''}
                onChange={handleCookingTimeChange}
                placeholder="e.g., 30 minutes"
                className="rt-reset rt-TextFieldInput"
              />
            ) : (
              <Text weight="bold">{recipe.cookingTime || 'Not specified'}</Text>
            )}
          </Flex>

          <Flex direction="column" gap="1">
            <Text size="2">Serving Suggestions</Text>
            {isEditing ? (
              <TextArea
                value={recipe.servingSuggestions || ''}
                onChange={handleServingSuggestionsChange}
                placeholder="Enter serving suggestions and presentation ideas"
                size="2"
              />
            ) : (
              <Text weight="bold">{recipe.servingSuggestions || 'Not specified'}</Text>
            )}
          </Flex>

          <Flex direction="column" gap="1">
            <Text size="2">Portion Size</Text>
            {isEditing ? (
              <TextField.Root
                value={recipe.portionSize || ''}
                onChange={handlePortionSizeChange}
                placeholder="e.g., 2 servings"
                className="rt-reset rt-TextFieldInput"
              />
            ) : (
              <Text weight="bold">{recipe.portionSize || 'Not specified'}</Text>
            )}
          </Flex>
        </Card>
      </Box>
    </Flex>
  );
};

export default RecipePreparation; 