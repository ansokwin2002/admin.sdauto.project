import { User } from '@/types/user';

// Types
export interface Branch {
  id: string;
  name: string;
  code: string;
  region: string;
  status: 'active' | 'inactive';
  manager?: User;
  regionalManager?: User;
  address: string;
  city: string;
  phone: string;
  services: {
    dineIn: boolean;
    takeaway: boolean;
    delivery: boolean;
  };
  businessHours: {
    day: string;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
  }[];
  settings: {
    inventoryTracking: boolean;
    allowLocalMenuOverride: boolean;
    defaultPrinter: string;
    taxRules: string;
  };
}

export const regions = [
  'North',
  'South',
  'East',
  'West',
  'Central',
  'Suburban',
  'Downtown',
  'Airport',
  'Mall',
  'Highway'
];

// Mock branch data
export const mockBranches: Branch[] = [
  {
    id: '1',
    name: 'Downtown Main',
    code: 'DTM-001',
    region: 'Downtown',
    status: 'active',
    manager: {
      id: 'u1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      role: 'Branch Manager'
    },
    regionalManager: {
      id: 'u5',
      name: 'Linda Chen',
      email: 'linda.chen@example.com',
      role: 'Regional Director'
    },
    address: '123 Main Street',
    city: 'Metropolis',
    phone: '(555) 123-4567',
    services: {
      dineIn: true,
      takeaway: true,
      delivery: true
    },
    businessHours: [
      { day: 'Monday', isOpen: true, openTime: '08:00', closeTime: '22:00' },
      { day: 'Tuesday', isOpen: true, openTime: '08:00', closeTime: '22:00' },
      { day: 'Wednesday', isOpen: true, openTime: '08:00', closeTime: '22:00' },
      { day: 'Thursday', isOpen: true, openTime: '08:00', closeTime: '22:00' },
      { day: 'Friday', isOpen: true, openTime: '08:00', closeTime: '23:00' },
      { day: 'Saturday', isOpen: true, openTime: '09:00', closeTime: '23:00' },
      { day: 'Sunday', isOpen: true, openTime: '10:00', closeTime: '21:00' }
    ],
    settings: {
      inventoryTracking: true,
      allowLocalMenuOverride: false,
      defaultPrinter: 'Kitchen Printer 1',
      taxRules: 'Standard City Tax'
    }
  },
  {
    id: '2',
    name: 'Westside Plaza',
    code: 'WSP-002',
    region: 'West',
    status: 'active',
    manager: {
      id: 'u2',
      name: 'Emma Johnson',
      email: 'emma.johnson@example.com',
      role: 'Branch Manager'
    },
    regionalManager: {
      id: 'u5',
      name: 'Linda Chen',
      email: 'linda.chen@example.com',
      role: 'Regional Director'
    },
    address: '456 West Avenue',
    city: 'Metropolis',
    phone: '(555) 234-5678',
    services: {
      dineIn: true,
      takeaway: true,
      delivery: false
    },
    businessHours: [
      { day: 'Monday', isOpen: true, openTime: '10:00', closeTime: '21:00' },
      { day: 'Tuesday', isOpen: true, openTime: '10:00', closeTime: '21:00' },
      { day: 'Wednesday', isOpen: true, openTime: '10:00', closeTime: '21:00' },
      { day: 'Thursday', isOpen: true, openTime: '10:00', closeTime: '21:00' },
      { day: 'Friday', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { day: 'Saturday', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { day: 'Sunday', isOpen: true, openTime: '11:00', closeTime: '20:00' }
    ],
    settings: {
      inventoryTracking: true,
      allowLocalMenuOverride: true,
      defaultPrinter: 'Front Desk Printer',
      taxRules: 'Standard City Tax'
    }
  },
  {
    id: '3',
    name: 'Eastside Corner',
    code: 'ESC-003',
    region: 'East',
    status: 'active',
    manager: {
      id: 'u3',
      name: 'Michael Davis',
      email: 'michael.davis@example.com',
      role: 'Branch Manager'
    },
    regionalManager: {
      id: 'u6',
      name: 'Robert Patel',
      email: 'robert.patel@example.com',
      role: 'Regional Director'
    },
    address: '789 East Boulevard',
    city: 'Metropolis',
    phone: '(555) 345-6789',
    services: {
      dineIn: false,
      takeaway: true,
      delivery: true
    },
    businessHours: [
      { day: 'Monday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
      { day: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
      { day: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
      { day: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
      { day: 'Friday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
      { day: 'Saturday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
      { day: 'Sunday', isOpen: false, openTime: '', closeTime: '' }
    ],
    settings: {
      inventoryTracking: true,
      allowLocalMenuOverride: false,
      defaultPrinter: 'Kitchen Printer 1',
      taxRules: 'East District Tax Rate'
    }
  },
  {
    id: '4',
    name: 'Northside Mall',
    code: 'NSM-004',
    region: 'North',
    status: 'active',
    manager: {
      id: 'u4',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      role: 'Branch Manager'
    },
    regionalManager: {
      id: 'u6',
      name: 'Robert Patel',
      email: 'robert.patel@example.com',
      role: 'Regional Director'
    },
    address: '123 North Mall',
    city: 'Metropolis',
    phone: '(555) 456-7890',
    services: {
      dineIn: true,
      takeaway: true,
      delivery: false
    },
    businessHours: [
      { day: 'Monday', isOpen: true, openTime: '10:00', closeTime: '21:00' },
      { day: 'Tuesday', isOpen: true, openTime: '10:00', closeTime: '21:00' },
      { day: 'Wednesday', isOpen: true, openTime: '10:00', closeTime: '21:00' },
      { day: 'Thursday', isOpen: true, openTime: '10:00', closeTime: '21:00' },
      { day: 'Friday', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { day: 'Saturday', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { day: 'Sunday', isOpen: true, openTime: '11:00', closeTime: '20:00' }
    ],
    settings: {
      inventoryTracking: true,
      allowLocalMenuOverride: true,
      defaultPrinter: 'Mall Printer',
      taxRules: 'Mall Complex Tax'
    }
  },
  {
    id: '5',
    name: 'Airport Terminal',
    code: 'APT-005',
    region: 'Airport',
    status: 'inactive',
    manager: {
      id: 'u7',
      name: 'David Park',
      email: 'david.park@example.com',
      role: 'Branch Manager'
    },
    regionalManager: {
      id: 'u5',
      name: 'Linda Chen',
      email: 'linda.chen@example.com',
      role: 'Regional Director'
    },
    address: 'Terminal B, Airport Road',
    city: 'Metropolis',
    phone: '(555) 567-8901',
    services: {
      dineIn: true,
      takeaway: true,
      delivery: false
    },
    businessHours: [
      { day: 'Monday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
      { day: 'Tuesday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
      { day: 'Wednesday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
      { day: 'Thursday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
      { day: 'Friday', isOpen: true, openTime: '06:00', closeTime: '23:00' },
      { day: 'Saturday', isOpen: true, openTime: '06:00', closeTime: '23:00' },
      { day: 'Sunday', isOpen: true, openTime: '06:00', closeTime: '22:00' }
    ],
    settings: {
      inventoryTracking: false,
      allowLocalMenuOverride: false,
      defaultPrinter: 'Airport Printer',
      taxRules: 'Airport Tax Zone'
    }
  }
]; 