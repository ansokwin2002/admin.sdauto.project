
import { Card, Flex, Heading, TextField } from '@radix-ui/themes'
import { Search } from 'lucide-react'

export const metadata = {
  title: "Text Field | SDAUTO",
}

export default function TextFieldDemo() {
  return (
    <div>
      <Heading mb="5">Text Field</Heading>
      
      <div className="space-y-5">
        {/* Basic TextField */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Basic Text Field</Heading>
          <TextField.Root placeholder="Enter text" />
        </Card>

        {/* TextField with Icons */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Text Field with Icons</Heading>
          <Flex direction="column" gap="4">
            <TextField.Root placeholder="Search...">
              <TextField.Slot>
                <Search size={16} />
              </TextField.Slot>
            </TextField.Root>
          </Flex>
        </Card>

        {/* TextField Sizes */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Text Field Sizes</Heading>
          <Flex direction="column" gap="4">
            <TextField.Root size="1" placeholder="Size 1" />
            <TextField.Root size="2" placeholder="Size 2 (default)" />
            <TextField.Root size="3" placeholder="Size 3" />
          </Flex>
        </Card>

        {/* TextField Variants */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Text Field Variants</Heading>
          <Flex direction="column" gap="4">
            <TextField.Root variant="surface" placeholder="Surface variant" />
            <TextField.Root variant="soft" placeholder="Soft variant" />
            <TextField.Root variant="classic" placeholder="Classic variant" />
          </Flex>
        </Card>

        {/* TextField Radius */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Text Field Radius</Heading>
          <Flex direction="column" gap="4">
            <TextField.Root radius="none" placeholder="None" />
            <TextField.Root radius="large" placeholder="Large" />
            <TextField.Root radius="full" placeholder="Full" />
          </Flex>
        </Card>

        {/* TextField States */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Text Field States</Heading>
          <Flex direction="column" gap="4">
            <TextField.Root placeholder="Regular state" />
            <TextField.Root disabled placeholder="Disabled state" />
            <TextField.Root readOnly value="Read-only state" />
          </Flex>
        </Card>
      </div>
    </div>
  )
} 