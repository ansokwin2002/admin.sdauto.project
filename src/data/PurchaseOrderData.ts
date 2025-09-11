import { subDays, addDays } from 'date-fns';

// Define types for Purchase Order management
export interface PurchaseOrder {
  id: string;
  poNumber: string;
  dateCreated: string;
  supplierName: string;
  supplierId: string;
  organizationId: string; // Reference to OrganizationEntity ID
  orderStatus: 'Draft' | 'Pending' | 'In Progress' | 'Delivered' | 'Partially Received' | 'Canceled';
  totalOrderValue: number;
  expectedDeliveryDate: string;
  paymentStatus: 'Paid' | 'Unpaid' | 'Partially Paid';
  orderedBy: string;
  supplierDetails: {
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
  };
  orderItems: PurchaseOrderItem[];
  shippingDetails?: {
    trackingNumber?: string;
    estimatedDeliveryTime?: string;
  };
  receivingLogs?: ReceivingLog[];
  paymentDetails: {
    paymentTerms: string;
    invoiceNumber?: string;
    paymentMethod?: 'Credit Card' | 'Bank Transfer' | 'Cash on Delivery' | 'Check';
    datePaid?: string;
  };
  notes?: string;
  supplierConfirmed: boolean;
}

export interface PurchaseOrderItem {
  id: string;
  itemName: string;
  quantityOrdered: number;
  unitPrice: number;
  receivedQuantity: number;
  stockLocation?: string;
  notes?: string;
}

export interface ReceivingLog {
  id: string;
  date: string;
  quantityReceived: number;
  receivedBy: string;
  notes?: string;
  itemName: string;
  itemSku: string;
  expiryDate?: string;
  storageLocation?: string;
}

export interface PurchaseOrderDashboardStats {
  totalPurchaseOrders: number;
  pendingOrders: number;
  completedOrders: number;
  outstandingPayments: number;
  averageDeliveryTime: number; // in days
  accuracyRate: number; // percentage
  restockAlerts: RestockAlert[];
}

export interface RestockAlert {
  id: string;
  itemName: string;
  currentStock: number;
  reorderPoint: number;
  supplier: string;
  supplierId: string;
}

