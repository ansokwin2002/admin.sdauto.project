'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  TextField, 
  Button, 
  Flex, 
  Text, 
  Box, 
  TextArea, 
  Select, 
  IconButton,
  Table,
  Card
} from '@radix-ui/themes';
import { 
  X, 
  Save, 
  Plus, 
  Trash2,
  Inbox
} from 'lucide-react';
import { 
  StockRequest, 
  StockRequestItem, 
  StockRequestStatus, 
  getStockItemById 
} from '@/data/StockRequestData';
import { organization } from '@/data/CommonData';
import { mockStockItems } from '@/data/StockItemData';
import { formatDate } from '@/utilities';
import DateInput from '@/components/common/DateInput';

interface StockRequestFormProps {
  request: StockRequest | Omit<StockRequest, 'id'>;
  onSave?: (request: Omit<StockRequest, 'id'>) => void;
  readOnly: boolean;
  onCancel: () => void;
}

const StockRequestForm: React.FC<StockRequestFormProps> = ({
  request,
  onSave,
  readOnly,
  onCancel
}) => {
  const [requestNumber, setRequestNumber] = useState<string>('');
  const [date, setDate] = useState<Date | undefined | null>(new Date());
  const [originId, setOriginId] = useState<string>('');
  const [destinationId, setDestinationId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [status, setStatus] = useState<StockRequestStatus>('New');
  const [items, setItems] = useState<StockRequestItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (request) {
      setRequestNumber(request.requestNumber || '');
      setDate(request.date);
      setOriginId(request.originId);
      setDestinationId(request.destinationId);
      setNotes(request.notes || '');
      setStatus(request.status);
      setItems(request.items);
      setErrors({});
    } else {
      setDate(new Date());
      setOriginId('');
      setDestinationId('');
      setNotes('');
      setStatus('New');
      setItems([]);
      setErrors({});
    }
  }, [request]);

  const validateForm = (): boolean => {
    if (readOnly) return true;
    
    const newErrors: Record<string, string> = {};
    
    if (!date) newErrors.date = 'Date is required';
    if (!originId) newErrors.originId = 'Origin is required';
    if (!destinationId) newErrors.destinationId = 'Destination is required';
    if (originId === destinationId && originId !== '') {
      newErrors.destinationId = 'Origin and destination cannot be the same';
    }
    if (items.length === 0) newErrors.items = 'At least one item is required';
    
    items.forEach((item, index) => {
      if (!item.stockItemId) {
        newErrors[`item-${index}`] = 'Item selection is required';
      }
      if (item.quantity <= 0) {
        newErrors[`quantity-${index}`] = 'Quantity must be greater than 0';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm() || readOnly || !onSave || !date) return;
    
    onSave({
      requestNumber,
      date: date,
      originId,
      destinationId,
      notes,
      status,
      items
    });
  };

  const addItem = () => {
    if (readOnly) return;
    const newItem: StockRequestItem = {
      id: `item-${Date.now()}`,
      stockItemId: '',
      quantity: 1,
      unitOfMeasure: '',
      notes: ''
    };
    setItems([...items, newItem]);
    setErrors(prev => ({ ...prev, items: undefined }));
  };

  const updateItem = (index: number, field: keyof StockRequestItem, value: any) => {
    if (readOnly) return;
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    if (field === 'stockItemId') {
      const stockItem = getStockItemById(value);
      updatedItems[index].unitOfMeasure = stockItem ? stockItem.storageUnit : '';
      setErrors(prev => ({ ...prev, [`item-${index}`]: undefined }));
    }
    
    if (field === 'quantity' && value > 0) {
      setErrors(prev => ({ ...prev, [`quantity-${index}`]: undefined }));
    }
    
    setItems(updatedItems);
  };

  const removeItem = (index: number) => {
    if (readOnly) return;
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
    const newErrors = {...errors};
    delete newErrors[`item-${index}`];
    delete newErrors[`quantity-${index}`];
    setErrors(newErrors);
  };
  
  const getItemName = (stockItemId: string) => {
    const stockItem = getStockItemById(stockItemId);
    return stockItem ? stockItem.name : 'Select item';
  };

  const handleOriginChange = (value: string) => {
    if (readOnly) return;
    setOriginId(value);
    
    if (errors.originId === 'Origin is required' && value) {
      setErrors(prev => ({ ...prev, originId: undefined }));
    }
    
    if (errors.destinationId === 'Origin and destination cannot be the same' && value !== destinationId) {
      setErrors(prev => ({ ...prev, destinationId: undefined }));
    }
  };

  const handleDestinationChange = (value: string) => {
    if (readOnly) return;
    setDestinationId(value);
    
    if (errors.destinationId === 'Destination is required' && value) {
      setErrors(prev => ({ ...prev, destinationId: undefined }));
    }
    
    if (errors.destinationId === 'Origin and destination cannot be the same' && value !== originId) {
       setErrors(prev => ({ ...prev, destinationId: undefined }));
    }
  };

  return (
    <>
      <Card size="3" mb="4">
        <Flex direction="column" gap="4">
          <Flex gap="4">
            <Box className="flex-1">
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Request Number</Text>
                <TextField.Root 
                  placeholder="Auto-generated" 
                  value={requestNumber}
                  disabled
                />
              </Flex>
            </Box>
            
            <Box className="flex-1">
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Date</Text>
                <DateInput 
                  value={date}
                  onChange={(newDate) => !readOnly && setDate(newDate)}
                  disabled={readOnly}
                  placeholder="Select request date"
                />
                {errors.date && <Text size="1" color="red">{errors.date}</Text>}
              </Flex>
            </Box>
          </Flex>
          
          <Flex gap="4">
            <Box className="flex-1">
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Origin</Text>
                <Select.Root 
                  value={originId} 
                  onValueChange={handleOriginChange}
                  disabled={readOnly}
                >
                  <Select.Trigger 
                    placeholder="Select origin" 
                    className={errors.originId ? "border-red-500" : ""} 
                    disabled={readOnly}
                  />
                  <Select.Content>
                    {organization.map(org => (
                      <Select.Item key={org.id} value={org.id}>
                        {org.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                {errors.originId && <Text size="1" color="red">{errors.originId}</Text>}
              </Flex>
            </Box>
            
            <Box className="flex-1">
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Destination</Text>
                <Select.Root 
                  value={destinationId} 
                  onValueChange={handleDestinationChange}
                  disabled={readOnly}
                >
                  <Select.Trigger 
                    placeholder="Select destination" 
                    className={errors.destinationId ? "border-red-500" : ""} 
                    disabled={readOnly}
                  />
                  <Select.Content>
                    {organization.map(org => (
                      <Select.Item key={org.id} value={org.id}>
                        {org.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                {errors.destinationId && <Text size="1" color="red">{errors.destinationId}</Text>}
              </Flex>
            </Box>
          </Flex>
          
          <Box>
            <Flex justify="between" align="center" mb="2">
              <Text as="label" size="2" weight="medium">Items</Text>
              {!readOnly && (
                <Button size="1" variant="soft" onClick={addItem}>
                  <Plus size={14} />
                  Add Item
                </Button>
              )}
            </Flex>
            
            {errors.items && <Text size="1" color="red" mb="2">{errors.items}</Text>}
            
            {items.length > 0 ? (
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Unit</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Notes</Table.ColumnHeaderCell>
                    {!readOnly && <Table.ColumnHeaderCell></Table.ColumnHeaderCell>}
                  </Table.Row>
                </Table.Header>
                
                <Table.Body>
                  {items.map((item, index) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>
                        {readOnly ? (
                          <Text>{getItemName(item.stockItemId)}</Text>
                        ) : (
                          <Flex direction="column" gap="1">
                            <Select.Root 
                              value={item.stockItemId}
                              onValueChange={(value) => updateItem(index, 'stockItemId', value)}
                              disabled={readOnly}
                            >
                              <Select.Trigger 
                                placeholder="Select item" 
                                className={errors[`item-${index}`] ? "border-red-500" : ""} 
                                disabled={readOnly}
                              />
                              <Select.Content>
                                {mockStockItems.map(stockItem => (
                                  <Select.Item key={stockItem.id} value={stockItem.id}>
                                    {stockItem.name}
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select.Root>
                            {errors[`item-${index}`] && <Text size="1" color="red">{errors[`item-${index}`]}</Text>}
                          </Flex>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <Flex direction="column" gap="1">
                          <TextField.Root 
                            type="number" 
                            min="1"
                            value={item.quantity.toString()}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value || '0'))}
                            readOnly={readOnly}
                            className={errors[`quantity-${index}`] ? "border-red-500" : ""}
                          />
                          {errors[`quantity-${index}`] && <Text size="1" color="red">{errors[`quantity-${index}`]}</Text>}
                        </Flex>
                      </Table.Cell>
                      <Table.Cell>
                        {item.unitOfMeasure}
                      </Table.Cell>
                      <Table.Cell>
                        <TextField.Root 
                          placeholder="Optional notes"
                          value={item.notes || ''}
                          onChange={(e) => updateItem(index, 'notes', e.target.value)}
                          readOnly={readOnly}
                        />
                      </Table.Cell>
                      {!readOnly && (
                        <Table.Cell>
                          <IconButton 
                            size="1" 
                            variant="soft" 
                            color="red"
                            onClick={() => removeItem(index)}
                            disabled={readOnly}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Table.Cell>
                      )}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            ) : (
              <Card variant="ghost" className="border-dashed">
                <Flex direction="column" align="center" justify="center" p="6" gap="3">
                  <Inbox size={32} className="text-gray-400" />
                  <Text size="2" color="gray">
                    No items added to this request yet.
                  </Text>
                  {!readOnly && (
                    <Button size="1" variant="soft" onClick={addItem}>
                      <Plus size={14} />
                      Add First Item
                    </Button>
                  )}
                </Flex>
              </Card>
            )}
          </Box>
          
          <Box>
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Notes</Text>
              <TextArea 
                placeholder={readOnly ? "-" : "Enter any additional notes..."} 
                value={notes}
                onChange={(e) => !readOnly && setNotes(e.target.value)}
                readOnly={readOnly}
              />
            </Flex>
          </Box>
        </Flex>
      </Card>
      {!readOnly && (
        <Flex gap="3" mt="4">
          <Button variant="solid" color="green" onClick={handleSubmit}>
            <Save size={16} />
            Save Changes
          </Button>
          <Button variant="soft" color="gray" onClick={onCancel}>
            <X size={16} />
            Cancel
          </Button>
        </Flex>
      )}
    </>
  );
};

export default StockRequestForm; 