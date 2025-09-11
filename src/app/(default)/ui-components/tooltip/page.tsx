'use client';

import { Card, Flex, Heading, Button, Tooltip, Text } from '@radix-ui/themes'
import { Info, Plus, Minus } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function TooltipDemo() {
  usePageTitle('Tooltip');
  return (
    <div>
      <Heading mb="5">Tooltip</Heading>
      
      <div className="space-y-5">
        {/* Basic Tooltip */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Basic Tooltip</Heading>
          <Flex gap="4">
            <Tooltip content="This is a tooltip">
              <Button>Hover me</Button>
            </Tooltip>
            <Flex align="center" gap="2">
              <Text>Hover this tooltip icon</Text>
              <Tooltip content="More information">
                <Info size={20} />
              </Tooltip>
            </Flex>            
          </Flex>
        </Card>

        {/* Tooltip Positions */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Tooltip Positions</Heading>
          <Flex gap="4" wrap="wrap">
            <Tooltip content="Top tooltip" side="top">
              <Button variant="soft">Top</Button>
            </Tooltip>
            <Tooltip content="Right tooltip" side="right">
              <Button variant="soft">Right</Button>
            </Tooltip>
            <Tooltip content="Bottom tooltip" side="bottom">
              <Button variant="soft">Bottom</Button>
            </Tooltip>
            <Tooltip content="Left tooltip" side="left">
              <Button variant="soft">Left</Button>
            </Tooltip>
          </Flex>
        </Card>

        {/* Tooltip with Different Content */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Tooltip with Different Content</Heading>
          <Flex gap="4">
            <Tooltip content="Add new item">
              <Button variant="soft">
                <Plus size={20} />
              </Button>
            </Tooltip>
            <Tooltip content="Remove item">
              <Button variant="soft" color="red">
                <Minus size={20} />
              </Button>
            </Tooltip>
            <Tooltip content={
              <div>
                <strong className="block">Complex tooltip</strong>
                <span>With multiple lines and <a href="#" className="text-orange-500">link</a></span>
              </div>
            }>
              <Button>Multiline HTML Content</Button>
            </Tooltip>
          </Flex>
        </Card>
      </div>
    </div>
  )
} 