// Static mock data for Purchase Orders with multi-branch support
export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "po-1",
    poNumber: "PO-10001",
    dateCreated: subDays(new Date(), 14).toISOString(),
    supplierName: "Farm Fresh Produce",
    supplierId: "supplier-1",
    organizationId: "br-1", // Los Angeles Branch
    orderStatus: "Delivered",
    totalOrderValue: 2456.78,
    expectedDeliveryDate: subDays(new Date(), 7).toISOString(),
    paymentStatus: "Paid",
    orderedBy: "John Doe",
    supplierDetails: {
      contactName: "Alex Lee",
      contactEmail: "alex@farmfreshproduce.com",
      contactPhone: "(555) 123-4567",
      address: "123 Farm Road, Fresno, CA 93706"
    },
    orderItems: [
      {
        id: "item-po-1-1",
        itemName: "Tomatoes",
        quantityOrdered: 50,
        unitPrice: 2.99,
        receivedQuantity: 50,
        stockLocation: "Dry Storage"
      },
      {
        id: "item-po-1-2",
        itemName: "Lettuce",
        quantityOrdered: 30,
        unitPrice: 1.99,
        receivedQuantity: 30,
        stockLocation: "Refrigerated"
      }
    ],
    shippingDetails: {
      trackingNumber: "TRK123456",
      estimatedDeliveryTime: "Delivered"
    },
    receivingLogs: [
      {
        id: "log-po-1-1",
        date: "2023-04-22",
        quantityReceived: 80,
        receivedBy: "Jane Smith",
        itemName: "Vegetables",
        itemSku: "VEG-001",
        expiryDate: subDays(new Date(), 14).toISOString(),
        storageLocation: "Dry Storage"
      }
    ],
    paymentDetails: {
      paymentTerms: "Net 15",
      invoiceNumber: "INV-20001",
      paymentMethod: "Bank Transfer",
      datePaid: "2023-04-25"
    },
    notes: "Regular weekly produce order",
    supplierConfirmed: true
  },
  {
    id: "po-2",
    poNumber: "PO-10002",
    dateCreated: subDays(new Date(), 13).toISOString(),
    supplierName: "Quality Meats Inc.",
    supplierId: "supplier-2",
    organizationId: "br-2", // Avenue Mall Branch
    orderStatus: "Delivered",
    totalOrderValue: 3789.45,
    expectedDeliveryDate: subDays(new Date(), 6).toISOString(),
    paymentStatus: "Paid",
    orderedBy: "Emily Davis",
    supplierDetails: {
      contactName: "Michael Wong",
      contactEmail: "michael@qualitymeats.com",
      contactPhone: "(555) 234-5678",
      address: "456 Butcher St, Chicago, IL 60607"
    },
    orderItems: [
      {
        id: "item-po-2-1",
        itemName: "Ribeye Steak",
        quantityOrdered: 20,
        unitPrice: 12.99,
        receivedQuantity: 20,
        stockLocation: "Freezer"
      },
      {
        id: "item-po-2-2",
        itemName: "Ground Beef",
        quantityOrdered: 40,
        unitPrice: 5.99,
        receivedQuantity: 40,
        stockLocation: "Refrigerated"
      }
    ],
    shippingDetails: {
      trackingNumber: "TRK234567",
      estimatedDeliveryTime: "Delivered"
    },
    receivingLogs: [
      {
        id: "log-po-2-1",
        date: "2023-04-25",
        quantityReceived: 60,
        receivedBy: "Robert Johnson",
        itemName: "Meat Products",
        itemSku: "MEAT-001",
        expiryDate: subDays(new Date(), 14).toISOString(),
        storageLocation: "Dry Storage"
      }
    ],
    paymentDetails: {
      paymentTerms: "Net 30",
      invoiceNumber: "INV-20002",
      paymentMethod: "Credit Card",
      datePaid: "2023-05-10"
    },
    notes: "Monthly meat order",
    supplierConfirmed: true
  },
  {
    id: "po-3",
    poNumber: "PO-10003",
    dateCreated: subDays(new Date(), 12).toISOString(),
    supplierName: "Ocean Harvest Seafood",
    supplierId: "supplier-3",
    organizationId: "br-3", // San Francisco Branch
    orderStatus: "Delivered",
    totalOrderValue: 1567.89,
    expectedDeliveryDate: subDays(new Date(), 5).toISOString(),
    paymentStatus: "Paid",
    orderedBy: "Sarah Johnson",
    supplierDetails: {
      contactName: "David Chen",
      contactEmail: "david@oceanharvest.com",
      contactPhone: "(555) 345-6789",
      address: "789 Harbor Dr, Seattle, WA 98101"
    },
    orderItems: [
      {
        id: "item-po-3-1",
        itemName: "Fresh Salmon",
        quantityOrdered: 15,
        unitPrice: 18.99,
        receivedQuantity: 15,
        stockLocation: "Freezer"
      },
      {
        id: "item-po-3-2",
        itemName: "Shrimp",
        quantityOrdered: 10,
        unitPrice: 22.99,
        receivedQuantity: 10,
        stockLocation: "Refrigerated"
      }
    ],
    shippingDetails: {
      trackingNumber: "TRK345678",
      estimatedDeliveryTime: "Delivered"
    },
    receivingLogs: [
      {
        id: "log-po-3-1",
        date: "2023-04-22",
        quantityReceived: 25,
        receivedBy: "Lisa Wong",
        itemName: "Seafood",
        itemSku: "FISH-001",
        expiryDate: subDays(new Date(), 14).toISOString(),
        storageLocation: "Dry Storage"
      }
    ],
    paymentDetails: {
      paymentTerms: "Due on delivery",
      invoiceNumber: "INV-20003",
      paymentMethod: "Cash on Delivery",
      datePaid: "2023-04-22"
    },
    notes: "Express delivery requested",
    supplierConfirmed: true
  },
  {
    id: "po-4",
    poNumber: "PO-10004",
    dateCreated: subDays(new Date(), 11).toISOString(),
    supplierName: "Organic Grains Co.",
    supplierId: "supplier-4",
    organizationId: "hq", // Headquarters order
    orderStatus: "Delivered",
    totalOrderValue: 5432.10,
    expectedDeliveryDate: subDays(new Date(), 4).toISOString(),
    paymentStatus: "Paid",
    orderedBy: "Robert Johnson",
    supplierDetails: {
      contactName: "Priya Patel",
      contactEmail: "priya@organicgrains.com",
      contactPhone: "(555) 456-7890",
      address: "101 Grain Mill Rd, Kansas City, MO 64108"
    },
    orderItems: [
      {
        id: "item-po-4-1",
        itemName: "Organic Rice",
        quantityOrdered: 100,
        unitPrice: 3.99,
        receivedQuantity: 100,
        stockLocation: "Dry Storage"
      },
      {
        id: "item-po-4-2",
        itemName: "Quinoa",
        quantityOrdered: 50,
        unitPrice: 6.99,
        receivedQuantity: 50,
        stockLocation: "Dry Storage"
      }
    ],
    shippingDetails: {
      trackingNumber: "TRK456789",
      estimatedDeliveryTime: "Delivered"
    },
    receivingLogs: [
      {
        id: "log-po-4-1",
        date: "2023-05-02",
        quantityReceived: 150,
        receivedBy: "John Doe",
        itemName: "Grains",
        itemSku: "GRAIN-001",
        expiryDate: subDays(new Date(), 14).toISOString(),
        storageLocation: "Dry Storage"
      }
    ],
    paymentDetails: {
      paymentTerms: "Net 30",
      invoiceNumber: "INV-20004",
      paymentMethod: "Bank Transfer",
      datePaid: "2023-05-25"
    },
    notes: "Bulk order for all branches",
    supplierConfirmed: true
  },
  {
    id: "po-5",
    poNumber: "PO-10005",
    dateCreated: subDays(new Date(), 10).toISOString(),
    supplierName: "Dairy Delights",
    supplierId: "supplier-5",
    organizationId: "br-1", // Los Angeles Branch
    orderStatus: "Delivered",
    totalOrderValue: 1234.56,
    expectedDeliveryDate: subDays(new Date(), 3).toISOString(),
    paymentStatus: "Paid",
    orderedBy: "Jane Smith",
    supplierDetails: {
      contactName: "Thomas Brown",
      contactEmail: "thomas@dairydelights.com",
      contactPhone: "(555) 567-8901",
      address: "202 Milk Way, Madison, WI 53703"
    },
    orderItems: [
      {
        id: "item-po-5-1",
        itemName: "Milk",
        quantityOrdered: 50,
        unitPrice: 3.49,
        receivedQuantity: 50,
        stockLocation: "Refrigerated"
      },
      {
        id: "item-po-5-2",
        itemName: "Cheese",
        quantityOrdered: 20,
        unitPrice: 5.99,
        receivedQuantity: 20,
        stockLocation: "Refrigerated"
      }
    ],
    shippingDetails: {
      trackingNumber: "TRK567890",
      estimatedDeliveryTime: "Delivered"
    },
    receivingLogs: [
      {
        id: "log-po-5-1",
        date: "2023-05-03",
        quantityReceived: 70,
        receivedBy: "Emily Davis",
        itemName: "Dairy Products",
        itemSku: "DAIRY-001",
        expiryDate: subDays(new Date(), 14).toISOString(),
        storageLocation: "Dry Storage"
      }
    ],
    paymentDetails: {
      paymentTerms: "Net 15",
      invoiceNumber: "INV-20005",
      paymentMethod: "Credit Card",
      datePaid: "2023-05-15"
    },
    notes: "Weekly dairy order",
    supplierConfirmed: true
  },
  {
    id: "po-6",
    poNumber: "PO-10006",
    dateCreated: subDays(new Date(), 9).toISOString(),
    supplierName: "Spice World Imports",
    supplierId: "supplier-6",
    organizationId: "br-2", // Avenue Mall Branch
    orderStatus: "In Progress",
    totalOrderValue: 876.54,
    expectedDeliveryDate: subDays(new Date(), 2).toISOString(),
    paymentStatus: "Unpaid",
    orderedBy: "Robert Johnson",
    supplierDetails: {
      contactName: "Raj Sharma",
      contactEmail: "raj@spiceworld.com",
      contactPhone: "(555) 678-9012",
      address: "303 Spice Lane, Miami, FL 33101"
    },
    orderItems: [
      {
        id: "item-po-6-1",
        itemName: "Black Pepper",
        quantityOrdered: 10,
        unitPrice: 12.99,
        receivedQuantity: 0,
        stockLocation: "Dry Storage"
      },
      {
        id: "item-po-6-2",
        itemName: "Cinnamon",
        quantityOrdered: 10,
        unitPrice: 9.99,
        receivedQuantity: 0,
        stockLocation: "Dry Storage"
      }
    ],
    shippingDetails: {
      trackingNumber: "TRK678901",
      estimatedDeliveryTime: "2 days"
    },
    paymentDetails: {
      paymentTerms: "Net 30"
    },
    supplierConfirmed: true
  },
  {
    id: "po-7",
    poNumber: "PO-10007",
    dateCreated: subDays(new Date(), 8).toISOString(),
    supplierName: "Beverage Distributors LLC",
    supplierId: "supplier-7",
    organizationId: "br-3", // San Francisco Branch
    orderStatus: "Pending",
    totalOrderValue: 2345.67,
    expectedDeliveryDate: subDays(new Date(), 1).toISOString(),
    paymentStatus: "Unpaid",
    orderedBy: "Sarah Johnson",
    supplierDetails: {
      contactName: "Carlos Rodriguez",
      contactEmail: "carlos@beveragedist.com",
      contactPhone: "(555) 789-0123",
      address: "404 Drink Blvd, Denver, CO 80202"
    },
    orderItems: [
      {
        id: "item-po-7-1",
        itemName: "Bottled Water",
        quantityOrdered: 100,
        unitPrice: 0.99,
        receivedQuantity: 0,
        stockLocation: "Dry Storage"
      },
      {
        id: "item-po-7-2",
        itemName: "Soda",
        quantityOrdered: 50,
        unitPrice: 1.49,
        receivedQuantity: 0,
        stockLocation: "Dry Storage"
      }
    ],
    paymentDetails: {
      paymentTerms: "Net 15"
    },
    supplierConfirmed: false
  },
  {
    id: "po-8",
    poNumber: "PO-10008",
    dateCreated: subDays(new Date(), 7).toISOString(),
    supplierName: "Kitchen Supply Pro",
    supplierId: "supplier-8",
    organizationId: "hq", // Headquarters order
    orderStatus: "Draft",
    totalOrderValue: 9876.54,
    expectedDeliveryDate: new Date().toISOString(),
    paymentStatus: null,
    orderedBy: "John Doe",
    supplierDetails: {
      contactName: "Emma Wilson",
      contactEmail: "emma@kitchensupply.com",
      contactPhone: "(555) 890-1234",
      address: "505 Utensil Ave, Chicago, IL 60607"
    },
    orderItems: [
      {
        id: "item-po-8-1",
        itemName: "Cooking Pots",
        quantityOrdered: 20,
        unitPrice: 49.99,
        receivedQuantity: 0,
        stockLocation: "Equipment Storage"
      },
      {
        id: "item-po-8-2",
        itemName: "Chef Knives",
        quantityOrdered: 10,
        unitPrice: 89.99,
        receivedQuantity: 0,
        stockLocation: "Equipment Storage"
      }
    ],
    paymentDetails: {
      paymentTerms: "Net 45"
    },
    notes: "Equipment order for all branches",
    supplierConfirmed: false
  },
  {
    id: "po-9",
    poNumber: "PO-10009",
    dateCreated: subDays(new Date(), 6).toISOString(),
    supplierName: "Global Ingredients",
    supplierId: "supplier-9",
    organizationId: "br-1", // Los Angeles Branch
    orderStatus: "Partially Received",
    totalOrderValue: 3456.78,
    expectedDeliveryDate: addDays(new Date(), 1).toISOString(),
    paymentStatus: "Partially Paid",
    orderedBy: "Emily Davis",
    supplierDetails: {
      contactName: "James Liu",
      contactEmail: "james@globalingredients.com",
      contactPhone: "(555) 901-2345",
      address: "606 Import Road, Los Angeles, CA 90007"
    },
    orderItems: [
      {
        id: "item-po-9-1",
        itemName: "Olive Oil",
        quantityOrdered: 30,
        unitPrice: 15.99,
        receivedQuantity: 30,
        stockLocation: "Dry Storage"
      },
      {
        id: "item-po-9-2",
        itemName: "Balsamic Vinegar",
        quantityOrdered: 20,
        unitPrice: 12.99,
        receivedQuantity: 10,
        stockLocation: "Dry Storage"
      }
    ],
    shippingDetails: {
      trackingNumber: "TRK901234",
      estimatedDeliveryTime: "Partially Delivered"
    },
    receivingLogs: [
      {
        id: "log-po-9-1",
        date: "2023-05-19",
        quantityReceived: 40,
        receivedBy: "Jane Smith",
        itemName: "Imported Goods",
        itemSku: "IMP-001",
        expiryDate: subDays(new Date(), 14).toISOString(),
        storageLocation: "Dry Storage"
      }
    ],
    paymentDetails: {
      paymentTerms: "Net 30",
      invoiceNumber: "INV-20009",
      paymentMethod: "Bank Transfer"
    },
    notes: "Second shipment pending",
    supplierConfirmed: true
  },
  {
    id: "po-10",
    poNumber: "PO-10010",
    dateCreated: subDays(new Date(), 5).toISOString(),
    supplierName: "Farm Fresh Produce",
    supplierId: "supplier-1",
    organizationId: "br-2", // Avenue Mall Branch
    orderStatus: "Canceled",
    totalOrderValue: 1234.56,
    expectedDeliveryDate: addDays(new Date(), 2).toISOString(),
    paymentStatus: "Unpaid",
    orderedBy: "Robert Johnson",
    supplierDetails: {
      contactName: "Alex Lee",
      contactEmail: "alex@farmfreshproduce.com",
      contactPhone: "(555) 123-4567",
      address: "123 Farm Road, Fresno, CA 93706"
    },
    orderItems: [
      {
        id: "item-po-10-1",
        itemName: "Apples",
        quantityOrdered: 50,
        unitPrice: 1.99,
        receivedQuantity: 0,
        stockLocation: "Refrigerated"
      },
      {
        id: "item-po-10-2",
        itemName: "Oranges",
        quantityOrdered: 40,
        unitPrice: 2.49,
        receivedQuantity: 0,
        stockLocation: "Refrigerated"
      }
    ],
    paymentDetails: {
      paymentTerms: "Net 15"
    },
    notes: "Canceled due to price changes",
    supplierConfirmed: false
  },
  {
    id: "po-11",
    poNumber: "PO-10011",
    dateCreated: subDays(new Date(), 4).toISOString(),
    supplierName: "Quality Meats Inc.",
    supplierId: "supplier-2",
    organizationId: "br-3", // San Francisco Branch
    orderStatus: "Delivered",
    totalOrderValue: 4567.89,
    expectedDeliveryDate: addDays(new Date(), 3).toISOString(),
    paymentStatus: "Paid",
    orderedBy: "Sarah Johnson",
    supplierDetails: {
      contactName: "Michael Wong",
      contactEmail: "michael@qualitymeats.com",
      contactPhone: "(555) 234-5678",
      address: "456 Butcher St, Chicago, IL 60607"
    },
    orderItems: [
      {
        id: "item-po-11-1",
        itemName: "Chicken Breast",
        quantityOrdered: 50,
        unitPrice: 8.99,
        receivedQuantity: 50,
        stockLocation: "Freezer"
      },
      {
        id: "item-po-11-2",
        itemName: "Pork Loin",
        quantityOrdered: 30,
        unitPrice: 9.99,
        receivedQuantity: 30,
        stockLocation: "Freezer"
      }
    ],
    shippingDetails: {
      trackingNumber: "TRK012345",
      estimatedDeliveryTime: "Delivered"
    },
    receivingLogs: [
      {
        id: "log-po-11-1",
        date: "2023-05-25",
        quantityReceived: 80,
        receivedBy: "Lisa Wong",
        itemName: "Meat Products",
        itemSku: "MEAT-002",
        expiryDate: subDays(new Date(), 14).toISOString(),
        storageLocation: "Dry Storage"
      }
    ],
    paymentDetails: {
      paymentTerms: "Net 15",
      invoiceNumber: "INV-20011",
      paymentMethod: "Credit Card",
      datePaid: "2023-06-01"
    },
    supplierConfirmed: true
  },
  {
    id: "po-12",
    poNumber: "PO-10012",
    dateCreated: subDays(new Date(), 3).toISOString(),
    supplierName: "Ocean Harvest Seafood",
    supplierId: "supplier-3",
    organizationId: "hq", // Headquarters order
    orderStatus: "In Progress",
    totalOrderValue: 3789.45,
    expectedDeliveryDate: addDays(new Date(), 4).toISOString(),
    paymentStatus: "Unpaid",
    orderedBy: "John Doe",
    supplierDetails: {
      contactName: "David Chen",
      contactEmail: "david@oceanharvest.com",
      contactPhone: "(555) 345-6789",
      address: "789 Harbor Dr, Seattle, WA 98101"
    },
    orderItems: [
      {
        id: "item-po-12-1",
        itemName: "Tuna",
        quantityOrdered: 20,
        unitPrice: 24.99,
        receivedQuantity: 0,
        stockLocation: "Freezer"
      },
      {
        id: "item-po-12-2",
        itemName: "Cod",
        quantityOrdered: 25,
        unitPrice: 18.99,
        receivedQuantity: 0,
        stockLocation: "Freezer"
      }
    ],
    shippingDetails: {
      trackingNumber: "TRK123456",
      estimatedDeliveryTime: "3 days"
    },
    paymentDetails: {
      paymentTerms: "Net 30"
    },
    notes: "Special order for company event",
    supplierConfirmed: true
  },
  {
    id: "po-13",
    poNumber: "PO-10013",
    dateCreated: subDays(new Date(), 2).toISOString(),
    supplierName: "Organic Grains Co.",
    supplierId: "supplier-4",
    organizationId: "br-1", // Los Angeles Branch
    orderStatus: "Pending",
    totalOrderValue: 987.65,
    expectedDeliveryDate: addDays(new Date(), 5).toISOString(),
    paymentStatus: "Unpaid",
    orderedBy: "Jane Smith",
    supplierDetails: {
      contactName: "Priya Patel",
      contactEmail: "priya@organicgrains.com",
      contactPhone: "(555) 456-7890",
      address: "101 Grain Mill Rd, Kansas City, MO 64108"
    },
    orderItems: [
      {
        id: "item-po-13-1",
        itemName: "Whole Wheat Flour",
        quantityOrdered: 30,
        unitPrice: 4.99,
        receivedQuantity: 0,
        stockLocation: "Dry Storage"
      },
      {
        id: "item-po-13-2",
        itemName: "Rolled Oats",
        quantityOrdered: 25,
        unitPrice: 3.99,
        receivedQuantity: 0,
        stockLocation: "Dry Storage"
      }
    ],
    paymentDetails: {
      paymentTerms: "Net 15"
    },
    supplierConfirmed: false
  },
  {
    id: "po-14",
    poNumber: "PO-10014",
    dateCreated: subDays(new Date(), 1).toISOString(),
    supplierName: "Dairy Delights",
    supplierId: "supplier-5",
    organizationId: "br-2", // Avenue Mall Branch
    orderStatus: "Delivered",
    totalOrderValue: 1567.89,
    expectedDeliveryDate: addDays(new Date(), 6).toISOString(),
    paymentStatus: "Paid",
    orderedBy: "Robert Johnson",
    supplierDetails: {
      contactName: "Thomas Brown",
      contactEmail: "thomas@dairydelights.com",
      contactPhone: "(555) 567-8901",
      address: "202 Milk Way, Madison, WI 53703"
    },
    orderItems: [
      {
        id: "item-po-14-1",
        itemName: "Yogurt",
        quantityOrdered: 40,
        unitPrice: 1.99,
        receivedQuantity: 40,
        stockLocation: "Refrigerated"
      },
      {
        id: "item-po-14-2",
        itemName: "Butter",
        quantityOrdered: 25,
        unitPrice: 4.49,
        receivedQuantity: 25,
        stockLocation: "Refrigerated"
      }
    ],
    shippingDetails: {
      trackingNumber: "TRK234567",
      estimatedDeliveryTime: "Delivered"
    },
    receivingLogs: [
      {
        id: "log-po-14-1",
        date: "2023-05-28",
        quantityReceived: 65,
        receivedBy: "Emily Davis",
        itemName: "Dairy Products",
        itemSku: "DAIRY-002",
        expiryDate: subDays(new Date(), 14).toISOString(),
        storageLocation: "Dry Storage"
      }
    ],
    paymentDetails: {
      paymentTerms: "Net 15",
      invoiceNumber: "INV-20014",
      paymentMethod: "Bank Transfer",
      datePaid: "2023-06-05"
    },
    supplierConfirmed: true
  },
  {
    id: "po-15",
    poNumber: "PO-10015",
    dateCreated: subDays(new Date(), 0).toISOString(),
    supplierName: "Spice World Imports",
    supplierId: "supplier-6",
    organizationId: "br-3", // San Francisco Branch
    orderStatus: "Pending",
    totalOrderValue: 654.32,
    expectedDeliveryDate: addDays(new Date(), 7).toISOString(),
    paymentStatus: "Unpaid",
    orderedBy: "Sarah Johnson",
    supplierDetails: {
      contactName: "Raj Sharma",
      contactEmail: "raj@spiceworld.com",
      contactPhone: "(555) 678-9012",
      address: "303 Spice Lane, Miami, FL 33101"
    },
    orderItems: [
      {
        id: "item-po-15-1",
        itemName: "Cumin",
        quantityOrdered: 5,
        unitPrice: 8.99,
        receivedQuantity: 0,
        stockLocation: "Dry Storage"
      },
      {
        id: "item-po-15-2",
        itemName: "Turmeric",
        quantityOrdered: 5,
        unitPrice: 7.99,
        receivedQuantity: 0,
        stockLocation: "Dry Storage"
      }
    ],
    paymentDetails: {
      paymentTerms: "Net 30"
    },
    supplierConfirmed: true
  }
];

