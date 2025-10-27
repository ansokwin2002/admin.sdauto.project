import { Tabs, Card, Heading, Flex, Text } from '@radix-ui/themes'

export const metadata = {
  title: "Tabs | SDAUTO",
}

export default function TabsDemo() {
  return (
    <div>
      <Heading mb="5">Tabs</Heading>
      
      <div className="space-y-5">
        {/* Basic Tabs */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Basic Tabs</Heading>
          <Tabs.Root defaultValue="account">
            <Tabs.List>
              <Tabs.Trigger value="account">Account</Tabs.Trigger>
              <Tabs.Trigger value="documents">Documents</Tabs.Trigger>
              <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="account">
              <Text as="p" mt="3">
                Make changes to your account here. Click save when you&apos;re done.
              </Text>
            </Tabs.Content>
            <Tabs.Content value="documents">
              <Text as="p" mt="3">
                Access and manage your documents here.
              </Text>
            </Tabs.Content>
            <Tabs.Content value="settings">
              <Text as="p" mt="3">
                Edit your notification and privacy settings here.
              </Text>
            </Tabs.Content>
          </Tabs.Root>
        </Card>

        {/* Tabs Colors */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Tabs Colors</Heading>
          <Flex direction="column" gap="4">
            <Tabs.Root defaultValue="tab1">
              <Tabs.List color="indigo">
                <Tabs.Trigger value="tab1">Indigo</Tabs.Trigger>
                <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>

            <Tabs.Root defaultValue="tab1">
              <Tabs.List color="cyan">
                <Tabs.Trigger value="tab1">Cyan</Tabs.Trigger>
                <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>

            <Tabs.Root defaultValue="tab1">
              <Tabs.List color="green">
                <Tabs.Trigger value="tab1">Green</Tabs.Trigger>
                <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>

            <Tabs.Root defaultValue="tab1">
              <Tabs.List color="orange">
                <Tabs.Trigger value="tab1">Orange</Tabs.Trigger>
                <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>

            <Tabs.Root defaultValue="tab1">
              <Tabs.List color="red">
                <Tabs.Trigger value="tab1">Red</Tabs.Trigger>
                <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </Flex>
        </Card>

        {/* Tabs Sizes */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Tabs Sizes</Heading>
          <Flex direction="column" gap="4">
            <Tabs.Root defaultValue="tab1">
              <Tabs.List size="1">
                <Tabs.Trigger value="tab1">Size 1</Tabs.Trigger>
                <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>

            <Tabs.Root defaultValue="tab1">
              <Tabs.List size="2">
                <Tabs.Trigger value="tab1">Size 2 (Default)</Tabs.Trigger>
                <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </Flex>
        </Card>

        {/* Tabs with Disabled State */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Tabs with Disabled State</Heading>
          <Tabs.Root defaultValue="tab1">
            <Tabs.List>
              <Tabs.Trigger value="tab1">Active</Tabs.Trigger>
              <Tabs.Trigger value="tab2" disabled>Disabled</Tabs.Trigger>
              <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="tab1">
              <Text as="p" mt="3">
                This is the active tab content.
              </Text>
            </Tabs.Content>
          </Tabs.Root>
        </Card>
      </div>
    </div>
  )
} 