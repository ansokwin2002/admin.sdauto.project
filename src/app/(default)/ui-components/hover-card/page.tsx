'use client'

import React from 'react'
import { Avatar, Box, Card, Flex, HoverCard, Link, Text, Heading, Inset, Button } from '@radix-ui/themes'
import { ArrowRight } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import Image from 'next/image'

export default function HoverCardDemo() {
  usePageTitle('Hover Card')
  return (
    <div>
      <Heading mb="5">Hover Card</Heading>

      <Card size="3">
        <Heading as="h2" size="3" mb="4">Profile Preview Hover Card</Heading>
        
        <Text as="p" mb="4">
          Follow{' '}
          <HoverCard.Root>
            <HoverCard.Trigger>
              <Link href="https://twitter.com/thedevelovers" target="_blank">
                @thedevelovers
              </Link>
            </HoverCard.Trigger>
            <HoverCard.Content>
              <Flex gap="4">
                <Avatar
                  size="3"
                  src="https://pbs.twimg.com/profile_images/614279622851624960/64KssNpD_200x200.png"
                  fallback="R"
                  radius="full"
                />
                <Box>
                  <Text as="div" size="2" weight="bold">The Develovers</Text>
                  <Text as="div" size="2" color="gray">@thedevelovers</Text>
                  <Text as="div" size="2" mt="2">Free and premium website templates for you next project.</Text>
                  <Flex gap="4" mt="3">
                    <Text as="div" size="2">
                      <Text weight="bold">0</Text> Following
                    </Text>
                    <Text as="div" size="2">
                      <Text weight="bold">2,900</Text> Followers
                    </Text>
                  </Flex>
                </Box>
              </Flex>
            </HoverCard.Content>
          </HoverCard.Root>
          {' '}for updates about new releases and features.
        </Text>
      </Card>

      <Card size="3" mt="5">
        <Heading as="h2" size="3" mb="4">Hover Card Sizes</Heading>
        
        <Flex gap="4" align="center">
          <HoverCard.Root>
            <HoverCard.Trigger>
              <Link href="#" target="_blank">Size 1</Link>
            </HoverCard.Trigger>
            <HoverCard.Content size="1">
              <Text size="1">This is a size 1 hover card with compact content.</Text>
            </HoverCard.Content>
          </HoverCard.Root>

          <HoverCard.Root>
            <HoverCard.Trigger>
              <Link href="#" target="_blank">Size 2</Link>
            </HoverCard.Trigger>
            <HoverCard.Content size="2">
              <Text size="2">This is a size 2 hover card with medium content.</Text>
            </HoverCard.Content>
          </HoverCard.Root>

          <HoverCard.Root>
            <HoverCard.Trigger>
              <Link href="#" target="_blank">Size 3</Link>
            </HoverCard.Trigger>
            <HoverCard.Content size="3">
              <Text size="3">This is a size 3 hover card with larger content.</Text>
            </HoverCard.Content>
          </HoverCard.Root>
        </Flex>
      </Card>

      <Card size="3" mt="5">
        <Heading as="h2" size="3" mb="4">Hover Card with Image and Text</Heading>
        
        <HoverCard.Root>
          <HoverCard.Trigger>
            <Link href="#" target="_blank">Hover me to see product details</Link>
          </HoverCard.Trigger>
          <HoverCard.Content>
            
            <Flex gap="4">
              <Box>
                <Inset side="left" pr="current">
                  <Image 
                    src="/images/hover-card/weight-loss.jpg"
                    alt="Product"
                    width={220}
                    height={170}
                    style={{
                      width: '220px',
                      height: '170px',
                      objectFit: 'cover',
                    }}
                  />
                </Inset>
              </Box>
              <Box>
                <Heading size="3" mb="1">Weight Loss Program</Heading>
                <Text as="div" size="2" color="gray">
                  Personalized 12-week weight loss program with nutrition guidance and workout plans tailored to your goals.
                </Text>
                <Flex gap="4" align="center" mt="3">
                  <Text as="div" size="2">
                    <Text weight="bold">$149</Text>
                  </Text>
                  <Button color="green">Enroll Now <ArrowRight size={16} /></Button>
                </Flex>
              </Box>
            </Flex>
          </HoverCard.Content>
        </HoverCard.Root>
      </Card>
    </div>
  )
}
