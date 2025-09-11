'use client'

import React from 'react'
import { IconButton, Card, Flex, Heading, Spinner } from '@radix-ui/themes'
import { Heart, Star, Bookmark, Share2, Settings, Bell } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function IconButtonDemo() {
  usePageTitle('Icon Button')
  return (
    <div>
      <Heading mb="5">Icon Button</Heading>
      
      <div className="space-y-5">
        {/* Basic Icon Buttons */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Basic Icon Buttons</Heading>
          <Flex gap="4" wrap="wrap">
            <IconButton>
              <Heart size={16} />
            </IconButton>
            <IconButton disabled>
              <Star size={16} />
            </IconButton>
            <IconButton color="tomato">
              <Bookmark size={16} />
            </IconButton>
          </Flex>
        </Card>

        {/* Icon Button Sizes */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Icon Button Sizes</Heading>
          <Flex gap="4" wrap="wrap" align="center">
            <IconButton size="1">
              <Heart size={14} />
            </IconButton>
            <IconButton size="2">
              <Heart size={16} />
            </IconButton>
            <IconButton size="3">
              <Heart size={18} />
            </IconButton>
            <IconButton size="4">
              <Heart size={20} />
            </IconButton>
          </Flex>
        </Card>

        {/* Icon Button Variants */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Icon Button Variants</Heading>
          <Flex gap="4" wrap="wrap" align="center">
            <IconButton variant="solid">
              <Share2 size={16} />
            </IconButton>
            <IconButton variant="soft">
              <Share2 size={16} />
            </IconButton>
            <IconButton variant="outline">
              <Share2 size={16} />
            </IconButton>
            <IconButton variant="surface">
              <Share2 size={16} />
            </IconButton>
            <IconButton variant="classic">
              <Share2 size={16} />
            </IconButton>
            <IconButton variant="ghost">
              <Share2 size={16} />
            </IconButton>
          </Flex>
        </Card>

        {/* Icon Button Colors */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Icon Button Colors</Heading>
          <Flex gap="4" wrap="wrap">
            <IconButton color="indigo">
              <Settings size={16} />
            </IconButton>
            <IconButton color="cyan">
              <Settings size={16} />
            </IconButton>
            <IconButton color="green">
              <Settings size={16} />
            </IconButton>
            <IconButton color="orange">
              <Settings size={16} />
            </IconButton>
            <IconButton color="red">
              <Settings size={16} />
            </IconButton>
            <IconButton color="gray">
              <Settings size={16} />
            </IconButton>
          </Flex>
          <Flex gap="4" wrap="wrap" mt="4">
            <IconButton color="indigo" variant="soft">
              <Settings size={16} />
            </IconButton>
            <IconButton color="cyan" variant="soft">
              <Settings size={16} />
            </IconButton>
            <IconButton color="green" variant="soft">
              <Settings size={16} />
            </IconButton>
            <IconButton color="orange" variant="soft">
              <Settings size={16} />
            </IconButton>
            <IconButton color="red" variant="soft">
              <Settings size={16} />
            </IconButton>
            <IconButton color="gray" variant="soft">
              <Settings size={16} />
            </IconButton>
          </Flex>
        </Card>

        {/* Icon Button Radius */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Icon Button Radius</Heading>
          <Flex gap="4" wrap="wrap" align="center">
            <IconButton radius="none">
              <Bell size={16} />
            </IconButton>
            <IconButton radius="small">
              <Bell size={16} />
            </IconButton>
            <IconButton radius="medium">
              <Bell size={16} />
            </IconButton>
            <IconButton radius="large">
              <Bell size={16} />
            </IconButton>
            <IconButton radius="full">
              <Bell size={16} />
            </IconButton>
          </Flex>
        </Card>

        {/* Loading Icon Buttons */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Loading Icon Buttons</Heading>
          <Flex gap="4" wrap="wrap">
            <IconButton disabled>
              <Spinner />
            </IconButton>
            <IconButton variant="soft" disabled>
              <Spinner />
            </IconButton>
            <IconButton variant="outline" disabled>
              <Spinner />
            </IconButton>
          </Flex>
        </Card>
      </div>
    </div>
  )
}
