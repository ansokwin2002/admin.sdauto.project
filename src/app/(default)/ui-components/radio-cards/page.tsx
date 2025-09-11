import React from 'react'
import { Box, Card, Flex, Heading, Text, RadioCards } from '@radix-ui/themes'
import { Laptop, CreditCard, Smartphone, Zap, Wifi, Cloud } from 'lucide-react'

export const metadata = {
  title: "Radio Cards | EatlyPOS",
}

export default function RadioCardsDemo() {
  return (
    <div>
      <Heading mb="5">Radio Cards</Heading>
      
      <div className="space-y-5">
        {/* Basic Radio Cards */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Basic Radio Cards</Heading>
          <Box maxWidth="600px">
            <RadioCards.Root defaultValue="1" columns={{ initial: "1", sm: "3" }}>
              <RadioCards.Item value="1">
                <Flex direction="column" width="100%">
                  <Text weight="bold">8-core CPU</Text>
                  <Text>32 GB RAM</Text>
                </Flex>
              </RadioCards.Item>
              <RadioCards.Item value="2">
                <Flex direction="column" width="100%">
                  <Text weight="bold">6-core CPU</Text>
                  <Text>24 GB RAM</Text>
                </Flex>
              </RadioCards.Item>
              <RadioCards.Item value="3">
                <Flex direction="column" width="100%">
                  <Text weight="bold">4-core CPU</Text>
                  <Text>16 GB RAM</Text>
                </Flex>
              </RadioCards.Item>
            </RadioCards.Root>
          </Box>
        </Card>

        {/* Radio Cards with Icons */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Radio Cards with Icons</Heading>
          <Box maxWidth="600px">
            <RadioCards.Root defaultValue="laptop" columns={{ initial: "1", sm: "3" }}>
              <RadioCards.Item value="laptop">
                <Flex direction="column" width="100%" align="center" gap="2">
                  <Laptop size={24} />
                  <Text weight="bold">Laptop</Text>
                  <Text align="center" size="2" color="gray">Portable computing device</Text>
                </Flex>
              </RadioCards.Item>
              <RadioCards.Item value="smartphone">
                <Flex direction="column" width="100%" align="center" gap="2">
                  <Smartphone size={24} />
                  <Text weight="bold">Smartphone</Text>
                  <Text align="center" size="2" color="gray">Mobile communication device</Text>
                </Flex>
              </RadioCards.Item>
              <RadioCards.Item value="tablet">
                <Flex direction="column" width="100%" align="center" gap="2">
                  <CreditCard size={24} />
                  <Text weight="bold">Tablet</Text>
                  <Text align="center" size="2" color="gray">Touchscreen computing device</Text>
                </Flex>
              </RadioCards.Item>
            </RadioCards.Root>
          </Box>
        </Card>

        {/* Radio Cards with Different Sizes */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Radio Cards Sizes</Heading>
          <Flex direction="column" gap="4">
            <Box>
              <Text size="2" mb="2">Size 1 (Small)</Text>
              <Box maxWidth="600px">
                <RadioCards.Root size="1" defaultValue="1" columns={{ initial: "1", sm: "3" }}>
                  <RadioCards.Item value="1">
                    <Flex direction="column" width="100%">
                      <Text weight="bold">Option 1</Text>
                      <Text size="1">Description</Text>
                    </Flex>
                  </RadioCards.Item>
                  <RadioCards.Item value="2">
                    <Flex direction="column" width="100%">
                      <Text weight="bold">Option 2</Text>
                      <Text size="1">Description</Text>
                    </Flex>
                  </RadioCards.Item>
                  <RadioCards.Item value="3">
                    <Flex direction="column" width="100%">
                      <Text weight="bold">Option 3</Text>
                      <Text size="1">Description</Text>
                    </Flex>
                  </RadioCards.Item>
                </RadioCards.Root>
              </Box>
            </Box>

            <Box>
              <Text size="2" mb="2">Size 2 (Medium)</Text>
              <Box maxWidth="600px">
                <RadioCards.Root size="2" defaultValue="1" columns={{ initial: "1", sm: "3" }}>
                  <RadioCards.Item value="1">
                    <Flex direction="column" width="100%">
                      <Text weight="bold">Option 1</Text>
                      <Text size="2">Description</Text>
                    </Flex>
                  </RadioCards.Item>
                  <RadioCards.Item value="2">
                    <Flex direction="column" width="100%">
                      <Text weight="bold">Option 2</Text>
                      <Text size="2">Description</Text>
                    </Flex>
                  </RadioCards.Item>
                  <RadioCards.Item value="3">
                    <Flex direction="column" width="100%">
                      <Text weight="bold">Option 3</Text>
                      <Text size="2">Description</Text>
                    </Flex>
                  </RadioCards.Item>
                </RadioCards.Root>
              </Box>
            </Box>

            <Box>
              <Text size="2" mb="2">Size 3 (Large)</Text>
              <Box maxWidth="600px">
                <RadioCards.Root size="3" defaultValue="1" columns={{ initial: "1", sm: "3" }}>
                  <RadioCards.Item value="1">
                    <Flex direction="column" width="100%">
                      <Text weight="bold">Option 1</Text>
                      <Text size="2">Description</Text>
                    </Flex>
                  </RadioCards.Item>
                  <RadioCards.Item value="2">
                    <Flex direction="column" width="100%">
                      <Text weight="bold">Option 2</Text>
                      <Text size="2">Description</Text>
                    </Flex>
                  </RadioCards.Item>
                  <RadioCards.Item value="3">
                    <Flex direction="column" width="100%">
                      <Text weight="bold">Option 3</Text>
                      <Text size="2">Description</Text>
                    </Flex>
                  </RadioCards.Item>
                </RadioCards.Root>
              </Box>
            </Box>
          </Flex>
        </Card>

        {/* Radio Cards with Different Variants */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Radio Cards Variants</Heading>
          <Flex direction="column" gap="4">
            <Box>
              <Text size="2" mb="2">Classic Variant</Text>
              <Box maxWidth="600px">
                <RadioCards.Root variant="classic" defaultValue="1" columns={{ initial: "1", sm: "3" }}>
                  <RadioCards.Item value="1">
                    <Flex direction="column" width="100%">
                      <Text weight="bold">Classic 1</Text>
                      <Text>Description</Text>
                    </Flex>
                  </RadioCards.Item>
                  <RadioCards.Item value="2">
                    <Flex direction="column" width="100%">
                      <Text weight="bold">Classic 2</Text>
                      <Text>Description</Text>
                    </Flex>
                  </RadioCards.Item>
                  <RadioCards.Item value="3">
                    <Flex direction="column" width="100%">
                      <Text weight="bold">Classic 3</Text>
                      <Text>Description</Text>
                    </Flex>
                  </RadioCards.Item>
                </RadioCards.Root>
              </Box>
            </Box>

            <Box>
              <Text size="2" mb="2">Surface Variant</Text>
              <Box maxWidth="600px">
                <RadioCards.Root variant="surface" defaultValue="1" columns={{ initial: "1", sm: "3" }}>
                  <RadioCards.Item value="1">
                    <Flex direction="column" width="100%">
                      <Text weight="bold">Surface 1</Text>
                      <Text>Description</Text>
                    </Flex>
                  </RadioCards.Item>
                  <RadioCards.Item value="2">
                    <Flex direction="column" width="100%">
                      <Text weight="bold">Surface 2</Text>
                      <Text>Description</Text>
                    </Flex>
                  </RadioCards.Item>
                  <RadioCards.Item value="3">
                    <Flex direction="column" width="100%">
                      <Text weight="bold">Surface 3</Text>
                      <Text>Description</Text>
                    </Flex>
                  </RadioCards.Item>
                </RadioCards.Root>
              </Box>
            </Box>
          </Flex>
        </Card>

        {/* Radio Cards with Different Colors */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Radio Cards Colors</Heading>
          <Flex direction="column" gap="4">
            {['indigo', 'cyan', 'green', 'orange', 'crimson'].map((color) => (
              <Box key={color}>
                <Text size="2" mb="2" style={{ textTransform: 'capitalize' }}>{color}</Text>
                <Box maxWidth="600px">
                  <RadioCards.Root color={color as any} defaultValue="1" columns={{ initial: "1", sm: "3" }}>
                    <RadioCards.Item value="1">
                      <Flex direction="column" width="100%">
                        <Text weight="bold">Option 1</Text>
                        <Text>Description</Text>
                      </Flex>
                    </RadioCards.Item>
                    <RadioCards.Item value="2">
                      <Flex direction="column" width="100%">
                        <Text weight="bold">Option 2</Text>
                        <Text>Description</Text>
                      </Flex>
                    </RadioCards.Item>
                    <RadioCards.Item value="3">
                      <Flex direction="column" width="100%">
                        <Text weight="bold">Option 3</Text>
                        <Text>Description</Text>
                      </Flex>
                    </RadioCards.Item>
                  </RadioCards.Root>
                </Box>
              </Box>
            ))}
          </Flex>
        </Card>

        {/* Radio Cards with Service Plans */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Service Plan Selection</Heading>
          <Box maxWidth="600px">
            <RadioCards.Root defaultValue="basic" columns={{ initial: "1", sm: "3" }}>
              <RadioCards.Item value="basic">
                <Flex direction="column" width="100%" align="center" gap="2" p="2">
                  <Zap size={24} />
                  <Text weight="bold">Basic</Text>
                  <Text align="center" size="4" weight="bold" mb="1">$9.99</Text>
                  <Text align="center" size="2" color="gray">Essential features for individuals</Text>
                </Flex>
              </RadioCards.Item>
              <RadioCards.Item value="pro">
                <Flex direction="column" width="100%" align="center" gap="2" p="2">
                  <Wifi size={24} />
                  <Text weight="bold">Pro</Text>
                  <Text align="center" size="4" weight="bold" mb="1">$19.99</Text>
                  <Text align="center" size="2" color="gray">Advanced features for professionals</Text>
                </Flex>
              </RadioCards.Item>
              <RadioCards.Item value="enterprise">
                <Flex direction="column" width="100%" align="center" gap="2" p="2">
                  <Cloud size={24} />
                  <Text weight="bold">Enterprise</Text>
                  <Text align="center" size="4" weight="bold" mb="1">$49.99</Text>
                  <Text align="center" size="2" color="gray">Complete solution for businesses</Text>
                </Flex>
              </RadioCards.Item>
            </RadioCards.Root>
          </Box>
        </Card>

        {/* Radio Cards with Disabled Items */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Disabled Radio Cards</Heading>
          <Box maxWidth="600px">
            <RadioCards.Root defaultValue="1" columns={{ initial: "1", sm: "3" }}>
              <RadioCards.Item value="1" disabled>
                <Flex direction="column" width="100%">
                  <Text weight="bold">Disabled 1</Text>
                  <Text>Description</Text>
                </Flex>
              </RadioCards.Item>
              <RadioCards.Item value="2" disabled>
                <Flex direction="column" width="100%">
                  <Text weight="bold">Disabled 2</Text>
                  <Text>Description</Text>
                </Flex>
              </RadioCards.Item>
              <RadioCards.Item value="3" disabled>
                <Flex direction="column" width="100%">
                  <Text weight="bold">Disabled 3</Text>
                  <Text>Description</Text>
                </Flex>
              </RadioCards.Item>
            </RadioCards.Root>
          </Box>
        </Card>
      </div>
    </div>
  )
}
