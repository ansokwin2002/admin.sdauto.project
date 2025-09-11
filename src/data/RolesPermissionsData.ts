export interface Permission {
  id: string;
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  accessScope: 'HQ' | 'Region' | 'Branch';
  assignedUsers: number;
  permissions: Permission[];
}

// Module names for permissions
export const moduleNames = [
  'Dashboard',
  'Orders',
  'Menu Management',
  'Inventory',
  'Purchasing',
  'Waste Management',
  'Staff Management',
  'Customer Management',
  'Loyalty Program',
  'Reports',
  'Admin Settings'
];

// Mock roles data
export const mockRoles: Role[] = [
  {
    id: '1',
    name: 'System Administrator',
    description: 'Full access to all system features and functionality',
    accessScope: 'HQ',
    assignedUsers: 2,
    permissions: moduleNames.map(module => ({
      id: `${module.toLowerCase().replace(/\s/g, '-')}-admin`,
      module,
      view: true,
      create: true,
      edit: true,
      delete: true
    }))
  },
  {
    id: '2',
    name: 'Branch Manager',
    description: 'Manages all aspects of branch operations',
    accessScope: 'Branch',
    assignedUsers: 5,
    permissions: moduleNames.map(module => ({
      id: `${module.toLowerCase().replace(/\s/g, '-')}-manager`,
      module,
      view: true,
      create: ['Admin Settings', 'Reports'].includes(module) ? false : true,
      edit: ['Admin Settings'].includes(module) ? false : true,
      delete: ['Admin Settings', 'Reports', 'Staff Management'].includes(module) ? false : true
    }))
  },
  {
    id: '3',
    name: 'Cashier',
    description: 'Handles customer transactions and orders',
    accessScope: 'Branch',
    assignedUsers: 12,
    permissions: moduleNames.map(module => ({
      id: `${module.toLowerCase().replace(/\s/g, '-')}-cashier`,
      module,
      view: ['Orders', 'Menu Management', 'Customer Management'].includes(module),
      create: ['Orders'].includes(module),
      edit: ['Orders'].includes(module),
      delete: false
    }))
  },
  {
    id: '4',
    name: 'Kitchen Staff',
    description: 'Manages food preparation and inventory',
    accessScope: 'Branch',
    assignedUsers: 8,
    permissions: moduleNames.map(module => ({
      id: `${module.toLowerCase().replace(/\s/g, '-')}-kitchen`,
      module,
      view: ['Orders', 'Inventory', 'Waste Management', 'Menu Management'].includes(module),
      create: ['Waste Management'].includes(module),
      edit: false,
      delete: false
    }))
  },
  {
    id: '5',
    name: 'Regional Manager',
    description: 'Oversees operations across multiple branches in a region',
    accessScope: 'Region',
    assignedUsers: 3,
    permissions: moduleNames.map(module => ({
      id: `${module.toLowerCase().replace(/\s/g, '-')}-regional`,
      module,
      view: true,
      create: ['Admin Settings'].includes(module) ? false : true,
      edit: ['Admin Settings'].includes(module) ? false : true,
      delete: ['Admin Settings'].includes(module) ? false : true
    }))
  }
]; 