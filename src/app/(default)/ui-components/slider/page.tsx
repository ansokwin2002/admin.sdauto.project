'use client'

import { Slider } from '@radix-ui/themes'
import { Heading, Card, Flex, Text } from '@radix-ui/themes'
import { useState } from 'react'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function SliderDemo() {
  usePageTitle('Slider');
  const [value, setValue] = useState(50)
  return (
    <div>
      <Heading mb="5">Slider</Heading>
      
      <div className="space-y-5">
        {/* Basic Slider */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Basic Slider</Heading>
          <Slider defaultValue={[50]} />
        </Card>

        {/* Slider Sizes */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Slider Sizes</Heading>
          <Flex direction="column" gap="4">
            <Slider size="1" defaultValue={[50]} />
            <Slider size="2" defaultValue={[50]} />
            <Slider size="3" defaultValue={[50]} />
          </Flex>
        </Card>

        {/* Slider with Range */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Slider with Range</Heading>
          <Slider defaultValue={[25, 75]} />
        </Card>

        {/* Slider with Custom Range and Step */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Slider with Custom Range and Step</Heading>
          <Slider defaultValue={[50]} min={0} max={100} step={10} onValueChange={(value) => setValue(value[0])} />
          <Text as="p" mt="3">
            Min: 0, Max: 100, Step: 10, Current Value: {value}
          </Text>
        </Card>

        {/* Disabled Slider */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Disabled Slider</Heading>
          <Slider defaultValue={[50]} disabled />
        </Card>

        {/* Slider Variants */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Slider Variants</Heading>
          <Flex direction="column" gap="4">
            <Slider variant="classic" defaultValue={[50]} />
            <Slider variant="surface" defaultValue={[50]} />
            <Slider variant="soft" defaultValue={[50]} />
          </Flex>
        </Card>

        {/* Slider Colors */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Slider Colors</Heading>
          <Flex direction="column" gap="4">
            <Slider color="cyan" defaultValue={[50]} />
            <Slider color="indigo" defaultValue={[50]} />
            <Slider color="orange" defaultValue={[50]} />
            <Slider color="crimson" defaultValue={[50]} />
          </Flex>
        </Card>
      </div>
    </div>
  )
}
