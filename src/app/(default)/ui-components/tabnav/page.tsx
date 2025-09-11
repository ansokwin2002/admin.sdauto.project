'use client'

import { TabNav } from '@radix-ui/themes'
import { Heading, Card, Flex } from '@radix-ui/themes'
import { usePathname } from 'next/navigation'
import NextLink from 'next/link'
import { usePageTitle } from "@/hooks/usePageTitle"

export default function TabNavDemo() {
  usePageTitle('TabNav')
  const pathname = usePathname()
  return (
    <div>
      <Heading mb="5">TabNav</Heading>
      
      <div className="space-y-5">
        {/* Basic TabNav */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Basic TabNav</Heading>
          <TabNav.Root>
            <TabNav.Link href="#">Account</TabNav.Link>
            <TabNav.Link href="#">Documents</TabNav.Link>
            <TabNav.Link href="#">Settings</TabNav.Link>
          </TabNav.Root>
        </Card>

        {/* TabNav Sizes */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">TabNav Sizes</Heading>
          <Flex direction="column" gap="4">
            <TabNav.Root size="1">
              <TabNav.Link href="#">Account</TabNav.Link>
              <TabNav.Link href="#">Documents</TabNav.Link>
              <TabNav.Link href="#">Settings</TabNav.Link>
            </TabNav.Root>
            <TabNav.Root size="2">
              <TabNav.Link href="#">Account</TabNav.Link>
              <TabNav.Link href="#">Documents</TabNav.Link>
              <TabNav.Link href="#">Settings</TabNav.Link>
            </TabNav.Root>
          </Flex>
        </Card>

        {/* TabNav with Router Link */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">TabNav with Disabled Items</Heading>
          <TabNav.Root>
            <TabNav.Link asChild active={pathname === '/ui-components/tabnav'} href="#">
              <NextLink href="/ui-components/tabnav">Account</NextLink>
            </TabNav.Link>
            <TabNav.Link asChild active={pathname === '/ui-components/tabnav/documents'} href="#">
              <NextLink href="/ui-components/tabnav/documents">Documents</NextLink>
            </TabNav.Link>
            <TabNav.Link asChild active={pathname === '/ui-components/tabnav/settings'} href="#">
              <NextLink href="/ui-components/tabnav/settings">Settings</NextLink>
            </TabNav.Link>
          </TabNav.Root>
        </Card>
      </div>
    </div>
  )
} 