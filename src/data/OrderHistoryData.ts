import { organization } from './CommonData';

export interface OrderHistoryItem {
  id: string;
  orderNumber: string;
  customer: string;
  type: 'Dine-in' | 'Takeout' | 'Delivery';
  table?: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    modifiers?: string[];
    addons?: string[];
  }[];
  total: number;
  status: 'completed' | 'cancelled' | 'refunded' | 'partially_refunded';
  timeCreated: Date;
  timeCompleted: Date;
  paymentMethod: string;
  notes?: string;
  branch?: string;
  refundAmount?: number;
  refundReason?: string;
}

// Get branch names from organization data
const branches = organization.filter(org => org.id !== "hq").map(org => org.name);

export const orderHistoryData: OrderHistoryItem[] = [
  {
    id: 'ord-h-001',
    orderNumber: 'ORD78901',
    customer: 'Emma Thompson',
    type: 'Dine-in',
    table: '12',
    items: [
      {
        id: 'item-1',
        name: 'Grilled Salmon',
        price: 24.99,
        quantity: 1,
        modifiers: ['Medium rare']
      },
      {
        id: 'item-2',
        name: 'Caesar Salad',
        price: 9.99,
        quantity: 1
      },
      {
        id: 'item-3',
        name: 'Iced Tea',
        price: 3.99,
        quantity: 2
      }
    ],
    total: 42.96,
    status: 'completed',
    timeCreated: new Date('2023-09-10T18:30:00'),
    timeCompleted: new Date('2023-09-10T19:45:00'),
    paymentMethod: 'Credit Card',
    branch: branches[0]
  },
  {
    id: 'ord-h-002',
    orderNumber: 'ORD78902',
    customer: 'Michael Chen',
    type: 'Takeout',
    items: [
      {
        id: 'item-1',
        name: 'Chicken Parmesan',
        price: 18.99,
        quantity: 1
      },
      {
        id: 'item-2',
        name: 'Garlic Bread',
        price: 4.99,
        quantity: 1
      }
    ],
    total: 23.98,
    status: 'completed',
    timeCreated: new Date('2023-09-10T12:15:00'),
    timeCompleted: new Date('2023-09-10T12:45:00'),
    paymentMethod: 'Cash',
    branch: branches[0]
  },
  {
    id: 'ord-h-003',
    orderNumber: 'ORD78903',
    customer: 'Sarah Johnson',
    type: 'Delivery',
    items: [
      {
        id: 'item-1',
        name: 'Pepperoni Pizza',
        price: 16.99,
        quantity: 1,
        modifiers: ['Extra cheese']
      },
      {
        id: 'item-2',
        name: 'Buffalo Wings',
        price: 12.99,
        quantity: 1
      },
      {
        id: 'item-3',
        name: 'Soda',
        price: 2.99,
        quantity: 2
      }
    ],
    total: 35.96,
    status: 'completed',
    timeCreated: new Date('2023-09-09T19:00:00'),
    timeCompleted: new Date('2023-09-09T19:50:00'),
    paymentMethod: 'Credit Card',
    branch: branches[2]
  },
  {
    id: 'ord-h-004',
    orderNumber: 'ORD78904',
    customer: 'Robert Davis',
    type: 'Dine-in',
    table: '5',
    items: [
      {
        id: 'item-1',
        name: 'New York Steak',
        price: 29.99,
        quantity: 1,
        modifiers: ['Medium']
      },
      {
        id: 'item-2',
        name: 'Mashed Potatoes',
        price: 5.99,
        quantity: 1
      },
      {
        id: 'item-3',
        name: 'Wine',
        price: 8.99,
        quantity: 1
      }
    ],
    total: 44.97,
    status: 'cancelled',
    timeCreated: new Date('2023-09-08T18:00:00'),
    timeCompleted: new Date('2023-09-08T18:15:00'),
    paymentMethod: 'Credit Card',
    notes: 'Customer left before order was prepared',
    branch: branches[0]
  },
  {
    id: 'ord-h-005',
    orderNumber: 'ORD78905',
    customer: 'Jennifer Lee',
    type: 'Takeout',
    items: [
      {
        id: 'item-1',
        name: 'Sushi Combo',
        price: 22.99,
        quantity: 1
      },
      {
        id: 'item-2',
        name: 'Miso Soup',
        price: 3.99,
        quantity: 1
      }
    ],
    total: 26.98,
    status: 'refunded',
    timeCreated: new Date('2023-09-07T13:30:00'),
    timeCompleted: new Date('2023-09-07T14:00:00'),
    paymentMethod: 'Credit Card',
    refundAmount: 26.98,
    refundReason: 'Wrong order prepared',
    branch: branches[1]
  },
  {
    id: 'ord-h-006',
    orderNumber: 'ORD78906',
    customer: 'David Wilson',
    type: 'Delivery',
    items: [
      {
        id: 'item-1',
        name: 'Vegetarian Pasta',
        price: 14.99,
        quantity: 1
      },
      {
        id: 'item-2',
        name: 'Tiramisu',
        price: 7.99,
        quantity: 1
      },
      {
        id: 'item-3',
        name: 'Sparkling Water',
        price: 2.99,
        quantity: 1
      }
    ],
    total: 25.97,
    status: 'partially_refunded',
    timeCreated: new Date('2023-09-06T19:30:00'),
    timeCompleted: new Date('2023-09-06T20:15:00'),
    paymentMethod: 'Credit Card',
    refundAmount: 7.99,
    refundReason: 'Dessert was incorrect',
    branch: branches[0]
  },
  {
    id: 'ord-h-007',
    orderNumber: 'ORD78907',
    customer: 'Jessica Miller',
    type: 'Dine-in',
    table: '8',
    items: [
      {
        id: 'item-1',
        name: 'Lobster Bisque',
        price: 12.99,
        quantity: 1
      },
      {
        id: 'item-2',
        name: 'Seafood Platter',
        price: 34.99,
        quantity: 1
      },
      {
        id: 'item-3',
        name: 'Cocktail',
        price: 9.99,
        quantity: 2
      }
    ],
    total: 67.96,
    status: 'completed',
    timeCreated: new Date('2023-09-05T17:45:00'),
    timeCompleted: new Date('2023-09-05T19:30:00'),
    paymentMethod: 'Credit Card',
    branch: branches[1]
  },
  {
    id: 'ord-h-008',
    orderNumber: 'ORD78908',
    customer: 'Thomas Brown',
    type: 'Takeout',
    items: [
      {
        id: 'item-1',
        name: 'Burger Combo',
        price: 15.99,
        quantity: 2
      },
      {
        id: 'item-2',
        name: 'Onion Rings',
        price: 4.99,
        quantity: 1
      }
    ],
    total: 36.97,
    status: 'completed',
    timeCreated: new Date('2023-09-04T12:00:00'),
    timeCompleted: new Date('2023-09-04T12:30:00'),
    paymentMethod: 'Cash',
    branch: branches[2]
  },
  {
    id: 'ord-h-009',
    orderNumber: 'ORD78909',
    customer: 'Olivia Garcia',
    type: 'Delivery',
    items: [
      {
        id: 'item-1',
        name: 'Family Pizza Deal',
        price: 29.99,
        quantity: 1,
        modifiers: ['Half pepperoni, half veggie']
      },
      {
        id: 'item-2',
        name: 'Breadsticks',
        price: 6.99,
        quantity: 1
      },
      {
        id: 'item-3',
        name: 'Soda 2L',
        price: 3.99,
        quantity: 1
      }
    ],
    total: 40.97,
    status: 'completed',
    timeCreated: new Date('2023-09-03T18:15:00'),
    timeCompleted: new Date('2023-09-03T19:10:00'),
    paymentMethod: 'Credit Card',
    branch: branches[0]
  },
  {
    id: 'ord-h-010',
    orderNumber: 'ORD78910',
    customer: 'William Taylor',
    type: 'Dine-in',
    table: '3',
    items: [
      {
        id: 'item-1',
        name: 'Ribeye Steak',
        price: 32.99,
        quantity: 1,
        modifiers: ['Medium well']
      },
      {
        id: 'item-2',
        name: 'Loaded Baked Potato',
        price: 6.99,
        quantity: 1
      },
      {
        id: 'item-3',
        name: 'Craft Beer',
        price: 7.99,
        quantity: 2
      }
    ],
    total: 55.96,
    status: 'completed',
    timeCreated: new Date('2023-09-02T19:00:00'),
    timeCompleted: new Date('2023-09-02T20:30:00'),
    paymentMethod: 'Credit Card',
    branch: branches[0]
  },
  {
    id: 'ord-h-011',
    orderNumber: 'ORD78911',
    customer: 'Linda Anderson',
    type: 'Takeout',
    items: [
      {
        id: 'item-1',
        name: 'Chicken Teriyaki Bowl',
        price: 12.99,
        quantity: 2
      },
      {
        id: 'item-2',
        name: 'Spring Rolls',
        price: 5.99,
        quantity: 1
      }
    ],
    total: 31.97,
    status: 'completed',
    timeCreated: new Date('2023-09-01T11:30:00'),
    timeCompleted: new Date('2023-09-01T12:00:00'),
    paymentMethod: 'Cash',
    branch: branches[2]
  },
  {
    id: 'ord-h-012',
    orderNumber: 'ORD78912',
    customer: 'James Martinez',
    type: 'Delivery',
    items: [
      {
        id: 'item-1',
        name: 'Veggie Platter',
        price: 19.99,
        quantity: 1
      },
      {
        id: 'item-2',
        name: 'Hummus',
        price: 6.99,
        quantity: 1
      },
      {
        id: 'item-3',
        name: 'Pita Bread',
        price: 3.99,
        quantity: 1
      }
    ],
    total: 30.97,
    status: 'cancelled',
    timeCreated: new Date('2023-08-31T17:45:00'),
    timeCompleted: new Date('2023-08-31T18:00:00'),
    paymentMethod: 'Credit Card',
    notes: 'Customer cancelled after order was placed',
    branch: branches[1]
  }
]; 