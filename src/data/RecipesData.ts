import { Recipe } from "@/types/inventory";

export const recipes: Recipe[] = [
  {
    id: "1",
    name: "Spaghetti Carbonara",
    category: "Main Course",
    description: "A classic Italian pasta dish with creamy sauce and bacon.",
    imageUrl: "/images/recipes/carbonara.jpg",
    ingredients: [
      { id: "4", amount: 5, ingredientItemId: "1", name: "Salt", unit: "g", costPerUnit: 0.5, totalCost: 2.5, inStock: 100 }, // Salt
      { id: "5", amount: 3, ingredientItemId: "2", name: "Black Pepper", unit: "g", costPerUnit: 1, totalCost: 3, inStock: 100 }, // Black Pepper
      { id: "9", amount: 2, ingredientItemId: "3", name: "Eggs", unit: "pcs", costPerUnit: 1, totalCost: 2, inStock: 100 }, // Eggs
      { id: "10", amount: 30, ingredientItemId: "4", name: "Butter", unit: "g", costPerUnit: 2, totalCost: 60, inStock: 100 }, // Butter
    ],
    portionSize: "350g",
    preparationTime: "25 min",
    steps: [
      { id: "1", stepNumber: 1, instruction: "Boil the pasta" },
      { id: "2", stepNumber: 2, instruction: "Cook the bacon" },
      { id: "3", stepNumber: 3, instruction: "Mix the pasta and bacon" },
      { id: "4", stepNumber: 4, instruction: "Add the butter and eggs" },
      { id: "5", stepNumber: 5, instruction: "Serve" },
    ],
    nutrition: {
      calories: 1000,
      protein: 20,
      carbs: 50,
      fat: 30,
    },
    cookingTime: "25 min",
    servingSuggestions: "3 servings",
    costPerPortion: 3.50,
    sellingPrice: 12.99,
  },
  {
    id: "2",
    name: "Chocolate Chip Cookies",
    category: "Dessert",
    description: "A classic American dessert with chocolate chips and a soft cookie dough.",
    imageUrl: "/images/recipes/cookies.jpg",
    ingredients: [
      { id: "1", amount: 250, ingredientItemId: "5", name: "All-Purpose Flour", unit: "g", costPerUnit: 0.5, totalCost: 125, inStock: 100 }, // All-Purpose Flour
      { id: "2", amount: 200, ingredientItemId: "6", name: "Granulated Sugar", unit: "g", costPerUnit: 0.75, totalCost: 150, inStock: 100 }, // Granulated Sugar
      { id: "10", amount: 150, ingredientItemId: "7", name: "Butter", unit: "g", costPerUnit: 2, totalCost: 300, inStock: 100 }, // Butter
      { id: "9", amount: 1, ingredientItemId: "8", name: "Eggs", unit: "pcs", costPerUnit: 1, totalCost: 1, inStock: 100 }, // Eggs
      { id: "15", amount: 200, ingredientItemId: "9", name: "Chocolate Chips", unit: "g", costPerUnit: 3, totalCost: 600, inStock: 100 }, // Chocolate Chips
    ],
    portionSize: "4 cookies",
    preparationTime: "45 min",
    steps: [
      { id: "1", stepNumber: 1, instruction: "Preheat oven to 350°F (177°C)" },
      { id: "2", stepNumber: 2, instruction: "Mix the dry ingredients" },
      { id: "3", stepNumber: 3, instruction: "Add the wet ingredients" },
      { id: "4", stepNumber: 4, instruction: "Drop by spoonfuls onto a baking sheet" },
      { id: "5", stepNumber: 5, instruction: "Bake for 10-12 minutes" },
    ],
    nutrition: {
      calories: 1000,
      protein: 20,
      carbs: 50,
      fat: 30,
    },
    costPerPortion: 2.25,
    sellingPrice: 8.50,
    cookingTime: "45 min",
    servingSuggestions: "4 cookies",
  },
  {
    id: "3",
    name: "Chicken Stir Fry",
    category: "Main Course",
    description: "A healthy and flavorful chicken stir fry with vegetables and a light sauce.",
    imageUrl: "/images/recipes/stir-fry.jpg",
    ingredients: [
      { id: "6", amount: 200, ingredientItemId: "10", name: "Chicken Breast", unit: "g", costPerUnit: 1, totalCost: 200, inStock: 100 }, // Chicken Breast
      { id: "11", amount: 100, ingredientItemId: "11", name: "Onions", unit: "g", costPerUnit: 0.5, totalCost: 50, inStock: 100 }, // Onions
      { id: "12", amount: 15, ingredientItemId: "12", name: "Garlic", unit: "g", costPerUnit: 1, totalCost: 15, inStock: 100 }, // Garlic
      { id: "3", amount: 30, ingredientItemId: "13", name: "Olive Oil", unit: "g", costPerUnit: 2, totalCost: 60, inStock: 100 }, // Olive Oil
      { id: "13", amount: 150, ingredientItemId: "14", name: "Rice", unit: "g", costPerUnit: 0.5, totalCost: 75, inStock: 100 }, // Rice
    ],
    portionSize: "400g",
    preparationTime: "30 min",
    steps: [
      { id: "1", stepNumber: 1, instruction: "Cut chicken into strips" },
      { id: "2", stepNumber: 2, instruction: "Stir-fry chicken until cooked" },
      { id: "3", stepNumber: 3, instruction: "Add vegetables and seasonings" },
      { id: "4", stepNumber: 4, instruction: "Cook rice separately" },
      { id: "5", stepNumber: 5, instruction: "Serve stir-fry over rice" }
    ],
    cookingTime: "20 min",
    servingSuggestions: "2 servings",
    costPerPortion: 5.75,
    sellingPrice: 14.99,
    nutrition: {
      calories: 450,
      protein: 35,
      carbs: 40,
      fat: 15
    }
  },
  {
    id: "4",
    name: "Tomato Soup",
    category: "Appetizer",
    description: "A creamy and comforting tomato soup with a hint of garlic and herbs.",
    imageUrl: "/images/recipes/tomato-soup.jpg",
    ingredients: [
      { id: "7", amount: 300, ingredientItemId: "15", name: "Tomatoes", unit: "g", costPerUnit: 0.5, totalCost: 150, inStock: 100 }, // Tomatoes
      { id: "11", amount: 50, ingredientItemId: "16", name: "Onions", unit: "g", costPerUnit: 0.5, totalCost: 25, inStock: 100 }, // Onions
      { id: "12", amount: 10, ingredientItemId: "17", name: "Garlic", unit: "g", costPerUnit: 1, totalCost: 10, inStock: 100 }, // Garlic
      { id: "3", amount: 15, ingredientItemId: "18", name: "Olive Oil", unit: "g", costPerUnit: 2, totalCost: 30, inStock: 100 }, // Olive Oil
      { id: "4", amount: 3, ingredientItemId: "19", name: "Salt", unit: "g", costPerUnit: 0.5, totalCost: 1.5, inStock: 100 }, // Salt
    ],
    portionSize: "250ml",
    preparationTime: "20 min",
    steps: [
      { id: "1", stepNumber: 1, instruction: "Dice tomatoes and onions" },
      { id: "2", stepNumber: 2, instruction: "Sauté onions and garlic in olive oil" },
      { id: "3", stepNumber: 3, instruction: "Add tomatoes and simmer" },
      { id: "4", stepNumber: 4, instruction: "Blend until smooth" },
      { id: "5", stepNumber: 5, instruction: "Season with salt and serve" }
    ],
    cookingTime: "15 min",
    servingSuggestions: "2 servings",
    costPerPortion: 1.85,
    sellingPrice: 6.99,
    nutrition: {
      calories: 120,
      protein: 3,
      carbs: 15,
      fat: 7
    }
  },
  {
    id: "5",
    name: "Lemon Butter Fish",
    category: "Main Course",
    description: "A delicious fish dish with a lemon butter sauce and vegetables.",
    imageUrl: "/images/recipes/fish.jpg",
    ingredients: [
      { id: "10", amount: 50, ingredientItemId: "20", name: "Butter", unit: "g", costPerUnit: 2, totalCost: 100, inStock: 100 }, // Butter
      { id: "14", amount: 30, ingredientItemId: "21", name: "Lemon", unit: "pcs", costPerUnit: 1, totalCost: 30, inStock: 100 }, // Lemon
      { id: "4", amount: 2, ingredientItemId: "22", name: "Salt", unit: "g", costPerUnit: 0.5, totalCost: 1, inStock: 100 }, // Salt
      { id: "5", amount: 1, ingredientItemId: "23", name: "Black Pepper", unit: "g", costPerUnit: 1, totalCost: 1, inStock: 100 }, // Black Pepper
    ],
    portionSize: "300g",
    preparationTime: "25 min",
    steps: [
      { id: "1", stepNumber: 1, instruction: "Season fish with salt and pepper" },
      { id: "2", stepNumber: 2, instruction: "Melt butter in a pan" },
      { id: "3", stepNumber: 3, instruction: "Cook fish until flaky" },
      { id: "4", stepNumber: 4, instruction: "Add lemon juice to the pan" },
      { id: "5", stepNumber: 5, instruction: "Drizzle sauce over fish before serving" }
    ],
    cookingTime: "15 min",
    servingSuggestions: "1 serving",
    costPerPortion: 8.25,
    sellingPrice: 22.99,
    nutrition: {
      calories: 320,
      protein: 28,
      carbs: 2,
      fat: 22
    }
  },
  {
    id: "6",
    name: "Mushroom Risotto",
    category: "Main Course",
    description: "A creamy and flavorful mushroom risotto with a hint of garlic and herbs.",
    imageUrl: "/images/recipes/risotto.jpg",
    ingredients: [
      { id: "13", amount: 200, ingredientItemId: "24", name: "Rice", unit: "g", costPerUnit: 0.5, totalCost: 100, inStock: 100 }, // Rice
      { id: "16", amount: 150, ingredientItemId: "25", name: "Mushrooms", unit: "g", costPerUnit: 1, totalCost: 150, inStock: 100 }, // Mushrooms
      { id: "11", amount: 50, ingredientItemId: "26", name: "Onions", unit: "g", costPerUnit: 0.5, totalCost: 25, inStock: 100 }, // Onions
      { id: "10", amount: 40, ingredientItemId: "27", name: "Butter", unit: "g", costPerUnit: 2, totalCost: 80, inStock: 100 }, // Butter
      { id: "4", amount: 3, ingredientItemId: "28", name: "Salt", unit: "g", costPerUnit: 0.5, totalCost: 1.5, inStock: 100 }, // Salt
    ],
    portionSize: "320g",
    preparationTime: "35 min",
    costPerPortion: 4.25,
    sellingPrice: 15.99,
    cookingTime: "35 min",
    servingSuggestions: "2 servings",
    steps: [
      { id: "1", stepNumber: 1, instruction: "Cook rice until tender" },
      { id: "2", stepNumber: 2, instruction: "Sauté onions and mushrooms in butter" },
      { id: "3", stepNumber: 3, instruction: "Add salt and simmer" },
      { id: "4", stepNumber: 4, instruction: "Serve with butter" }
    ],
    nutrition: {
      calories: 350,
      protein: 10,
      carbs: 40,
      fat: 16
    }
    
  },
  {
    id: "7",
    name: "Tiramisu",
    category: "Dessert",
    description: "A classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.",
    imageUrl: "/images/recipes/tiramisu.jpg",
    ingredients: [
      { id: "9", amount: 4, ingredientItemId: "29", name: "Eggs", unit: "pcs", costPerUnit: 1, totalCost: 4, inStock: 100 }, // Eggs
      { id: "2", amount: 100, ingredientItemId: "30", name: "Granulated Sugar", unit: "g", costPerUnit: 0.75, totalCost: 75, inStock: 100 }, // Granulated Sugar
      { id: "17", amount: 250, ingredientItemId: "31", name: "Mascarpone", unit: "g", costPerUnit: 2, totalCost: 500, inStock: 100 }, // Mascarpone
      { id: "18", amount: 200, ingredientItemId: "32", name: "Coffee", unit: "g", costPerUnit: 1, totalCost: 200, inStock: 100 }, // Coffee
      { id: "19", amount: 100, ingredientItemId: "33", name: "Ladyfingers", unit: "g", costPerUnit: 1, totalCost: 100, inStock: 100 }, // Ladyfingers
    ],
    portionSize: "150g",
    preparationTime: "4 hours",
    costPerPortion: 3.75,
    sellingPrice: 9.99,
    steps: [
      { id: "1", stepNumber: 1, instruction: "Mix eggs and sugar" },
      { id: "2", stepNumber: 2, instruction: "Add mascarpone and coffee" },
      { id: "3", stepNumber: 3, instruction: "Soak ladyfingers in coffee" },
      { id: "4", stepNumber: 4, instruction: "Layer and refrigerate" }
    ],
    cookingTime: "4 hours",
    servingSuggestions: "1 serving",
  },
  {
    id: "8",
    name: "Bruschetta",
    category: "Appetizer",
    description: "A classic Italian appetizer with bread rubbed with garlic and olive oil.",
    imageUrl: "/images/recipes/bruschetta.jpg",
    ingredients: [
      { id: "7", amount: 200, ingredientItemId: "34", name: "Tomatoes", unit: "g", costPerUnit: 0.5, totalCost: 100, inStock: 100 }, // Tomatoes
      { id: "12", amount: 15, ingredientItemId: "35", name: "Garlic", unit: "g", costPerUnit: 1, totalCost: 15, inStock: 100 }, // Garlic
      { id: "3", amount: 25, ingredientItemId: "36", name: "Olive Oil", unit: "g", costPerUnit: 2, totalCost: 50, inStock: 100 }, // Olive Oil
      { id: "20", amount: 150, ingredientItemId: "37", name: "Baguette", unit: "g", costPerUnit: 1, totalCost: 150, inStock: 100 }, // Baguette
      { id: "4", amount: 2, ingredientItemId: "38", name: "Salt", unit: "g", costPerUnit: 0.5, totalCost: 1, inStock: 100 }, // Salt
    ],
    portionSize: "4 pieces",
    preparationTime: "15 min",
    steps: [
      { id: "1", stepNumber: 1, instruction: "Rub bread with garlic and olive oil" },
      { id: "2", stepNumber: 2, instruction: "Bake until golden brown" },
      { id: "3", stepNumber: 3, instruction: "Serve with tomatoes and basil" }
    ],
    cookingTime: "10 min",
    servingSuggestions: "4 servings",
    costPerPortion: 2.15,
    sellingPrice: 7.50,
  },
  {
    id: "9",
    name: "Beef Stroganoff",
    category: "Main Course",
    description: "A creamy and flavorful beef stroganoff with a hint of mushrooms and onions.",
    imageUrl: null,
    ingredients: [
      { id: "21", amount: 250, ingredientItemId: "39", name: "Beef", unit: "g", costPerUnit: 1, totalCost: 250, inStock: 100 }, // Beef
      { id: "16", amount: 100, ingredientItemId: "40", name: "Mushrooms", unit: "g", costPerUnit: 1, totalCost: 100, inStock: 100 }, // Mushrooms
      { id: "11", amount: 75, ingredientItemId: "41", name: "Onions", unit: "g", costPerUnit: 0.5, totalCost: 37.5, inStock: 100 }, // Onions
      { id: "22", amount: 100, ingredientItemId: "42", name: "Sour Cream", unit: "g", costPerUnit: 2, totalCost: 200, inStock: 100 }, // Sour Cream
      { id: "13", amount: 150, ingredientItemId: "43", name: "Rice", unit: "g", costPerUnit: 0.5, totalCost: 75, inStock: 100 }, // Rice
    ],
    portionSize: "380g",
    preparationTime: "40 min",
    costPerPortion: 6.50,
    sellingPrice: 18.99,
    steps: [
      { id: "1", stepNumber: 1, instruction: "Cook beef until tender" },
      { id: "2", stepNumber: 2, instruction: "Sauté mushrooms and onions in butter" },
      { id: "3", stepNumber: 3, instruction: "Add sour cream and rice" },
      { id: "4", stepNumber: 4, instruction: "Serve with mushrooms and onions" }
    ],
    cookingTime: "40 min",
    servingSuggestions: "4 servings",
  },
  {
    id: "10",
    name: "Apple Pie",
    category: "Dessert",
    description: "A classic American dessert with apple pie and a hint of cinnamon.",
    imageUrl: "/images/recipes/apple-pie.jpg",
    ingredients: [
      { id: "1", amount: 300, ingredientItemId: "44", name: "All-Purpose Flour", unit: "g", costPerUnit: 0.5, totalCost: 150, inStock: 100 }, // All-Purpose Flour
      { id: "10", amount: 150, ingredientItemId: "45", name: "Butter", unit: "g", costPerUnit: 2, totalCost: 300, inStock: 100 }, // Butter
      { id: "2", amount: 120, ingredientItemId: "46", name: "Granulated Sugar", unit: "g", costPerUnit: 0.75, totalCost: 90, inStock: 100 }, // Granulated Sugar
      { id: "23", amount: 500, ingredientItemId: "47", name: "Apples", unit: "g", costPerUnit: 0.5, totalCost: 250, inStock: 100 }, // Apples
      { id: "24", amount: 10, ingredientItemId: "48", name: "Cinnamon", unit: "g", costPerUnit: 1, totalCost: 10, inStock: 100 }, // Cinnamon
    ],
    portionSize: "1 slice",
    preparationTime: "1 hour",
    costPerPortion: 2.80,
    sellingPrice: 8.99,
    steps: [
      { id: "1", stepNumber: 1, instruction: "Mix flour and butter" },
      { id: "2", stepNumber: 2, instruction: "Add sugar and apples" },
      { id: "3", stepNumber: 3, instruction: "Bake until golden brown" },
      { id: "4", stepNumber: 4, instruction: "Serve with cinnamon" }
    ],
    cookingTime: "1 hour",
    servingSuggestions: "1 serving",
  },
  {
    id: "11",
    name: "Shrimp Scampi",
    category: "Main Course",
    description: "A creamy and flavorful shrimp scampi with a hint of lemon and pasta.",
    imageUrl: "/images/recipes/shrimp-scampi.jpg",
    ingredients: [
      { id: "25", amount: 200, ingredientItemId: "49", name: "Shrimp", unit: "g", costPerUnit: 1, totalCost: 200, inStock: 100 }, // Shrimp
      { id: "12", amount: 20, ingredientItemId: "50", name: "Garlic", unit: "g", costPerUnit: 1, totalCost: 20, inStock: 100 }, // Garlic
      { id: "10", amount: 50, ingredientItemId: "51", name: "Butter", unit: "g", costPerUnit: 2, totalCost: 100, inStock: 100 }, // Butter
      { id: "14", amount: 30, ingredientItemId: "52", name: "Lemon", unit: "pcs", costPerUnit: 1, totalCost: 30, inStock: 100 }, // Lemon
      { id: "26", amount: 200, ingredientItemId: "53", name: "Pasta", unit: "g", costPerUnit: 0.5, totalCost: 100, inStock: 100 }, // Pasta
    ],
    portionSize: "300g",
    preparationTime: "25 min",
    costPerPortion: 7.25,
    sellingPrice: 19.99,
    steps: [
      { id: "1", stepNumber: 1, instruction: "Cook pasta until tender" },
      { id: "2", stepNumber: 2, instruction: "Sauté garlic and shrimp in butter" },
      { id: "3", stepNumber: 3, instruction: "Add lemon and pasta" },
      { id: "4", stepNumber: 4, instruction: "Serve with shrimp and garlic" }
    ],
    cookingTime: "25 min",
    servingSuggestions: "3 servings",
  },
  {
    id: "12",
    name: "Caprese Salad",
    category: "Appetizer",
    description: "A refreshing and flavorful caprese salad with tomatoes, mozzarella, basil, and olive oil.",
    imageUrl: "/images/recipes/caprese.jpg",
    ingredients: [
      { id: "7", amount: 200, ingredientItemId: "54", name: "Tomatoes", unit: "g", costPerUnit: 0.5, totalCost: 100, inStock: 100 }, // Tomatoes
      { id: "27", amount: 150, ingredientItemId: "55", name: "Mozzarella", unit: "g", costPerUnit: 1, totalCost: 150, inStock: 100 }, // Mozzarella
      { id: "28", amount: 30, ingredientItemId: "56", name: "Basil", unit: "pcs", costPerUnit: 1, totalCost: 30, inStock: 100 }, // Basil
      { id: "3", amount: 20, ingredientItemId: "57", name: "Olive Oil", unit: "g", costPerUnit: 2, totalCost: 40, inStock: 100 }, // Olive Oil
      { id: "4", amount: 2, ingredientItemId: "58", name: "Salt", unit: "g", costPerUnit: 0.5, totalCost: 1, inStock: 100 }, // Salt
    ],
    portionSize: "250g",
    preparationTime: "10 min",
    costPerPortion: 3.50,
    sellingPrice: 9.99,
    steps: [
      { id: "1", stepNumber: 1, instruction: "Slice tomatoes and mozzarella" },
      { id: "2", stepNumber: 2, instruction: "Arrange on a plate" },
      { id: "3", stepNumber: 3, instruction: "Add basil and olive oil" },
      { id: "4", stepNumber: 4, instruction: "Serve with salt" }
    ],
    cookingTime: "10 min",
    servingSuggestions: "2 servings",
  },
  {
    id: "13",
    name: "Vegetable Curry",
    category: "Main Course",
    description: "A creamy and flavorful vegetable curry with a hint of coconut milk and rice.",
    imageUrl: null,
    ingredients: [
      { id: "29", amount: 200, ingredientItemId: "59", name: "Mixed Vegetables", unit: "g", costPerUnit: 0.5, totalCost: 100, inStock: 100 }, // Mixed Vegetables
      { id: "30", amount: 50, ingredientItemId: "60", name: "Curry Paste", unit: "g", costPerUnit: 1, totalCost: 50, inStock: 100 }, // Curry Paste
      { id: "31", amount: 200, ingredientItemId: "61", name: "Coconut Milk", unit: "g", costPerUnit: 2, totalCost: 400, inStock: 100 }, // Coconut Milk
      { id: "13", amount: 150, ingredientItemId: "62", name: "Rice", unit: "g", costPerUnit: 0.5, totalCost: 75, inStock: 100 }, // Rice
      { id: "4", amount: 3, ingredientItemId: "63", name: "Salt", unit: "g", costPerUnit: 0.5, totalCost: 1.5, inStock: 100 }, // Salt
    ],
    portionSize: "400g",
    preparationTime: "35 min",
    costPerPortion: 4.20,
    sellingPrice: 13.99,
    steps: [
      { id: "1", stepNumber: 1, instruction: "Cook rice until tender" },
      { id: "2", stepNumber: 2, instruction: "Sauté vegetables and curry paste in butter" },
      { id: "3", stepNumber: 3, instruction: "Add coconut milk and rice" },
      { id: "4", stepNumber: 4, instruction: "Serve with vegetables and curry paste" }
    ],
    cookingTime: "35 min",
    servingSuggestions: "4 servings",
  },
  {
    id: "14",
    name: "Cheesecake",
    category: "Dessert",
    description: "A classic American dessert with cheesecake and a hint of graham crackers.",
    imageUrl: "/images/recipes/cheesecake.jpg",
    ingredients: [
      { id: "32", amount: 300, ingredientItemId: "64", name: "Cream Cheese", unit: "g", costPerUnit: 2, totalCost: 600, inStock: 100 }, // Cream Cheese
      { id: "2", amount: 150, ingredientItemId: "65", name: "Granulated Sugar", unit: "g", costPerUnit: 0.75, totalCost: 112.5, inStock: 100 }, // Granulated Sugar
      { id: "9", amount: 3, ingredientItemId: "66", name: "Eggs", unit: "pcs", costPerUnit: 1, totalCost: 3, inStock: 100 }, // Eggs
      { id: "33", amount: 150, ingredientItemId: "67", name: "Graham Crackers", unit: "g", costPerUnit: 1, totalCost: 150, inStock: 100 }, // Graham Crackers
      { id: "10", amount: 80, ingredientItemId: "68", name: "Butter", unit: "g", costPerUnit: 2, totalCost: 160, inStock: 100 }, // Butter
    ],
    portionSize: "1 slice",
    preparationTime: "1 hour 30 min",
    costPerPortion: 3.90,
    sellingPrice: 10.99,
    steps: [
      { id: "1", stepNumber: 1, instruction: "Mix cream cheese and sugar" },
      { id: "2", stepNumber: 2, instruction: "Add eggs and graham crackers" },
      { id: "3", stepNumber: 3, instruction: "Bake until golden brown" },
      { id: "4", stepNumber: 4, instruction: "Serve with butter" }
    ],
    cookingTime: "1 hour 30 min",
    servingSuggestions: "1 slice",
  },
  {
    id: "15",
    name: "Spinach Dip",
    category: "Appetizer",
    description: "A creamy and flavorful spinach dip with a hint of sour cream and garlic.",
    imageUrl: "/images/recipes/spinach-dip.jpg",
    ingredients: [
      { id: "34", amount: 200, ingredientItemId: "69", name: "Spinach", unit: "g", costPerUnit: 0.5, totalCost: 100, inStock: 100 }, // Spinach
      { id: "32", amount: 150, ingredientItemId: "70", name: "Cream Cheese", unit: "g", costPerUnit: 2, totalCost: 300, inStock: 100 }, // Cream Cheese
      { id: "22", amount: 100, ingredientItemId: "71", name: "Sour Cream", unit: "g", costPerUnit: 2, totalCost: 200, inStock: 100 }, // Sour Cream
      { id: "12", amount: 10, ingredientItemId: "72", name: "Garlic", unit: "g", costPerUnit: 1, totalCost: 10, inStock: 100 }, // Garlic
      { id: "4", amount: 2, ingredientItemId: "73", name: "Salt", unit: "g", costPerUnit: 0.5, totalCost: 1, inStock: 100 }, // Salt
    ],
    portionSize: "200g",
    preparationTime: "20 min",
    steps: [
      { id: "1", stepNumber: 1, instruction: "Cook spinach until wilted" },
      { id: "2", stepNumber: 2, instruction: "Mix cream cheese and sour cream" },
      { id: "3", stepNumber: 3, instruction: "Add minced garlic and salt" },
      { id: "4", stepNumber: 4, instruction: "Fold in cooked spinach" },
      { id: "5", stepNumber: 5, instruction: "Chill before serving" }
    ],
    cookingTime: "10 min",
    servingSuggestions: "4 servings",
    costPerPortion: 2.95,
    sellingPrice: 8.50,
    nutrition: {
      calories: 180,
      protein: 5,
      carbs: 4,
      fat: 16
    }
  },
];