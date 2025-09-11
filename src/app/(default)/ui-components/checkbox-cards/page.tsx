'use client'

import React, { useState } from 'react'
import { Card, CheckboxCards, Flex, Heading, Text } from '@radix-ui/themes'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function CheckboxCardsDemo() {
  usePageTitle('Checkbox Cards');
  const [selectedOptions, setSelectedOptions] = useState<string[]>(["1"])
  
  return (
    <div>
      <Heading mb="5">Checkbox Cards</Heading>
      
      <div className="space-y-5">
        {/* Basic Checkbox Cards */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Basic Checkbox Cards</Heading>
          <CheckboxCards.Root
            defaultValue={["1"]} 
            columns={{ initial: "1", sm: "3" }}
            onValueChange={setSelectedOptions}
          >
            <CheckboxCards.Item value="1">
              <Flex direction="column" width="100%">
                <Text weight="bold">A1 Keyboard</Text>
                <Text>US Layout</Text>
              </Flex>
            </CheckboxCards.Item>
            <CheckboxCards.Item value="2">
              <Flex direction="column" width="100%">
                <Text weight="bold">Pro Mouse</Text>
                <Text>Zero-lag wireless</Text>
              </Flex>
            </CheckboxCards.Item>
            <CheckboxCards.Item value="3">
              <Flex direction="column" width="100%">
                <Text weight="bold">Lightning Mat</Text>
                <Text>Wireless charging</Text>
              </Flex>
            </CheckboxCards.Item>
          </CheckboxCards.Root>
          <Text as="p" size="2" mt="2">Selected options: {selectedOptions.join(', ')}</Text>
        </Card>

        {/* Checkbox Cards Sizes */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Checkbox Cards Sizes</Heading>
          <Flex direction="column" gap="4">
            <CheckboxCards.Root size="1" defaultValue={["1"]} columns="3">
              <CheckboxCards.Item value="1">Size 1</CheckboxCards.Item>
              <CheckboxCards.Item value="2">Size 1</CheckboxCards.Item>
              <CheckboxCards.Item value="3">Size 1</CheckboxCards.Item>
            </CheckboxCards.Root>

            <CheckboxCards.Root size="2" defaultValue={["1"]} columns="3">
              <CheckboxCards.Item value="1">Size 2</CheckboxCards.Item>
              <CheckboxCards.Item value="2">Size 2</CheckboxCards.Item>
              <CheckboxCards.Item value="3">Size 2</CheckboxCards.Item>
            </CheckboxCards.Root>

            <CheckboxCards.Root size="3" defaultValue={["1"]} columns="3">
              <CheckboxCards.Item value="1">Size 3</CheckboxCards.Item>
              <CheckboxCards.Item value="2">Size 3</CheckboxCards.Item>
              <CheckboxCards.Item value="3">Size 3</CheckboxCards.Item>
            </CheckboxCards.Root>
          </Flex>
        </Card>

        {/* Checkbox Cards Colors */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Checkbox Cards Colors</Heading>
          <Flex direction="column" gap="4">
            <CheckboxCards.Root color="indigo" defaultValue={["1"]} columns="2">
              <CheckboxCards.Item value="1">Indigo</CheckboxCards.Item>
              <CheckboxCards.Item value="2">Indigo</CheckboxCards.Item>
            </CheckboxCards.Root>

            <CheckboxCards.Root color="cyan" defaultValue={["1"]} columns="2">
              <CheckboxCards.Item value="1">Cyan</CheckboxCards.Item>
              <CheckboxCards.Item value="2">Cyan</CheckboxCards.Item>
            </CheckboxCards.Root>

            <CheckboxCards.Root color="orange" defaultValue={["1"]} columns="2">
              <CheckboxCards.Item value="1">Orange</CheckboxCards.Item>
              <CheckboxCards.Item value="2">Orange</CheckboxCards.Item>
            </CheckboxCards.Root>
          </Flex>
        </Card>

        {/* High Contrast Checkbox Cards */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">High Contrast Checkbox Cards</Heading>
          <Flex direction="column" gap="4">
            <CheckboxCards.Root color="yellow" defaultValue={["1"]} columns="2">
              <CheckboxCards.Item value="1">Yellow</CheckboxCards.Item>
              <CheckboxCards.Item value="2">Yellow</CheckboxCards.Item>
            </CheckboxCards.Root>
          </Flex>
          <Flex direction="column" gap="4" mt="4">
            <CheckboxCards.Root color="yellow" highContrast defaultValue={["1"]} columns="2">
              <CheckboxCards.Item value="1">High Contrast</CheckboxCards.Item>
              <CheckboxCards.Item value="2">High Contrast</CheckboxCards.Item>
            </CheckboxCards.Root>
          </Flex>
        </Card>

        {/* Disabled Checkbox Cards */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Disabled Checkbox Cards</Heading>
          <CheckboxCards.Root defaultValue={["1"]} columns="2">
            <CheckboxCards.Item value="1" disabled>Disabled</CheckboxCards.Item>
            <CheckboxCards.Item value="2" disabled>Disabled</CheckboxCards.Item>
          </CheckboxCards.Root>
        </Card>
      </div>
    </div>
  )
}
