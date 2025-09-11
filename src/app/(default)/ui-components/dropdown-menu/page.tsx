'use client'

import { usePageTitle } from '@/hooks/usePageTitle'
import React from 'react'
import { Button, Card, DropdownMenu, Flex, Heading, Text } from '@radix-ui/themes'

export default function DropdownMenuDemo() {
  usePageTitle('Dropdown Menu')
  const [showFullName, setShowFullName] = React.useState(true);
  const [showEmail, setShowEmail] = React.useState(false);
  const [showProfilePic, setShowProfilePic] = React.useState(true);
  const [selectedOption, setSelectedOption] = React.useState('medium');
  return (
    <div>
      <Heading mb="5">Dropdown Menu</Heading>
      
      <div className="space-y-5">
        {/* Dropdown Menu with Submenu */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Dropdown Menu with Submenu</Heading>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button variant="soft">
                Options
                <DropdownMenu.TriggerIcon />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>
              <DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>

              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger>More</DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent>
                  <DropdownMenu.Item>Move to project…</DropdownMenu.Item>
                  <DropdownMenu.Item>Move to folder…</DropdownMenu.Item>

                  <DropdownMenu.Separator />
                  <DropdownMenu.Item>Advanced options…</DropdownMenu.Item>
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>

              <DropdownMenu.Separator />
              <DropdownMenu.Item>Share</DropdownMenu.Item>
              <DropdownMenu.Item>Add to favorites</DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item shortcut="⌘ ⌫" color="red">
                Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Card>

        {/* Dropdown Menu with Checkbox (Multiple Select) */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Dropdown Menu with Checkbox (Multiple Select)</Heading>
          <Flex gap="4" align="center" mt="4">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button>
                  Checkbox Menu
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.CheckboxItem 
                  checked={showFullName}
                  onCheckedChange={setShowFullName}
                >
                  Show Full Name
                </DropdownMenu.CheckboxItem>
                <DropdownMenu.CheckboxItem
                  checked={showEmail} 
                  onCheckedChange={setShowEmail}
                >
                  Show Email
                </DropdownMenu.CheckboxItem>
                <DropdownMenu.CheckboxItem
                  checked={showProfilePic}
                  onCheckedChange={setShowProfilePic}
                >
                  Show Profile Picture
                </DropdownMenu.CheckboxItem>
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            {/* Display states */}
            <Flex gap="4">
              <Text size="2" weight="bold">Selected: </Text>
              <Text size="2">
                {[
                  showFullName && 'Full Name',
                  showEmail && 'Email', 
                  showProfilePic && 'Profile Picture'
                ].filter(Boolean).join(', ')}
              </Text>
            </Flex>
          </Flex>
        </Card>

        {/* Dropdown Menu with Radio (Single Select) */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Dropdown Menu with Radio (Single Select)</Heading>
          <Flex gap="4" align="center" mt="4">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button>
                  Radio Menu
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                  <DropdownMenu.RadioItem value="small">
                    Small Size
                  </DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="medium">
                    Medium Size
                  </DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="large">
                    Large Size
                  </DropdownMenu.RadioItem>
                </DropdownMenu.RadioGroup>
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            {/* Display selected state */}
            <Flex gap="4">
              <Text size="2" weight="bold">Selected: </Text>
              <Text size="2">{selectedOption}</Text>
            </Flex>
          </Flex>
        </Card>

        {/* Dropdown Menu Sizes */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Dropdown Menu Sizes</Heading>
          <Flex gap="4">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button size="1" variant="soft">
                  Small
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content size="1">
                <DropdownMenu.Item>Edit</DropdownMenu.Item>
                <DropdownMenu.Item>Delete</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button size="2" variant="soft">
                  Medium
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content size="2">
                <DropdownMenu.Item>Edit</DropdownMenu.Item>
                <DropdownMenu.Item>Delete</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button size="3" variant="soft">
                  Large
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content size="2">
                <DropdownMenu.Item>Edit</DropdownMenu.Item>
                <DropdownMenu.Item>Delete</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
        </Card>

        {/* Dropdown Menu Colors */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Dropdown Menu Colors</Heading>
          <Flex gap="4">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button color="indigo" size="2">
                  Indigo
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item>Edit</DropdownMenu.Item>
                <DropdownMenu.Item color="red">Delete</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button color="cyan" size="2">
                  Cyan
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item>Edit</DropdownMenu.Item>
                <DropdownMenu.Item color="red">Delete</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button color="red" size="2">
                  Red
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item>Edit</DropdownMenu.Item>
                <DropdownMenu.Item color="red">Delete</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
          <Flex gap="4" mt="4">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button color="indigo" size="2" variant="soft">
                  Indigo
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item>Edit</DropdownMenu.Item>
                <DropdownMenu.Item color="red">Delete</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button color="cyan" size="2" variant="soft">
                  Cyan
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item>Edit</DropdownMenu.Item>
                <DropdownMenu.Item color="red">Delete</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button color="red" size="2" variant="soft">
                  Red
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item>Edit</DropdownMenu.Item>
                <DropdownMenu.Item color="red">Delete</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
        </Card>

        {/* High Contrast Dropdown Menu */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">High Contrast Dropdown Menu</Heading>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button highContrast>High Contrast</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content highContrast>
              <DropdownMenu.Item>Edit</DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
              <DropdownMenu.Item color="red">Delete</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Card>
      </div>
    </div>
  )
}

