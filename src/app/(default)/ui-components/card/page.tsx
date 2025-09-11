import React from 'react'
import { Box, Card, Flex, Heading, Inset, Strong, Text } from '@radix-ui/themes'
import Image from 'next/image'

export const metadata = {
  title: "Card | EatlyPOS",
}

export default function CardDemo() {
  return (
    <div>
      <Heading mb="5">Card</Heading>
      
      <div className="space-y-5">
        {/* Basic Card */}
        <Heading as="h2" size="3" mb="4">Basic Card</Heading>
        <Card>
          <Text>This is a basic card component.</Text>
        </Card>

        {/* Card with Custom Styling */}
        <Heading as="h2" size="3" mb="4">Card with Custom Styling</Heading>
        <Flex gap="4">
          <Card style={{ width: 250 }}>
            <Text>Fixed width card (250px)</Text>
          </Card>
          <Card className="shadow flex-1">
            <Text>Card with shadow</Text>
          </Card>
          <Card className="shadow-lg flex-1">
            <Text>Card with large shadow</Text>
          </Card>
        </Flex>
        
        {/* Card Variants */}
        <Heading as="h2" size="3" mb="4">Card Variants</Heading>
        <Flex gap="3" align="center">
          <Card>
            <Text as="div" size="2" weight="bold">
              Classic Variant (Default)
            </Text>
            <Text as="div" color="gray" size="2">
              Start building your next project in minutes
            </Text>
          </Card>

          <Card asChild>
            <a href="#" className="group">
              <Text as="div" size="2" weight="bold" className="text-indigo-600 group-hover:underline">
                Clickable Card
              </Text>
              <Text as="div" color="gray" size="2">
                Start building your next project in minutes
              </Text>
            </a>
          </Card>

          <Card variant="ghost">
            <Text as="div" size="2" weight="bold">
              Ghost Variant
            </Text>
            <Text as="div" color="gray" size="2">
              Start building your next project in minutes
            </Text>
          </Card>
        </Flex>

        {/* Card Sizes */}
        <Heading as="h2" size="3" mb="4">Card Sizes</Heading>
        <Flex direction="column" gap="4">
          <Card size="1">
            <Text>Size 1 card</Text>
          </Card>
          <Card size="2">
            <Text>Size 2 card</Text>
          </Card>
          <Card size="3">
            <Text>Size 3 card</Text>
          </Card>
          <Card size="4">
            <Text>Size 4 card</Text>
          </Card>
          <Card size="5">
            <Text>Size 5 card</Text>
          </Card>
        </Flex>

        {/* Card with Inset Content */}
        <Heading as="h2" size="3" mb="4">Card with Inset Content</Heading>
        <Box maxWidth="240px">
          <Card size="2">
            <Inset clip="padding-box" side="top" pb="current">
              <Image
                src="/images/rewards/drink-upgrade.jpg"
                alt="Bold typography"
                width={240}
                height={140}
                style={{
                  display: "block",
                  objectFit: "cover",
                  width: "100%",
                  height: 140,
                  backgroundColor: "var(--gray-5)",
                }}
              />
            </Inset>
            <Text as="p" size="3">
              <Strong>Typography</Strong> is the art and technique of arranging type to
              make written language legible, readable and appealing when displayed.
            </Text>
          </Card>
        </Box>
      </div>
    </div>
  )
}
