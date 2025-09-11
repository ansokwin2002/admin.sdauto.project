export interface LiveOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  modifiers?: string[];
  addons?: string[];
}

export interface LiveOrder {
  id: string;
  orderNumber: string;
  customer: string;
  items: LiveOrderItem[];
  total: number;
  type: 'Dine-in' | 'Takeout' | 'Delivery';
  table?: string;
  status: 'new' | 'preparing' | 'cooking' | 'ready' | 'completed' | 'cancelled';
  timeElapsed: string;
  timeReceived: Date;
  isCompleted: boolean;
  paymentMethod: 'Cash' | 'Credit Card' | 'Mobile Pay';
  notes?: string;
}

export const liveOrdersData: LiveOrder[] = [
  {
    id: 'order-001',
    orderNumber: '1001',
    customer: 'John Smith',
    items: [
      { id: 'item-001', name: 'Classic Burger', quantity: 2, price: 11.99, modifiers: ['Medium'] },
      { id: 'item-002', name: 'French Fries', quantity: 1, price: 4.99 },
      { id: 'item-003', name: 'Coke', quantity: 2, price: 2.99 }
    ],
    total: 34.95,
    type: 'Dine-in',
    table: '12',
    status: 'cooking',
    timeElapsed: '10 min',
    timeReceived: new Date(Date.now() - 10 * 60 * 1000),
    isCompleted: false,
    paymentMethod: 'Credit Card'
  },
  {
    id: 'order-002',
    orderNumber: '1002',
    customer: 'Sarah Johnson',
    items: [
      { id: 'item-004', name: 'Margherita Pizza', quantity: 1, price: 15.99, modifiers: ['Medium'] },
      { id: 'item-005', name: 'Sparkling Water', quantity: 1, price: 1.99 }
    ],
    total: 17.98,
    type: 'Takeout',
    status: 'ready',
    timeElapsed: '15 min',
    timeReceived: new Date(Date.now() - 15 * 60 * 1000),
    isCompleted: true,
    paymentMethod: 'Mobile Pay'
  },
  {
    id: 'order-003',
    orderNumber: '1003',
    customer: 'Michael Chen',
    items: [
      { id: 'item-006', name: 'Classic Burger', quantity: 1, price: 11.99, modifiers: ['Medium'], addons: ['Extra Cheese', 'Bacon'] },
      { id: 'item-007', name: 'Chocolate Cake', quantity: 1, price: 6.99 },
      { id: 'item-008', name: 'Iced Coffee', quantity: 1, price: 4.99, modifiers: ['Medium'] }
    ],
    total: 23.97,
    type: 'Delivery',
    status: 'new',
    timeElapsed: '2 min',
    timeReceived: new Date(Date.now() - 2 * 60 * 1000),
    isCompleted: false,
    paymentMethod: 'Credit Card'
  },
  {
    id: 'order-004',
    orderNumber: '1004',
    customer: 'Emma Wilson',
    items: [
      { id: 'item-009', name: 'Ice Tea', quantity: 2, price: 2.99 },
      { id: 'item-010', name: 'French Fries', quantity: 1, price: 4.99, addons: ['Cheese Sauce'] }
    ],
    total: 10.97,
    type: 'Dine-in',
    table: '7',
    status: 'ready',
    timeElapsed: '7 min',
    timeReceived: new Date(Date.now() - 7 * 60 * 1000),
    isCompleted: true,
    paymentMethod: 'Cash'
  },
  {
    id: 'order-005',
    orderNumber: '1005',
    customer: 'David Rodriguez',
    items: [
      { id: 'item-011', name: 'Margherita Pizza', quantity: 2, price: 15.99, modifiers: ['Medium'], addons: ['Extra Cheese'] },
      { id: 'item-012', name: 'Coke', quantity: 2, price: 2.99 }
    ],
    total: 37.96,
    type: 'Dine-in',
    table: '3',
    status: 'preparing',
    timeElapsed: '4 min',
    timeReceived: new Date(Date.now() - 4 * 60 * 1000),
    isCompleted: false,
    paymentMethod: 'Credit Card'
  },
  {
    id: 'order-006',
    orderNumber: '1006',
    customer: 'Linda Kim',
    items: [
      { id: 'item-013', name: 'Classic Burger', quantity: 1, price: 11.99, modifiers: ['Small'] },
      { id: 'item-014', name: 'French Fries', quantity: 1, price: 4.99 },
      { id: 'item-015', name: 'Sprite', quantity: 1, price: 2.99 }
    ],
    total: 19.97,
    type: 'Takeout',
    status: 'cooking',
    timeElapsed: '8 min',
    timeReceived: new Date(Date.now() - 8 * 60 * 1000),
    isCompleted: false,
    paymentMethod: 'Mobile Pay',
    notes: 'No onions on burger please'
  },
  {
    id: 'order-007',
    orderNumber: '1007',
    customer: 'James Brown',
    items: [
      { id: 'item-016', name: 'Chocolate Cake', quantity: 2, price: 6.99 },
      { id: 'item-017', name: 'Iced Coffee', quantity: 2, price: 4.99, modifiers: ['Large'] }
    ],
    total: 23.96,
    type: 'Dine-in',
    table: '5',
    status: 'ready',
    timeElapsed: '12 min',
    timeReceived: new Date(Date.now() - 12 * 60 * 1000),
    isCompleted: true,
    paymentMethod: 'Credit Card'
  },
  {
    id: 'order-008',
    orderNumber: '1008',
    customer: 'Sofia Martinez',
    items: [
      { id: 'item-018', name: 'Margherita Pizza', quantity: 1, price: 18.99, modifiers: ['Large'], addons: ['Mushrooms'] },
      { id: 'item-019', name: 'Sparkling Water', quantity: 2, price: 1.99 }
    ],
    total: 22.97,
    type: 'Delivery',
    status: 'preparing',
    timeElapsed: '6 min',
    timeReceived: new Date(Date.now() - 6 * 60 * 1000),
    isCompleted: false,
    paymentMethod: 'Credit Card'
  },
  {
    id: 'order-009',
    orderNumber: '1009',
    customer: 'Robert Wang',
    items: [
      { id: 'item-020', name: 'Classic Burger', quantity: 1, price: 13.99, modifiers: ['Large'] },
      { id: 'item-021', name: 'French Fries', quantity: 1, price: 6.99, modifiers: ['Large'], addons: ['Truffle Oil'] }
    ],
    total: 20.98,
    type: 'Takeout',
    status: 'ready',
    timeElapsed: '18 min',
    timeReceived: new Date(Date.now() - 18 * 60 * 1000),
    isCompleted: true,
    paymentMethod: 'Mobile Pay'
  },
  {
    id: 'order-010',
    orderNumber: '1010',
    customer: 'Elizabeth Thompson',
    items: [
      { id: 'item-022', name: 'Ice Tea', quantity: 4, price: 2.99 }
    ],
    total: 11.96,
    type: 'Dine-in',
    table: '9',
    status: 'new',
    timeElapsed: '1 min',
    timeReceived: new Date(Date.now() - 1 * 60 * 1000),
    isCompleted: false,
    paymentMethod: 'Cash'
  },
  {
    id: 'order-011',
    orderNumber: '1011',
    customer: 'Daniel Patel',
    items: [
      { id: 'item-023', name: 'Margherita Pizza', quantity: 1, price: 12.99, modifiers: ['Small'] },
      { id: 'item-024', name: 'Classic Burger', quantity: 1, price: 11.99, modifiers: ['Medium'] },
      { id: 'item-025', name: 'Coke', quantity: 2, price: 2.99 }
    ],
    total: 30.96,
    type: 'Dine-in',
    table: '14',
    status: 'cooking',
    timeElapsed: '9 min',
    timeReceived: new Date(Date.now() - 9 * 60 * 1000),
    isCompleted: false,
    paymentMethod: 'Credit Card'
  },
  {
    id: 'order-012',
    orderNumber: '1012',
    customer: 'Olivia Garcia',
    items: [
      { id: 'item-026', name: 'Chocolate Cake', quantity: 3, price: 6.99 }
    ],
    total: 20.97,
    type: 'Takeout',
    status: 'ready',
    timeElapsed: '11 min',
    timeReceived: new Date(Date.now() - 11 * 60 * 1000),
    isCompleted: true,
    paymentMethod: 'Mobile Pay'
  },
  {
    id: 'order-013',
    orderNumber: '1013',
    customer: 'William Singh',
    items: [
      { id: 'item-027', name: 'Classic Burger', quantity: 4, price: 11.99, modifiers: ['Medium'] },
      { id: 'item-028', name: 'French Fries', quantity: 2, price: 5.99, modifiers: ['Medium'] },
      { id: 'item-029', name: 'Sprite', quantity: 4, price: 2.99 }
    ],
    total: 71.92,
    type: 'Dine-in',
    table: '20',
    status: 'preparing',
    timeElapsed: '3 min',
    timeReceived: new Date(Date.now() - 3 * 60 * 1000),
    isCompleted: false,
    paymentMethod: 'Credit Card'
  },
  {
    id: 'order-014',
    orderNumber: '1014',
    customer: 'Ava Wilson',
    items: [
      { id: 'item-030', name: 'Iced Coffee', quantity: 1, price: 5.99, modifiers: ['Large'], addons: ['Whipped Cream'] },
      { id: 'item-031', name: 'Chocolate Cake', quantity: 1, price: 6.99 }
    ],
    total: 12.98,
    type: 'Takeout',
    status: 'cooking',
    timeElapsed: '5 min',
    timeReceived: new Date(Date.now() - 5 * 60 * 1000),
    isCompleted: false,
    paymentMethod: 'Cash'
  },
  {
    id: 'order-015',
    orderNumber: '1015',
    customer: 'Nathan Lewis',
    items: [
      { id: 'item-032', name: 'Margherita Pizza', quantity: 1, price: 18.99, modifiers: ['Large'] },
      { id: 'item-033', name: 'Coke', quantity: 1, price: 2.99 }
    ],
    total: 21.98,
    type: 'Delivery',
    status: 'new',
    timeElapsed: '1 min',
    timeReceived: new Date(Date.now() - 1 * 60 * 1000),
    isCompleted: false,
    paymentMethod: 'Credit Card'
  }
]; 