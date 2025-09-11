import { IngredientItem } from '@/types/inventory';

export const ingredientItems: IngredientItem[] = [
  {
    id: '1',
    name: 'All-Purpose Flour',
    nameLocalized: 'All flour',
    sku: 'FLR-001',
    category: 'Dry Goods',
    storageUnit: 'kg',
    ingredientUnit: 'g',
    storageIngredientFactor: 1000,
    barcode: '8901234567890',
    unitPrice: 1.25,
    minLevel: 10,
    maxLevel: 50,
    reorderLevel: 15,
    branchData: {
      'br-1': {
        unitPrice: 1.25,
        minLevel: 10,
        maxLevel: 50,
        reorderLevel: 15,
      },
      'br-2': {
        unitPrice: 1.30,
        minLevel: 8,
        maxLevel: 40,
        reorderLevel: 12,
      },
      'br-3': {
        unitPrice: 1.35,
        minLevel: 5,
        maxLevel: 30,
        reorderLevel: 10,
      }
    }
  },
  {
    id: '2',
    name: 'Granulated Sugar',
    nameLocalized: 'Gran Sugar',
    sku: 'SGR-001',
    category: 'Dry Goods',
    storageUnit: 'kg',
    ingredientUnit: 'g',
    storageIngredientFactor: 1000,
    barcode: '8901234567891',
    unitPrice: 0.95,
    minLevel: 5,
    maxLevel: 30,
    reorderLevel: 10,
    branchData: {
      'br-1': {
        unitPrice: 0.95,
        minLevel: 5,
        maxLevel: 30,
        reorderLevel: 10,
      },
      'br-2': {
        unitPrice: 0.99,
        minLevel: 7,
        maxLevel: 35,
        reorderLevel: 12,
      }
    }
  },
  {
    id: '3',
    name: 'Olive Oil',
    nameLocalized: '',
    sku: 'OIL-001',
    category: 'Oils',
    storageUnit: 'l',
    ingredientUnit: 'ml',
    storageIngredientFactor: 1000,
    barcode: '8901234567892',
    unitPrice: 8.50,
    minLevel: 2,
    maxLevel: 10,
    reorderLevel: 3,
    branchData: {
      'br-1': {
        unitPrice: 8.50,
        minLevel: 2,
        maxLevel: 10,
        reorderLevel: 3,
      },
      'br-3': {
        unitPrice: 9.25,
        minLevel: 3,
        maxLevel: 12,
        reorderLevel: 4,
      }
    }
  },
  {
    id: '4',
    name: 'Salt',
    nameLocalized: '',
    sku: 'SLT-001',
    category: 'Spices',
    storageUnit: 'kg',
    ingredientUnit: 'g',
    storageIngredientFactor: 1000,
    barcode: '8901234567893',
    unitPrice: 0.75,
    minLevel: 1,
    maxLevel: 5,
    reorderLevel: 2,
    branchData: {
      'br-1': {
        unitPrice: 0.75,
        minLevel: 1,
        maxLevel: 5,
        reorderLevel: 2,
      },
      'br-2': {
        unitPrice: 0.75,
        minLevel: 1,
        maxLevel: 5,
        reorderLevel: 2,
      },
      'br-3': {
        unitPrice: 0.75,
        minLevel: 1,
        maxLevel: 5,
        reorderLevel: 2,
      }
    }
  },
  {
    id: '5',
    name: 'Black Pepper',
    nameLocalized: '',
    sku: 'PEP-001',
    category: 'Spices',
    storageUnit: 'kg',
    ingredientUnit: 'g',
    storageIngredientFactor: 1000,
    barcode: '8901234567894',
    unitPrice: 12.50,
    minLevel: 0.5,
    maxLevel: 2,
    reorderLevel: 0.8,
    branchData: {
      'br-1': {
        unitPrice: 12.50,
        minLevel: 0.5,
        maxLevel: 2,
        reorderLevel: 0.8,
      },
      'br-2': {
        unitPrice: 12.50,
        minLevel: 0.5,
        maxLevel: 2,
        reorderLevel: 0.8,
      }
    }
  },
  {
    id: '6',
    name: 'Chicken Breast',
    nameLocalized: '',
    sku: 'CHK-001',
    category: 'Meat',
    storageUnit: 'kg',
    ingredientUnit: 'g',
    storageIngredientFactor: 1000,
    barcode: '8901234567895',
    unitPrice: 7.25,
    minLevel: 5,
    maxLevel: 20,
    reorderLevel: 8,
    branchData: {
      'br-1': {
        unitPrice: 7.25,
        minLevel: 5,
        maxLevel: 20,
        reorderLevel: 8,
      },
      'br-2': {
        unitPrice: 7.25,
        minLevel: 5,
        maxLevel: 20,
        reorderLevel: 8,
      }
    }
  },
  {
    id: '7',
    name: 'Tomatoes',
    nameLocalized: '',
    sku: 'TOM-001',
    category: 'Vegetables',
    storageUnit: 'kg',
    ingredientUnit: 'g',
    storageIngredientFactor: 1000,
    barcode: '8901234567896',
    unitPrice: 2.15,
    minLevel: 3,
    maxLevel: 15,
    reorderLevel: 5,
    branchData: {
      'br-1': {
        unitPrice: 2.15,
        minLevel: 3,
        maxLevel: 15,
        reorderLevel: 5,
      },
      'br-2': {
        unitPrice: 2.15,
        minLevel: 3,
        maxLevel: 15,
        reorderLevel: 5,
      }
    }
  },
  {
    id: '8',
    name: 'Milk',
    nameLocalized: '',
    sku: 'MLK-001',
    category: 'Dairy',
    storageUnit: 'l',
    ingredientUnit: 'ml',
    storageIngredientFactor: 1000,
    barcode: '8901234567897',
    unitPrice: 1.05,
    minLevel: 5,
    maxLevel: 20,
    reorderLevel: 8,
    branchData: {
      'br-1': {
        unitPrice: 1.05,
        minLevel: 5,
        maxLevel: 20,
        reorderLevel: 8,
      },
      'br-2': {
        unitPrice: 1.05,
        minLevel: 5,
        maxLevel: 20,
        reorderLevel: 8,
      }
    }
  },
  {
    id: '9',
    name: 'Eggs',
    nameLocalized: '',
    sku: 'EGG-001',
    category: 'Dairy',
    storageUnit: 'pcs',
    ingredientUnit: 'pcs',
    storageIngredientFactor: 1,
    unitPrice: 0.15,
    barcode: '8901234567898',
    minLevel: 24,
    maxLevel: 120,
    reorderLevel: 36,
    branchData: {
      'br-1': {
        unitPrice: 0.15,
        minLevel: 24,
        maxLevel: 120,
        reorderLevel: 36,
      },
      'br-2': {
        unitPrice: 0.15,
        minLevel: 24,
        maxLevel: 120,
        reorderLevel: 36,
      }
    }
  },
  {
    id: '10',
    name: 'Butter',
    nameLocalized: '',
    sku: 'BTR-001',
    category: 'Dairy',
    storageUnit: 'kg',
    ingredientUnit: 'g',
    storageIngredientFactor: 1000,
    unitPrice: 5.75,
    barcode: '8901234567899',
    minLevel: 2,
    maxLevel: 10,
    reorderLevel: 3,
    branchData: {
      'br-1': {
        unitPrice: 5.75,
        minLevel: 2,
        maxLevel: 10,
        reorderLevel: 3,
      },
      'br-2': {
        unitPrice: 5.75,
        minLevel: 2,
        maxLevel: 10,
        reorderLevel: 3,
      }
    }
  },
  {
    id: '11',
    name: 'Onions',
    nameLocalized: '',
    sku: 'ONI-001',
    category: 'Vegetables',
    storageUnit: 'kg',
    ingredientUnit: 'g',
    storageIngredientFactor: 1000,
    unitPrice: 1.25,
    barcode: '8901234567900',
    minLevel: 3,
    maxLevel: 15,
    reorderLevel: 5,
    branchData: {
      'br-1': {
        unitPrice: 1.25,
        minLevel: 3,
        maxLevel: 15,
        reorderLevel: 5,
      },
      'br-2': {
        unitPrice: 1.25,
        minLevel: 3,
        maxLevel: 15,
        reorderLevel: 5,
      }
    }
  },
  {
    id: '12',
    name: 'Garlic',
    nameLocalized: '',
    sku: 'GRL-001',
    category: 'Vegetables',
    storageUnit: 'kg',
    ingredientUnit: 'g',
    storageIngredientFactor: 1000,
    unitPrice: 3.50,
    barcode: '8901234567901',
    minLevel: 1,
    maxLevel: 5,
    reorderLevel: 1.5,
    branchData: {
      'br-1': {
        unitPrice: 3.50,
        minLevel: 1,
        maxLevel: 5,
        reorderLevel: 1.5,
      },
      'br-2': {
        unitPrice: 3.50,
        minLevel: 1,
        maxLevel: 5,
        reorderLevel: 1.5,
      }
    }
  },
  {
    id: '13',
    name: 'Rice',
    nameLocalized: '',
    sku: 'RIC-001',
    category: 'Dry Goods',
    storageUnit: 'kg',
    ingredientUnit: 'g',
    storageIngredientFactor: 1000,
    unitPrice: 2.35,
    barcode: '8901234567902',
    minLevel: 10,
    maxLevel: 50,
    reorderLevel: 15,
    branchData: {
      'br-1': {
        unitPrice: 2.35,
        minLevel: 10,
        maxLevel: 50,
        reorderLevel: 15,
      },
      'br-2': {
        unitPrice: 2.35,
        minLevel: 10,
        maxLevel: 50,
        reorderLevel: 15,
      }
    }
  },
  {
    id: '14',
    name: 'Lemon',
    nameLocalized: '',
    sku: 'LMN-001',
    category: 'Fruits',
    storageUnit: 'kg',
    ingredientUnit: 'g',
    storageIngredientFactor: 1000,
    unitPrice: 2.95,
    barcode: '8901234567903',
    minLevel: 2,
    maxLevel: 8,
    reorderLevel: 3,
    branchData: {
      'br-1': {
        unitPrice: 2.95,
        minLevel: 2,
        maxLevel: 8,
        reorderLevel: 3,
      },
      'br-2': {
        unitPrice: 2.95,
        minLevel: 2,
        maxLevel: 8,
        reorderLevel: 3,
      }
    }
  },
  {
    id: '15',
    name: 'Chocolate Chips',
    nameLocalized: '',
    sku: 'CHC-001',
    category: 'Bakery',
    storageUnit: 'kg',
    ingredientUnit: 'g',
    storageIngredientFactor: 1000,
    unitPrice: 6.75,
    barcode: '8901234567904',
    minLevel: 2,
    maxLevel: 10,
    reorderLevel: 3,
    branchData: {
      'br-1': {
        unitPrice: 6.75,
        minLevel: 2,
        maxLevel: 10,
        reorderLevel: 3,
      },
      'br-2': {
        unitPrice: 6.75,
        minLevel: 2,
        maxLevel: 10,
        reorderLevel: 3,
      }
    }
  }
];
