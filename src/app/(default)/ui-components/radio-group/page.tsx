import React from 'react';
import { Flex, Heading, Text, RadioGroup, Card } from '@radix-ui/themes';

export const metadata = {
  title: "Radio Group | EatlyPOS",
}

export default function RadioDemo() {
  return (
    <div>
      <Heading mb="5">Radio Group</Heading>
      
      <div className="space-y-5">
        {/* Sizes */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Sizes</Heading>
          <Flex align="center" gap="4">
            <RadioGroup.Root defaultValue="1" size="1">
              <Flex gap="2" direction="column">
                <Text as="label" size="2">
                  <Flex gap="2">
                    <RadioGroup.Item value="1" /> Small
                  </Flex>
                </Text>
                <Text as="label" size="2">
                  <Flex gap="2">
                    <RadioGroup.Item value="2" /> Option 2
                  </Flex>
                </Text>
              </Flex>
            </RadioGroup.Root>
            
            <RadioGroup.Root defaultValue="1" size="2">
              <Flex gap="2" direction="column">
                <Text as="label" size="2">
                  <Flex gap="2">
                    <RadioGroup.Item value="1" /> Medium
                  </Flex>
                </Text>
                <Text as="label" size="2">
                  <Flex gap="2">
                    <RadioGroup.Item value="2" /> Option 2
                  </Flex>
                </Text>
              </Flex>
            </RadioGroup.Root>
            
            <RadioGroup.Root defaultValue="1" size="3">
              <Flex gap="2" direction="column">
                <Text as="label" size="2">
                  <Flex gap="2">
                    <RadioGroup.Item value="1" /> Large
                  </Flex>
                </Text>
                <Text as="label" size="2">
                  <Flex gap="2">
                    <RadioGroup.Item value="2" /> Option 2
                  </Flex>
                </Text>
              </Flex>
            </RadioGroup.Root>
          </Flex>
        </Card>
        
        {/* Variants */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Variants</Heading>
          <Flex align="center" gap="4">            
            <RadioGroup.Root defaultValue="1" variant="classic">
              <Flex gap="2" direction="column">
                <Text as="label" size="2">
                  <Flex gap="2">
                    <RadioGroup.Item value="1" /> Classic
                  </Flex>
                </Text>
                <Text as="label" size="2">
                  <Flex gap="2">
                    <RadioGroup.Item value="2" /> Option 2
                  </Flex>
                </Text>
              </Flex>
            </RadioGroup.Root>
            
            <RadioGroup.Root defaultValue="1" variant="soft">
              <Flex gap="2" direction="column">
                <Text as="label" size="2">
                  <Flex gap="2">
                    <RadioGroup.Item value="1" /> Soft
                  </Flex>
                </Text>
                <Text as="label" size="2">
                  <Flex gap="2">
                    <RadioGroup.Item value="2" /> Option 2
                  </Flex>
                </Text>
              </Flex>
            </RadioGroup.Root>

            <RadioGroup.Root defaultValue="1" variant="surface">
              <Flex gap="2" direction="column">
                <Text as="label" size="2">
                  <Flex gap="2">
                    <RadioGroup.Item value="1" /> Surface
                  </Flex>
                </Text>
                <Text as="label" size="2">
                  <Flex gap="2">
                    <RadioGroup.Item value="2" /> Option 2
                  </Flex>
                </Text>
              </Flex>
            </RadioGroup.Root>
          </Flex>
        </Card>
        
        {/* Colors */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Colors</Heading>
          <Flex wrap="wrap" gap="6">
            {["indigo", "cyan", "green", "orange", "crimson"].map((color) => (
              <RadioGroup.Root key={color} defaultValue="1" color={color as any}>
                <Flex gap="2" direction="column">
                  <Text as="label" size="2">
                    <Flex gap="2">
                      <RadioGroup.Item value="1" /> {color.charAt(0).toUpperCase() + color.slice(1)}
                    </Flex>
                  </Text>
                  <Text as="label" size="2">
                    <Flex gap="2">
                      <RadioGroup.Item value="2" /> Option 2
                    </Flex>
                  </Text>
                </Flex>
              </RadioGroup.Root>
            ))}
          </Flex>
        </Card>
        
        {/* High Contrast */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">High Contrast</Heading>
          <Flex gap="6">
            <RadioGroup.Root defaultValue="1" highContrast>
              <Flex gap="2" direction="column">
                <Text as="label" size="2">
                  <Flex gap="2">
                    <RadioGroup.Item value="1" /> Normal Contrast
                  </Flex>
                </Text>
                <Text as="label" size="2">
                  <Flex gap="2">
                    <RadioGroup.Item value="2" /> Option 2
                  </Flex>
                </Text>
              </Flex>
            </RadioGroup.Root>
            
            <RadioGroup.Root defaultValue="1" highContrast>
              <Flex gap="2" direction="column">
                <Text as="label" size="2">
                  <Flex gap="2">
                    <RadioGroup.Item value="1" /> High Contrast
                  </Flex>
                </Text>
                <Text as="label" size="2">
                  <Flex gap="2">
                    <RadioGroup.Item value="2" /> Option 2
                  </Flex>
                </Text>
              </Flex>
            </RadioGroup.Root>
          </Flex>
        </Card>
        
        {/* Orientation */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Orientation</Heading>
          <Flex gap="6">
            <RadioGroup.Root defaultValue="vertical">
              <Flex gap="2" direction="column">
                <Text as="label" size="2">
                  <Flex gap="2">
                    <RadioGroup.Item value="vertical" /> Vertical
                  </Flex>
                </Text>
                <Text as="label" size="2">
                  <Flex gap="2">
                    <RadioGroup.Item value="option2" /> Option 2
                  </Flex>
                </Text>
              </Flex>
            </RadioGroup.Root>
            
            <RadioGroup.Root defaultValue="horizontal">
              <Flex gap="4" direction="row">
                <Text as="label" size="2">
                  <Flex gap="2">
                    <RadioGroup.Item value="horizontal" /> Horizontal
                  </Flex>
                </Text>
                <Text as="label" size="2">
                  <Flex gap="2">
                    <RadioGroup.Item value="option2" /> Option 2
                  </Flex>
                </Text>
              </Flex>
            </RadioGroup.Root>
          </Flex>
        </Card>
        
        {/* Disabled State */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Disabled State</Heading>
          <Flex gap="6">
            <RadioGroup.Root defaultValue="1">
              <Flex gap="2" direction="column">
                <Text as="label" size="2">
                  <Flex gap="2">
                    <RadioGroup.Item value="1" disabled /> Disabled (Selected)
                  </Flex>
                </Text>
                <Text as="label" size="2">
                  <Flex gap="2">
                    <RadioGroup.Item value="2" disabled /> Disabled (Unselected)
                  </Flex>
                </Text>
              </Flex>
            </RadioGroup.Root>
          </Flex>
        </Card>
      </div>
    </div>
  );
}