// Mock dashboard stats
export const mockPurchaseOrderStats: PurchaseOrderDashboardStats = {
  totalPurchaseOrders: mockPurchaseOrders.length,
  pendingOrders: mockPurchaseOrders.filter(po => po.orderStatus === 'Pending' || po.orderStatus === 'In Progress').length,
  completedOrders: mockPurchaseOrders.filter(po => po.orderStatus === 'Delivered').length,
  outstandingPayments: mockPurchaseOrders.filter(po => po.paymentStatus === 'Unpaid' || po.paymentStatus === 'Partially Paid').length,
  averageDeliveryTime: 5.2, // Average days from order to delivery
  accuracyRate: 94.7, // Percentage of orders delivered correctly
  restockAlerts: [
    {
      id: "restock-1",
      itemName: "Tomatoes",
      currentStock: 5,
      reorderPoint: 10,
      supplier: "Farm Fresh Produce",
      supplierId: "supplier-1"
    },
    {
      id: "restock-2",
      itemName: "Chicken",
      currentStock: 8,
      reorderPoint: 15,
      supplier: "Quality Meats Inc.",
      supplierId: "supplier-2"
    },
    {
      id: "restock-3",
      itemName: "Rice",
      currentStock: 12,
      reorderPoint: 20,
      supplier: "Organic Grains Co.",
      supplierId: "supplier-4"
    }
  ]
};

