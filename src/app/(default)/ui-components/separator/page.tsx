import React from 'react'
import { Separator } from '@radix-ui/themes'
import { Box, Flex, Grid, Text, Heading, Card } from '@radix-ui/themes'

export const metadata = {
  title: "Separator | EatlyPOS",
}

export default function SeparatorDemo() {
  return (
    <div>
      <Heading size="6" mb="6">Separator</Heading>

      <Grid columns={{ initial: '1', md: '2' }} gap="6">
        {/* Size variants */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Sizes</Heading>
          <Flex direction="column" gap="6">
            <Box>
              <Text size="2" mb="2" weight="bold">Size 1</Text>
              <Separator size="1" my="3" />
              <Text size="2">Content below separator</Text>
            </Box>
            
            <Box>
              <Text size="2" mb="2" weight="bold">Size 2</Text>
              <Separator size="2" my="3" />
              <Text size="2">Content below separator</Text>
            </Box>
            
            <Box>
              <Text size="2" mb="2" weight="bold">Size 3</Text>
              <Separator size="3" my="3" />
              <Text size="2">Content below separator</Text>
            </Box>
            
            <Box>
              <Text size="2" mb="2" weight="bold">Size 4</Text>
              <Separator size="4" my="3" />
              <Text size="2">Content below separator</Text>
            </Box>
          </Flex>
        </Card>
        
        {/* Colors */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Colors</Heading>
          <Flex direction="column" gap="6">
            {['gray', 'indigo', 'cyan', 'green', 'orange', 'crimson'].map((color) => (
              <Box key={color}>
                <Text size="2" mb="2" weight="bold">{color.charAt(0).toUpperCase() + color.slice(1)}</Text>
                <Separator color={color as any} size="4" my="3" />
                <Text size="2">Content below separator</Text>
              </Box>
            ))}
          </Flex>
        </Card>
        
        {/* Orientation */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Orientation</Heading>
          <Flex direction="column" gap="6">
            <Box>
              <Text size="2" mb="2" weight="bold">Horizontal (default)</Text>
              <Separator orientation="horizontal" my="3" />
              <Text size="2">Content below separator</Text>
            </Box>
            
            <Box>
              <Text size="2" mb="2" weight="bold">Vertical</Text>
              <Flex height="100px" align="center">
                <Text size="2">Left content</Text>
                <Separator orientation="vertical" mx="3" />
                <Text size="2">Right content</Text>
              </Flex>
            </Box>
          </Flex>
        </Card>
        
        
      </Grid>
    </div>
  )
}
