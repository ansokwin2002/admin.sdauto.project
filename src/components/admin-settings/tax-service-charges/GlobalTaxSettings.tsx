'use client';

import React, { useState } from 'react';
import { Box, Card, Flex, Text, TextField, Switch, Button, Heading, Checkbox } from '@radix-ui/themes';
import { Save } from 'lucide-react';
import DateInput from '@/components/common/DateInput';
import { toast } from 'sonner';

export default function GlobalTaxSettings() {
  const [taxName, setTaxName] = useState('VAT');
  const [taxRate, setTaxRate] = useState('10');
  const [isInclusive, setIsInclusive] = useState(true);
  const [enableForAllBranches, setEnableForAllBranches] = useState(true);
  const [effectiveDate, setEffectiveDate] = useState<Date | null>(new Date('2025-05-15'));
  
  const handleSave = () => {
    // In a real implementation, this would save the settings to the server
    console.log({
      taxName,
      taxRate: parseFloat(taxRate),
      isInclusive,
      enableForAllBranches,
      effectiveDate
    });
    
    // Show success toast
    toast.success('Global tax settings saved successfully');
  };

  return (
    <Box>
      <Card size="2">
        <Flex direction="column" gap="4">          
          <Flex gap="4" direction="column">
            <Flex gap="4" align="center">
              <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Tax Name</Text>
              <TextField.Root 
                value={taxName}
                onChange={(e) => setTaxName(e.target.value)}
                placeholder="Enter tax name"
              />
            </Flex>
            
            <Flex gap="4" align="center">
              <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Tax Rate (%)</Text>
              <TextField.Root 
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="Enter tax rate"
                type="number"
              />
            </Flex>
            
            <Flex gap="4" align="center">
              <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Tax Inclusive</Text>
              <Switch color="green" checked={isInclusive} onCheckedChange={setIsInclusive} />
              <Text size="2" color="gray">{isInclusive ? 'Inclusive' : 'Exclusive'}</Text>
            </Flex>
            
            <Flex gap="4" align="center">
              <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Enable for All Branches</Text>
              <Checkbox checked={enableForAllBranches} onCheckedChange={(checked) => checked !== 'indeterminate' && setEnableForAllBranches(checked)} />
            </Flex>
            
            <Flex gap="4" align="center">
              <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Effective Date</Text>
              <DateInput 
                value={effectiveDate}
                onChange={setEffectiveDate}
                placeholder="Select effective date"
              />
            </Flex>
            
            <Flex gap="4" mt="2" justify="start">
              <Button color="green" onClick={handleSave}>
                <Save size={16} />
                Save Changes
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
}
