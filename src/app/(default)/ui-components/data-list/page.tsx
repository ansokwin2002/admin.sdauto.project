import React from 'react'
import { Box, Card, DataList, Flex, Heading, Text } from '@radix-ui/themes'

export const metadata = {
  title: "Data List | EatlyPOS",
}

export default function DataListDemo() {
  return (
    <div>
      <Heading mb="5">Data List</Heading>
      
      <div className="space-y-5">
        {/* Basic Data List */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Basic Data List</Heading>
          <DataList.Root>
            <DataList.Item>
              <DataList.Label>Status</DataList.Label>
              <DataList.Value>Active</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Created</DataList.Label>
              <DataList.Value>Dec 12, 2023</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Last Updated</DataList.Label>
              <DataList.Value>Jan 5, 2024</DataList.Value>
            </DataList.Item>
          </DataList.Root>
        </Card>

        {/* Data List Sizes */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Data List Sizes</Heading>
          <Flex direction="column" gap="4">
            <DataList.Root size="1">
              <DataList.Item>
                <DataList.Label>Size 1</DataList.Label>
                <DataList.Value>Compact</DataList.Value>
              </DataList.Item>
            </DataList.Root>

            <DataList.Root size="2">
              <DataList.Item>
                <DataList.Label>Size 2</DataList.Label>
                <DataList.Value>Default</DataList.Value>
              </DataList.Item>
            </DataList.Root>

            <DataList.Root size="3">
              <DataList.Item>
                <DataList.Label>Size 3</DataList.Label>
                <DataList.Value>Large</DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </Flex>
        </Card>

        {/* Data List Colors */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Data List Colors</Heading>
          <Flex direction="column" gap="4">
            <DataList.Root>
              <DataList.Item>
                <DataList.Label color="indigo">Indigo</DataList.Label>
                <DataList.Value>Value</DataList.Value>
              </DataList.Item>
            </DataList.Root>

            <DataList.Root>
              <DataList.Item>
                <DataList.Label color="cyan">Cyan</DataList.Label>
                <DataList.Value>Value</DataList.Value>
              </DataList.Item>
            </DataList.Root>

            <DataList.Root>
              <DataList.Item>
                <DataList.Label color="orange">Orange</DataList.Label>
                <DataList.Value>Value</DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </Flex>
        </Card>

        {/* High Contrast Data List */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">High Contrast Data List</Heading>
          <Flex direction="column" gap="4">
            <DataList.Root>
              <DataList.Item>
                <DataList.Label color="indigo">Regular Contrast</DataList.Label>
                <DataList.Value>Value</DataList.Value>
              </DataList.Item>
            </DataList.Root>

            <DataList.Root>
              <DataList.Item>
                <DataList.Label color="indigo" highContrast>High Contrast</DataList.Label>
                <DataList.Value>Value</DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </Flex>
        </Card>

        {/* Data List Orientation */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Data List Orientation</Heading>
          <Flex direction="column" gap="4">
            <Box>
              <Text weight="bold" mb="2">Horizontal (Default)</Text>
              <DataList.Root>
                <DataList.Item>
                  <DataList.Label>Label</DataList.Label>
                  <DataList.Value>Value</DataList.Value>
                </DataList.Item>
              </DataList.Root>
            </Box>

            <Box>
              <Text weight="bold" mb="2">Vertical</Text>
              <DataList.Root orientation="vertical">
                <DataList.Item>
                  <DataList.Label>Label</DataList.Label>
                  <DataList.Value>Value</DataList.Value>
                </DataList.Item>
              </DataList.Root>
            </Box>
          </Flex>
        </Card>
      </div>
    </div>
  )
}
