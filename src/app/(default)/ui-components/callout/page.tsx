import React from 'react'
import { Callout, Card, Flex, Heading } from '@radix-ui/themes'
import { CheckCircle, Info, TriangleAlert, XCircle } from 'lucide-react'

export const metadata = {
  title: "Callout | SDAUTO",
}

export default function CalloutDemo() {
  return (
    <div>
      <Heading mb="5">Callout</Heading>
      
      <div className="space-y-5">
        {/* Basic Callout */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Basic Callout</Heading>
          <Callout.Root>
            <Callout.Icon>
              <Info size={16} />
            </Callout.Icon>
            <Callout.Text>
              This is a basic callout with an info icon.
            </Callout.Text>
          </Callout.Root>
        </Card>

        {/* Callout Variants */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Callout Variants</Heading>
          <Flex direction="column" gap="4">
            <Callout.Root variant="soft">
              <Callout.Icon>
                <Info size={16} />
              </Callout.Icon>
              <Callout.Text>
                This is a soft variant callout.
              </Callout.Text>
            </Callout.Root>

            <Callout.Root variant="outline">
              <Callout.Icon>
                <Info size={16} />
              </Callout.Icon>
              <Callout.Text>
                This is an outline variant callout.
              </Callout.Text>
            </Callout.Root>

            <Callout.Root variant="surface">
              <Callout.Icon>
                <Info size={16} />
              </Callout.Icon>
              <Callout.Text>
                This is a surface variant callout.
              </Callout.Text>
            </Callout.Root>
          </Flex>
        </Card>

        {/* Callout Colors */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Callout Colors</Heading>
          <Flex direction="column" gap="4">
            <Callout.Root color="blue">
              <Callout.Icon>
                <Info size={16} />
              </Callout.Icon>
              <Callout.Text>
                Info callout message
              </Callout.Text>
            </Callout.Root>

            <Callout.Root color="green">
              <Callout.Icon>
                <CheckCircle size={16} />
              </Callout.Icon>
              <Callout.Text>
                Success callout message
              </Callout.Text>
            </Callout.Root>

            <Callout.Root color="red">
              <Callout.Icon>
                <XCircle size={16} />
              </Callout.Icon>
              <Callout.Text>
                Error callout message
              </Callout.Text>
            </Callout.Root>

            <Callout.Root color="amber">
              <Callout.Icon>
                <TriangleAlert size={16} />
              </Callout.Icon>
              <Callout.Text>
                Warning callout message
              </Callout.Text>
            </Callout.Root>
          </Flex>
        </Card>

        {/* Callout Sizes */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Callout Sizes</Heading>
          <Flex direction="column" gap="4">
            <Callout.Root size="1">
              <Callout.Icon>
                <Info size={14} />
              </Callout.Icon>
              <Callout.Text>
                Small size callout (size 1)
              </Callout.Text>
            </Callout.Root>

            <Callout.Root size="2">
              <Callout.Icon>
                <Info size={16} />
              </Callout.Icon>
              <Callout.Text>
                Medium size callout (size 2)
              </Callout.Text>
            </Callout.Root>

            <Callout.Root size="3">
              <Callout.Icon>
                <Info size={18} />
              </Callout.Icon>
              <Callout.Text>
                Large size callout (size 3)
              </Callout.Text>
            </Callout.Root>
          </Flex>
        </Card>

        {/* High Contrast Callout */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">High Contrast Callout</Heading>
          <Flex direction="column" gap="4">
            <Callout.Root highContrast>
              <Callout.Icon>
                <Info size={16} />
              </Callout.Icon>
              <Callout.Text>
                High contrast callout example
              </Callout.Text>
            </Callout.Root>

            <Callout.Root highContrast color="blue" variant="soft">
              <Callout.Icon>
                <Info size={16} />
              </Callout.Icon>
              <Callout.Text>
                High contrast soft blue callout
              </Callout.Text>
            </Callout.Root>
          </Flex>
        </Card>
      </div>
    </div>
  )
}
