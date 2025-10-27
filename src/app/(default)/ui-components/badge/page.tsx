import React from 'react'
import { Badge, Card, Flex, Heading } from '@radix-ui/themes'

export const metadata = {
  title: "Badge | SDAUTO",
}

export default function BadgeDemo() {
  return (
    <div>
      <Heading mb="5">Badge</Heading>
      
      <div className="space-y-5">
        {/* Basic Badges */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Basic Badges</Heading>
          <Flex gap="4" wrap="wrap">
            <Badge>Default Badge</Badge>
            <Badge highContrast>High Contrast</Badge>
          </Flex>
        </Card>

        {/* Badge Variants */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Badge Variants</Heading>
          <Flex gap="4" wrap="wrap">
            <Badge variant="solid">Solid</Badge>
            <Badge variant="soft">Soft</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="surface">Surface</Badge>
          </Flex>
        </Card>

        {/* Badge Colors */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Badge Colors</Heading>
          <Flex gap="4" wrap="wrap">
            <Badge color="indigo">Indigo</Badge>
            <Badge color="cyan">Cyan</Badge>
            <Badge color="green">Green</Badge>
            <Badge color="orange">Orange</Badge>
            <Badge color="red">Red</Badge>
            <Badge color="gray">Gray</Badge>
          </Flex>
          <Flex gap="4" wrap="wrap" className="mt-4">
            <Badge color="indigo" variant="soft">Indigo</Badge>
            <Badge color="cyan" variant="soft">Cyan</Badge>
            <Badge color="green" variant="soft">Green</Badge>
            <Badge color="orange" variant="soft">Orange</Badge>
            <Badge color="red" variant="soft">Red</Badge>
            <Badge color="gray" variant="soft">Gray</Badge>
          </Flex>
          <Flex gap="4" wrap="wrap" className="mt-4">
            <Badge color="indigo" variant="outline">Indigo</Badge>
            <Badge color="cyan" variant="outline">Cyan</Badge>
            <Badge color="green" variant="outline">Green</Badge>
            <Badge color="orange" variant="outline">Orange</Badge>
            <Badge color="red" variant="outline">Red</Badge>
            <Badge color="gray" variant="outline">Gray</Badge>
          </Flex>
          <Flex gap="4" wrap="wrap" className="mt-4">
            <Badge color="indigo" variant="surface">Indigo</Badge>
            <Badge color="cyan" variant="surface">Cyan</Badge>
            <Badge color="green" variant="surface">Green</Badge>
            <Badge color="orange" variant="surface">Orange</Badge>
            <Badge color="red" variant="surface">Red</Badge>
            <Badge color="gray" variant="surface">Gray</Badge>
          </Flex>
        </Card>

        {/* Badge Sizes */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Badge Sizes</Heading>
          <Flex gap="4" align="center" wrap="wrap">
            <Badge>Size 1 (Default)</Badge>
            <Badge size="2">Size 2</Badge>
            <Badge size="3">Size 3</Badge>
          </Flex>
        </Card>

        {/* Badge Radius */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Badge Radius</Heading>
          <Flex gap="4" wrap="wrap">
            <Badge radius="none">None</Badge>
            <Badge radius="small">Small</Badge>
            <Badge radius="medium">Medium (Default)</Badge>
            <Badge radius="large">Large</Badge>
            <Badge radius="full">Full Radius</Badge>
          </Flex>
        </Card>
      </div>
    </div>
  )
}
