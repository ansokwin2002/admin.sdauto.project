'use client'

import React, { useState } from 'react'
import { Card, CheckboxGroup, Flex, Grid, Heading, Text } from '@radix-ui/themes'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function CheckboxGroupDemo() {
  usePageTitle('Checkbox Group')
  const [selectedOptions, setSelectedOptions] = useState<string[]>(["1"])
  
  return (
    <div>
      <Heading mb="5">Checkbox Group</Heading>
      
      <div className="space-y-5">
        {/* Basic Checkbox Group */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Basic Checkbox Group</Heading>
          <CheckboxGroup.Root 
            defaultValue={["1"]} 
            name="example"
            onValueChange={setSelectedOptions}
          >
            <Flex gap="4">
              <CheckboxGroup.Item value="1">Option 1</CheckboxGroup.Item>
              <CheckboxGroup.Item value="2">Option 2</CheckboxGroup.Item>
              <CheckboxGroup.Item value="3">Option 3</CheckboxGroup.Item>
            </Flex>
          </CheckboxGroup.Root>
          <Text as="p" size="2" mt="2">Selected options: {selectedOptions.join(', ')}</Text>
        </Card>

        {/* Checkbox Group Sizes */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Checkbox Group Sizes</Heading>
          <Flex align="center" gap="2">
            <CheckboxGroup.Root size="1" defaultValue={["1"]}>
              <CheckboxGroup.Item value="1" />
            </CheckboxGroup.Root>

            <CheckboxGroup.Root size="2" defaultValue={["1"]}>
              <CheckboxGroup.Item value="1" />
            </CheckboxGroup.Root>

            <CheckboxGroup.Root size="3" defaultValue={["1"]}>
              <CheckboxGroup.Item value="1" />
            </CheckboxGroup.Root>
          </Flex>
        </Card>

        {/* Checkbox Group Variants */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Checkbox Group Variants</Heading>
          <Flex gap="2">
            <Flex direction="column" asChild  gap="2">
              <CheckboxGroup.Root variant="classic" defaultValue={["1"]}>
                <CheckboxGroup.Item value="1" />
                <CheckboxGroup.Item value="2" />
              </CheckboxGroup.Root>
            </Flex>

            <Flex direction="column" asChild gap="2">
              <CheckboxGroup.Root variant="soft" defaultValue={["1"]}>
                <CheckboxGroup.Item value="1" />
                <CheckboxGroup.Item value="2" />
              </CheckboxGroup.Root>
            </Flex>
          </Flex>

        </Card>

        {/* Checkbox Group Colors */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Checkbox Group Colors</Heading>
          <Flex gap="2">
            <CheckboxGroup.Root color="indigo" defaultValue={["1"]}>
              <CheckboxGroup.Item value="1" />
            </CheckboxGroup.Root>

            <CheckboxGroup.Root color="cyan" defaultValue={["1"]}>
              <CheckboxGroup.Item value="1" />
            </CheckboxGroup.Root>

            <CheckboxGroup.Root color="orange" defaultValue={["1"]}>
              <CheckboxGroup.Item value="1" />
            </CheckboxGroup.Root>

            <CheckboxGroup.Root color="crimson" defaultValue={["1"]}>
              <CheckboxGroup.Item value="1" />
            </CheckboxGroup.Root>

            <CheckboxGroup.Root color="indigo" variant="soft" defaultValue={["1"]}>
              <CheckboxGroup.Item value="1" />
            </CheckboxGroup.Root>

            <CheckboxGroup.Root color="cyan" variant="soft" defaultValue={["1"]}>
              <CheckboxGroup.Item value="1" />
            </CheckboxGroup.Root>

            <CheckboxGroup.Root color="orange" variant="soft" defaultValue={["1"]}>
              <CheckboxGroup.Item value="1" />
            </CheckboxGroup.Root>

            <CheckboxGroup.Root color="crimson" variant="soft" defaultValue={["1"]}>
              <CheckboxGroup.Item value="1" />
            </CheckboxGroup.Root>
          </Flex>

        </Card>

        {/* High Contrast Checkbox Group */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">High Contrast Checkbox Group</Heading>
          <Grid rows="2" gap="2" display="inline-grid" flow="column">
            <CheckboxGroup.Root color="indigo" defaultValue={["1"]}>
              <CheckboxGroup.Item value="1" />
            </CheckboxGroup.Root>
            <CheckboxGroup.Root color="indigo" defaultValue={["1"]} highContrast>
              <CheckboxGroup.Item value="1" />
            </CheckboxGroup.Root>

            <CheckboxGroup.Root color="cyan" defaultValue={["1"]}>
              <CheckboxGroup.Item value="1" />
            </CheckboxGroup.Root>

            <CheckboxGroup.Root color="cyan" defaultValue={["1"]} highContrast>
              <CheckboxGroup.Item value="1" />
            </CheckboxGroup.Root>

            <CheckboxGroup.Root color="orange" defaultValue={["1"]}>
              <CheckboxGroup.Item value="1" />
            </CheckboxGroup.Root>

            <CheckboxGroup.Root color="orange" defaultValue={["1"]} highContrast>
              <CheckboxGroup.Item value="1" />
            </CheckboxGroup.Root>

            <CheckboxGroup.Root color="crimson" defaultValue={["1"]}>
              <CheckboxGroup.Item value="1" />
            </CheckboxGroup.Root>

            <CheckboxGroup.Root color="crimson" defaultValue={["1"]} highContrast>
              <CheckboxGroup.Item value="1" />
            </CheckboxGroup.Root>

            <CheckboxGroup.Root color="gray" defaultValue={["1"]}>
              <CheckboxGroup.Item value="1" />
            </CheckboxGroup.Root>

            <CheckboxGroup.Root color="gray" defaultValue={["1"]} highContrast>
              <CheckboxGroup.Item value="1" />
            </CheckboxGroup.Root>
          </Grid>

        </Card>

        {/* Checkbox Group Alignment */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Checkbox Group Alignment</Heading>
          <Flex direction="column" gap="3">
            <CheckboxGroup.Root size="1" defaultValue={["1"]}>
              <Text as="label" size="2">
                <Flex gap="2">
                  <CheckboxGroup.Item value="1" /> Default
                </Flex>
              </Text>

              <Text as="label" size="2">
                <Flex gap="2">
                  <CheckboxGroup.Item value="2" /> Compact
                </Flex>
              </Text>
            </CheckboxGroup.Root>

            <CheckboxGroup.Root size="2" defaultValue={["1"]}>
              <Text as="label" size="3">
                <Flex gap="2">
                  <CheckboxGroup.Item value="1" /> Default
                </Flex>
              </Text>

              <Text as="label" size="3">
                <Flex gap="2">
                  <CheckboxGroup.Item value="2" /> Compact
                </Flex>
              </Text>
            </CheckboxGroup.Root>

            <CheckboxGroup.Root size="3" defaultValue={["1"]}>
              <Text as="label" size="4">
                <Flex gap="2">
                  <CheckboxGroup.Item value="1" /> Default
                </Flex>
              </Text>

              <Text as="label" size="4">
                <Flex gap="2">
                  <CheckboxGroup.Item value="2" /> Compact
                </Flex>
              </Text>
            </CheckboxGroup.Root>
          </Flex>
        </Card>

        {/* Disabled Checkbox Group */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Disabled Checkbox Group</Heading>
          <Flex direction="column" gap="2">
            <CheckboxGroup.Root defaultValue={["2"]}>
              <CheckboxGroup.Item value="1">Off</CheckboxGroup.Item>
              <CheckboxGroup.Item value="2">On</CheckboxGroup.Item>
            </CheckboxGroup.Root>

            <CheckboxGroup.Root defaultValue={["2"]}>
              <CheckboxGroup.Item value="1" disabled>
                Off
              </CheckboxGroup.Item>
              <CheckboxGroup.Item value="2" disabled>
                On
              </CheckboxGroup.Item>
            </CheckboxGroup.Root>
          </Flex>

        </Card>
      </div>
    </div>
  )
}
