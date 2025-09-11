'use client';

import { useState, useEffect } from 'react';
import { Box, Flex, Text, Button, Tabs, Badge, AlertDialog } from '@radix-ui/themes';
import { CheckCircle, Save, XCircle, X, FileText, Clock, History, Trash2 } from 'lucide-react';
import { Supplier } from '@/types/inventory';
import SupplierMetricsPanel from '@/components/purchasing/supplier/SupplierMetricsPanel';
import SupplierGeneralInfo from '@/components/purchasing/supplier/SupplierGeneralInfo';
import SupplierOrderHistory from '@/components/purchasing/supplier/SupplierOrderHistory';
import SupplierBusinessHours from '@/components/purchasing/supplier/SupplierBusinessHours';
import { PageHeading } from '@/components/common/PageHeading';

// Define component props
interface SupplierDetailsProps {
  editingItem: Supplier | null;
  onSubmit: (supplier: Supplier) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

// Default blank supplier
const defaultNewSupplier: Supplier = {
  id: '',
  name: '',
  category: 'Vegetables',
  contactPerson: '',
  phone: '',
  email: '',
  address: '',
  lastOrderDate: new Date(),
  totalOrders: 0,
  active: true,
  averageDeliveryTime: 0,
  businessHours: [],
  notes: ''
};

export default function SupplierDetails({ editingItem, onSubmit, onCancel, onDelete }: SupplierDetailsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  // Determine if adding a new supplier
  const isNewSupplier = editingItem === null;
  
  // Initialize state based on props
  const [supplier, setSupplier] = useState<Supplier>(
    editingItem ? { ...editingItem } : defaultNewSupplier
  );
  const [activeTab, setActiveTab] = useState<string>('general');

  // Reset state if editingItem changes (e.g., navigating between edit pages)
  useEffect(() => {
    setSupplier(editingItem ? { ...editingItem } : defaultNewSupplier);
    setActiveTab('general');
  }, [editingItem]);

  const handleUpdate = (updates: Partial<Supplier>) => {
    setSupplier(current => ({ ...current, ...updates }));
  };

  const handleSave = () => {
    onSubmit(supplier);
  };

  const handleDelete = () => {
    if (supplier.id && onDelete) {
      onDelete(supplier.id);
      setShowDeleteDialog(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Flex justify="between" align="center" mb="4">
        <PageHeading 
          title={isNewSupplier ? "Add New Supplier" : supplier.name} 
          description={isNewSupplier ? "Add a new supplier to your list" : "View/edit supplier details"}
          noMarginBottom
          showBackButton={true}
          onBackClick={onCancel}
          badge={ !isNewSupplier && (supplier.active ? 
            <Badge color="green">
              <CheckCircle className="h-3 w-3" />
              Active
            </Badge> : 
            <Badge color="red">
              <XCircle className="h-3 w-3" />
              Inactive
            </Badge>
          )}
        />
      </Flex>
      
      {/* Supplier Metrics Panel */}
      {!isNewSupplier && <SupplierMetricsPanel supplier={supplier} />}
      
      {/* Tabs */}
      <Box mt="4">  
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Trigger value="general">
              <Flex gap="2" align="center">
                <FileText size={16} />
                <Text>General Information</Text>
              </Flex>
            </Tabs.Trigger>
            <Tabs.Trigger value="business-hours">
              <Flex gap="2" align="center">
                <Clock size={16} />
                <Text>Business Hours</Text>
              </Flex>
            </Tabs.Trigger>
            {!isNewSupplier && (
              <Tabs.Trigger value="orders">
                <Flex gap="2" align="center">
                  <History size={16} />
                  <Text>Order History</Text>
                </Flex>
              </Tabs.Trigger>
            )}
          </Tabs.List>
          
          <Box mt="4">
            {activeTab === 'general' && (
              <SupplierGeneralInfo supplier={supplier} onUpdate={handleUpdate} />
            )}
            
            {activeTab === 'business-hours' && (
              <SupplierBusinessHours 
                businessHours={supplier.businessHours || []} 
                onUpdate={(hours) => handleUpdate({ businessHours: hours })} 
              />
            )}
            
            {activeTab === 'orders' && !isNewSupplier && supplier.id && (
              <SupplierOrderHistory supplierId={supplier.id} />
            )}
          </Box>
        </Tabs.Root>
      </Box>

      <Flex justify="between" mt="4">
        <Flex gap="4">
          <Button color="green" onClick={handleSave}>
            <Save className="h-4 w-4" />
            {isNewSupplier ? "Add Supplier" : "Save Changes"}
          </Button>
          <Button variant="soft" color="gray" onClick={onCancel}>
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </Flex>
        {!isNewSupplier && (
          <Button 
            variant="soft" 
            color="red" 
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        )}
      </Flex>

      <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialog.Content>
          <AlertDialog.Title>Delete Supplier</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to delete this supplier? This action cannot be undone.
          </AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button variant="solid" color="red" onClick={handleDelete}>
                Delete
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Box>
  );
} 