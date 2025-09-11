import { WasteLog, WasteReason, WasteSource } from '@/types/inventory';

// Mock waste logs data
export const wasteLogs: WasteLog[] = [
  {
    id: '1',
    productId: 'ing-001',
    productName: 'Tomatoes',
    quantity: 2,
    measureUnit: 'kg',
    reason: 'spoiled',
    source: 'storage',
    staffName: 'John Smith',
    timestamp: new Date('2025-03-12T08:30:00'),
    notes: 'Found during morning inventory check',
    branchId: 'branch-001',
    cost: 4.50
  },
  {
    id: '2',
    productId: 'ing-005',
    productName: 'Chicken Breast',
    quantity: 1.5,
    measureUnit: 'kg',
    reason: 'overcooked',
    source: 'cooking',
    staffName: 'Maria Rodriguez',
    timestamp: new Date('2025-03-12T13:15:00'),
    branchId: 'branch-001',
    cost: 12.75
  },
  {
    id: '3',
    productId: 'ing-012',
    productName: 'French Fries',
    quantity: 500,
    measureUnit: 'g',
    reason: 'wrong-order',
    source: 'prep',
    staffName: 'David Lee',
    timestamp: new Date('2025-03-12T19:45:00'),
    notes: 'Customer ordered sweet potato fries instead',
    branchId: 'branch-001',
    cost: 3.25
  },
  {
    id: '4',
    productId: 'ing-008',
    productName: 'Salmon Fillet',
    quantity: 250,
    measureUnit: 'g',
    reason: 'customer-return',
    source: 'service',
    staffName: 'Sarah Johnson',
    timestamp: new Date('2025-03-12T20:10:00'),
    notes: 'Customer complained it was undercooked',
    branchId: 'branch-002',
    cost: 8.50
  },
  {
    id: '5',
    productId: 'ing-015',
    productName: 'Lettuce',
    quantity: 1,
    measureUnit: 'kg',
    reason: 'spoiled',
    source: 'storage',
    staffName: 'Alex Wong',
    timestamp: new Date('2025-03-12T07:45:00'),
    branchId: 'branch-002',
    cost: 3.00
  },
  {
    id: '6',
    productId: 'ing-003',
    productName: 'Avocado',
    quantity: 3,
    measureUnit: 'pcs',
    reason: 'spoiled',
    source: 'storage',
    staffName: 'Emma Torres',
    timestamp: new Date('2025-01-05T09:15:00'),
    notes: 'Over-ripened during weekend',
    branchId: 'branch-001',
    cost: 6.75
  },
  {
    id: '7',
    productId: 'ing-020',
    productName: 'Mashed Potatoes',
    quantity: 2.5,
    measureUnit: 'kg',
    reason: 'overcooked',
    source: 'cooking',
    staffName: 'Chris Parker',
    timestamp: new Date('2025-02-18T16:30:00'),
    notes: "Too dry, couldn't be served",
    branchId: 'branch-003',
    cost: 5.50
  },
  {
    id: '8',
    productId: 'ing-011',
    productName: 'Fresh Bread',
    quantity: 5,
    measureUnit: 'pcs',
    reason: 'other',
    source: 'storage',
    staffName: 'Lisa Montgomery',
    timestamp: new Date('2025-04-22T07:30:00'),
    notes: 'Day-old bread not used for croutons',
    branchId: 'branch-002',
    cost: 7.25
  },
  {
    id: '9',
    productId: 'ing-007',
    productName: 'Shrimp',
    quantity: 350,
    measureUnit: 'g',
    reason: 'wrong-order',
    source: 'prep',
    staffName: 'Raj Patel',
    timestamp: new Date('2025-05-10T12:45:00'),
    notes: 'Chef ordered small size but large delivered',
    branchId: 'branch-001',
    cost: 14.90
  },
  {
    id: '10',
    productId: 'ing-022',
    productName: 'Mushrooms',
    quantity: 400,
    measureUnit: 'g',
    reason: 'spoiled',
    source: 'storage',
    staffName: 'Shannon Kim',
    timestamp: new Date('2025-06-05T08:15:00'),
    branchId: 'branch-003',
    cost: 4.80
  },
  {
    id: '11',
    productId: 'ing-031',
    productName: 'Ribeye Steak',
    quantity: 0.8,
    measureUnit: 'kg',
    reason: 'customer-return',
    source: 'service',
    staffName: 'Tyrone Jackson',
    timestamp: new Date('2025-07-14T19:20:00'),
    notes: 'Customer requested medium but was too rare',
    branchId: 'branch-002',
    cost: 32.50
  },
  {
    id: '12',
    productId: 'ing-018',
    productName: 'Cream Sauce',
    quantity: 1.2,
    measureUnit: 'l',
    reason: 'overcooked',
    source: 'cooking',
    staffName: 'Hannah Martinez',
    timestamp: new Date('2025-08-23T14:40:00'),
    notes: 'Split during service',
    branchId: 'branch-001',
    cost: 8.75
  },
  {
    id: '13',
    productId: 'ing-025',
    productName: 'Fresh Mint',
    quantity: 2,
    measureUnit: 'kg',
    reason: 'other',
    source: 'prep',
    staffName: 'Omar Hassan',
    timestamp: new Date('2025-09-30T16:10:00'),
    notes: 'Excess from weekend promotion',
    branchId: 'branch-003',
    cost: 12.00
  },
  {
    id: '14',
    productId: 'ing-042',
    productName: 'Spring Rolls',
    quantity: 24,
    measureUnit: 'pcs',
    reason: 'wrong-order',
    source: 'service',
    staffName: 'Victoria Chen',
    timestamp: new Date('2025-10-17T11:30:00'),
    notes: 'Order mixup with catering event',
    branchId: 'branch-002',
    cost: 18.50
  },
  {
    id: '15',
    productId: 'ing-033',
    productName: 'Chocolate Ganache',
    quantity: 1.5,
    measureUnit: 'kg',
    reason: 'overcooked',
    source: 'cooking',
    staffName: 'Gabriel Wilson',
    timestamp: new Date('2025-12-24T15:50:00'),
    notes: 'Temperature too high during preparation',
    branchId: 'branch-001',
    cost: 22.40
  }
];

// Reasons and sources arrays for form dropdowns
export const wasteReasons: { value: WasteReason; label: string }[] = [
  { value: 'spoiled', label: 'Spoiled/Expired' },
  { value: 'overcooked', label: 'Overcooked/Burnt' },
  { value: 'wrong-order', label: 'Wrong Order' },
  { value: 'customer-return', label: 'Customer Return' },
  { value: 'other', label: 'Other' }
];

export const wasteSources: { value: WasteSource; label: string }[] = [
  { value: 'prep', label: 'Food Preparation' },
  { value: 'cooking', label: 'Cooking Process' },
  { value: 'storage', label: 'Storage' },
  { value: 'service', label: 'Service/Front-of-House' },
  { value: 'other', label: 'Other' }
]; 