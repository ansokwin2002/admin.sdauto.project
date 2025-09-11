export interface User {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
  branches: string[];
  region?: string;
  status: 'active' | 'inactive';
  lastActive?: string;
  canViewOwnReports: boolean;
  canEditInventory: boolean;
  activityLog?: {
    timestamp: string;
    action: string;
  }[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
}

export const roles: Role[] = [
  {
    id: 'role1',
    name: 'Admin',
    description: 'Full system access'
  },
  {
    id: 'role2',
    name: 'Branch Manager',
    description: 'Manages branch operations'
  },
  {
    id: 'role3',
    name: 'Cashier',
    description: 'Handles sales transactions'
  },
  {
    id: 'role4',
    name: 'Inventory Specialist',
    description: 'Manages inventory and stock'
  },
  {
    id: 'role5',
    name: 'Regional Manager',
    description: 'Oversees multiple branches'
  }
];

// Helper function to create dynamic dates
const getDynamicDate = (daysAgo: number = 0, hoursAgo: number = 0, minutesAgo: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  date.setMinutes(date.getMinutes() - minutesAgo);
  return date.toISOString();
};

export const mockUsers: User[] = [
  {
    id: 'user1',
    firstName: 'Peter',
    lastName: 'Bryan',
    name: 'Peter Bryan',
    email: 'peter.bryan@eatlypos.com',
    role: 'Admin',
    avatar: 'https://placehold.co/100x100?text=PB',
    branches: ['1', '2'],
    status: 'active',
    phone: '+1 (555) 123-4567',
    lastActive: getDynamicDate(0, 2, 15), // 2 hours, 15 minutes ago
    canViewOwnReports: false,
    canEditInventory: true,
    activityLog: [
      {
        timestamp: getDynamicDate(0, 2, 15), // 2 hours, 15 minutes ago
        action: 'Logged in'
      },
      {
        timestamp: getDynamicDate(0, 1, 30), // 1 hour, 30 minutes ago
        action: 'Updated inventory settings'
      }
    ]
  },
  {
    id: 'user2',
    firstName: 'Jane',
    lastName: 'Smith',
    name: 'Jane Smith',
    email: 'jane.smith@eatlypos.com',
    role: 'Inventory Specialist',
    avatar: 'https://placehold.co/100x100?text=JS',
    branches: ['1'],
    status: 'active',
    phone: '+1 (555) 234-5678',
    lastActive: getDynamicDate(1, 3, 45), // 1 day, 3 hours, 45 minutes ago
    canViewOwnReports: true,
    canEditInventory: true,
    activityLog: [
      {
        timestamp: getDynamicDate(1, 3, 45), // 1 day, 3 hours, 45 minutes ago
        action: 'Updated stock levels'
      }
    ]
  },
  {
    id: 'user3',
    firstName: 'Robert',
    lastName: 'Johnson',
    name: 'Robert Johnson',
    email: 'robert.johnson@eatlypos.com',
    role: 'Cashier',
    avatar: 'https://placehold.co/100x100?text=RJ',
    branches: ['2'],
    status: 'active',
    lastActive: getDynamicDate(2, 5, 15), // 2 days, 5 hours, 15 minutes ago
    canViewOwnReports: true,
    canEditInventory: false,
    activityLog: [
      {
        timestamp: getDynamicDate(2, 5, 15), // 2 days, 5 hours, 15 minutes ago
        action: 'Processed 12 orders'
      }
    ]
  },
  {
    id: 'user4',
    firstName: 'Maria',
    lastName: 'Garcia',
    name: 'Maria Garcia',
    email: 'maria.garcia@eatlypos.com',
    role: 'Branch Manager',
    avatar: 'https://placehold.co/100x100?text=MG',
    branches: ['3'],
    region: 'East',
    status: 'active',
    phone: '+1 (555) 345-6789',
    lastActive: getDynamicDate(0, 0, 30), // 30 minutes ago
    canViewOwnReports: false,
    canEditInventory: true,
    activityLog: [
      {
        timestamp: getDynamicDate(0, 0, 30), // 30 minutes ago
        action: 'Approved schedule changes'
      }
    ]
  },
  {
    id: 'user5',
    firstName: 'David',
    lastName: 'Chen',
    name: 'David Chen',
    email: 'david.chen@eatlypos.com',
    role: 'Regional Manager',
    avatar: 'https://placehold.co/100x100?text=DC',
    branches: ['1', '2', '3'],
    region: 'West',
    status: 'inactive',
    phone: '+1 (555) 456-7890',
    lastActive: getDynamicDate(7, 8, 0), // 7 days, 8 hours ago
    canViewOwnReports: false,
    canEditInventory: true,
    activityLog: [
      {
        timestamp: getDynamicDate(7, 8, 0), // 7 days, 8 hours ago
        action: 'Generated regional sales report'
      }
    ]
  },
  {
    id: 'user6',
    firstName: 'Sarah',
    lastName: 'Wilson',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@eatlypos.com',
    role: 'Cashier',
    avatar: 'https://placehold.co/100x100?text=SW',
    branches: ['1'],
    status: 'active',
    phone: '+1 (555) 567-8901',
    lastActive: getDynamicDate(0, 4, 20), // 4 hours, 20 minutes ago
    canViewOwnReports: true,
    canEditInventory: false,
    activityLog: [
      {
        timestamp: getDynamicDate(0, 4, 20), // 4 hours, 20 minutes ago
        action: 'Processed 8 orders'
      }
    ]
  },
  {
    id: 'user7',
    firstName: 'Michael',
    lastName: 'Brown',
    name: 'Michael Brown',
    email: 'michael.brown@eatlypos.com',
    role: 'Branch Manager',
    avatar: 'https://placehold.co/100x100?text=MB',
    branches: ['2'],
    status: 'active',
    phone: '+1 (555) 678-9012',
    lastActive: getDynamicDate(0, 3, 5), // 3 hours, 5 minutes ago
    canViewOwnReports: false,
    canEditInventory: true,
    activityLog: [
      {
        timestamp: getDynamicDate(0, 3, 5), // 3 hours, 5 minutes ago
        action: 'Updated employee schedule'
      }
    ]
  },
  {
    id: 'user8',
    firstName: 'Emily',
    lastName: 'Taylor',
    name: 'Emily Taylor',
    email: 'emily.taylor@eatlypos.com',
    role: 'Inventory Specialist',
    avatar: 'https://placehold.co/100x100?text=ET',
    branches: ['3'],
    status: 'active',
    phone: '+1 (555) 789-0123',
    lastActive: getDynamicDate(1, 6, 15), // 1 day, 6 hours, 15 minutes ago
    canViewOwnReports: true,
    canEditInventory: true,
    activityLog: [
      {
        timestamp: getDynamicDate(1, 6, 15), // 1 day, 6 hours, 15 minutes ago
        action: 'Updated inventory counts'
      }
    ]
  },
  {
    id: 'user9',
    firstName: 'James',
    lastName: 'Anderson',
    name: 'James Anderson',
    email: 'james.anderson@eatlypos.com',
    role: 'Regional Manager',
    avatar: 'https://placehold.co/100x100?text=JA',
    branches: ['2', '3'],
    region: 'North',
    status: 'active',
    phone: '+1 (555) 890-1234',
    lastActive: getDynamicDate(0, 1, 45), // 1 hour, 45 minutes ago
    canViewOwnReports: false,
    canEditInventory: true,
    activityLog: [
      {
        timestamp: getDynamicDate(0, 1, 45), // 1 hour, 45 minutes ago
        action: 'Reviewed regional reports'
      }
    ]
  },
  {
    id: 'user10',
    firstName: 'Olivia',
    lastName: 'Martinez',
    name: 'Olivia Martinez',
    email: 'olivia.martinez@eatlypos.com',
    role: 'Cashier',
    avatar: 'https://placehold.co/100x100?text=OM',
    branches: ['3'],
    status: 'inactive',
    phone: '+1 (555) 901-2345',
    lastActive: getDynamicDate(10, 2, 30), // 10 days, 2 hours, 30 minutes ago
    canViewOwnReports: true,
    canEditInventory: false,
    activityLog: [
      {
        timestamp: getDynamicDate(10, 2, 30), // 10 days, 2 hours, 30 minutes ago
        action: 'Processed 5 orders'
      }
    ]
  },
  {
    id: 'user11',
    firstName: 'Daniel',
    lastName: 'Clark',
    name: 'Daniel Clark',
    email: 'daniel.clark@eatlypos.com',
    role: 'Admin',
    avatar: 'https://placehold.co/100x100?text=DC',
    branches: ['1', '2', '3'],
    status: 'active',
    phone: '+1 (555) 012-3456',
    lastActive: getDynamicDate(0, 0, 5), // 5 minutes ago
    canViewOwnReports: false,
    canEditInventory: true,
    activityLog: [
      {
        timestamp: getDynamicDate(0, 0, 5), // 5 minutes ago
        action: 'System maintenance'
      }
    ]
  },
  {
    id: 'user12',
    firstName: 'Sophia',
    lastName: 'Lee',
    name: 'Sophia Lee',
    email: 'sophia.lee@eatlypos.com',
    role: 'Inventory Specialist',
    avatar: 'https://placehold.co/100x100?text=SL',
    branches: ['2'],
    status: 'active',
    phone: '+1 (555) 123-4567',
    lastActive: getDynamicDate(2, 2, 0), // 2 days, 2 hours ago
    canViewOwnReports: true,
    canEditInventory: true,
    activityLog: [
      {
        timestamp: getDynamicDate(2, 2, 0), // 2 days, 2 hours ago
        action: 'Stock reconciliation'
      }
    ]
  },
  {
    id: 'user13',
    firstName: 'William',
    lastName: 'Harris',
    name: 'William Harris',
    email: 'william.harris@eatlypos.com',
    role: 'Branch Manager',
    avatar: 'https://placehold.co/100x100?text=WH',
    branches: ['4'],
    status: 'active',
    phone: '+1 (555) 234-5678',
    lastActive: getDynamicDate(0, 5, 30), // 5 hours, 30 minutes ago
    canViewOwnReports: false,
    canEditInventory: true,
    activityLog: [
      {
        timestamp: getDynamicDate(0, 5, 30), // 5 hours, 30 minutes ago
        action: 'Approved purchase order'
      }
    ]
  },
  {
    id: 'user14',
    firstName: 'Victoria',
    lastName: 'Wright',
    name: 'Victoria Wright',
    email: 'victoria.wright@eatlypos.com',
    role: 'Cashier',
    avatar: 'https://placehold.co/100x100?text=VW',
    branches: ['1'],
    status: 'active',
    phone: '+1 (555) 345-6789',
    lastActive: getDynamicDate(1, 1, 15), // 1 day, 1 hour, 15 minutes ago
    canViewOwnReports: true,
    canEditInventory: false,
    activityLog: [
      {
        timestamp: getDynamicDate(1, 1, 15), // 1 day, 1 hour, 15 minutes ago
        action: 'Processed 10 orders'
      }
    ]
  },
  {
    id: 'user15',
    firstName: 'Benjamin',
    lastName: 'Adams',
    name: 'Benjamin Adams',
    email: 'benjamin.adams@eatlypos.com',
    role: 'Regional Manager',
    avatar: 'https://placehold.co/100x100?text=BA',
    branches: ['3', '4'],
    region: 'South',
    status: 'active',
    phone: '+1 (555) 456-7890',
    lastActive: getDynamicDate(0, 6, 25), // 6 hours, 25 minutes ago
    canViewOwnReports: false,
    canEditInventory: true,
    activityLog: [
      {
        timestamp: getDynamicDate(0, 6, 25), // 6 hours, 25 minutes ago
        action: 'Created performance report'
      }
    ]
  }
]; 