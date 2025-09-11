'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  Flex, 
  Grid, 
  Heading, 
  Table, 
  Text, 
  Tabs, 
  Badge, 
  TextField, 
  TextArea, 
  Select,
  Separator,
  AlertDialog
} from '@radix-ui/themes';
import { CheckSquare, Save, FileText, Truck, DollarSign, X, Plus, Trash2 } from 'lucide-react';
import { PurchaseOrder, PurchaseOrderItem, ReceivingLog } from '@/data/PurchaseOrderData';
import { mockSuppliers } from '@/data/SupplierData';
import { formatDate } from '@/utilities';
import SelectSupplierDialog from './SelectSupplierDialog';
import DateInput from '@/components/common/DateInput';
import AddItemDialog from './AddItemDialog';
import AddReceivingLog from './AddReceivingLog';
import SearchableSelect from '@/components/common/SearchableSelect';
import { organization } from '@/data/CommonData';
import { PageHeading } from '@/components/common/PageHeading';
import CardHeading from '@/components/common/CardHeading';

interface PurchaseOrderFormProps {
  editingItem?: PurchaseOrder | null;
  onSubmit: (formData: Partial<PurchaseOrder>) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

export default function PurchaseOrderForm({ editingItem, onSubmit, onCancel, onDelete }: PurchaseOrderFormProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [editForm, setEditForm] = useState<Partial<PurchaseOrder>>({});
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<PurchaseOrderItem | null>(null);
  const [isAddReceivingLogOpen, setIsAddReceivingLogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  // Date states
  const [orderDate, setOrderDate] = useState<Date | undefined>(undefined);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<Date | undefined>(undefined);
  const [datePaid, setDatePaid] = useState<Date | undefined>(undefined);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const isNewPO = !editingItem;
  const isEditable = isNewPO || editingItem?.orderStatus === 'Draft';
  
  useEffect(() => {
    if (isNewPO) {
      const today = new Date();
      const newPO: Partial<PurchaseOrder> = {
        dateCreated: today.toISOString().slice(0, 10),
        orderStatus: 'Draft',
        paymentStatus: null,
        orderedBy: 'Current User',
        organizationId: '',
        supplierDetails: {
          contactName: '',
          contactEmail: '',
          contactPhone: '',
          address: ''
        },
        orderItems: [],
        totalOrderValue: 0,
        supplierConfirmed: false
      };
      setEditForm(newPO);
      setOrderDate(today);
    } else if (editingItem) {
      setEditForm(editingItem);
      
      if (editingItem.dateCreated) {
        setOrderDate(new Date(editingItem.dateCreated));
      }
      
      if (editingItem.expectedDeliveryDate) {
        setExpectedDeliveryDate(new Date(editingItem.expectedDeliveryDate));
      }
      
      if (editingItem.paymentDetails?.datePaid) {
        setDatePaid(new Date(editingItem.paymentDetails.datePaid));
      }
    }
  }, [editingItem, isNewPO]);
  
  const handleSave = () => {
    if (isEditable) {
      onSubmit(editForm);
    }
  };
  
  const handleSupplierSelect = (supplierId: string) => {
    const supplier = mockSuppliers.find(s => s.id === supplierId);
    if (supplier) {
      setEditForm({
        ...editForm,
        supplierName: supplier.name,
        supplierId: supplier.id,
        supplierDetails: {
          contactName: supplier.contactPerson,
          contactEmail: supplier.email,
          contactPhone: supplier.phone,
          address: supplier.address
        }
      });
      setIsSupplierDialogOpen(false);
    }
  };
  
  const handleAddItem = (item: PurchaseOrderItem) => {
    const currentItems = editForm.orderItems || [];
    const newItems = [...currentItems, item];
    const newTotalValue = newItems.reduce((total, item) => total + (item.quantityOrdered * item.unitPrice), 0);
    
    setEditForm({
      ...editForm,
      orderItems: newItems,
      totalOrderValue: newTotalValue
    });
  };

  const handleEditItem = (item: PurchaseOrderItem) => {
    setItemToEdit(item);
    setIsAddItemDialogOpen(true);
  };

  const handleDeleteItem = (itemId: string) => {
    const currentItems = editForm.orderItems || [];
    const newItems = currentItems.filter(item => item.id !== itemId);
    const newTotalValue = newItems.reduce((total, item) => total + (item.quantityOrdered * item.unitPrice), 0);
    
    setEditForm({
      ...editForm,
      orderItems: newItems,
      totalOrderValue: newTotalValue
    });
  };
  
  const getStatusColor = (status: PurchaseOrder['orderStatus']) => {
    switch (status) {
      case 'Draft': return 'gray';
      case 'Pending': return 'amber';
      case 'In Progress': return 'blue';
      case 'Delivered': return 'green';
      case 'Partially Received': return 'purple';
      case 'Canceled': return 'red';
      default: return 'gray';
    }
  };
  
  const getPaymentStatusColor = (status: PurchaseOrder['paymentStatus']) => {
    switch (status) {
      case 'Paid': return 'green';
      case 'Partially Paid': return 'amber';
      case 'Unpaid': return 'red';
      default: return 'gray';
    }
  };
  
  const handleAddReceivingLog = (log: ReceivingLog) => {
    const currentLogs = editForm.receivingLogs || [];
    const newLogs = [...currentLogs, log];
    
    // Also update the received quantity for the corresponding item
    const updatedItems = editForm.orderItems?.map(item => {
      if (item.itemName === log.itemName) {
        return {
          ...item,
          receivedQuantity: (item.receivedQuantity || 0) + log.quantityReceived
        };
      }
      return item;
    }) || [];
    
    setEditForm({
      ...editForm,
      receivingLogs: newLogs,
      orderItems: updatedItems,
      // If all items are fully received, update order status
      orderStatus: isAllItemsReceived(updatedItems) ? 'Delivered' : 'Partially Received'
    });
  };
  
  const isAllItemsReceived = (items: PurchaseOrderItem[]) => {
    return items.every(item => item.receivedQuantity >= item.quantityOrdered);
  };
  
  const poData = editForm;

  const handleDelete = () => {
    if (editingItem?.id && onDelete) {
      onDelete(editingItem.id);
      setShowDeleteDialog(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Flex 
        direction={{ initial: "column", sm: "row" }} 
        justify="between" 
        align={{ initial: "stretch", sm: "center" }}
        gap={{ initial: "4", sm: "0" }}
        mb="4"
      >
        <PageHeading
          title={isNewPO ? 'New Purchase Order' : poData?.poNumber} 
          description={isNewPO ? 'Create a new purchase order' : 'View/edit purchase order'}
          showBackButton={true}
          onBackClick={onCancel}
          noMarginBottom
          badge={
            <>
              {poData?.orderStatus && (
                <Badge color={getStatusColor(poData.orderStatus)}>{poData.orderStatus}</Badge>
              )}
              {poData?.paymentStatus && (
                <Badge color={getPaymentStatusColor(poData.paymentStatus)}>{poData.paymentStatus}</Badge>
              )}
              {poData?.organizationId && (
                <Badge color="blue">
                  {organization.find(org => org.id === poData.organizationId)?.name || ''}
                </Badge>
              )}
            </>
          }
        />
        {!isEditable && (
          <Text size="2" color="gray">This purchase order cannot be edited</Text>
        )}
      </Flex>
      
      {/* Tabs */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="overflow-x-auto">
          <Tabs.Trigger value="general">
            <FileText size={16} className="mr-2" />
            General Information
          </Tabs.Trigger>
          <Tabs.Trigger value="items">
            <CheckSquare size={16} className="mr-2" />
            Order Items
          </Tabs.Trigger>
          {!isEditable && (
            <>
              <Tabs.Trigger value="status">
                <Truck size={16} className="mr-2" />
                Order Status & Tracking
              </Tabs.Trigger>
              <Tabs.Trigger value="payment">
                <DollarSign size={16} className="mr-2" />
                Payment & Invoicing
              </Tabs.Trigger>
            </>
          )}
        </Tabs.List>
        
        <Box mt="4">
          {/* General Information Tab */}
          {activeTab === 'general' && (
            <Card size="3">
              <CardHeading title="Order Information" mb="4"/>
              <Grid columns={{ initial: "1", sm: "2" }} gap="4">
                <Grid columns={{ initial: "1", sm: "2" }} gap="4">
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">PO Number</Text>
                    <Text>{isNewPO ? 'Auto-generated' : poData?.poNumber}</Text>
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Ordered By</Text>
                    <Text>{poData?.orderedBy}</Text>
                  </Flex>
                </Grid>
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Order Date</Text>
                  {isEditable ? (
                    <DateInput
                      value={orderDate}
                      onChange={(date) => {
                        setOrderDate(date);
                        if (date) {
                          setEditForm({
                            ...editForm,
                            dateCreated: date.toISOString().slice(0, 10)
                          });
                        }
                      }}
                      placeholder="Select order date"
                    />
                  ) : (
                    <Text>{orderDate ? formatDate(orderDate) : "Not set"}</Text>
                  )}
                </Flex>
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Ordered For</Text>
                  <SearchableSelect
                    options={organization.map(org => ({ value: org.id, label: org.name }))}
                    value={editForm.organizationId || ''}
                    onChange={(value) => {
                      if (!isEditable) return;
                      setEditForm({
                        ...editForm,
                        organizationId: value as string
                      });
                    }}
                    placeholder="Select organization or branch"
                    isDisabled={!isEditable}
                  />
                </Flex>
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Expected Delivery Date</Text>
                  {isEditable ? (
                    <DateInput
                      value={expectedDeliveryDate}
                      onChange={(date) => {
                        setExpectedDeliveryDate(date);
                        if (date) {
                          setEditForm({
                            ...editForm,
                            expectedDeliveryDate: date.toISOString().slice(0, 10)
                          });
                        }
                      }}
                      placeholder="Select delivery date"
                      minDate={new Date()}
                    />
                  ) : (
                    <Text>{expectedDeliveryDate ? formatDate(expectedDeliveryDate) : "Not set"}</Text>
                  )}
                </Flex>
              </Grid>
              
              <Separator size="4" my="4" />
              
              <CardHeading title="Supplier Information" mb="4"/>
              <Grid columns={{ initial: "1", sm: "2" }} gap="4" width="auto">
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Supplier</Text>
                  <Flex 
                    direction={{ initial: "column", sm: "row" }}
                    gap={{ initial: "2", sm: "2" }}
                  >
                    <TextField.Root 
                      value={editForm.supplierName || ''}
                      readOnly
                      placeholder="Select a supplier"
                      className="w-full"
                    />
                    <Button variant="soft" onClick={() => setIsSupplierDialogOpen(true)} disabled={!isEditable}>
                      Select Supplier
                    </Button>
                  </Flex>
                </Flex>
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Contact Name</Text>
                  <TextField.Root 
                    value={editForm.supplierDetails?.contactName || ''}
                    readOnly
                  />
                </Flex>
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Contact Email</Text>
                  <TextField.Root 
                    value={editForm.supplierDetails?.contactEmail || ''}
                    readOnly
                  />
                </Flex>
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Contact Phone</Text>
                  <TextField.Root 
                    value={editForm.supplierDetails?.contactPhone || ''}
                    readOnly
                  />
                </Flex>
                <Flex direction="column" gap="1" gridColumn={{ initial: "1", sm: "1 / 3" }}>
                  <Text as="label" size="2" weight="medium">Address</Text>
                  <TextArea 
                    value={editForm.supplierDetails?.address || ''}
                    readOnly
                  />
                </Flex>
              </Grid>
              
              <Separator size="4" my="4" />
              
              <CardHeading title="Notes" mb="4"/>
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Notes</Text>
                <TextArea 
                  placeholder="Any special instructions or notes for this order"
                  value={editForm.notes || ''}
                  onChange={(e) => {
                    if (!isEditable) return;
                    setEditForm({...editForm, notes: e.target.value});
                  }}
                  readOnly={!isEditable}
                />
              </Flex>
            </Card>
          )}
          
          {/* Order Items Tab */}
          {activeTab === 'items' && (
            <Card size="3">
              <Flex 
                direction={{ initial: "column", sm: "row" }}
                justify="between" 
                align={{ initial: "stretch", sm: "center" }}
                gap={{ initial: "3", sm: "0" }}
                mb="3"
              >
                <CardHeading title="Order Items" mb="0"/>
                <Button 
                  size="2"
                  onClick={() => setIsAddItemDialogOpen(true)}
                  disabled={!isEditable}
                >
                  <Plus size={16} />
                  Add Item
                </Button>
              </Flex>
              <div className="overflow-x-auto">
                <Table.Root variant="surface">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>Item Name</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell align="right">Quantity</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell align="right">Unit Price</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell align="right">Sub Total</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell align="right">Received</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Stock Location</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {editForm.orderItems && editForm.orderItems.length > 0 ? (
                      editForm.orderItems.map((item) => (
                        <Table.Row key={item.id}>
                          <Table.Cell>{item.itemName}</Table.Cell>
                          <Table.Cell align="right">{item.quantityOrdered}</Table.Cell>
                          <Table.Cell align="right">${item.unitPrice.toFixed(2)}</Table.Cell>
                          <Table.Cell align="right">${(item.quantityOrdered * item.unitPrice).toFixed(2)}</Table.Cell>
                          <Table.Cell align="right">{item.receivedQuantity || 0}</Table.Cell>
                          <Table.Cell>{item.stockLocation || 'Not specified'}</Table.Cell>
                          <Table.Cell>
                            {isEditable ? (
                              <Flex gap="1">
                                <Button 
                                  variant="soft" 
                                  size="1"
                                  onClick={() => handleEditItem(item)}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="soft" 
                                  size="1" 
                                  color="red"
                                  onClick={() => handleDeleteItem(item.id)}
                                >
                                  Delete
                                </Button>
                              </Flex>
                            ) : (
                              <Text size="1" color="gray">No actions available</Text>
                            )}
                          </Table.Cell>
                        </Table.Row>
                      ))
                    ) : (
                      <Table.Row>
                        <Table.Cell colSpan={7}>
                          <Text align="center" className="py-3">No items in this order</Text>
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table.Root>
              </div>
              <Flex justify="end" mt="4">
                <Box p="2" style={{ textAlign: 'right' }}>
                  <Text weight="bold">Total Order Value: ${editForm.totalOrderValue?.toFixed(2) || '0.00'}</Text>
                </Box>
              </Flex>
            </Card>
          )}
          
          {/* Order Status Tab */}
          {activeTab === 'status' && (
            <Box className="space-y-4">
              <Card size="3">
                <CardHeading title="Order Status & Tracking"/>
                
                <Grid columns={{ initial: "1", sm: "2" }} gap="4" width="auto" mb="4">
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Current Status</Text>
                    <Select.Root 
                      value={editForm.orderStatus}
                      onValueChange={(value) => {
                        if (!isEditable) return;
                        setEditForm({
                          ...editForm, 
                          orderStatus: value as PurchaseOrder['orderStatus']
                        });
                      }}
                      disabled={!isEditable}
                    >
                      <Select.Trigger />
                      <Select.Content>
                        <Select.Item value="Draft">Draft</Select.Item>
                        <Select.Item value="Pending">Pending</Select.Item>
                        <Select.Item value="In Progress">In Progress</Select.Item>
                        <Select.Item value="Delivered">Delivered</Select.Item>
                        <Select.Item value="Partially Received">Partially Received</Select.Item>
                        <Select.Item value="Canceled">Canceled</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Flex>
                  
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Supplier Confirmation</Text>
                    <Select.Root 
                      value={editForm.supplierConfirmed ? 'yes' : 'no'}
                      onValueChange={(value) => {
                        if (!isEditable) return;
                        setEditForm({
                          ...editForm, 
                          supplierConfirmed: value === 'yes'
                        });
                      }}
                      disabled={!isEditable}
                    >
                      <Select.Trigger />
                      <Select.Content>
                        <Select.Item value="yes">Confirmed</Select.Item>
                        <Select.Item value="no">Not Confirmed</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Flex>
                </Grid>
                
                <Grid columns={{ initial: "1", sm: "2" }} gap="4" width="auto">
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Tracking Number</Text>
                    <TextField.Root 
                      value={editForm.shippingDetails?.trackingNumber || ''}
                      onChange={(e) => {
                        if (!isEditable) return;
                        setEditForm({
                          ...editForm, 
                          shippingDetails: {
                            ...editForm.shippingDetails || {},
                            trackingNumber: e.target.value
                          }
                        });
                      }}
                      readOnly={!isEditable}
                    />
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Estimated Delivery Time (days)</Text>
                    <TextField.Root 
                      type="number"
                      min="1"
                      value={editForm.shippingDetails?.estimatedDeliveryTime || ''}
                      onChange={(e) => {
                        if (!isEditable) return;
                        setEditForm({
                          ...editForm, 
                          shippingDetails: {
                            ...editForm.shippingDetails || {},
                            estimatedDeliveryTime: e.target.value
                          }
                        });
                      }}
                      readOnly={!isEditable}
                    />
                  </Flex>
                </Grid>
              </Card>
              <Card size="3">
                {/* Receiving Logs */}
                <CardHeading title="Receiving Logs" mb="4"/>
                
                <div className="overflow-x-auto">
                  <Table.Root variant="surface">
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeaderCell>Item Name</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>SKU</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Qty. Received</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Expiry Date</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Storage Location</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Received By</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Notes</Table.ColumnHeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {editForm.receivingLogs && editForm.receivingLogs.length > 0 ? (
                        editForm.receivingLogs.map((log) => (
                          <Table.Row key={log.id}>
                            <Table.Cell>{log.itemName}</Table.Cell>
                            <Table.Cell>{log.itemSku}</Table.Cell>
                            <Table.Cell>{log.quantityReceived}</Table.Cell>
                            <Table.Cell>{log.expiryDate ? formatDate(new Date(log.expiryDate)) : 'N/A'}</Table.Cell>
                            <Table.Cell>{log.storageLocation || 'N/A'}</Table.Cell>
                            <Table.Cell>{log.receivedBy}</Table.Cell>
                            <Table.Cell>{formatDate(new Date(log.date))}</Table.Cell>
                            <Table.Cell>{log.notes || '-'}</Table.Cell>
                          </Table.Row>
                        ))
                      ) : (
                        <Table.Row>
                          <Table.Cell colSpan={8}>
                            <Text align="center" className="py-3">No receiving logs recorded</Text>
                          </Table.Cell>
                        </Table.Row>
                      )}
                    </Table.Body>
                  </Table.Root>
                </div>
                
                {(editForm.orderStatus === 'In Progress' || editForm.orderStatus === 'Partially Received') && (
                  <Button 
                    mt="3" 
                    variant="soft" 
                    onClick={() => setIsAddReceivingLogOpen(true)}
                    disabled={!isEditable && !(editForm.orderStatus === 'In Progress' || editForm.orderStatus === 'Partially Received')}
                  >
                    Add Receiving Log
                  </Button>
                )}
              </Card>
            </Box>
          )}
          
          {/* Payment Tab */}
          {activeTab === 'payment' && (
            <Card size="3">
              <CardHeading title="Payment & Invoicing" mb="4"/>
              
              <Grid columns={{ initial: "1", sm: "2" }} gap="4" width="auto">
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Total Order Cost</Text>
                  <Text size="4" weight="bold">${editForm.totalOrderValue?.toFixed(2) || '0.00'}</Text>
                </Flex>
                
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Payment Status</Text>
                  <Select.Root 
                    value={editForm.paymentStatus}
                    onValueChange={(value) => {
                      if (!isEditable) return;
                      setEditForm({
                        ...editForm, 
                        paymentStatus: value as PurchaseOrder['paymentStatus']
                      });
                    }}
                    disabled={!isEditable}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Item value="Paid">Paid</Select.Item>
                      <Select.Item value="Partially Paid">Partially Paid</Select.Item>
                      <Select.Item value="Unpaid">Unpaid</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Flex>
                
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Payment Terms</Text>
                  <Select.Root 
                    value={editForm.paymentDetails?.paymentTerms}
                    onValueChange={(value) => {
                      if (!isEditable) return;
                      setEditForm({
                        ...editForm, 
                        paymentDetails: {
                          ...editForm.paymentDetails || { paymentTerms: '' },
                          paymentTerms: value
                        }
                      });
                    }}
                    disabled={!isEditable}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Item value="Due on delivery">Due on delivery</Select.Item>
                      <Select.Item value="Net 15">Net 15</Select.Item>
                      <Select.Item value="Net 30">Net 30</Select.Item>
                      <Select.Item value="Net 45">Net 45</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Flex>
                
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Invoice Number</Text>
                  <TextField.Root 
                    value={editForm.paymentDetails?.invoiceNumber || ''}
                    onChange={(e) => {
                      if (!isEditable) return;
                      setEditForm({
                        ...editForm, 
                        paymentDetails: {
                          ...editForm.paymentDetails || { paymentTerms: '' },
                          invoiceNumber: e.target.value
                        }
                      });
                    }}
                    readOnly={!isEditable}
                  />
                </Flex>
                
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Payment Method</Text>
                  <Select.Root 
                    value={editForm.paymentDetails?.paymentMethod}
                    onValueChange={(value) => {
                      if (!isEditable) return;
                      setEditForm({
                        ...editForm, 
                        paymentDetails: {
                          ...editForm.paymentDetails || { paymentTerms: '' },
                          paymentMethod: value as PurchaseOrder['paymentDetails']['paymentMethod']
                        }
                      });
                    }}
                    disabled={!isEditable}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Item value="Credit Card">Credit Card</Select.Item>
                      <Select.Item value="Bank Transfer">Bank Transfer</Select.Item>
                      <Select.Item value="Cash on Delivery">Cash on Delivery</Select.Item>
                      <Select.Item value="Check">Check</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Flex>
                
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Date Paid</Text>
                  {isEditable ? (
                    <DateInput
                      value={datePaid}
                      onChange={(date) => {
                        setDatePaid(date);
                        if (date) {
                          setEditForm({
                            ...editForm,
                            paymentDetails: {
                              ...editForm.paymentDetails || { paymentTerms: '' },
                              datePaid: date.toISOString().slice(0, 10)
                            }
                          });
                        }
                      }}
                      placeholder="Select date paid"
                      maxDate={new Date()}
                    />
                  ) : (
                    <Text>{datePaid ? formatDate(datePaid) : "Not set"}</Text>
                  )}
                </Flex>
              </Grid>
            </Card>
          )}
        </Box>
      </Tabs.Root>
      
      <Flex 
        direction={{ initial: "column", sm: "row" }}
        justify="between" 
        gap={{ initial: "3", sm: "4" }}
        mt="4"
      >
        <Flex 
          direction={{ initial: "column", sm: "row" }}
          gap={{ initial: "3", sm: "4" }}
        >
          {isEditable ? (
            <>
              <Button onClick={handleSave} color="green">
                <Save size={16} /> {isNewPO ? 'Create Purchase Order' : 'Save Changes'}
              </Button>
              <Button variant="soft" color="gray" onClick={onCancel}>
                <X size={16} />
                Cancel
              </Button>
            </>
          ) : null}
        </Flex>
        {isEditable && editingItem?.orderStatus === 'Draft' && (
          <Button 
            variant="soft" 
            color="red" 
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 size={16} />
            Delete
          </Button>
        )}
      </Flex>

      <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialog.Content>
          <AlertDialog.Title>Delete Purchase Order</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to delete this purchase order? This action cannot be undone.
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
      
      <SelectSupplierDialog
        open={isSupplierDialogOpen}
        onOpenChange={setIsSupplierDialogOpen}
        onSelectSupplier={handleSupplierSelect}
      />
      
      <AddItemDialog
        open={isAddItemDialogOpen}
        onOpenChange={(open) => {
          setIsAddItemDialogOpen(open);
          if (!open) setItemToEdit(null);
        }}
        onAddItem={handleAddItem}
        initialItem={itemToEdit}
      />
      
      <AddReceivingLog
        open={isAddReceivingLogOpen}
        onOpenChange={setIsAddReceivingLogOpen}
        onAddLog={handleAddReceivingLog}
        availableItems={editForm.orderItems || []}
      />
    </Box>
  );
} 