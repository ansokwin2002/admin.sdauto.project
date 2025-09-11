import { organization } from './CommonData';
import { StockItem } from '@/types/inventory';
import { mockStockItems } from './StockItemData';
import { StockRequestStatus } from './StockRequestData';

export interface TransferItemDiscrepancy {
  expectedQuantity: number;
  receivedQuantity: number;
  condition: 'good' | 'damaged' | 'partial';
  notes: string;
}

export interface TransferItem {
  id: string;
  stockItemId: string;
  quantity: number;
  discrepancy?: TransferItemDiscrepancy;
}

export interface TransferAttachment {
  id: string;
  type: 'receipt' | 'damage' | 'other';
  fileName: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  notes?: string;
}

export interface StockTransferLog {
  id: string;
  transferNumber: string;
  dateCreated: string;
  originId: string;
  destinationId: string;
  status: StockRequestStatus;
  createdBy: string;
  approvedBy?: string;
  rejectedBy?: string;
  dateReceived?: string; 
  hasDiscrepancies: boolean;
  notes?: string;
  items: TransferItem[];
  attachments: TransferAttachment[];
}

// Mock user data
const users = [
  { id: 'user-1', name: 'John Smith' },
  { id: 'user-2', name: 'Emily Johnson' },
  { id: 'user-3', name: 'Michael Brown' },
  { id: 'user-4', name: 'Jessica Williams' }
];

