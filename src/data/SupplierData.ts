import { BusinessHours, Supplier, SupplierOrder, SupplierMetrics } from "@/types/inventory";

const defaultBusinessHours: BusinessHours[] = [
  { day: 'Monday', open: '08:00', close: '17:00', isClosed: false },
  { day: 'Tuesday', open: '08:00', close: '17:00', isClosed: false },
  { day: 'Wednesday', open: '08:00', close: '17:00', isClosed: false },
  { day: 'Thursday', open: '08:00', close: '17:00', isClosed: false },
  { day: 'Friday', open: '08:00', close: '17:00', isClosed: false },
  { day: 'Saturday', open: '09:00', close: '14:00', isClosed: false },
  { day: 'Sunday', open: '00:00', close: '00:00', isClosed: true }
];

export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Fresh Farms Inc.',
    category: 'Vegetables',
    contactPerson: 'John Smith',
    phone: '555-123-4567',
    email: 'john@freshfarms.com',
    address: '123 Farm Road, Countryside, CA 90210',
    lastOrderDate: new Date('2024-03-15'),
    totalOrders: 45,
    active: true,
    averageDeliveryTime: 2,
    notes: 'Premium quality produce supplier',
    logoUrl: 'https://placehold.co/100x100?text=FF',
    businessHours: defaultBusinessHours,
    performance: {
      onTimeDeliveryRate: 92.5,
      averageLeadTime: 1.8,
      orderAccuracy: 97.2,
      customerRating: 4.7
    }
  },
  {
    id: '2',
    name: 'Local Butcher',
    category: 'Meat',
    contactPerson: 'Mike Johnson',
    phone: '555-234-5678',
    email: 'mike@localbutcher.com',
    address: '456 Meat St, Downtown, CA 90211',
    lastOrderDate: new Date('2024-03-17'),
    totalOrders: 36,
    active: true,
    averageDeliveryTime: 1,
    notes: 'High-quality local meats',
    logoUrl: 'https://placehold.co/100x100?text=LB',
    businessHours: defaultBusinessHours,
    performance: {
      onTimeDeliveryRate: 96.8,
      averageLeadTime: 1.2,
      orderAccuracy: 99.1,
      customerRating: 4.9
    }
  },
  {
    id: '3',
    name: 'Local Dairy',
    category: 'Dairy',
    contactPerson: 'Sarah Wilson',
    phone: '555-345-6789',
    email: 'sarah@localdairy.com',
    address: '789 Dairy Ln, Farmville, CA 90212',
    lastOrderDate: new Date('2024-03-16'),
    totalOrders: 52,
    active: true,
    averageDeliveryTime: 2,
    notes: 'Organic dairy products',
    businessHours: defaultBusinessHours,
    performance: {
      onTimeDeliveryRate: 95.5,
      averageLeadTime: 1.5,
      orderAccuracy: 98.5,
      customerRating: 4.8
    }
  },
  {
    id: '4',
    name: 'Ocean Fresh',
    category: 'Seafood',
    contactPerson: 'David Lee',
    phone: '555-456-7890',
    email: 'david@oceanfresh.com',
    address: '321 Harbor Dr, Seaside, CA 90213',
    lastOrderDate: new Date('2024-03-14'),
    totalOrders: 28,
    active: true,
    averageDeliveryTime: 1,
    notes: 'Fresh seafood, daily deliveries',
    businessHours: defaultBusinessHours,
    performance: {
      onTimeDeliveryRate: 94.2,
      averageLeadTime: 1.3,
      orderAccuracy: 99.2,
      customerRating: 4.6
    }
  },
  {
    id: '5',
    name: 'Global Foods Ltd.',
    category: 'Grains',
    contactPerson: 'Lisa Chang',
    phone: '555-567-8901',
    email: 'lisa@globalfoods.com',
    address: '654 Import Blvd, Harbor City, CA 90214',
    lastOrderDate: new Date('2024-03- 10'),
    totalOrders: 19,
    active: true,
    averageDeliveryTime: 4,
    notes: 'International food distributor',
    businessHours: defaultBusinessHours,
    performance: {
      onTimeDeliveryRate: 93.7,
      averageLeadTime: 1.4,
      orderAccuracy: 99.3,
      customerRating: 4.5
    }
  },
  {
    id: '6',
    name: 'Happy Hens Farm',
    category: 'Dairy',
    contactPerson: 'Robert Taylor',
    phone: '555-678-9012',
    email: 'robert@happyhens.com',
    address: '987 Egg Lane, Chickentown, CA 90215',
    lastOrderDate: new Date('2024-03-16'),
    totalOrders: 33,
    active: true,
    averageDeliveryTime: 2,
    notes: 'Free-range eggs and poultry',
    businessHours: defaultBusinessHours,
    performance: {
      onTimeDeliveryRate: 92.9,
      averageLeadTime: 1.6,
      orderAccuracy: 99.4,
      customerRating: 4.4
    }
  },
  {
    id: '7',
    name: 'Citrus Delights',
    category: 'Beverages',
    contactPerson: 'Maria Rodriguez',
    phone: '555-789-0123',
    email: 'maria@citrusdelights.com',
    address: '741 Orange Grove, Citrus Heights, CA 90216',
    lastOrderDate: new Date('2024-03-12'),
    totalOrders: 24,
    active: true,
    averageDeliveryTime: 3,
    notes: 'Premium juices and concentrates',
    businessHours: defaultBusinessHours,
    performance: {
      onTimeDeliveryRate: 91.8,
      averageLeadTime: 1.7,
      orderAccuracy: 99.5,
      customerRating: 4.3
    }
  },
  {
    id: '8',
    name: 'Local Bakery',
    category: 'Bakery',
    contactPerson: 'Paul Brown',
    phone: '555-890-1234',
    email: 'paul@localbakery.com',
    address: '852 Flour St, Breadville, CA 90217',
    lastOrderDate: new Date('2024-03-15'),
    totalOrders: 41,
    active: true,
    averageDeliveryTime: 1,
    notes: 'Artisanal breads and pastries',
    businessHours: defaultBusinessHours,
    performance: {
      onTimeDeliveryRate: 90.5,
      averageLeadTime: 1.8,
      orderAccuracy: 99.6,
      customerRating: 4.2
    }
  },
  {
    id: '9',
    name: 'Orchard Fresh',
    category: 'Fruits',
    contactPerson: 'Emma Davis',
    phone: '555-901-2345',
    email: 'emma@orchardfresh.com',
    address: '963 Apple Way, Fruitland, CA 90218',
    lastOrderDate: new Date('2024-03-11'),
    totalOrders: 30,
    active: true,
    averageDeliveryTime: 2,
    notes: 'Seasonal fruits and berries',
    businessHours: defaultBusinessHours,
    performance: {
      onTimeDeliveryRate: 90.0,
      averageLeadTime: 1.9,
      orderAccuracy: 99.7,
      customerRating: 4.1
    }
  },
  {
    id: '10',
    name: 'Italian Imports',
    category: 'Dry Goods',
    contactPerson: 'Luca Romano',
    phone: '555-012-3456',
    email: 'luca@italianimports.com',
    address: '159 Pasta Lane, Little Italy, CA 90219',
    lastOrderDate: new Date('2024-03-08'),
    totalOrders: 17,
    active: false,
    averageDeliveryTime: 5,
    notes: 'Italian specialty foods',
    businessHours: defaultBusinessHours,
    performance: {
      onTimeDeliveryRate: 89.5,
      averageLeadTime: 2.0,
      orderAccuracy: 99.8,
      customerRating: 4.0
    }
  },
  {
    id: '11',
    name: 'Spice Route Trading',
    category: 'Spices',
    contactPerson: 'Raj Patel',
    phone: '555-123-9876',
    email: 'raj@spiceroute.com',
    address: '432 Saffron Ave, Spicetown, CA 90220',
    lastOrderDate: new Date('2024-03-14'),
    totalOrders: 25,
    active: true,
    averageDeliveryTime: 3,
    notes: 'Exotic spices and herbs from around the world',
    logoUrl: 'https://placehold.co/100x100?text=SR',
    businessHours: defaultBusinessHours,
    performance: {
      onTimeDeliveryRate: 90.2,
      averageLeadTime: 2.3,
      orderAccuracy: 97.8,
      customerRating: 4.5
    }
  },
  {
    id: '12',
    name: 'Olive Grove Oils',
    category: 'Oils',
    contactPerson: 'Elena Vasquez',
    phone: '555-789-4561',
    email: 'elena@olivegrove.com',
    address: '765 Olive Lane, Mediterranean Heights, CA 90221',
    lastOrderDate: new Date('2024-03-15'),
    totalOrders: 22,
    active: true,
    averageDeliveryTime: 2,
    notes: 'Premium olive oils and vinegars',
    logoUrl: 'https://placehold.co/100x100?text=OG',
    businessHours: defaultBusinessHours,
    performance: {
      onTimeDeliveryRate: 94.5,
      averageLeadTime: 1.8,
      orderAccuracy: 98.2,
      customerRating: 4.7
    }
  },
  {
    id: '13',
    name: 'Mountain Mushrooms',
    category: 'Mushrooms',
    contactPerson: 'Finn Anderson',
    phone: '555-456-7123',
    email: 'finn@mountainmushrooms.com',
    address: '291 Forest Path, Woodland, CA 90222',
    lastOrderDate: new Date('2024-03-12'),
    totalOrders: 18,
    active: true,
    averageDeliveryTime: 1,
    notes: 'Specialty cultivated and foraged mushrooms',
    logoUrl: 'https://placehold.co/100x100?text=MM',
    businessHours: defaultBusinessHours,
    performance: {
      onTimeDeliveryRate: 95.6,
      averageLeadTime: 1.2,
      orderAccuracy: 98.9,
      customerRating: 4.8
    }
  },
  {
    id: '14',
    name: 'Green Valley Herbs',
    category: 'Herbs',
    contactPerson: 'Sophia Green',
    phone: '555-654-3210',
    email: 'sophia@greenvalleyherbs.com',
    address: '821 Herb Lane, Botanica, CA 90223',
    lastOrderDate: new Date('2024-03-17'),
    totalOrders: 31,
    active: true,
    averageDeliveryTime: 1,
    notes: 'Fresh and dried culinary herbs',
    logoUrl: 'https://placehold.co/100x100?text=GV',
    businessHours: defaultBusinessHours,
    performance: {
      onTimeDeliveryRate: 97.2,
      averageLeadTime: 1.0,
      orderAccuracy: 99.1,
      customerRating: 4.9
    }
  },
  {
    id: '15',
    name: 'Nutty Harvest',
    category: 'Nuts',
    contactPerson: 'Marcus Wellington',
    phone: '555-321-8765',
    email: 'marcus@nuttyharvest.com',
    address: '543 Almond Road, Nutville, CA 90224',
    lastOrderDate: new Date('2024-03-16'),
    totalOrders: 27,
    active: true,
    averageDeliveryTime: 2,
    notes: 'Premium nuts, seeds, and nut butters',
    logoUrl: 'https://placehold.co/100x100?text=NH',
    businessHours: defaultBusinessHours,
    performance: {
      onTimeDeliveryRate: 93.4,
      averageLeadTime: 1.5,
      orderAccuracy: 97.6,
      customerRating: 4.6
    }
  }
];

