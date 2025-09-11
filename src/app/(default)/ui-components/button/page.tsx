'use client'

import React from 'react'
import { Button, Card, Flex, Heading, Spinner } from '@radix-ui/themes'
import { ArrowRight, Mail, Loader2, Bookmark } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function ButtonDemo() {
  usePageTitle('Button');
  return (
    <div>
      <Heading mb="5">Button</Heading>
      
      <div className="space-y-5">
        {/* Basic Buttons */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Basic Buttons</Heading>
          <Flex gap="4" wrap="wrap">
            <Button>Default Button</Button>
            <Button disabled>Disabled</Button>
            <Button highContrast>High Contrast</Button>
          </Flex>
        </Card>

        {/* Button Variants */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Button Variants</Heading>
          <Flex gap="4" wrap="wrap" align="center">
            <Button variant="solid">Solid</Button>
            <Button variant="soft">Soft</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="surface">Surface</Button>
            <Button variant="classic">Classic</Button>
            <Button variant="ghost">Ghost</Button>
          </Flex>
        </Card>

        {/* Button Colors */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Button Colors</Heading>
          <Flex gap="4" wrap="wrap">
            <Button color="indigo">Indigo</Button>
            <Button color="cyan">Cyan</Button>
            <Button color="green">Green</Button>
            <Button color="orange">Orange</Button>
            <Button color="red">Red</Button>
            <Button color="gray">Gray</Button>
          </Flex>
          <Flex gap="4" wrap="wrap" className="mt-4">
            <Button color="indigo" variant="soft">Indigo</Button>
            <Button color="cyan" variant="soft">Cyan</Button>
            <Button color="green" variant="soft">Green</Button>
            <Button color="orange" variant="soft">Orange</Button>
            <Button color="red" variant="soft">Red</Button>
            <Button color="gray" variant="soft">Gray</Button>
          </Flex>
          <Flex gap="4" wrap="wrap" className="mt-4">
            <Button color="indigo" variant="outline">Indigo</Button>
            <Button color="cyan" variant="outline">Cyan</Button>
            <Button color="green" variant="outline">Green</Button>
            <Button color="orange" variant="outline">Orange</Button>
            <Button color="red" variant="outline">Red</Button>
            <Button color="gray" variant="outline">Gray</Button>
          </Flex>
          <Flex gap="4" wrap="wrap" className="mt-4">
            <Button color="indigo" variant="surface">Indigo</Button>
            <Button color="cyan" variant="surface">Cyan</Button>
            <Button color="green" variant="surface">Green</Button>
            <Button color="orange" variant="surface">Orange</Button>
            <Button color="red" variant="surface">Red</Button>
            <Button color="gray" variant="surface">Gray</Button>
          </Flex>
          <Flex gap="4" wrap="wrap" className="mt-4">
            <Button color="indigo" variant="classic">Indigo</Button>
            <Button color="cyan" variant="classic">Cyan</Button>
            <Button color="green" variant="classic">Green</Button>
            <Button color="orange" variant="classic">Orange</Button>
            <Button color="red" variant="classic">Red</Button>
            <Button color="gray" variant="classic">Gray</Button>
          </Flex>
          <Flex gap="4" wrap="wrap" className="mt-4">
            <Button color="indigo" variant="ghost">Indigo</Button>
            <Button color="cyan" variant="ghost">Cyan</Button>
            <Button color="green" variant="ghost">Green</Button>
            <Button color="orange" variant="ghost">Orange</Button>
            <Button color="red" variant="ghost">Red</Button>
            <Button color="gray" variant="ghost">Gray</Button>
          </Flex>
        </Card>

        {/* Buttons with Icons */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Buttons with Icons</Heading>
          <Flex gap="4" wrap="wrap">
            <Button>
              <Mail size={16} />
              Email
            </Button>
            <Button variant="soft">
              Continue
              <ArrowRight size={16} />
            </Button>
            <Button variant="outline">
              <Mail size={16} />
              Email
              <ArrowRight size={16} />
            </Button>
          </Flex>
        </Card>

        {/* Loading Buttons */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Loading Buttons</Heading>
          <Flex gap="4" wrap="wrap">
            <Button disabled>
              <Loader2 size={16} className="animate-spin" />
              Please wait
            </Button>
            <Button variant="soft" disabled>
              <Loader2 size={16} className="animate-spin" />
              Loading...
            </Button>
            <Button variant="outline" disabled>
              <Loader2 size={16} className="animate-spin" />
              Processing
            </Button>
          </Flex>
          <Flex gap="3" wrap="wrap" className="mt-4">
            <Button>
              <Spinner loading={false}>
                <Bookmark size={16} />
              </Spinner>
              Bookmark (loading=false)
            </Button>

            <Button disabled>
              <Spinner loading>
                <Bookmark />
              </Spinner>
              Bookmark
            </Button>
            <Button disabled variant="soft">
              <Spinner loading>
                <Bookmark />
              </Spinner>
              Bookmark
            </Button>
            <Button disabled variant="outline">
              <Spinner loading>
                <Bookmark />
              </Spinner>
              Bookmark
            </Button>
          </Flex>

          <Flex gap="3" wrap="wrap" className="mt-4">
            <Button loading variant="classic">
              Bookmark
            </Button>
            <Button loading variant="solid">
              Bookmark
            </Button>
            <Button loading variant="soft">
              Bookmark
            </Button>
            <Button loading variant="surface">
              Bookmark
            </Button>
            <Button loading variant="outline">
              Bookmark
            </Button>
          </Flex>
        </Card>

        {/* Button Sizes */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Button Sizes</Heading>
          <Flex gap="4" align="center" wrap="wrap">
            <Button size="1">Size 1</Button>
            <Button>Size 2 (default)</Button>
            <Button size="3">Size 3</Button>
            <Button size="4">Size 4</Button>
          </Flex>
        </Card>

        {/* Button Radius */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Button Radius</Heading>
          <Flex gap="4" wrap="wrap">
            <Button radius="none">None</Button>
            <Button radius="small">Small</Button>
            <Button radius="medium">Medium (Default)</Button>
            <Button radius="large">Large</Button>
            <Button radius="full">Full Radius</Button>
          </Flex>
        </Card>
      </div>
    </div>
  )
}
