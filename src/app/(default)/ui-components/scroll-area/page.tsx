import React from 'react'
import { ScrollArea } from '@radix-ui/themes'
import { Box, Flex, Grid, Text, Heading, Card } from '@radix-ui/themes'

export const metadata = {
  title: "Scroll Area | EatlyPOS",
}

export default function ScrollAreaDemo() {
  return (
    <div>
      <Heading size="6" mb="6">Scroll Area</Heading>

      <Grid columns={{ initial: '1', md: '2' }} gap="6">
        {/* Size variants */}
        <Card>
          <Heading size="3" mb="3">Sizes</Heading>
          <Flex direction="column" gap="4">
            <Box>
              <Text size="2" mb="2" weight="bold">Size 1</Text>
              <ScrollArea size="1" style={{ height: 150 }} scrollbars="vertical">
                <Box p="2">
                  <Text size="2">
                    {longText}
                  </Text>
                </Box>
              </ScrollArea>
            </Box>
            
            <Box>
              <Text size="2" mb="2" weight="bold">Size 2</Text>
              <ScrollArea size="2" style={{ height: 150 }} scrollbars="vertical">
                <Box p="2">
                  <Text size="2">
                    {longText}
                  </Text>
                </Box>
              </ScrollArea>
            </Box>
            
            <Box>
              <Text size="2" mb="2" weight="bold">Size 3</Text>
              <ScrollArea size="3" style={{ height: 150 }} scrollbars="vertical">
                <Box p="2">
                  <Text size="2">
                    {longText}
                  </Text>
                </Box>
              </ScrollArea>
            </Box>
          </Flex>
        </Card>
        
        {/* Radius variants */}
        <Card>
          <Heading size="3" mb="3">Radius</Heading>
          <Flex direction="column" gap="4">
            <Box>
              <Text size="2" mb="2" weight="bold">Radius None</Text>
              <ScrollArea radius="none" style={{ height: 150 }} scrollbars="vertical">
                <Box p="2">
                  <Text size="2">
                    {longText}
                  </Text>
                </Box>
              </ScrollArea>
            </Box>
            
            <Box>
              <Text size="2" mb="2" weight="bold">Radius Medium</Text>
              <ScrollArea radius="medium" style={{ height: 150 }} scrollbars="vertical">
                <Box p="2">
                  <Text size="2">
                    {longText}
                  </Text>
                </Box>
              </ScrollArea>
            </Box>
            
            <Box>
              <Text size="2" mb="2" weight="bold">Radius Full</Text>
              <ScrollArea radius="full" style={{ height: 150 }} scrollbars="vertical">
                <Box p="2">
                  <Text size="2">
                    {longText}
                  </Text>
                </Box>
              </ScrollArea>
            </Box>
          </Flex>
        </Card>
        
        {/* Scrollbar variants */}
        <Card>
          <Heading size="3" mb="3">Scrollbars</Heading>
          <Flex direction="column" gap="4">
            <Box>
              <Text size="2" mb="2" weight="bold">Vertical Scrollbar</Text>
              <ScrollArea style={{ height: 150, width: '100%' }} scrollbars="vertical">
                <Box p="2">
                  <Text size="2">
                    {longText}
                  </Text>
                </Box>
              </ScrollArea>
            </Box>
            
            <Box>
              <Text size="2" mb="2" weight="bold">Horizontal Scrollbar</Text>
              <ScrollArea style={{ height: 150, width: '100%' }} scrollbars="horizontal">
                <Box p="2" style={{ width: '200%' }}>
                  <Text size="2">
                    This content is wider than the container, so it will scroll horizontally.
                  </Text>
                </Box>
              </ScrollArea>
            </Box>
            
            <Box>
              <Text size="2" mb="2" weight="bold">Both Scrollbars</Text>
              <ScrollArea style={{ height: 150, width: '100%' }} scrollbars="both">
                <Box p="2" style={{ width: '200%' }}>
                  <Text size="2">
                    {longText}
                    {longText}
                  </Text>
                </Box>
              </ScrollArea>
            </Box>
          </Flex>
        </Card>
      </Grid>
    </div>
  )
}

// Sample long text for demonstration
const longText = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, 
nunc nisl aliquet nunc, quis aliquam nisl nisl eu nisl. Nullam euismod, nisl eget aliquam ultricies, 
nunc nisl aliquet nunc, quis aliquam nisl nisl eu nisl. Nullam euismod, nisl eget aliquam ultricies, 
nunc nisl aliquet nunc, quis aliquam nisl nisl eu nisl. Nullam euismod, nisl eget aliquam ultricies, 
nunc nisl aliquet nunc, quis aliquam nisl nisl eu nisl. Nullam euismod, nisl eget aliquam ultricies, 
nunc nisl aliquet nunc, quis aliquam nisl nisl eu nisl. Nullam euismod, nisl eget aliquam ultricies, 
nunc nisl aliquet nunc, quis aliquam nisl nisl eu nisl. Nullam euismod, nisl eget aliquam ultricies, 
nunc nisl aliquet nunc, quis aliquam nisl nisl eu nisl.
`.repeat(3);
