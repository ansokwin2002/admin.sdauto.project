'use client'

import React from 'react'
import { Popover, Button, Card, Flex, Heading, Text, Inset, Avatar, Link } from '@radix-ui/themes'
import { Settings, Bell, Info, User } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import Image from 'next/image'

export default function PopoverDemo() {
  usePageTitle('Popover');
  return (
    <div>
      <Heading mb="5">Popover</Heading>
      
      <div className="space-y-5">
        {/* Basic Popover */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Basic Popover</Heading>
          <Flex gap="4">
            <Popover.Root>
              <Popover.Trigger>
                <Button variant="soft">
                  Click me
                </Button>
              </Popover.Trigger>
              <Popover.Content>
                <Flex gap="3" direction="column">
                  <Heading size="3">Popover Title</Heading>
                  <Text size="2">This is a basic popover with some content.</Text>
                  <Button size="1">Action Button</Button>
                </Flex>
              </Popover.Content>
            </Popover.Root>
          </Flex>
        </Card>

        {/* Popover Sizes */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Popover Sizes</Heading>
          <Flex gap="4">
            <Popover.Root>
              <Popover.Trigger>
                <Button variant="soft" size="1">
                  Size 1
                </Button>
              </Popover.Trigger>
              <Popover.Content size="1">
                <Text size="1">This is a size 1 popover with compact content.</Text>
              </Popover.Content>
            </Popover.Root>

            <Popover.Root>
              <Popover.Trigger>
                <Button variant="soft" size="2">
                  Size 2
                </Button>
              </Popover.Trigger>
              <Popover.Content size="2">
                <Text size="2">This is a size 2 popover with medium content.</Text>
              </Popover.Content>
            </Popover.Root>

            <Popover.Root>
              <Popover.Trigger>
                <Button variant="soft" size="3">
                  Size 3
                </Button>
              </Popover.Trigger>
              <Popover.Content size="3">
                <Text size="3">This is a size 3 popover with larger content.</Text>
              </Popover.Content>
            </Popover.Root>
          </Flex>
        </Card>

        {/* Popover with Inset Content */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Popover with Inset Content</Heading>
          <Flex gap="4">
            <Popover.Root>
              <Popover.Trigger>
                <Button variant="soft">
                  <User size={16} />
                  User Profile
                </Button>
              </Popover.Trigger>
              <Popover.Content>
                <Inset side="top" pb="current">
                  <Image 
                    src="/images/popover/profile-banner.jpg"
                    alt="Profile banner"
                    width={250}
                    height={120}
                    style={{
                      display: 'block',
                      objectFit: 'cover',
                      width: '100%',
                      height: '120px',
                    }}
                  />
                </Inset>
                <Flex direction="column" gap="3" p="3">
                  <Flex justify="center" mt="-8" mb="1">
                    <Avatar 
                      size="5" 
                      src="/images/user-avatar.jpg"
                      radius="full"
                      fallback="JD"
                      style={{ border: '2px solid white' }}
                    />
                  </Flex>
                  <Heading size="3" align="center">John Doe</Heading>
                  <Text size="2" color="gray" align="center">Product Designer</Text>
                  <Flex gap="3" mt="2">
                    <Button size="2">Message</Button>
                    <Button size="2">View Profile</Button>
                  </Flex>
                </Flex>
              </Popover.Content>
            </Popover.Root>
          </Flex>
        </Card>

        {/* Popover with Icons */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Popover with Icons</Heading>
          <Flex gap="4">
            <Popover.Root>
              <Popover.Trigger>
                <Button variant="soft">
                  <Settings size={16} />
                  Settings
                </Button>
              </Popover.Trigger>
              <Popover.Content>
                <Flex direction="column" gap="2">
                  <Heading size="3" mb="2">Settings</Heading>
                  <Link href="#">
                    <Flex align="center" gap="2">
                      <Bell size={16} />
                      <Text size="2">Notification preferences</Text>
                    </Flex>
                  </Link>
                  <Link href="#">
                    <Flex align="center" gap="2">
                      <User size={16} />
                      <Text size="2">Account settings</Text>
                    </Flex>
                  </Link>
                  <Link href="#">
                    <Flex align="center" gap="2">
                      <Info size={16} />
                      <Text size="2">Help and support</Text>
                    </Flex>
                  </Link>
                </Flex>
              </Popover.Content>
            </Popover.Root>
          </Flex>
        </Card>
      </div>
    </div>
  )
}
