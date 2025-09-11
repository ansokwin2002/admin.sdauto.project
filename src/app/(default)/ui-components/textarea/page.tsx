import { Card, Flex, Heading, TextArea } from '@radix-ui/themes'

export const metadata = {
  title: "Text Area | EatlyPOS",
}

export default function TextAreaDemo() {
  return (
    <div>
      <Heading mb="5">Text Area</Heading>
      
      <div className="space-y-5">
        {/* Basic TextArea */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Basic Text Area</Heading>
          <TextArea placeholder="Enter your message" />
        </Card>

        {/* TextArea Sizes */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Text Area Sizes</Heading>
          <Flex direction="column" gap="4">
            <TextArea size="1" placeholder="Size 1" />
            <TextArea size="2" placeholder="Size 2 (default)" />
            <TextArea size="3" placeholder="Size 3" />
          </Flex>
        </Card>

        {/* TextArea Variants */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Text Area Variants</Heading>
          <Flex direction="column" gap="4">
            <TextArea variant="surface" placeholder="Surface variant" />
            <TextArea variant="soft" placeholder="Soft variant" />
            <TextArea variant="classic" placeholder="Classic variant" />
          </Flex>
        </Card>

        {/* TextArea States */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Text Area States</Heading>
          <Flex direction="column" gap="4">
            <TextArea placeholder="Regular state" />
            <TextArea disabled placeholder="Disabled state" />
            <TextArea readOnly value="Read-only state" />
          </Flex>
        </Card>

        {/* TextArea with Color */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Text Area with Color</Heading>
          <Flex direction="column" gap="4">
            <TextArea color="red" variant="soft" placeholder="Red" />
            <TextArea color="blue" variant="soft" placeholder="Blue" />
          </Flex>
        </Card>

        {/* TextArea with Radius */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Text Area with Radius</Heading>
          <Flex direction="column" gap="4">
            <TextArea radius="none" placeholder="None" />
            <TextArea radius="large" placeholder="Large" />
            <TextArea radius="full" placeholder="Full" />
          </Flex>
        </Card>

        {/* TextArea Resize */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Text Area Resize</Heading>
          <Flex direction="column" gap="4">
            <TextArea resize="none" placeholder="None" />
            <TextArea resize="both" placeholder="Both" />
            <TextArea resize="horizontal" placeholder="Horizontal" />
            <TextArea resize="vertical" placeholder="Vertical" />
          </Flex>
        </Card>
      </div>
    </div>
  )
} 