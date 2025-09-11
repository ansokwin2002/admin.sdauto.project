'use client';

import React, { useState } from 'react';
import { Box, Card, Flex, Text, Select, Switch, Button, Heading, RadioGroup, Checkbox } from '@radix-ui/themes';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for languages and currencies
const languages = [
  { code: 'en', name: 'English' },
  { code: 'id', name: 'Indonesian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'es', name: 'Spanish' },
  { code: 'ar', name: 'Arabic' }
];

const currencies = [
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'GBP', name: 'British Pound', symbol: '£' }
];

export default function LanguageCurrency() {
  const [defaultLanguage, setDefaultLanguage] = useState('en');
  const [enableMultilingual, setEnableMultilingual] = useState(false);
  const [supportedLanguages, setSupportedLanguages] = useState(['en', 'id']);
  const [defaultCurrency, setDefaultCurrency] = useState('IDR');
  const [symbolPlacement, setSymbolPlacement] = useState('before');
  
  // Example amount for preview
  const amount = 1250000;
  
  // Format preview based on current settings
  const formatPreview = () => {
    const currency = currencies.find(c => c.code === defaultCurrency);
    if (!currency) return '';
    
    const formattedAmount = new Intl.NumberFormat('en-US').format(amount);
    
    return symbolPlacement === 'before' 
      ? `${currency.symbol} ${formattedAmount}`
      : `${formattedAmount} ${currency.symbol}`;
  };
  
  // Handle language selection/deselection
  const toggleLanguage = (code: string) => {
    if (supportedLanguages.includes(code)) {
      // Don't allow removing the default language
      if (code === defaultLanguage) return;
      setSupportedLanguages(supportedLanguages.filter(lang => lang !== code));
    } else {
      setSupportedLanguages([...supportedLanguages, code]);
    }
  };
  
  // Handle save changes
  const handleSave = () => {
    // In a real implementation, this would save the settings to the server
    console.log({
      defaultLanguage,
      enableMultilingual,
      supportedLanguages,
      defaultCurrency,
      symbolPlacement
    });
    
    // Show success toast
    toast.success('Changes saved successfully');
  };

  return (
    <Card size="3">
      <Flex direction="column" gap="4">
        <Flex gap="4" direction="column">
          <Flex gap="4" align="center">
            <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Default Language</Text>
            <Select.Root value={defaultLanguage} onValueChange={setDefaultLanguage}>
              <Select.Trigger placeholder="Select default language" />
              <Select.Content>
                {languages.map(lang => (
                  <Select.Item key={lang.code} value={lang.code}>{lang.name}</Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>
          
          <Flex gap="4" align="center">
            <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Enable Multilingual UI</Text>
            <Switch color="green" checked={enableMultilingual} onCheckedChange={setEnableMultilingual} />
          </Flex>
          
          {enableMultilingual && (
            <Flex gap="4" align="start">
              <Text as="label" size="2" weight="medium" style={{ width: '180px', marginTop: '8px' }}>Supported Languages</Text>
              <Flex wrap="wrap" gap="5">
                {languages.map(lang => (
                  <Text as="label" size="2" key={lang.code}>
                    <Flex gap="1" align="center">
                      <Checkbox 
                        checked={supportedLanguages.includes(lang.code)}
                        onCheckedChange={() => toggleLanguage(lang.code)}
                        disabled={lang.code === defaultLanguage}
                      />
                      {lang.name} {lang.code === defaultLanguage && '(Default)'}
                    </Flex>
                  </Text>
                ))}
              </Flex>
            </Flex>
          )}
          
          <Flex gap="4" align="center">
            <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Default Currency</Text>
            <Select.Root value={defaultCurrency} onValueChange={setDefaultCurrency}>
              <Select.Trigger placeholder="Select default currency" />
              <Select.Content>
                {currencies.map(currency => (
                  <Select.Item key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name} ({currency.symbol})
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>
          
          <Flex gap="4" align="center">
            <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Symbol Placement</Text>
            <RadioGroup.Root value={symbolPlacement} onValueChange={setSymbolPlacement}>
              <Flex gap="2">
                <Text as="label" size="2">
                  <Flex gap="1" align="center">
                    <RadioGroup.Item value="before" />
                    Before amount
                  </Flex>
                </Text>
                <Text as="label" size="2">
                  <Flex gap="1" align="center">
                    <RadioGroup.Item value="after" />
                    After amount
                  </Flex>
                </Text>
              </Flex>
            </RadioGroup.Root>
          </Flex>
          
          <Flex gap="4" align="center">
            <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Format Preview</Text>
            <Text size="3" weight="medium">{formatPreview()}</Text>
          </Flex>
          
          <Flex gap="4" mt="2">
            <Button color="green" onClick={handleSave}>
              <Save size={16} />
              Save Changes
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