// Filter purchase orders based on search text and organization
export function filterPurchaseOrders(
  purchaseOrders: PurchaseOrder[], 
  searchText: string, 
  organizationId?: string
): PurchaseOrder[] {
  let filteredOrders = purchaseOrders;
  
  // Filter by organization if specified (except HQ which sees all)
  if (organizationId && organizationId !== 'hq') {
    filteredOrders = filteredOrders.filter(po => po.organizationId === organizationId);
  }
  
  // If no search text, return organization-filtered results
  if (!searchText) return filteredOrders;
  
  const lowerSearchText = searchText.toLowerCase();
  
  return filteredOrders.filter(po => 
    (po.poNumber?.toLowerCase() || '').includes(lowerSearchText) ||
    (po.supplierName?.toLowerCase() || '').includes(lowerSearchText) ||
    (po.orderStatus?.toLowerCase() || '').includes(lowerSearchText) ||
    (po.paymentStatus?.toLowerCase() || '').includes(lowerSearchText) ||
    (po.orderedBy?.toLowerCase() || '').includes(lowerSearchText)
  );
}

// Get purchase orders for a specific organization
export function getPurchaseOrdersByOrganization(organizationId: string): PurchaseOrder[] {
  // HQ can see all purchase orders
  if (organizationId === 'hq') return mockPurchaseOrders;
  
  return mockPurchaseOrders.filter(po => po.organizationId === organizationId);
}

