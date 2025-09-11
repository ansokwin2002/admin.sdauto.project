'use client'

import React from 'react'
import { Button, Card, Dialog, Flex, Heading, Text, TextField, Table, Inset } from '@radix-ui/themes'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function DialogDemo() {
  usePageTitle('Dialog')

  return (
    <div>
      <Heading mb="5">Dialog</Heading>
      
      <div className="space-y-5">
        {/* Basic Dialog */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Basic Dialog</Heading>
          <Dialog.Root>
            <Dialog.Trigger>
              <Button>Open Dialog</Button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>Basic Dialog</Dialog.Title>
              <Dialog.Description>
                This is a basic dialog with title and description.
              </Dialog.Description>
              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft" color="gray">Cancel</Button>
                </Dialog.Close>
                <Dialog.Close>
                  <Button>Save</Button>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Card>

        {/* Dialog with Form */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Dialog with Form</Heading>
          <Dialog.Root>
            <Dialog.Trigger>
              <Button>Edit profile</Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="450px">
              <Dialog.Title>Edit profile</Dialog.Title>
              <Dialog.Description size="2" mb="4">
                Make changes to your profile.
              </Dialog.Description>

              <Flex direction="column" gap="3">
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    Name
                  </Text>
                  <TextField.Root
                    defaultValue="Freja Johnsen"
                    placeholder="Enter your full name"
                  />
                </label>
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    Email
                  </Text>
                  <TextField.Root
                    defaultValue="freja@example.com"
                    placeholder="Enter your email"
                  />
                </label>
              </Flex>

              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft" color="gray">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Dialog.Close>
                  <Button>Save</Button>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>

        </Card>

        {/* Dialog Sizes */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Dialog Sizes</Heading>
          <Flex gap="4">
            <Dialog.Root>
              <Dialog.Trigger>
                <Button>Small Dialog</Button>
              </Dialog.Trigger>
              <Dialog.Content size="1" maxWidth="250px">
                <Dialog.Title size="2">Small Dialog</Dialog.Title>
                <Dialog.Description size="2">This is a small sized dialog.</Dialog.Description>
                <Flex gap="3" mt="4" justify="end">
                  <Dialog.Close>
                    <Button size="1">Close</Button>
                  </Dialog.Close>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>

            <Dialog.Root>
              <Dialog.Trigger>
                <Button size="2">Medium Dialog</Button>
              </Dialog.Trigger>
              <Dialog.Content size="2">
                <Dialog.Title>Medium Dialog</Dialog.Title>
                <Dialog.Description>This is a medium sized dialog.</Dialog.Description>
                <Flex gap="3" mt="4" justify="end">
                  <Dialog.Close>
                    <Button size="2">Close</Button>
                  </Dialog.Close>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>

            <Dialog.Root>
              <Dialog.Trigger>
                <Button>Large Dialog</Button>
              </Dialog.Trigger>
              <Dialog.Content size="3">
                <Dialog.Title>Large Dialog</Dialog.Title>
                <Dialog.Description>This is a large sized dialog.</Dialog.Description>
                <Flex gap="3" mt="4" justify="end">
                  <Dialog.Close>
                    <Button size="3">Close</Button>
                  </Dialog.Close>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>
          </Flex>
        </Card>

        {/* Dialog with Inset Content */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Dialog with Inset Content</Heading>
          <Dialog.Root>
            <Dialog.Trigger>
              <Button>View Users</Button>
            </Dialog.Trigger>
            <Dialog.Content size="4">
              <Dialog.Title>User List</Dialog.Title>
              <Dialog.Description mb="4">
                View and manage system users.
              </Dialog.Description>
              <Inset side="x" my="5">
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>John Doe</Table.Cell>
                      <Table.Cell>Admin</Table.Cell>
                      <Table.Cell>Active</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Jane Smith</Table.Cell>
                      <Table.Cell>Editor</Table.Cell>
                      <Table.Cell>Active</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Bob Johnson</Table.Cell>
                      <Table.Cell>Viewer</Table.Cell>
                      <Table.Cell>Inactive</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table.Root>
              </Inset>
              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button>Close</Button>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Card>
      </div>
    </div>
  )
}
