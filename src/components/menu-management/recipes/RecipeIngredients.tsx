import React, { useState } from 'react';
import { 
  Box, 
  Table, 
  Flex, 
  Text, 
  Button,
  Select,
  Dialog, 
  Grid,
  IconButton,
  TextField
} from '@radix-ui/themes';
import { Trash2, Plus, X, Save } from 'lucide-react';
import { RecipeIngredient, UnitOfMeasure, Recipe, IngredientItem } from '@/types/inventory';
import { unitOfMeasures } from '@/data/CommonData';
import { ingredientItems } from '@/data/IngredientItemsData';
import SearchableSelect from '@/components/common/SearchableSelect';
import { mockStockItems } from '@/data/StockItemData';

interface RecipeIngredientsProps {
  recipe: Recipe;
  updateIngredients: (ingredients: Recipe['ingredients']) => void;
  isEditing: boolean;
}

const RecipeIngredients: React.FC<RecipeIngredientsProps> = ({
  recipe,
  updateIngredients,
  isEditing
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [ingradientItem, setIngredientItem] = useState<IngredientItem | null>(null);
  const [newIngredient, setNewIngredient] = useState<Partial<RecipeIngredient>>({
    name: '',
    amount: 0,
    unit: 'g',
    costPerUnit: 0,
    totalCost: 0,
    inStock: 0
  });

  const handleAddIngredient = () => {
    if (newIngredient.name && newIngredient.amount) {
      const ingredient: RecipeIngredient = {
        id: Date.now().toString(),
        ingredientItemId: Date.now().toString(),
        name: newIngredient.name || '',
        amount: newIngredient.amount || 0,
        unit: newIngredient.unit as UnitOfMeasure || 'g',
        costPerUnit: newIngredient.costPerUnit || 0,
        totalCost: (newIngredient.amount || 0) * (newIngredient.costPerUnit || 0),
        inStock: newIngredient.inStock || 0
      };
      
      updateIngredients([...recipe.ingredients, ingredient]);
      setOpenDialog(false);
      setNewIngredient({
        name: '',
        amount: 0,
        unit: 'g',
        costPerUnit: 0,
        totalCost: 0,
        inStock: 0
      });
    }
  };

  const handleDeleteIngredient = (id: string) => {
    updateIngredients(recipe.ingredients.filter(ingredient => ingredient.id !== id));
  };

  const handleIngredientChange = (id: string, field: keyof RecipeIngredient, value: any) => {
    const updatedIngredients = recipe.ingredients.map(ingredient => {
      if (ingredient.id === id) {
        const updatedIngredient = { ...ingredient, [field]: value };
        
        // Recalculate total cost if amount or cost per unit changes
        if (field === 'amount' || field === 'costPerUnit') {
          updatedIngredient.totalCost = updatedIngredient.amount * updatedIngredient.costPerUnit;
        }
        
        return updatedIngredient;
      }
      return ingredient;
    });
    
    updateIngredients(updatedIngredients);
  };

  const handleNewIngredientChange = (field: keyof RecipeIngredient, value: any) => {
    setNewIngredient(prev => {
      const updated = { ...prev, [field]: value };
      
      // Update total cost automatically
      if (field === 'amount' || field === 'costPerUnit') {
        const amount = field === 'amount' ? value : (prev.amount || 0);
        const costPerUnit = field === 'costPerUnit' ? value : (prev.costPerUnit || 0);
        updated.totalCost = amount * costPerUnit;
      }

      if (field === 'name') {
        if (ingradientItem) {
          updated.name = ingradientItem.name;
        }
      }
      
      return updated;
    });
  };

  const handleUnitChange = (id: string, value: string) => {
    handleIngredientChange(id, 'unit', value as UnitOfMeasure);
  };

  const handleNewUnitChange = (value: string) => {
    handleNewIngredientChange('unit', value as UnitOfMeasure);
  };

  return (
    <Box>
      {isEditing && (
        <Button 
          size="2"
          variant="soft"
          mb="2"
          onClick={() => setOpenDialog(true)}
        >
          <Plus size={15} />
          <Text>Add Ingredient</Text>
        </Button>
      )}

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Ingredient</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Qty.</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Unit</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cost per Unit</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell align="right">Total Cost</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Stock Available</Table.ColumnHeaderCell>
            {isEditing && <Table.ColumnHeaderCell align="center">Actions</Table.ColumnHeaderCell>}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {recipe.ingredients.length > 0 ? (
            recipe.ingredients.map((ingredient) => (
              <Table.Row key={ingredient.id} className="align-middle">
                <Table.Cell>
                  {isEditing ? (
                    <TextField.Root
                      placeholder="Ingredient Name"
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(ingredient.id, 'name', e.target.value)}
                    />
                  ) : (
                    ingredient.name
                  )}
                </Table.Cell>
                <Table.Cell>
                  {isEditing ? (
                    <TextField.Root
                      type="number"
                      placeholder="Amount"
                      value={ingredient.amount}
                      onChange={(e) => handleIngredientChange(ingredient.id, 'amount', Number(e.target.value))}
                    />
                  ) : (
                    ingredient.amount
                  )}
                </Table.Cell>
                <Table.Cell>
                  {isEditing ? (
                    <Select.Root
                      value={ingredient.unit}
                      onValueChange={(value) => handleUnitChange(ingredient.id, value)}
                    >
                      <Select.Trigger />
                      <Select.Content>
                        {unitOfMeasures.map(unit => (
                          <Select.Item key={unit} value={unit}>
                            {unit}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  ) : (
                    ingredient.unit
                  )}
                </Table.Cell>
                <Table.Cell>
                  {isEditing ? (
                    <TextField.Root
                      type="number"
                      placeholder="Cost per Unit"
                      value={ingredient.costPerUnit}
                      onChange={(e) => handleIngredientChange(ingredient.id, 'costPerUnit', Number(e.target.value))}
                    />
                  ) : (
                    `$${ingredient.costPerUnit.toFixed(2)}`
                  )}
                </Table.Cell>
                <Table.Cell align="right">
                  ${ingredient.totalCost.toFixed(2)}
                </Table.Cell>
                <Table.Cell>
                  {`${ingredient.inStock} ${ingredient.unit}`}
                </Table.Cell>
                {isEditing && (
                  <Table.Cell align="center">
                    <Button 
                      color="red" 
                      variant="ghost" 
                      size="2" 
                      onClick={() => handleDeleteIngredient(ingredient.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </Table.Cell>
                )}
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={isEditing ? 7 : 6} align="center">
                <Text color="gray">No ingredients added yet</Text>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
      
      {/* Add Ingredient Dialog */}
      <Dialog.Root open={openDialog} onOpenChange={setOpenDialog}>
        <Dialog.Content>
          <Flex justify="between" mb="2">
            <Dialog.Title>Add Ingredient</Dialog.Title>
            <Dialog.Close>
              <IconButton variant="ghost" color="gray">
                <X size={18} />
              </IconButton>
            </Dialog.Close>
          </Flex>
          
          <Flex direction="column" gap="4">
            <SearchableSelect
              placeholder="Select ingredient"
              options={ingredientItems.map(ingredient => ({
                value: ingredient.id,
                label: ingredient.name
              }))}
              value={ingradientItem?.id}
              onChange={(value) => {
                setIngredientItem(ingredientItems.find(item => item.id === value) || null);
                handleNewIngredientChange('name', value);
              }}
              usePortal={true}
            />
            
            <Grid columns="3" gap="3">
              <TextField.Root
                type="number"
                placeholder="Amount"
                value={newIngredient.amount || ''}
                onChange={(e) => handleNewIngredientChange('amount', Number(e.target.value))}
                min={0}
                step={0.01}
              />
              
              <Select.Root
                onValueChange={handleNewUnitChange}
              >
                <Select.Trigger placeholder="Select unit" />
                <Select.Content>
                  {unitOfMeasures.map(unit => (
                    <Select.Item key={unit} value={unit}>
                      {unit}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              
              <TextField.Root
                type="number"
                placeholder="Cost per Unit"
                value={newIngredient.costPerUnit || ''}
                onChange={(e) => handleNewIngredientChange('costPerUnit', Number(e.target.value))}
                min={0}
                step={0.01}
              >
                <TextField.Slot>$</TextField.Slot>
              </TextField.Root>
            </Grid>
            <Text size="2" mt="2">
              Available Stock: {mockStockItems.find(item => item.id === ingradientItem?.id)?.quantity} {mockStockItems.find(item => item.id === ingradientItem?.id)?.storageUnit}
            </Text>
            <Text size="2" mt="2">
              Total Cost: ${(newIngredient.totalCost || 0).toFixed(2)}
            </Text>
          </Flex>
          
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                <X size={16} />
                Cancel
              </Button>
            </Dialog.Close>
            <Button color="green" onClick={handleAddIngredient}>
              <Save size={16} />
              Save
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
};

export default RecipeIngredients; 