// Get organization-specific dashboard stats
export function getOrganizationPurchaseOrderStats(organizationId: string): PurchaseOrderDashboardStats {
  const orgOrders = getPurchaseOrdersByOrganization(organizationId);
  
  return {
    totalPurchaseOrders: orgOrders.length,
    pendingOrders: orgOrders.filter(po => po.orderStatus === 'Pending' || po.orderStatus === 'In Progress').length,
    completedOrders: orgOrders.filter(po => po.orderStatus === 'Delivered').length,
    outstandingPayments: orgOrders.filter(po => po.paymentStatus === 'Unpaid' || po.paymentStatus === 'Partially Paid').length,
    averageDeliveryTime: 5.2, // Simplified for mock data
    accuracyRate: 94.7, // Simplified for mock data
    restockAlerts: getRestockAlertsForOrganization(organizationId)
  };
}

// Get restock alerts for a specific organization
function getRestockAlertsForOrganization(organizationId: string): RestockAlert[] {
  // In a real implementation, this would filter alerts by organization
  if (organizationId === 'hq') return mockPurchaseOrderStats.restockAlerts;
  
  // Simple filtering logic to assign different alerts to different branches
  if (organizationId === 'br-1') return [mockPurchaseOrderStats.restockAlerts[0]];
  if (organizationId === 'br-2') return [mockPurchaseOrderStats.restockAlerts[1]];
  if (organizationId === 'br-3') return [mockPurchaseOrderStats.restockAlerts[2]];
  
  return [];
}

