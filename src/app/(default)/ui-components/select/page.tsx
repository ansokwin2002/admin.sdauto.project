'use client'

import React, { useState } from 'react'
import { Select } from '@radix-ui/themes'
import { Flex, Grid, Text, Heading, Card } from '@radix-ui/themes'
import { SunIcon, MoonIcon } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'

// For SSR example
const data = {
  apple: "Apple",
  orange: "Orange",
};

const dataIcon= {
  light: { label: "Light", icon: <SunIcon size={16} /> },
  dark: { label: "Dark", icon: <MoonIcon size={16} /> },
};

export default function SelectDemo() {
  usePageTitle('Select Component');
  const [selectedOption, setSelectedOption] = useState('apple')
  const [selectedIcon, setSelectedIcon] = useState("light");
  return (
    <div>
      <Heading size="6" mb="6">Select</Heading>

      <Grid columns={{ initial: '1', md: '2' }} gap="6">
        {/* Default */}
        <Card>
          <Heading size="3" mb="3">Default</Heading>
          <Flex direction="column" gap="4">
            <Flex gap="4" align="center">
              <Text size="2" style={{ width: '150px' }}>Default</Text>
              <Select.Root defaultValue="apple">
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="banana">Banana</Select.Item>
                  <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
            
            <Flex gap="4" align="center">
              <Text size="2" style={{ width: '150px' }}>With Placeholder</Text>
              <Select.Root>
                <Select.Trigger placeholder="Select a fruit" />
                <Select.Content>
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="banana">Banana</Select.Item>
                  <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
            
            <Flex gap="4" align="center">
              <Text size="2" style={{ width: '150px' }}>With Disabled Item</Text>
              <Select.Root>
                <Select.Trigger placeholder="Select a fruit" />
                <Select.Content>
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="banana" disabled>Banana</Select.Item>
                  <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
          </Flex>
        </Card>
        
        {/* Size variants */}
        <Card>
          <Heading size="3" mb="3">Sizes</Heading>
          <Flex direction="column" gap="4">
            <Flex gap="4" align="center">
              <Text size="2" style={{ width: '50px' }}>Size 1</Text>
              <Select.Root size="1">
                <Select.Trigger placeholder="Select a fruit" />
                <Select.Content>
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="banana">Banana</Select.Item>
                  <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
            
            <Flex gap="4" align="center">
              <Text size="2" style={{ width: '50px' }}>Size 2</Text>
              <Select.Root size="2">
                <Select.Trigger placeholder="Select a fruit" />
                <Select.Content>
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="banana">Banana</Select.Item>
                  <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
            
            <Flex gap="4" align="center">
              <Text size="2" style={{ width: '50px' }}>Size 3</Text>
              <Select.Root size="3">
                <Select.Trigger placeholder="Select a fruit" />
                <Select.Content>
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="banana">Banana</Select.Item>
                  <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
          </Flex>
        </Card>

        {/* Variants */}
        <Card>
          <Heading size="3" mb="3">Variants</Heading>
          <Flex direction="column" gap="4">
            <Flex gap="4" align="center">
              <Text size="2" style={{ width: '120px' }}>Surface Variant</Text>
              <Select.Root >
                <Select.Trigger placeholder="Select a fruit" variant="surface"/>
                <Select.Content>
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="banana">Banana</Select.Item>
                  <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
            
            <Flex gap="4" align="center">
              <Text size="2" style={{ width: '120px' }}>Classic Variant</Text>
              <Select.Root >
                <Select.Trigger placeholder="Select a fruit" variant="classic"/>
                <Select.Content>
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="banana">Banana</Select.Item>
                  <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
            
            <Flex gap="4" align="center">
              <Text size="2" style={{ width: '120px' }}>Soft Variant</Text>
              <Select.Root >
                <Select.Trigger placeholder="Select a fruit" variant="soft"/>
                <Select.Content>
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="banana">Banana</Select.Item>
                  <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>

            <Flex gap="4" align="center">
              <Text size="2" style={{ width: '120px' }}>Ghost Variant</Text>
              <Select.Root >
                <Select.Trigger placeholder="Select a fruit" variant="ghost"/>
                <Select.Content>
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="banana">Banana</Select.Item>
                  <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
          </Flex>
        </Card>

        {/* Colors */}
        <Card>
          <Heading size="3" mb="3">Colors</Heading>
          <Flex direction="column" gap="4">
            <Flex gap="4" align="center">
              <Text size="2" style={{ width: '50px' }}>Indigo</Text>
              <Select.Root >
                <Select.Trigger placeholder="Select a fruit" color="indigo" variant="soft"/>
                <Select.Content color="indigo">
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="banana">Banana</Select.Item>
                  <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
            
            <Flex gap="4" align="center">
              <Text size="2" style={{ width: '50px' }}>Blue</Text>
              <Select.Root >
                <Select.Trigger placeholder="Select a fruit" color="blue" variant="soft"/>
                <Select.Content color="blue">
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="banana">Banana</Select.Item>
                  <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
            
            <Flex gap="4" align="center">
              <Text size="2" style={{ width: '50px' }}>Green</Text>
              <Select.Root >
                <Select.Trigger placeholder="Select a fruit" color="green" variant="soft"/>
                <Select.Content color="green">
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="banana">Banana</Select.Item>
                  <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>

            <Flex gap="4" align="center">
              <Text size="2" style={{ width: '50px' }}>Amber</Text>
              <Select.Root >
                <Select.Trigger placeholder="Select a fruit" color="amber" variant="soft"/>
                <Select.Content color="amber">
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="banana">Banana</Select.Item>
                  <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
          </Flex>
        </Card>

        {/* High Contrast */}
        <Card>
          <Heading size="3" mb="3">High Contrast</Heading>
          <Flex direction="column" gap="4">
            <Flex gap="4" align="center">
              <Text size="2" style={{ width: '100px' }}>Default</Text>
              <Select.Root >
                <Select.Trigger placeholder="Select a fruit"/>
                <Select.Content>
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="banana">Banana</Select.Item>
                  <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
            
            <Flex gap="4" align="center">
              <Text size="2" style={{ width: '100px' }}>High Contrast</Text>
              <Select.Root>
                <Select.Trigger placeholder="Select a fruit" />
                <Select.Content highContrast variant="solid">
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="banana">Banana</Select.Item>
                  <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
          </Flex>
        </Card>

        {/* Radius */}
        <Card>
          <Heading size="3" mb="3">Radius</Heading>
          <Flex direction="column" gap="4">
            <Flex gap="4" align="center">
              <Text size="2" style={{ width: '100px' }}>Radius None</Text>
              <Select.Root>
                <Select.Trigger placeholder="Select a fruit" radius="none" />
                <Select.Content>
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="banana">Banana</Select.Item>
                  <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
            
            <Flex gap="4" align="center">
              <Text size="2" style={{ width: '100px' }}>Radius Large</Text>
              <Select.Root>
                <Select.Trigger placeholder="Select a fruit" radius="large" />
                <Select.Content>
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="banana">Banana</Select.Item>
                  <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
            
            <Flex gap="4" align="center">
              <Text size="2" style={{ width: '100px' }}>Radius Full</Text>
              <Select.Root>
                <Select.Trigger placeholder="Select a fruit" radius="full" />
                <Select.Content>
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="banana">Banana</Select.Item>
                  <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
          </Flex>
        </Card>

        {/* Placeholder */}
        <Card>
          <Heading size="3" mb="3">Placeholder</Heading>
          <Flex direction="column" gap="4">
            <Flex gap="4" align="center">
              <Text size="2" style={{ width: '130px' }}>With Placeholder</Text>
              <Select.Root>
                <Select.Trigger placeholder="Choose your favorite fruit" />
                <Select.Content>
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="banana">Banana</Select.Item>
                  <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
            
            <Flex gap="4" align="center">
              <Text size="2" style={{ width: '130px' }}>With Default Value</Text>
              <Select.Root defaultValue="banana">
                <Select.Trigger placeholder="Choose your favorite fruit" />
                <Select.Content>
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="banana">Banana</Select.Item>
                  <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
          </Flex>
        </Card>

        {/* Position */}
        <Card>
          <Heading size="3" mb="3">Position</Heading>
          <Flex direction="column" gap="4">
            <Flex gap="4" align="center">
              <Text size="2" style={{ width: '120px' }}>Position Top</Text>
              <Select.Root>
                <Select.Trigger placeholder="Select a fruit" />
                <Select.Content position="popper" side="top">
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="banana">Banana</Select.Item>
                  <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
            
            <Flex gap="4" align="center">
              <Text size="2" style={{ width: '120px' }}>Position Bottom</Text>
              <Select.Root>
                <Select.Trigger placeholder="Select a fruit" />
                <Select.Content position="popper" side="bottom">
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="banana">Banana</Select.Item>
                  <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
          </Flex>
        </Card>

        {/* With SSR */}
        <Card>
          <Heading size="3" mb="3">With SSR (Server Side Rendering)</Heading>
          <Flex gap="4" align="center">
            <Text size="2">Dynamically Generated Options</Text>
            <Select.Root value={selectedOption} onValueChange={setSelectedOption}>
              <Select.Trigger placeholder="Select a fruit">
                {selectedOption ? data[selectedOption] : null}
              </Select.Trigger>
              <Select.Content>
                {Object.keys(data).map((option) => (
                  <Select.Item key={option} value={option}>
                    {data[option]}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>
        </Card>

        {/* With Icon */}
        <Card>
          <Heading size="3" mb="3">With Icon</Heading>
          <Flex direction="column" maxWidth="160px">
            <Select.Root value={selectedIcon} onValueChange={setSelectedIcon}>
              <Select.Trigger>
                <Flex as="span" align="center" gap="2">
                  {dataIcon[selectedIcon].icon}
                  {dataIcon[selectedIcon].label}
                </Flex>
              </Select.Trigger>
              <Select.Content position="popper">
                <Select.Item value="light">Light</Select.Item>
                <Select.Item value="dark">Dark</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>
        </Card>
      </Grid>
    </div>
  )
}