// Mock transfer logs
export const mockTransferLogs: StockTransferLog[] = [
  {
    id: 'transfer-1',
    transferNumber: 'TR-2023001',
    dateCreated: '2023-12-01T10:30:00Z',
    originId: 'br-1',
    destinationId: 'br-2',
    status: 'New',
    createdBy: 'user-1',
    hasDiscrepancies: false,
    notes: 'Weekly stock transfer to Los Angeles branch',
    items: [
      {
        id: 'item-1-1',
        stockItemId: '1', // Tomatoes
        quantity: 10
      },
      {
        id: 'item-1-2',
        stockItemId: '2', // Chicken Breast
        quantity: 5
      }
    ],
    attachments: []
  },
  {
    id: 'transfer-2',
    transferNumber: 'TR-2023002',
    dateCreated: '2023-12-05T14:15:00Z',
    originId: 'br-2',
    destinationId: 'br-3',
    status: 'Rejected',
    createdBy: 'user-2',
    rejectedBy: 'user-3',
    hasDiscrepancies: false,
    notes: 'Rejected due to insufficient stock at origin',
    items: [
      {
        id: 'item-2-1',
        stockItemId: '4', // Rice
        quantity: 20
      },
      {
        id: 'item-2-2',
        stockItemId: '5', // Salmon Fillet
        quantity: 8
      }
    ],
    attachments: []
  },
  {
    id: 'transfer-3',
    transferNumber: 'TR-2023003',
    dateCreated: '2023-12-10T09:45:00Z',
    originId: 'hq',
    destinationId: 'br-1',
    status: 'Approved',
    createdBy: 'user-1',
    approvedBy: 'user-4',
    hasDiscrepancies: false,
    notes: 'Monthly stock resupply',
    items: [
      {
        id: 'item-3-1',
        stockItemId: '6', // Eggs
        quantity: 120
      },
      {
        id: 'item-3-2',
        stockItemId: '7', // Potatoes
        quantity: 15
      },
      {
        id: 'item-3-3',
        stockItemId: '9', // Orange Juice
        quantity: 24
      }
    ],
    attachments: []
  },
  {
    id: 'transfer-4',
    transferNumber: 'TR-2023004',
    dateCreated: '2023-12-15T11:20:00Z',
    originId: 'br-3',
    destinationId: 'br-1',
    status: 'Delivering',
    createdBy: 'user-3',
    approvedBy: 'user-4',
    hasDiscrepancies: false,
    notes: 'Emergency transfer due to unexpected demand',
    items: [
      {
        id: 'item-4-1',
        stockItemId: '3', // Milk
        quantity: 12
      },
      {
        id: 'item-4-2',
        stockItemId: '11', // Cheese
        quantity: 8
      }
    ],
    attachments: []
  },
  {
    id: 'transfer-5',
    transferNumber: 'TR-2023005',
    dateCreated: '2023-11-20T08:10:00Z',
    originId: 'hq',
    destinationId: 'br-2',
    status: 'Completed',
    createdBy: 'user-2',
    approvedBy: 'user-1',
    dateReceived: '2023-11-21T14:30:00Z',
    hasDiscrepancies: false,
    notes: 'Regular monthly stock transfer',
    items: [
      {
        id: 'item-5-1',
        stockItemId: '8', // Ground Beef
        quantity: 10
      },
      {
        id: 'item-5-2',
        stockItemId: '12', // Apples
        quantity: 25
      }
    ],
    attachments: [
      {
        id: 'attachment-5-1',
        type: 'receipt',
        fileName: 'delivery-receipt-5.jpg',
        url: '/images/delivery-photo.jpg',
        uploadedBy: 'user-2',
        uploadedAt: '2023-11-21T14:35:00Z'
      }
    ]
  },
  {
    id: 'transfer-6',
    transferNumber: 'TR-2023006',
    dateCreated: '2023-11-25T10:45:00Z',
    originId: 'br-1',
    destinationId: 'br-3',
    status: 'Completed',
    createdBy: 'user-3',
    approvedBy: 'user-4',
    dateReceived: '2023-11-26T09:15:00Z',
    hasDiscrepancies: true,
    notes: 'Some items were missing upon delivery',
    items: [
      {
        id: 'item-6-1',
        stockItemId: '1', // Tomatoes
        quantity: 15,
        discrepancy: {
          expectedQuantity: 15,
          receivedQuantity: 12,
          condition: 'good',
          notes: '3 units missing from delivery'
        }
      },
      {
        id: 'item-6-2',
        stockItemId: '6', // Eggs
        quantity: 60,
        discrepancy: {
          expectedQuantity: 60,
          receivedQuantity: 60,
          condition: 'good',
          notes: ''
        }
      }
    ],
    attachments: [
      {
        id: 'attachment-6-1',
        type: 'receipt',
        fileName: 'delivery-photo-6.jpg',
        url: '/images/delivery-photo.jpg',
        uploadedBy: 'user-3',
        uploadedAt: '2023-11-26T09:20:00Z'
      },
      {
        id: 'attachment-6-2',
        type: 'other',
        fileName: 'discrepancy-photo-6.jpg',
        url: '/images/delivery-photo.jpg',
        uploadedBy: 'user-3',
        uploadedAt: '2023-11-26T09:25:00Z',
        notes: 'Photo documenting missing items'
      }
    ]
  },
  
  // Completed Status with Damaged Items
  {
    id: 'transfer-7',
    transferNumber: 'TR-2023007',
    dateCreated: '2023-11-28T15:30:00Z',
    originId: 'br-2',
    destinationId: 'br-1',
    status: 'Completed',
    createdBy: 'user-4',
    approvedBy: 'user-1',
    dateReceived: '2023-11-29T11:00:00Z',
    hasDiscrepancies: true,
    notes: 'Some items were damaged during transit',
    items: [
      {
        id: 'item-7-1',
        stockItemId: '3', // Milk
        quantity: 24,
        discrepancy: {
          expectedQuantity: 24,
          receivedQuantity: 20,
          condition: 'damaged',
          notes: '4 units damaged during shipping, packaged leaked'
        }
      },
      {
        id: 'item-7-2',
        stockItemId: '12', // Apples
        quantity: 30,
        discrepancy: {
          expectedQuantity: 30,
          receivedQuantity: 25,
          condition: 'partial',
          notes: 'Some apples bruised'
        }
      }
    ],
    attachments: [
      {
        id: 'attachment-7-1',
        type: 'receipt',
        fileName: 'delivery-photo-7.jpg',
        url: '/images/delivery-photo.jpg',
        uploadedBy: 'user-4',
        uploadedAt: '2023-11-29T11:05:00Z'
      },
      {
        id: 'attachment-7-2',
        type: 'damage',
        fileName: 'damaged-milk-7.jpg',
        url: '/images/food-damaged.jpg',
        uploadedBy: 'user-4',
        uploadedAt: '2023-11-29T11:10:00Z',
        notes: 'Photo of milk cartons damaged during shipping'
      },
      {
        id: 'attachment-7-3',
        type: 'damage',
        fileName: 'damaged-apples-7.jpg',
        url: '/images/food-damaged.jpg',
        uploadedBy: 'user-4',
        uploadedAt: '2023-11-29T11:15:00Z',
        notes: 'Photo of bruised apples'
      }
    ]
  },
  {
    id: 'transfer-8',
    transferNumber: 'TR-2023008',
    dateCreated: '2023-12-02T13:20:00Z',
    originId: 'hq',
    destinationId: 'br-3',
    status: 'Completed',
    createdBy: 'user-1',
    approvedBy: 'user-2',
    dateReceived: '2023-12-03T10:45:00Z',
    hasDiscrepancies: true,
    notes: 'Received more items than expected',
    items: [
      {
        id: 'item-8-1',
        stockItemId: '2', // Chicken Breast
        quantity: 10,
        discrepancy: {
          expectedQuantity: 10,
          receivedQuantity: 15,
          condition: 'good',
          notes: 'Received 5 extra units'
        }
      },
      {
        id: 'item-8-2',
        stockItemId: '4', // Rice
        quantity: 5,
        discrepancy: {
          expectedQuantity: 5,
          receivedQuantity: 5,
          condition: 'good',
          notes: ''
        }
      }
    ],
    attachments: [
      {
        id: 'attachment-8-1',
        type: 'receipt',
        fileName: 'delivery-photo-8.jpg',
        url: '/images/delivery-photo.jpg',
        uploadedBy: 'user-1',
        uploadedAt: '2023-12-03T10:50:00Z'
      },
      {
        id: 'attachment-8-2',
        type: 'other',
        fileName: 'excess-inventory-8.jpg',
        url: '/images/food-damaged.jpg',
        uploadedBy: 'user-1',
        uploadedAt: '2023-12-03T11:00:00Z',
        notes: 'Photo of excess inventory received'
      }
    ]
  },
  
  // New Status (Recent)
  {
    id: 'transfer-9',
    transferNumber: 'TR-2023009',
    dateCreated: '2023-12-18T09:00:00Z',
    originId: 'br-3',
    destinationId: 'br-2',
    status: 'New',
    createdBy: 'user-3',
    hasDiscrepancies: false,
    notes: 'Urgent transfer for weekend demand',
    items: [
      {
        id: 'item-9-1',
        stockItemId: '9', // Orange Juice
        quantity: 30
      }
    ],
    attachments: []
  },
  
  // Approved Status (Expedited)
  {
    id: 'transfer-10',
    transferNumber: 'TR-2023010',
    dateCreated: '2023-12-19T10:30:00Z',
    originId: 'hq',
    destinationId: 'br-1',
    status: 'Approved',
    createdBy: 'user-2',
    approvedBy: 'user-4',
    hasDiscrepancies: false,
    notes: 'Expedited transfer for holiday supplies',
    items: [
      {
        id: 'item-10-1',
        stockItemId: '13', // Pasta
        quantity: 15
      },
      {
        id: 'item-10-2',
        stockItemId: '7', // Potatoes
        quantity: 20
      },
      {
        id: 'item-10-3',
        stockItemId: '12', // Apples
        quantity: 25
      }
    ],
    attachments: []
  },
  
  // Completed (Long-ago) with Multiple Discrepancies
  {
    id: 'transfer-11',
    transferNumber: 'TR-2023011',
    dateCreated: '2023-10-05T08:45:00Z',
    originId: 'br-1',
    destinationId: 'br-2',
    status: 'Completed',
    createdBy: 'user-3',
    approvedBy: 'user-1',
    dateReceived: '2023-10-06T14:20:00Z',
    hasDiscrepancies: true,
    notes: 'Multiple issues with this shipment',
    items: [
      {
        id: 'item-11-1',
        stockItemId: '8', // Ground Beef
        quantity: 15,
        discrepancy: {
          expectedQuantity: 15,
          receivedQuantity: 10,
          condition: 'partial',
          notes: '5 units missing, rest in acceptable condition'
        }
      },
      {
        id: 'item-11-2',
        stockItemId: '1', // Tomatoes
        quantity: 20,
        discrepancy: {
          expectedQuantity: 20,
          receivedQuantity: 18,
          condition: 'damaged',
          notes: '2 boxes crushed during transit'
        }
      },
      {
        id: 'item-11-3',
        stockItemId: '11', // Cheese
        quantity: 10,
        discrepancy: {
          expectedQuantity: 10,
          receivedQuantity: 12,
          condition: 'good',
          notes: 'Received 2 extra units'
        }
      }
    ],
    attachments: [
      {
        id: 'attachment-11-1',
        type: 'receipt',
        fileName: 'delivery-photo-11.jpg',
        url: '/images/delivery-photo.jpg',
        uploadedBy: 'user-3',
        uploadedAt: '2023-10-06T14:25:00Z'
      },
      {
        id: 'attachment-11-2',
        type: 'damage',
        fileName: 'damaged-tomatoes-11.jpg',
        url: '/images/food-damaged.jpg',
        uploadedBy: 'user-3',
        uploadedAt: '2023-10-06T14:30:00Z',
        notes: 'Photo showing crushed tomato boxes'
      },
      {
        id: 'attachment-11-3',
        type: 'other',
        fileName: 'discrepancy-photo-11.jpg',
        url: '/images/food-damaged.jpg',
        uploadedBy: 'user-1',
        uploadedAt: '2023-10-06T16:00:00Z',
        notes: 'Photo of all discrepancies'
      }
    ]
  },
  
  // Delivering (Current)
  {
    id: 'transfer-12',
    transferNumber: 'TR-2023012',
    dateCreated: '2023-12-17T13:15:00Z',
    originId: 'br-2',
    destinationId: 'br-3',
    status: 'Delivering',
    createdBy: 'user-4',
    approvedBy: 'user-2',
    hasDiscrepancies: false,
    notes: 'Standard weekly transfer',
    items: [
      {
        id: 'item-12-1',
        stockItemId: '2', // Chicken Breast
        quantity: 8
      },
      {
        id: 'item-12-2',
        stockItemId: '6', // Eggs
        quantity: 30
      }
    ],
    attachments: []
  },
  
  // Recently Completed
  {
    id: 'transfer-13',
    transferNumber: 'TR-2023013',
    dateCreated: '2023-12-14T09:30:00Z',
    originId: 'hq',
    destinationId: 'br-1',
    status: 'Completed',
    createdBy: 'user-1',
    approvedBy: 'user-3',
    dateReceived: '2023-12-15T11:45:00Z',
    hasDiscrepancies: false,
    notes: 'All items received in good condition',
    items: [
      {
        id: 'item-13-1',
        stockItemId: '4', // Rice
        quantity: 10
      },
      {
        id: 'item-13-2',
        stockItemId: '9', // Orange Juice
        quantity: 15
      },
      {
        id: 'item-13-3',
        stockItemId: '3', // Milk
        quantity: 20
      }
    ],
    attachments: [
      {
        id: 'attachment-13-1',
        type: 'receipt',
        fileName: 'delivery-photo-13.jpg',
        url: '/images/delivery-photo.jpg',
        uploadedBy: 'user-1',
        uploadedAt: '2023-12-15T11:50:00Z'
      }
    ]
  },
  
  // Rejected (Policy Violation)
  {
    id: 'transfer-14',
    transferNumber: 'TR-2023014',
    dateCreated: '2023-12-16T14:20:00Z',
    originId: 'br-1',
    destinationId: 'br-3',
    status: 'Rejected',
    createdBy: 'user-2',
    rejectedBy: 'user-4',
    hasDiscrepancies: false,
    notes: 'Rejected due to policy violation - exceeds maximum transfer quantity',
    items: [
      {
        id: 'item-14-1',
        stockItemId: '7', // Potatoes
        quantity: 50
      },
      {
        id: 'item-14-2',
        stockItemId: '12', // Apples
        quantity: 100
      }
    ],
    attachments: []
  },
  
  // Completed with Photo Evidence
  {
    id: 'transfer-15',
    transferNumber: 'TR-2023015',
    dateCreated: '2023-12-10T08:00:00Z',
    originId: 'br-3',
    destinationId: 'br-2',
    status: 'Completed',
    createdBy: 'user-3',
    approvedBy: 'user-1',
    dateReceived: '2023-12-11T10:30:00Z',
    hasDiscrepancies: true,
    notes: 'Some items received in poor condition',
    items: [
      {
        id: 'item-15-1',
        stockItemId: '15', // Shrimp
        quantity: 5,
        discrepancy: {
          expectedQuantity: 5,
          receivedQuantity: 5,
          condition: 'damaged',
          notes: 'Temperature control issue during transit'
        }
      },
      {
        id: 'item-15-2',
        stockItemId: '6', // Eggs
        quantity: 20,
        discrepancy: {
          expectedQuantity: 20,
          receivedQuantity: 18,
          condition: 'partial',
          notes: '2 units broken during transit'
        }
      }
    ],
    attachments: [
      {
        id: 'attachment-15-1',
        type: 'receipt',
        fileName: 'delivery-photo-15.jpg',
        url: '/images/delivery-photo.jpg',
        uploadedBy: 'user-3',
        uploadedAt: '2023-12-11T10:35:00Z'
      },
      {
        id: 'attachment-15-2',
        type: 'damage',
        fileName: 'spoiled-shrimp-15.jpg',
        url: '/images/food-damaged.jpg',
        uploadedBy: 'user-3',
        uploadedAt: '2023-12-11T10:40:00Z',
        notes: 'Evidence of temperature abuse during transit'
      },
      {
        id: 'attachment-15-3',
        type: 'damage',
        fileName: 'broken-eggs-15.jpg',
        url: '/images/food-damaged.jpg',
        uploadedBy: 'user-3',
        uploadedAt: '2023-12-11T10:45:00Z',
        notes: 'Photo of broken egg cartons'
      }
    ]
  }
];

// Helper functions to work with the data
export const getTransferLogById = (id: string): StockTransferLog | undefined => {
  return mockTransferLogs.find(log => log.id === id);
};

export const getUserById = (id: string): { id: string; name: string } | undefined => {
  return users.find(user => user.id === id);
};

export const getStockItemById = (id: string): StockItem | undefined => {
  return mockStockItems.find(item => item.id === id);
}; 