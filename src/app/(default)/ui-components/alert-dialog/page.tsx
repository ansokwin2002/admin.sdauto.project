'use client'

import React from 'react'
import {
  AlertDialog,
  Button,
  Flex,
  Card,
  Heading
} from '@radix-ui/themes'
import { AlertTriangle } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function AlertDialogDemo() {
  usePageTitle('Alert Dialog')
  return (
    <div>
      <Heading mb="5">Alert Dialog</Heading>
      
      <div className="space-y-5">
        {/* Danger Alert Dialog */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Danger Alert Dialog</Heading>
          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <Button color="red">Delete Account</Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content maxWidth="450px">
              <AlertDialog.Title>Delete Account</AlertDialog.Title>
              <AlertDialog.Description size="2">
                Are you sure? This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </AlertDialog.Description>
              
              <Flex gap="3" mt="4" justify="end">
                <AlertDialog.Cancel>
                  <Button variant="soft" color="gray">
                    Cancel
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button variant="solid" color="red">
                    Delete Account
                  </Button>
                </AlertDialog.Action>
              </Flex>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </Card>
        
        {/* Basic Alert Dialog */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Basic Alert Dialog</Heading>
          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <Button color="blue">Save Changes</Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content maxWidth="450px">
              <AlertDialog.Title>Unsaved Changes</AlertDialog.Title>
              <AlertDialog.Description size="2">
                You have unsaved changes. Would you like to save them before leaving?
              </AlertDialog.Description>
              
              <Flex gap="3" mt="4" justify="end">
                <AlertDialog.Cancel>
                  <Button variant="soft" color="gray">
                    Discard
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button variant="solid" color="blue">
                    Save Changes
                  </Button>
                </AlertDialog.Action>
              </Flex>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </Card>
        
        {/* Alert Dialog with Icon */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Alert Dialog with Icon</Heading>
          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <Button color="amber">Warning Example</Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content maxWidth="450px">
              <Flex gap="3" align="center" mb="4">
                <AlertTriangle size={24} className="text-amber-500" />
                <AlertDialog.Title mb="0" trim="both">Warning</AlertDialog.Title>
              </Flex>
              <AlertDialog.Description size="2" className="mt-2">
                This action might have consequences. Are you sure you want to proceed?
              </AlertDialog.Description>
              
              <Flex gap="3" mt="4" justify="end">
                <AlertDialog.Cancel>
                  <Button variant="soft" color="gray">
                    Cancel
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button variant="solid" color="amber">
                    Proceed Anyway
                  </Button>
                </AlertDialog.Action>
              </Flex>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </Card>

        {/* Alert Dialog Sizes */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Alert Dialog Sizes</Heading>
          <Flex gap="4" wrap="wrap">
            <AlertDialog.Root>
              <AlertDialog.Trigger>
                <Button>Size 1</Button>
              </AlertDialog.Trigger>
              <AlertDialog.Content size="1" maxWidth="250px">
                <AlertDialog.Title size="3">Extra Small Dialog</AlertDialog.Title>
                <AlertDialog.Description size="2">
                  {`This is a small sized alert dialog with size="1"`}
                </AlertDialog.Description>
                
                <Flex gap="3" mt="4" justify="end">
                  <AlertDialog.Cancel>
                    <Button variant="soft" color="gray" size="1">Cancel</Button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action>
                    <Button variant="solid" size="1">Confirm</Button>
                  </AlertDialog.Action>
                </Flex>
              </AlertDialog.Content>
            </AlertDialog.Root>

            <AlertDialog.Root>
              <AlertDialog.Trigger>
                <Button>Size 2</Button>
              </AlertDialog.Trigger>
              <AlertDialog.Content size="2" maxWidth="350px">
                <AlertDialog.Title size="3">Small Dialog</AlertDialog.Title>
                <AlertDialog.Description size="2">
                  {`This is an extra large sized alert dialog with size="4"`}
                </AlertDialog.Description>
                
                <Flex gap="3" mt="4" justify="end">
                  <AlertDialog.Cancel>
                    <Button variant="soft" color="gray">Cancel</Button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action>
                    <Button variant="solid">Confirm</Button>
                  </AlertDialog.Action>
                </Flex>
              </AlertDialog.Content>
            </AlertDialog.Root>

            <AlertDialog.Root>
              <AlertDialog.Trigger>
                <Button>Size 3 (Default)</Button>
              </AlertDialog.Trigger>
              <AlertDialog.Content size="3" maxWidth="450px">
                <AlertDialog.Title>Default Dialog</AlertDialog.Title>
                <AlertDialog.Description>
                  {`This is the default sized alert dialog with size="2"`}
                </AlertDialog.Description>
                
                <Flex gap="3" mt="4" justify="end">
                  <AlertDialog.Cancel>
                    <Button variant="soft" color="gray">Cancel</Button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action>
                    <Button variant="solid">Confirm</Button>
                  </AlertDialog.Action>
                </Flex>
              </AlertDialog.Content>
            </AlertDialog.Root>

            <AlertDialog.Root>
              <AlertDialog.Trigger>
                <Button>Size 4</Button>
              </AlertDialog.Trigger>
              <AlertDialog.Content size="4" maxWidth="550px">
                <AlertDialog.Title>Large Dialog</AlertDialog.Title>
                <AlertDialog.Description size="4">
                  {`This is a large sized alert dialog with size="4"`}
                </AlertDialog.Description>
                
                <Flex gap="3" mt="4" justify="end">
                  <AlertDialog.Cancel>
                    <Button variant="soft" color="gray" size="3">Cancel</Button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action>
                    <Button variant="solid" size="3">Confirm</Button>
                  </AlertDialog.Action>
                </Flex>
              </AlertDialog.Content>
            </AlertDialog.Root>
          </Flex>
        </Card>
      </div>
    </div>
  )
}
