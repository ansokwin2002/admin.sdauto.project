'use client';

import { useState } from 'react';
import { Dialog, TextField, Box, Table, Button, Flex, Text, Badge, IconButton } from '@radix-ui/themes';
import { Search, Save, X } from 'lucide-react';
import { organization } from '@/data/CommonData';
import { toast } from 'sonner';

interface BranchPriceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: {
    itemId: string;
    basePrice: number;
    branchSpecificPrices?: { [branchId: string]: number };
  };
  menuItem: {
    id: string;
    name: string;
    branchPrices?: { [branchId: string]: number };
  };
  onSave: (itemId: string, branchPrices: { [branchId: string]: number }) => void;
}

export default function BranchPriceDialog({ 
  open, 
  onOpenChange, 
  item, 
  menuItem, 
  onSave 
}: BranchPriceDialogProps) {
  const [branchPrices, setBranchPrices] = useState<{ [branchId: string]: number }>(
    item.branchSpecificPrices || menuItem.branchPrices || {}
  );
  const [searchBranch, setSearchBranch] = useState('');

  const filteredBranches = organization.filter(branch => 
    branch.id !== 'hq' && 
    branch.name.toLowerCase().includes(searchBranch.toLowerCase())
  );

  const handlePriceChange = (branchId: string, value: string) => {
    setBranchPrices(prev => ({
      ...prev,
      [branchId]: parseFloat(value) || 0
    }));
  };

  const handleSave = () => {
    // Remove prices that are equal to base price
    const cleanedPrices = Object.entries(branchPrices).reduce((acc, [branchId, price]) => {
      if (price !== item.basePrice) {
        acc[branchId] = price;
      }
      return acc;
    }, {} as { [branchId: string]: number });

    onSave(item.itemId, cleanedPrices);
    onOpenChange(false);
    toast.success('Branch prices updated successfully!');
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 600 }}>
        <Flex justify="between">
          <Dialog.Title>Branch-Specific Pricing</Dialog.Title>
          <Dialog.Close>
            <IconButton variant="ghost" color="gray">
              <X size={16} />
            </IconButton>
          </Dialog.Close>
        </Flex>
        <Box mb="4">
          <Flex direction="column" gap="2">
            <Box>Set specific prices for <Badge>{menuItem?.name}</Badge> by branch</Box>
            <Flex align="center" gap="2">
              <Text weight="bold">Base Price: ${item.basePrice.toFixed(2)}</Text>
            </Flex>
          </Flex>
        </Box>

        <Flex direction="column" gap="4">
          <TextField.Root
            type="text"
            placeholder="Search branches..."
            value={searchBranch}
            onChange={(e) => setSearchBranch(e.target.value)}
          >
            <TextField.Slot>
              <Search size={16} />
            </TextField.Slot>            
          </TextField.Root>

          <Box style={{ maxHeight: '400px', overflow: 'auto' }}>
            <Table.Root variant="surface">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Branch</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Difference</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredBranches.map((branch) => {
                  const branchPrice = branchPrices[branch.id] || item.basePrice;
                  const priceDiff = branchPrice - item.basePrice;
                  
                  return (
                    <Table.Row key={branch.id} className="align-middle">
                      <Table.Cell>{branch.name}</Table.Cell>
                      <Table.Cell>
                        <TextField.Root
                          type="number"
                          value={branchPrice}
                          onChange={(e) => handlePriceChange(branch.id, e.target.value)}
                          min="0"
                          step="0.01"
                        >
                          <TextField.Slot>$</TextField.Slot>
                        </TextField.Root>
                      </Table.Cell>
                      <Table.Cell>
                        <Flex align="center" gap="1">
                          {/* <ArrowRight size={14} /> */}
                          <Text
                            weight="bold"
                            color={priceDiff > 0 ? "green" : priceDiff < 0 ? "red" : "gray"}
                            size="2"
                          >
                            {priceDiff === 0 ? "-" : (
                              priceDiff > 0 ? `+$${priceDiff.toFixed(2)}` : `-$${Math.abs(priceDiff).toFixed(2)}`
                            )}
                          </Text>
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Root>
          </Box>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              <X size={16} />
              Cancel
            </Button>
          </Dialog.Close>
          <Button color="green" onClick={handleSave}>
            <Save size={16} />
            Save Changes
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
} 