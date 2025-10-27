import React from 'react'
import { Avatar, Box, Card, Flex, Heading } from '@radix-ui/themes'
import { User } from 'lucide-react'

export const metadata = {
  title: "Avatar | SDAUTO",
}

export default function AvatarDemo() {
  return (
    <div>
      <Heading mb="5">Avatar</Heading>
      
      <div className="space-y-5">
        {/* Basic Avatars */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Basic Avatars</Heading>
          <Flex gap="4" wrap="wrap">
            <Avatar
              src="/images/user-avatar.jpg"
              fallback="A"
            />
            <Avatar fallback="JD" />
            <Avatar highContrast fallback="HC" />
          </Flex>
        </Card>

        {/* Avatar Sizes */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Avatar Sizes</Heading>
          <Flex gap="4" align="center" wrap="wrap">
            <Avatar size="1" fallback="1" src="/images/user-avatar.jpg" />
            <Avatar size="2" fallback="2" src="/images/user-avatar.jpg" />
            <Avatar size="3" fallback="3" src="/images/user-avatar.jpg" />
            <Avatar size="4" fallback="4" src="/images/user-avatar.jpg" />
            <Avatar size="5" fallback="5" src="/images/user-avatar.jpg" />
            <Avatar size="6" fallback="6" src="/images/user-avatar.jpg" />
            <Avatar size="7" fallback="7" src="/images/user-avatar.jpg" />
            <Avatar size="8" fallback="8" src="/images/user-avatar.jpg" />
            <Avatar size="9" fallback="9" src="/images/user-avatar.jpg" />
          </Flex>
        </Card>

        {/* Avatar Variants */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Avatar Variants</Heading>
          <Flex gap="4" wrap="wrap">
            <Avatar variant="solid" fallback="S" />
            <Avatar variant="soft" fallback="S" />
          </Flex>
        </Card>

        {/* Avatar Colors */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Avatar Colors</Heading>
          <Flex gap="4" wrap="wrap">
            <Avatar variant="solid" fallback="I" color="indigo" />
            <Avatar variant="solid" fallback="C" color="cyan" />
            <Avatar variant="solid" fallback="G" color="green" />
            <Avatar variant="solid" fallback="O" color="orange" />
            <Avatar variant="solid" fallback="R" color="red" />
            <Avatar variant="solid" fallback="P" color="pink" />
            <Avatar variant="solid" fallback="B" color="blue" />
            <Avatar variant="solid" fallback="M" color="purple" />
          </Flex>
          <Flex gap="4" wrap="wrap" className="mt-4">
            <Avatar variant="soft" fallback="I" color="indigo" />
            <Avatar variant="soft" fallback="C" color="cyan" />
            <Avatar variant="soft" fallback="G" color="green" />
            <Avatar variant="soft" fallback="O" color="orange" />
            <Avatar variant="soft" fallback="R" color="red" />
            <Avatar variant="soft" fallback="P" color="pink" />
            <Avatar variant="soft" fallback="B" color="blue" />
            <Avatar variant="soft" fallback="M" color="purple" />
          </Flex>
          <Flex gap="4" wrap="wrap" className="mt-4">
            <Avatar variant="solid" fallback="I" color="indigo" highContrast />
            <Avatar variant="solid" fallback="C" color="cyan" highContrast />
            <Avatar variant="solid" fallback="G" color="green" highContrast />
            <Avatar variant="solid" fallback="O" color="orange" highContrast />
            <Avatar variant="solid" fallback="R" color="red" highContrast />
            <Avatar variant="solid" fallback="P" color="pink" highContrast />
            <Avatar variant="solid" fallback="B" color="blue" highContrast />
            <Avatar variant="solid" fallback="M" color="purple" highContrast />
          </Flex>
        </Card>

        {/* Avatar Radius */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Avatar Radius</Heading>
          <Flex gap="4" wrap="wrap">
            <Avatar radius="none" fallback="N" />
            <Avatar radius="small" fallback="S" />
            <Avatar radius="medium" fallback="M" />
            <Avatar radius="large" fallback="L" />
            <Avatar radius="full" fallback="F" />
          </Flex>
        </Card>

        {/* Avatar Fallback */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Avatar Fallback</Heading>
          <Flex gap="4" wrap="wrap">
            <Avatar
              src="broken-image.jpg"
              fallback="JD"
            />
            <Avatar
              src="broken-image.jpg" 
              fallback="AB"
              color="blue"
            />
            <Avatar
              fallback={
                <Box width="24px" height="24px">
                  <User size={24} />
                </Box>
              }
            />
          </Flex>
        </Card>
      </div>
    </div>
  )
}
