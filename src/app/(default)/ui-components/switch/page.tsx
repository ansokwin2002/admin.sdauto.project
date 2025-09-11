import { Switch, Card, Heading, Flex, Text } from '@radix-ui/themes'

export const metadata = {
  title: "Switch | EatlyPOS",
}

export default function SwitchDemo() {
  return (
    <div>
      <Heading mb="5">Switch</Heading>
      
      <div className="space-y-5">
        {/* Basic Switches */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Basic Switches</Heading>
          <Flex direction="column" gap="4">
            <Text as="label" size="2">
              <Flex gap="2">
                <Switch defaultChecked /> Airplane Mode
              </Flex>
            </Text>
            <Text as="label" size="2">
              <Flex gap="2">
                <Switch disabled /> Disabled Switch
              </Flex>
            </Text>
          </Flex>
        </Card>

        {/* Switch Sizes */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Switch Sizes</Heading>
          <Flex direction="column" gap="4">
            <Text as="label" size="2">
              <Flex gap="2">
                <Switch size="1" defaultChecked /> Small
              </Flex>
            </Text>
            <Text as="label" size="2">
              <Flex gap="2">
                <Switch size="2" defaultChecked /> Medium
              </Flex>
            </Text>
            <Text as="label" size="2">
              <Flex gap="2">
                <Switch size="3" defaultChecked /> Large
              </Flex>
            </Text>
          </Flex>
        </Card>

        {/* Switch Colors */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Switch Colors</Heading>
          <Flex gap="4">
            <Switch color="indigo" defaultChecked />
            <Switch color="cyan" defaultChecked />
            <Switch color="green" defaultChecked />
            <Switch color="orange" defaultChecked />
            <Switch color="red" defaultChecked />
          </Flex>
          <Flex gap="4" mt="4">
            <Switch color="indigo" defaultChecked variant="soft" />
            <Switch color="cyan" defaultChecked variant="soft" />
            <Switch color="green" defaultChecked variant="soft" />
            <Switch color="orange" defaultChecked variant="soft" />
            <Switch color="red" defaultChecked variant="soft" />
          </Flex>
        </Card>

        {/* Switch Radius */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Switch Radius</Heading>
          <Flex gap="4">
            <Switch radius="none" defaultChecked />
            <Switch radius="small" defaultChecked />
            <Switch radius="medium" defaultChecked />
            <Switch radius="large" defaultChecked />
            <Switch radius="full" defaultChecked />
          </Flex>
        </Card>

          {/* switch variant */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Switch Variant</Heading>
          <Flex gap="4">
            <Switch variant="soft" checked={false} />
            <Switch variant="classic" checked={false} />
            <Switch variant="surface" checked={false} />
          </Flex>
          <Flex gap="4" mt="4">
            <Switch variant="soft" defaultChecked />
            <Switch variant="classic" defaultChecked />
            <Switch variant="surface" defaultChecked />
          </Flex>
        </Card>
      </div>
    </div>
  )
} 