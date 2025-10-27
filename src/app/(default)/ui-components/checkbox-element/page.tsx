import React from 'react'
import { Box, Card, Checkbox, Flex, Heading, Text } from '@radix-ui/themes'

export const metadata = {
  title: "Checkbox | SDAUTO",
}

export default function CheckboxElement() {
  return (
    <div>
      <Heading mb="5">Checkbox</Heading>
      
      <div className="space-y-5">
        {/* Basic Checkbox */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Basic Checkbox</Heading>
          <Flex gap="4" wrap="wrap">
            <Text as="label" size="2">
              <Flex gap="2">
                <Checkbox defaultChecked /> Accept terms and conditions
              </Flex>
            </Text>
          </Flex>
        </Card>

        {/* Checkbox Sizes */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Checkbox Sizes</Heading>
          <Flex direction="column" gap="4">
            <Text as="label" size="1">
              <Flex gap="2" align="center">
                <Checkbox size="1" defaultChecked /> Size 1
              </Flex>
            </Text>
            <Text as="label" size="2">
              <Flex gap="2" align="center">
                <Checkbox size="2" defaultChecked /> Size 2
              </Flex>
            </Text>
            <Text as="label" size="3">
              <Flex gap="2" align="center">
                <Checkbox size="3" defaultChecked /> Size 3
              </Flex>
            </Text>
          </Flex>
        </Card>

        {/* Checkbox Variants */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Checkbox Variants</Heading>
          <Flex direction="column" gap="4">
            <Text as="label" size="2">
              <Flex gap="2">
                <Checkbox variant="classic" defaultChecked /> Classic variant
              </Flex>
            </Text>
            <Text as="label" size="2">
              <Flex gap="2">
                <Checkbox variant="soft" defaultChecked /> Soft variant
              </Flex>
            </Text>
          </Flex>
        </Card>

        {/* Checkbox Colors */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Checkbox Colors</Heading>
          <Flex gap="4">
            <Text as="label" size="2">
              <Flex gap="2">
                <Checkbox color="indigo" defaultChecked /> Indigo
              </Flex>
            </Text>
            <Text as="label" size="2">
              <Flex gap="2">
                <Checkbox color="cyan" defaultChecked /> Cyan
              </Flex>
            </Text>
            <Text as="label" size="2">
              <Flex gap="2">
                <Checkbox color="green" defaultChecked /> Green
              </Flex>
            </Text>
            <Text as="label" size="2">
              <Flex gap="2">
                <Checkbox color="orange" defaultChecked /> Orange
              </Flex>
            </Text>
            <Text as="label" size="2">
              <Flex gap="2">
                <Checkbox color="red" defaultChecked /> Red
              </Flex>
            </Text>
          </Flex>
          <Flex gap="4" className='mt-4'>
            <Text as="label" size="2">
              <Flex gap="2">
                <Checkbox color="indigo" variant="soft" defaultChecked /> Indigo
              </Flex>
            </Text>
            <Text as="label" size="2">
              <Flex gap="2">
                <Checkbox color="cyan" variant="soft" defaultChecked /> Cyan
              </Flex>
            </Text>
            <Text as="label" size="2">
              <Flex gap="2">
                <Checkbox color="green" variant="soft" defaultChecked /> Green
              </Flex>
            </Text>
            <Text as="label" size="2">
              <Flex gap="2">
                <Checkbox color="orange" variant="soft" defaultChecked /> Orange
              </Flex>
            </Text>
            <Text as="label" size="2">
              <Flex gap="2">
                <Checkbox color="red" variant="soft" defaultChecked /> Red
              </Flex>
            </Text>
          </Flex>
        </Card>

        {/* High Contrast Checkbox */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">High Contrast Checkbox</Heading>
          <Flex gap="2">
            <Checkbox color="indigo" highContrast defaultChecked />
            <Checkbox color="cyan" highContrast defaultChecked />
            <Checkbox color="green" highContrast defaultChecked />
            <Checkbox color="orange" highContrast defaultChecked />
            <Checkbox color="red" highContrast defaultChecked />
          </Flex>
        </Card>

        {/* Checkbox Alignment */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Checkbox Alignment</Heading>
          <Box maxWidth="300px">
            <Text as="label" size="3">
              <Flex as="span" gap="2">
                <Checkbox defaultChecked /> I understand that these documents are
                confidential and cannot be shared with a third party.
              </Flex>
            </Text>
          </Box>

        </Card>

        {/* Checkbox States*/}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Checkbox States and Indeterminate</Heading>
          <Flex direction="column" gap="4">
            <Text as="label" size="2">
              <Flex gap="2">
                <Checkbox disabled /> Disabled unchecked
              </Flex>
            </Text>
            <Text as="label" size="2">
              <Flex gap="2">
                <Checkbox disabled defaultChecked /> Disabled checked
              </Flex>
            </Text>
            <Text as="label" size="2">
              <Flex gap="2">
                <Checkbox checked="indeterminate" /> Indeterminate state
              </Flex>
            </Text>
            <Text as="label" size="2">
              <Flex gap="2">
                <Checkbox disabled checked="indeterminate" /> Disabled indeterminate state
              </Flex>
            </Text>
          </Flex>
        </Card>
      </div>
    </div>
  )
}