export const mockSupplierOrders: SupplierOrder[] = [
  {
    id: '1',
    orderNumber: 'PO-973/2349/001',
    supplierId: '7',
    status: 'open',
    orderDate: new Date('2024-03-18'),
    updatedAt: new Date('2024-03-18'),
    totalItems: 2,
    totalQuantity: 10,
    totalAmount: 179,
    notes: 'Regular weekly order'
  },
  {
    id: '2',
    orderNumber: 'PO-973/2349/002',
    supplierId: '7',
    status: 'delivered',
    orderDate: new Date('2024-03-17'),
    updatedAt: new Date('2024-03-17'),
    totalItems: 2,
    totalQuantity: 10,
    totalAmount: 212.5,
    notes: 'Urgent order'
  },
  {
    id: '3',
    orderNumber: 'PO-973/2349/003',
    supplierId: '7',
    status: 'cancelled',
    orderDate: new Date('2024-03-16'),
    updatedAt: new Date('2024-03-16'),
    totalItems: 2,
    totalQuantity: 10,
    totalAmount: 179,
    notes: 'Regular weekly order'
  },
  {
    id: '4',
    orderNumber: 'PO-973/2349/004',
    supplierId: '7',
    status: 'delivered',
    orderDate: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
    totalItems: 2,
    totalQuantity: 10,
    totalAmount: 108,
    notes: 'Regular weekly order'
  },
  {
    id: '5',
    orderNumber: 'PO-973/2349/005',
    supplierId: '7',
    status: 'cancelled',
    orderDate: new Date('2024-03-14'),
    updatedAt: new Date('2024-03-14'),
    totalItems: 1,
    totalQuantity: 10,
    totalAmount: 140,
    notes: 'Cancelled due to supplier inventory issue'
  },
  {
    id: '6',
    orderNumber: 'PO-973/2349/006',
    supplierId: '7',
    status: 'pending',
    orderDate: new Date('2024-03-13'),
    updatedAt: new Date('2024-03-13'),
    totalItems: 2,
    totalQuantity: 10,
    totalAmount: 179,
    notes: 'Regular weekly order'
  },
  {
    id: '7',
    orderNumber: 'PO-973/2349/007',
    supplierId: '1',
    status: 'pending',
    orderDate: new Date('2024-03-12'),
    updatedAt: new Date('2024-03-12'),
    totalItems: 2,
    totalQuantity: 10,
    totalAmount: 179,
    notes: 'Regular weekly order'
  },
  {
    id: '8',
    orderNumber: 'PO-973/2349/008',
    supplierId: '1',
    status: 'pending',
    orderDate: new Date('2024-03-11'),
    updatedAt: new Date('2024-03-11'),
    totalItems: 2,
    totalQuantity: 10,
    totalAmount: 179,
    notes: 'Regular weekly order'
  },
  {
    id: '9',
    orderNumber: 'PO-973/2349/009',
    supplierId: '1',
    status: 'pending',
    orderDate: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
    totalItems: 2,
    totalQuantity: 10,
    totalAmount: 179,
    notes: 'Regular weekly order'
  },
  {
    id: '10',
    orderNumber: 'PO-973/2349/010',
    supplierId: '1',
    status: 'pending',
    orderDate: new Date('2024-03-09'),
    updatedAt: new Date('2024-03-09'),
    totalItems: 2,
    totalQuantity: 10,
    totalAmount: 179,
    notes: 'Regular weekly order'
  }
];

export const mockSupplierMetrics: SupplierMetrics = {
  totalSuppliers: 10,
  pendingOrders: 3,
  averageDeliveryTime: 2.3,
  totalMonthlyPurchases: 5280,
  stockShortages: 3
};

export const mockTopSuppliers = [
  { id: '1', name: 'Fresh Farms Inc.', orderCount: 45, totalSpent: 4250 },
  { id: '3', name: 'Local Dairy', orderCount: 52, totalSpent: 3680 },
  { id: '8', name: 'Local Bakery', orderCount: 41, totalSpent: 2950 }
];

export const mockStockShortages = [
  { id: '5', name: 'Salmon Fillet', supplier: 'Ocean Fresh', daysDelayed: 2 },
  { id: '10', name: 'Bread', supplier: 'Local Bakery', daysDelayed: 3 },
  { id: '14', name: 'Yogurt', supplier: 'Local Dairy', daysDelayed: 1 }
]; 