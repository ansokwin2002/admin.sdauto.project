import { organization } from './CommonData';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  isActive: boolean;
  isSeasonal: boolean;
  seasonalStartDate?: string;
  seasonalEndDate?: string;
  availableBranchesIds: string[];
  dietaryLabels: string[];
  ingredients: {
    id: string;
    name: string;
    quantity: number;
    unit: string;
  }[];
  popularity: number;
  stockWarning: boolean;
  branchPrices?: { [branchId: string]: number };
}

export const menuCategories = [
  { id: 'main-course', name: 'Main Course' },
  { id: 'starters', name: 'Starters' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'appetizers', name: 'Appetizers' },
  { id: 'beverages', name: 'Beverages' },
  { id: 'sides', name: 'Sides' },
];

export const dietaryLabels = [
  { id: 'vegetarian', name: 'Vegetarian' },
  { id: 'vegan', name: 'Vegan' },
  { id: 'gluten-free', name: 'Gluten Free' },
  { id: 'halal', name: 'Halal' },
  { id: 'spicy', name: 'Spicy' },
];

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Burger',
    description: 'Juicy beef patty with fresh lettuce, tomatoes, and special sauce',
    category: 'main-course',
    price: 12.99,
    imageUrl: '/images/menu/burger.jpg',
    isActive: true,
    isSeasonal: false,
    availableBranchesIds: ["br-1", "br-2", "br-3"],
    dietaryLabels: ['halal'],
    ingredients: [
      { id: '1', name: 'Beef Patty', quantity: 1, unit: 'piece' },
      { id: '2', name: 'Burger Bun', quantity: 1, unit: 'piece' },
      { id: '3', name: 'Lettuce', quantity: 0.1, unit: 'kg' },
      { id: '4', name: 'Tomato', quantity: 0.05, unit: 'kg' },
    ],
    popularity: 98,
    stockWarning: false,
  },
  {
    id: '2',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, croutons, parmesan cheese with Caesar dressing',
    category: 'starters',
    price: 8.99,
    imageUrl: '/images/menu/caesar-salad.jpg',
    isActive: true,
    isSeasonal: false,
    availableBranchesIds: ["br-2"],
    dietaryLabels: ['vegetarian'],
    ingredients: [
      { id: '5', name: 'Romaine Lettuce', quantity: 0.2, unit: 'kg' },
      { id: '6', name: 'Croutons', quantity: 0.05, unit: 'kg' },
      { id: '7', name: 'Parmesan Cheese', quantity: 0.03, unit: 'kg' },
    ],
    popularity: 87,
    stockWarning: false,
    branchPrices: {
      'br-1': 9.99,
      'br-2': 8.99,
      'br-3': 7.99
    }
  },
  {
    id: '3',
    name: 'Margherita Pizza',
    description: 'Classic tomato sauce, mozzarella, and fresh basil',
    category: 'main-course',
    price: 14.99,
    imageUrl: '/images/menu/pizza.jpg',
    isActive: true,
    isSeasonal: true,
    seasonalStartDate: '2025-06-01',
    seasonalEndDate: '2025-08-31',
    availableBranchesIds: [],
    dietaryLabels: ['vegetarian'],
    ingredients: [
      { id: '8', name: 'Pizza Dough', quantity: 0.3, unit: 'kg' },
      { id: '9', name: 'Tomato Sauce', quantity: 0.1, unit: 'kg' },
      { id: '10', name: 'Mozzarella', quantity: 0.15, unit: 'kg' },
    ],
    popularity: 95,
    stockWarning: false,
  },
  {
    id: '4',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
    category: 'desserts',
    price: 7.99,
    imageUrl: '/images/menu/lava-cake.jpg',
    isActive: true,
    isSeasonal: false,
    availableBranchesIds: ["br-1", "br-2", "br-3"],
    dietaryLabels: [],
    ingredients: [
      { id: '11', name: 'Dark Chocolate', quantity: 0.1, unit: 'kg' },
      { id: '12', name: 'Butter', quantity: 0.05, unit: 'kg' },
      { id: '13', name: 'Eggs', quantity: 2, unit: 'pieces' },
    ],
    popularity: 92,
    stockWarning: false,
  },
  {
    id: '5',
    name: 'Spicy Wings',
    description: 'Crispy chicken wings tossed in our signature spicy sauce',
    category: 'appetizers',
    price: 9.99,
    imageUrl: null,
    isActive: false,
    isSeasonal: false,
    availableBranchesIds: ["br-1", "br-2", "br-3"],
    dietaryLabels: ['spicy', 'halal'],
    ingredients: [
      { id: '14', name: 'Chicken Wings', quantity: 0.5, unit: 'kg' },
      { id: '15', name: 'Hot Sauce', quantity: 0.05, unit: 'kg' },
    ],
    popularity: 90,
    stockWarning: true,
  },
  {
    id: '6',
    name: 'Seasonal Fruit Platter',
    description: 'Fresh seasonal fruits arranged beautifully',
    category: 'desserts',
    price: 11.99,
    imageUrl: null,
    isActive: true,
    isSeasonal: true,
    seasonalStartDate: '2025-06-01',
    seasonalEndDate: '2025-08-31',
    availableBranchesIds: ["br-1", "br-2", "br-3"],
    dietaryLabels: ['vegan', 'gluten-free'],
    ingredients: [
      { id: '16', name: 'Mixed Fruits', quantity: 0.5, unit: 'kg' },
    ],
    popularity: 78,
    stockWarning: false,
  },
  {
    id: '7',
    name: 'Iced Coffee',
    description: 'Cold brewed coffee with cream and simple syrup',
    category: 'beverages',
    price: 4.99,
    imageUrl: '/images/menu/iced-coffee.jpg',
    isActive: true,
    isSeasonal: false,
    availableBranchesIds: ["br-2", "br-3"],
    dietaryLabels: [],
    ingredients: [
      { id: '17', name: 'Coffee Beans', quantity: 0.02, unit: 'kg' },
      { id: '18', name: 'Cream', quantity: 0.05, unit: 'kg' },
    ],
    popularity: 96,
    stockWarning: false,
    branchPrices: {
      'br-2': 5.99,
      'br-3': 4.49
    }
  },
  {
    id: '8',
    name: 'Truffle Fries',
    description: 'Crispy fries tossed with truffle oil and parmesan',
    category: 'sides',
    price: 6.99,
    imageUrl: '/images/menu/truffle-fries.jpg',
    isActive: false,
    isSeasonal: false,
    availableBranchesIds: ["br-1"],
    dietaryLabels: ['vegetarian'],
    ingredients: [
      { id: '19', name: 'Potatoes', quantity: 0.3, unit: 'kg' },
      { id: '20', name: 'Truffle Oil', quantity: 0.02, unit: 'kg' },
      { id: '21', name: 'Parmesan', quantity: 0.02, unit: 'kg' },
    ],
    popularity: 89,
    stockWarning: true,
  },
  {
    id: '9',
    name: 'Grilled Salmon',
    description: 'Fresh salmon fillet with lemon herb butter',
    category: 'main-course',
    price: 24.99,
    imageUrl: '/images/menu/salmon.jpg',
    isActive: true,
    isSeasonal: false,
    availableBranchesIds: ["br-1", "br-2"],
    dietaryLabels: ['gluten-free'],
    ingredients: [
      { id: '22', name: 'Salmon Fillet', quantity: 0.2, unit: 'kg' },
      { id: '23', name: 'Butter', quantity: 0.03, unit: 'kg' },
    ],
    popularity: 88,
    stockWarning: false,
  },
  {
    id: '10',
    name: 'Mushroom Risotto',
    description: 'Creamy Italian rice with wild mushrooms',
    category: 'main-course',
    price: 16.99,
    imageUrl: '/images/menu/risotto.jpg',
    isActive: true,
    isSeasonal: false,
    availableBranchesIds: ["br-2", "br-3"],
    dietaryLabels: ['vegetarian'],
    ingredients: [
      { id: '24', name: 'Arborio Rice', quantity: 0.15, unit: 'kg' },
      { id: '25', name: 'Mushrooms', quantity: 0.1, unit: 'kg' },
    ],
    popularity: 85,
    stockWarning: false,
  },
  {
    id: '11',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee and mascarpone',
    category: 'desserts',
    price: 8.99,
    imageUrl: '/images/menu/tiramisu.jpg',
    isActive: true,
    isSeasonal: false,
    availableBranchesIds: ["br-1", "br-3"],
    dietaryLabels: ['vegetarian'],
    ingredients: [
      { id: '26', name: 'Mascarpone', quantity: 0.1, unit: 'kg' },
      { id: '27', name: 'Coffee', quantity: 0.05, unit: 'kg' },
    ],
    popularity: 91,
    stockWarning: false,
  },
  {
    id: '12',
    name: 'Green Smoothie',
    description: 'Healthy blend of spinach, banana, and almond milk',
    category: 'beverages',
    price: 6.99,
    imageUrl: '/images/menu/green-smoothie.jpg',
    isActive: true,
    isSeasonal: false,
    availableBranchesIds: ["br-1", "br-2", "br-3"],
    dietaryLabels: ['vegan', 'gluten-free'],
    ingredients: [
      { id: '28', name: 'Spinach', quantity: 0.1, unit: 'kg' },
      { id: '29', name: 'Banana', quantity: 0.2, unit: 'kg' },
    ],
    popularity: 82,
    stockWarning: false,
  },
  {
    id: '13',
    name: 'Caprese Salad',
    description: 'Fresh mozzarella, tomatoes, and basil with balsamic glaze',
    category: 'starters',
    price: 10.99,
    imageUrl: '/images/menu/caprese.jpg',
    isActive: true,
    isSeasonal: true,
    seasonalStartDate: '2025-06-01',
    seasonalEndDate: '2025-09-30',
    availableBranchesIds: ["br-2"],
    dietaryLabels: ['vegetarian', 'gluten-free'],
    ingredients: [
      { id: '30', name: 'Mozzarella', quantity: 0.1, unit: 'kg' },
      { id: '31', name: 'Tomatoes', quantity: 0.15, unit: 'kg' },
    ],
    popularity: 87,
    stockWarning: false,
  },
  {
    id: '14',
    name: 'BBQ Ribs',
    description: 'Slow-cooked pork ribs with house BBQ sauce',
    category: 'main-course',
    price: 22.99,
    imageUrl: null,
    isActive: true,
    isSeasonal: false,
    availableBranchesIds: ["br-1", "br-3"],
    dietaryLabels: [],
    ingredients: [
      { id: '32', name: 'Pork Ribs', quantity: 0.4, unit: 'kg' },
      { id: '33', name: 'BBQ Sauce', quantity: 0.1, unit: 'kg' },
    ],
    popularity: 94,
    stockWarning: false,
  },
  {
    id: '15',
    name: 'Mango Sorbet',
    description: 'Refreshing dairy-free mango sorbet',
    category: 'desserts',
    price: 5.99,
    imageUrl: '/images/menu/mango-sorbet.jpg',
    isActive: true,
    isSeasonal: true,
    seasonalStartDate: '2025-06-01',
    seasonalEndDate: '2025-08-31',
    availableBranchesIds: ["br-1", "br-2", "br-3"],
    dietaryLabels: ['vegan', 'gluten-free'],
    ingredients: [
      { id: '34', name: 'Mango Puree', quantity: 0.2, unit: 'kg' },
      { id: '35', name: 'Sugar', quantity: 0.05, unit: 'kg' },
    ],
    popularity: 86,
    stockWarning: false,
  },
]; 