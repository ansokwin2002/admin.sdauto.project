export type StockCategory = 
  | 'Vegetables'
  | 'Meat'
  | 'Dairy'
  | 'Beverages'
  | 'Dry Goods'
  | 'Spices'
  | 'Seafood'
  | 'Other'
  | 'Bakery'
  | 'Fruits'
  | 'Nuts'
  | 'Legumes'
  | 'Grains'
  | 'Herbs'
  | 'Mushrooms'
  | 'Oils'
  | 'Other';

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export type UnitOfMeasure = 'kg' | 'g' | 'l' | 'ml' | 'units' | 'pcs';

export interface IngredientItem {
  id: string;
  name: string;
  nameLocalized: string;
  sku: string;
  category: StockCategory;
  storageUnit: UnitOfMeasure;
  ingredientUnit: UnitOfMeasure;
  storageIngredientFactor: number;
  barcode: string;
  
  // Default values for new branches
  unitPrice?: number;
  minLevel?: number;
  maxLevel?: number;
  reorderLevel?: number;
  
  // Branch-specific data
  branchData?: {
    [branchId: string]: BranchIngredientData;
  };
}

export interface BranchIngredientData {
  unitPrice: number;
  minLevel: number;
  maxLevel: number;
  reorderLevel: number;
}

export interface StockItem {
  id: string;
  name: string;
  nameLocalized: string;
  sku: string;
  category: StockCategory;
  quantity: number;
  storageUnit: UnitOfMeasure;
  ingredientUnit: UnitOfMeasure;
  reorderLevel: number;
  supplierName: string;
  lastRestockedDate: Date;
  expirationDate?: Date;
  status: StockStatus;
  branchData?: { 
    [branchId: string]: StockItemBranch 
  };
}

export interface StockItemBranch {
  id: string;
  stockItemId: string;
  branchId: string;
  quantity: number;
  reorderLevel: number;
  lastRestockedDate: Date;
  expirationDate?: Date;
  status: StockStatus;
}


export interface StockMovement {
  id: string;
  stockItemId: string;
  type: 'purchase' | 'usage' | 'waste' | 'adjustment';
  quantity: number;
  date: Date;
  notes?: string;
}

export interface StockMetrics {
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  expiringItems: number;
} 

// Define the Recipe type
export interface Recipe {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  description: string;
  ingredients: RecipeIngredient[];
  steps: PreparationStep[];
  portionSize: string;
  preparationTime: string;
  cookingTime: string;
  servingSuggestions: string;
  costPerPortion: number;
  sellingPrice: number;
  nutrition?: NutritionalInfo;
}

export interface RecipeIngredient {
  id: string;
  ingredientItemId: string;
  name: string;
  amount: number;
  unit: UnitOfMeasure;
  costPerUnit: number;
  totalCost: number;
  inStock: number;
}

export interface PreparationStep {
  id: string;
  stepNumber: number;
  instruction: string;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
}

export interface Supplier {
  id: string;
  name: string;
  category: StockCategory;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  lastOrderDate: Date;
  totalOrders: number;
  active: boolean;
  averageDeliveryTime: number; // in days
  notes?: string;
  logoUrl?: string;
  businessHours?: BusinessHours[];
  performance?: SupplierPerformance;
}

export interface BusinessHours {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  open: string; // format: "HH:MM"
  close: string; // format: "HH:MM"
  isClosed: boolean;
}

export interface SupplierPerformance {
  onTimeDeliveryRate: number; // percentage
  averageLeadTime: number; // in days
  orderAccuracy: number; // percentage
  customerRating: number; // 1-5 scale
}

export interface SupplierOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  status: 'open' | 'pending' | 'delivered' | 'cancelled';
  orderDate: Date;
  updatedAt: Date;
  totalItems: number;
  totalQuantity: number;
  totalAmount: number;
  notes?: string;
}

export interface SupplierMetrics {
  totalSuppliers: number;
  pendingOrders: number;
  averageDeliveryTime: number;
  totalMonthlyPurchases: number;
  stockShortages: number;
}

export type WasteReason = 'spoiled' | 'overcooked' | 'wrong-order' | 'customer-return' | 'other';

export type WasteSource = 'prep' | 'cooking' | 'storage' | 'service' | 'other';

export interface WasteLog {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  measureUnit: UnitOfMeasure;
  reason: WasteReason;
  source: WasteSource;
  staffName: string;
  timestamp: Date;
  notes?: string;
  branchId?: string;
  cost?: number;
}