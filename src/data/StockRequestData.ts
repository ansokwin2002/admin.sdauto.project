import { StockItem } from '@/types/inventory';
import { mockStockItems } from './StockItemData';

export type StockRequestStatus = 'New' | 'Rejected' | 'Approved' | 'Delivering' | 'Completed';

export interface StockRequestItem {
  id: string;
  stockItemId: string;
  quantity: number;
  unitOfMeasure: string;
  notes?: string;
}

export interface StockRequest {
  id: string;
  requestNumber: string;
  date: Date;
  originId: string;
  destinationId: string;
  items: StockRequestItem[];
  notes?: string;
  status: StockRequestStatus;
}

// Helper function to get random stock items
const getRandomStockItems = (count: number): StockRequestItem[] => {
  const items: StockRequestItem[] = [];
  const stockItems = [...mockStockItems];
  
  for (let i = 0; i < count; i++) {
    if (stockItems.length === 0) break;
    
    const randomIndex = Math.floor(Math.random() * stockItems.length);
    const stockItem = stockItems.splice(randomIndex, 1)[0];
    
    items.push({
      id: `item-${i + 1}`,
      stockItemId: stockItem.id,
      quantity: Math.floor(Math.random() * 10) + 1,
      unitOfMeasure: stockItem.storageUnit,
      notes: Math.random() > 0.7 ? `Special handling required for ${stockItem.name}` : undefined
    });
  }
  
  return items;
};

// Mock data for stock requests
export const mockStockRequests: StockRequest[] = [
  {
    id: 'req-001',
    requestNumber: 'SR-001',
    date: new Date('2025-02-01'),
    originId: 'br-1',
    destinationId: 'br-2',
    items: getRandomStockItems(3),
    notes: 'Urgent request due to unexpected demand',
    status: 'Approved'
  },
  {
    id: 'req-002',
    requestNumber: 'SR-002',
    date: new Date('2025-02-05'),
    originId: 'br-1',
    destinationId: 'br-3',
    items: getRandomStockItems(2),
    notes: 'Regular weekly stock transfer',
    status: 'Approved'
  },
  {
    id: 'req-003',
    requestNumber: 'SR-003',
    date: new Date('2025-02-10'),
    originId: 'br-1',
    destinationId: 'br-3',
    items: getRandomStockItems(4),
    status: 'Approved'
  },
  {
    id: 'req-004',
    requestNumber: 'SR-004',
    date: new Date('2025-03-15'),
    originId: 'br-3',
    destinationId: 'br-2',
    items: getRandomStockItems(1),
    notes: 'Emergency transfer needed',
    status: 'New'
  },
  {
    id: 'req-005',
    requestNumber: 'SR-005',
    date: new Date('2025-03-20'),
    originId: 'br-1',
    destinationId: 'br-3',
    items: getRandomStockItems(2),
    status: 'Rejected',
    notes: 'Items not available in requested quantities'
  },
  {
    id: 'req-006',
    requestNumber: 'SR-006',
    date: new Date('2025-03-22'),
    originId: 'br-2',
    destinationId: 'hq',
    items: getRandomStockItems(5),
    status: 'New'
  },
  {
    id: 'req-007',
    requestNumber: 'SR-007',
    date: new Date('2025-04-02'),
    originId: 'hq',
    destinationId: 'br-1',
    items: getRandomStockItems(2),
    notes: 'Restock for weekend rush',
    status: 'Approved'
  },
  {
    id: 'req-008',
    requestNumber: 'SR-008',
    date: new Date('2025-04-08'),
    originId: 'br-3',
    destinationId: 'br-1',
    items: getRandomStockItems(3),
    status: 'Delivering'
  },
  {
    id: 'req-009',
    requestNumber: 'SR-009',
    date: new Date('2025-04-10'),
    originId: 'br-1',
    destinationId: 'br-2',
    items: getRandomStockItems(4),
    status: 'Completed'
  },
  {
    id: 'req-010',
    requestNumber: 'SR-010',
    date: new Date('2025-04-12'),
    originId: 'hq',
    destinationId: 'br-3',
    items: getRandomStockItems(1),
    notes: 'Urgent - Low stock on spices',
    status: 'New'
  },
  {
    id: 'req-011',
    requestNumber: 'SR-011',
    date: new Date('2025-04-15'),
    originId: 'br-2',
    destinationId: 'br-1',
    items: getRandomStockItems(3),
    status: 'Approved'
  },
  {
    id: 'req-012',
    requestNumber: 'SR-012',
    date: new Date('2025-04-18'),
    originId: 'br-1',
    destinationId: 'hq',
    items: getRandomStockItems(2),
    status: 'Delivering'
  },
  {
    id: 'req-013',
    requestNumber: 'SR-013',
    date: new Date('2025-04-20'),
    originId: 'hq',
    destinationId: 'br-2',
    items: getRandomStockItems(5),
    notes: 'Holiday season stock up',
    status: 'New'
  },
  {
    id: 'req-014',
    requestNumber: 'SR-014',
    date: new Date('2025-04-22'),
    originId: 'br-3',
    destinationId: 'br-1',
    items: getRandomStockItems(1),
    status: 'Rejected',
    notes: 'Destination branch currently overstocked'
  },
  {
    id: 'req-015',
    requestNumber: 'SR-015',
    date: new Date('2025-04-25'),
    originId: 'br-2',
    destinationId: 'br-1',
    items: getRandomStockItems(4),
    status: 'Delivering'
  }
];

// Function to generate a new request number
export const generateRequestNumber = (): string => {
  if (mockStockRequests.length === 0) {
    return 'SR-001'; // Start from 001 if no requests exist
  }
  // Sort requests by ID to reliably find the last one
  const sortedRequests = [...mockStockRequests].sort((a, b) => {
    const numA = parseInt(a.id.split('-')[1]);
    const numB = parseInt(b.id.split('-')[1]);
    return numA - numB;
  });
  const lastRequest = sortedRequests[sortedRequests.length - 1];
  const lastNumber = parseInt(lastRequest.requestNumber.split('-')[1]);
  const newNumber = lastNumber + 1;
  return `SR-${newNumber.toString().padStart(3, '0')}`;
};

// Helper function to get stock item by ID
export const getStockItemById = (id: string): StockItem | undefined => {
  return mockStockItems.find(item => item.id === id);
};

// Helper functions to add, update, delete stock requests
export const addStockRequest = (request: Omit<StockRequest, 'id'>): StockRequest => {
  const newRequest: StockRequest = {
    ...request,
    id: `req-${(mockStockRequests.length + 1).toString().padStart(3, '0')}`
  };
  mockStockRequests.push(newRequest);
  return newRequest;
};

export const updateStockRequest = (id: string, updates: Partial<StockRequest>): StockRequest | undefined => {
  const index = mockStockRequests.findIndex(req => req.id === id);
  if (index === -1) return undefined;
  
  mockStockRequests[index] = {
    ...mockStockRequests[index],
    ...updates
  };
  
  return mockStockRequests[index];
};

export const deleteStockRequest = (id: string): boolean => {
  const index = mockStockRequests.findIndex(req => req.id === id);
  if (index === -1) return false;
  
  mockStockRequests.splice(index, 1);
  return true;
}; 