// Get a purchase order by ID
export function getPurchaseOrderById(id: string): PurchaseOrder | undefined {
  return mockPurchaseOrders.find(po => po.id === id);
}

// Add new purchase order
export function addPurchaseOrder(purchaseOrder: Omit<PurchaseOrder, 'id' | 'poNumber'>): PurchaseOrder {
  const newId = `po-${mockPurchaseOrders.length + 1}`;
  const newPoNumber = `PO-${10000 + mockPurchaseOrders.length + 1}`;
  
  const newPurchaseOrder: PurchaseOrder = {
    ...purchaseOrder,
    id: newId,
    poNumber: newPoNumber
  };
  
  mockPurchaseOrders.push(newPurchaseOrder);
  return newPurchaseOrder;
}

// Update purchase order
export function updatePurchaseOrder(id: string, updates: Partial<PurchaseOrder>): PurchaseOrder | undefined {
  const index = mockPurchaseOrders.findIndex(po => po.id === id);
  if (index === -1) return undefined;
  
  const updatedPO = { ...mockPurchaseOrders[index], ...updates };
  mockPurchaseOrders[index] = updatedPO;
  return updatedPO;
}

// Delete purchase order
export function deletePurchaseOrder(id: string): boolean {
  const index = mockPurchaseOrders.findIndex(po => po.id === id);
  if (index === -1) return false;
  
  mockPurchaseOrders.splice(index, 1);
  return true;
}

// Transfer purchase order between organizations
export function transferPurchaseOrder(
  poId: string, 
  targetOrganizationId: string
): PurchaseOrder | undefined {
  const po = getPurchaseOrderById(poId);
  if (!po) return undefined;
  
  const sourceOrgId = po.organizationId;
  
  return updatePurchaseOrder(poId, {
    organizationId: targetOrganizationId,
    notes: po.notes 
      ? `${po.notes} - Transferred from ${sourceOrgId}` 
      : `Transferred from ${sourceOrgId}`
  });
}

