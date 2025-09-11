'use client'

import React, { useState } from 'react'
import { Radio, Card, Flex, Heading, Text } from '@radix-ui/themes'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function RadioDemo() {
  usePageTitle('Radio Button')
  const [selectedValue, setSelectedValue] = useState('option1')

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value)
  }

  return (
    <div>
      <Heading mb="5">Radio Button</Heading>
      
      <div className="space-y-5">
        {/* Basic Radio */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Basic Radio</Heading>
          <Flex align="start" direction="column" gap="2">
            <Flex asChild gap="2">
              <Text as="label" size="2">
                <Radio 
                  name="basic-example" 
                  value="option1" 
                  checked={selectedValue === 'option1'} 
                  onChange={handleValueChange}
                />
                Option 1
              </Text>
            </Flex>
            <Flex asChild gap="2">
              <Text as="label" size="2">
                <Radio 
                  name="basic-example" 
                  value="option2" 
                  checked={selectedValue === 'option2'} 
                  onChange={handleValueChange}
                />
                Option 2
              </Text>
            </Flex>
            <Flex asChild gap="2">
              <Text as="label" size="2">
                <Radio 
                  name="basic-example" 
                  value="option3" 
                  checked={selectedValue === 'option3'} 
                  onChange={handleValueChange}
                />
                Option 3
              </Text>
            </Flex>
            <Text size="2" color="gray">Selected: {selectedValue}</Text>
          </Flex>
        </Card>
        
        {/* Radio Variants */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Radio Variants</Heading>
          <Flex direction="column" gap="4">
            <Flex asChild gap="2">
              <Text as="label" size="2">
                <Radio variant="soft" name="variant-example" value="soft" defaultChecked />
                Soft checked
              </Text>
            </Flex>
            <Flex asChild gap="2">
              <Text as="label" size="2">
                <Radio variant="soft" name="variant-example" value="soft" />
                Soft unchecked
              </Text>
            </Flex>
            <Flex asChild gap="2">
              <Text as="label" size="2">
                <Radio variant="surface" name="variant-example" value="surface" />
                Surface
              </Text>
            </Flex>
            <Flex asChild gap="2">
              <Text as="label" size="2">
                <Radio variant="surface" name="variant-example" value="surface" />
                Surface checked
              </Text>
            </Flex>
            <Flex asChild gap="2">
              <Text as="label" size="2">
                <Radio variant="classic" name="variant-example" value="classic" />
                Classic
              </Text>
            </Flex>
          </Flex>
        </Card>
          

        {/* Radio Sizes */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Radio Sizes</Heading>
          <Flex direction="column" gap="4">
            <Flex asChild gap="2">
              <Text as="label" size="1">
                <Radio size="1" name="size-example" value="size1" defaultChecked />
                Size 1
              </Text>
            </Flex>
            <Flex asChild gap="2">
              <Text as="label" size="2">
                <Radio size="2" name="size-example" value="size2" />
                Size 2
              </Text>
            </Flex>
            <Flex asChild gap="2">
              <Text as="label" size="3">
                <Radio size="3" name="size-example" value="size3" />
                Size 3
              </Text>
            </Flex>
          </Flex>
        </Card>

        {/* Radio Colors */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Radio Colors</Heading>
          <Flex direction="column" gap="4">
            <Flex asChild gap="2">
              <Text as="label" size="2">
                <Radio color="indigo" name="color-example" value="indigo" />
                Indigo
              </Text>
            </Flex>
            <Flex asChild gap="2">
              <Text as="label" size="2">
                <Radio color="cyan" name="color-example" value="cyan" />
                Cyan
              </Text>
            </Flex>
            <Flex asChild gap="2">
              <Text as="label" size="2">
                <Radio color="green" name="color-example" value="green" defaultChecked />
                Green
              </Text>
            </Flex>
            <Flex asChild gap="2">
              <Text as="label" size="2">
                <Radio color="orange" name="color-example" value="orange" />
                Orange
              </Text>
            </Flex>
            <Flex asChild gap="2">
              <Text as="label" size="2">
                <Radio color="red" name="color-example" value="red" />
                Red
              </Text>
            </Flex>
          </Flex>
        </Card>

        {/* Disabled Radio */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Disabled Radio</Heading>
          <Flex direction="column" gap="4">
            <Flex asChild gap="2">
              <Text as="label" size="2" color="gray">
                <Radio disabled name="disabled-example" value="disabled1" />
                Disabled unchecked
              </Text>
            </Flex>
            <Flex asChild gap="2">
              <Text as="label" size="2" color="gray">
                <Radio disabled name="disabled-example" value="disabled2" defaultChecked />
                Disabled checked
              </Text>
            </Flex>
          </Flex>
        </Card>

        {/* Radio with High Contrast */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">High Contrast Radio</Heading>
          <Flex direction="column" gap="4">
            <Flex asChild gap="2">
              <Text as="label" size="2">
                <Radio highContrast name="contrast-example" value="high" defaultChecked />
                High contrast
              </Text>
            </Flex>
            <Flex asChild gap="2">
              <Text as="label" size="2">
                <Radio name="contrast-example" value="normal" />
                Normal contrast
              </Text>
            </Flex>
          </Flex>
        </Card>
      </div>
    </div>
  )
}

