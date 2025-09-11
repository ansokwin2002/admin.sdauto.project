import React from 'react'
import { SegmentedControl } from '@radix-ui/themes'
import { Flex, Grid, Text, Heading, Card } from '@radix-ui/themes'
import { Laptop, Smartphone, Tablet } from 'lucide-react'

export const metadata = {
  title: "Segmented Control | EatlyPOS",
}

export default function SegmentedControlDemo() {
  return (
    <div>
      <Heading size="6" mb="6">Segmented Control</Heading>

      <Grid columns={{ initial: '1', md: '2' }} gap="6">
        {/* Basic Segmented Control */}
        <Card>
          <Heading size="3" mb="3">Basic Usage</Heading>
          <Flex direction="column" gap="4">
            <SegmentedControl.Root defaultValue="option1">
              <SegmentedControl.Item value="option1">Option 1</SegmentedControl.Item>
              <SegmentedControl.Item value="option2">Option 2</SegmentedControl.Item>
              <SegmentedControl.Item value="option3">Option 3</SegmentedControl.Item>
            </SegmentedControl.Root>
          </Flex>
        </Card>

        {/* Segmented Control with Icons */}
        <Card>
          <Heading size="3" mb="3">With Icons</Heading>
          <Flex direction="column" gap="4">
            <SegmentedControl.Root defaultValue="laptop">
              <SegmentedControl.Item value="laptop">
                <Flex gap="1" align="center">
                  <Laptop size={16} />
                  <Text>Laptop</Text>
                </Flex>
              </SegmentedControl.Item>
              <SegmentedControl.Item value="smartphone">
                <Flex gap="1" align="center">
                  <Smartphone size={16} />
                  <Text>Phone</Text>
                </Flex>
              </SegmentedControl.Item>
              <SegmentedControl.Item value="tablet">
                <Flex gap="1" align="center">
                  <Tablet size={16} />
                  <Text>Tablet</Text>
                </Flex>
              </SegmentedControl.Item>
            </SegmentedControl.Root>
          </Flex>
        </Card>

        {/* Size variants */}
        <Card>
          <Heading size="3" mb="3">Sizes</Heading>
          <Flex direction="column" gap="4">
            <Flex align="center" gap="4">
              <Text size="2" weight="bold">Size 1</Text>
              <SegmentedControl.Root size="1" defaultValue="option1">
                <SegmentedControl.Item value="option1">Option 1</SegmentedControl.Item>
                <SegmentedControl.Item value="option2">Option 2</SegmentedControl.Item>
                <SegmentedControl.Item value="option3">Option 3</SegmentedControl.Item>
              </SegmentedControl.Root>
            </Flex>
            
            <Flex align="center" gap="4">
              <Text size="2" weight="bold">Size 2</Text>
              <SegmentedControl.Root size="2" defaultValue="option1">
                <SegmentedControl.Item value="option1">Option 1</SegmentedControl.Item>
                <SegmentedControl.Item value="option2">Option 2</SegmentedControl.Item>
                <SegmentedControl.Item value="option3">Option 3</SegmentedControl.Item>
              </SegmentedControl.Root>
            </Flex>
            
            <Flex align="center" gap="4">
              <Text size="2" weight="bold">Size 3</Text>
              <SegmentedControl.Root size="3" defaultValue="option1">
                <SegmentedControl.Item value="option1">Option 1</SegmentedControl.Item>
                <SegmentedControl.Item value="option2">Option 2</SegmentedControl.Item>
                <SegmentedControl.Item value="option3">Option 3</SegmentedControl.Item>
              </SegmentedControl.Root>
            </Flex>
          </Flex>
        </Card>
        
        {/* Radius variants */}
        <Card>
          <Heading size="3" mb="3">Radius</Heading>
          <Flex direction="column" gap="4">
            <Flex align="center" gap="4">
              <Text size="2" weight="bold">Radius None</Text>
              <SegmentedControl.Root radius="none" defaultValue="option1">
                <SegmentedControl.Item value="option1">Option 1</SegmentedControl.Item>
                <SegmentedControl.Item value="option2">Option 2</SegmentedControl.Item>
                <SegmentedControl.Item value="option3">Option 3</SegmentedControl.Item>
              </SegmentedControl.Root>
            </Flex>
            
            <Flex align="center" gap="4">
              <Text size="2" weight="bold">Radius Medium</Text>
              <SegmentedControl.Root radius="medium" defaultValue="option1">
                <SegmentedControl.Item value="option1">Option 1</SegmentedControl.Item>
                <SegmentedControl.Item value="option2">Option 2</SegmentedControl.Item>
                <SegmentedControl.Item value="option3">Option 3</SegmentedControl.Item>
              </SegmentedControl.Root>
            </Flex>
            
            <Flex align="center" gap="4">
              <Text size="2" weight="bold">Radius Full</Text>
              <SegmentedControl.Root radius="full" defaultValue="option1">
                <SegmentedControl.Item value="option1">Option 1</SegmentedControl.Item>
                <SegmentedControl.Item value="option2">Option 2</SegmentedControl.Item>
                <SegmentedControl.Item value="option3">Option 3</SegmentedControl.Item>
              </SegmentedControl.Root>
            </Flex>
          </Flex>
        </Card>

        {/* Variants */}
        <Card>
          <Heading size="3" mb="3">Variants</Heading>
          <Flex direction="column" gap="4">
            <Flex align="center" gap="4">
              <Text size="2" weight="bold">Surface Variant</Text>
              <SegmentedControl.Root variant="surface" defaultValue="option1">
                <SegmentedControl.Item value="option1">Option 1</SegmentedControl.Item>
                <SegmentedControl.Item value="option2">Option 2</SegmentedControl.Item>
                <SegmentedControl.Item value="option3">Option 3</SegmentedControl.Item>
              </SegmentedControl.Root>
            </Flex>
            
            <Flex align="center" gap="4">
              <Text size="2" weight="bold">Classic Variant</Text>
              <SegmentedControl.Root variant="classic" defaultValue="option1">
                <SegmentedControl.Item value="option1">Option 1</SegmentedControl.Item>
                <SegmentedControl.Item value="option2">Option 2</SegmentedControl.Item>
                <SegmentedControl.Item value="option3">Option 3</SegmentedControl.Item>
              </SegmentedControl.Root>
            </Flex>
          </Flex>
        </Card>
      </Grid>
    </div>
  )
}
