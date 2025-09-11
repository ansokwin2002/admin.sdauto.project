'use client';

import { Box, Callout, Flex, Heading, Separator, Text } from '@radix-ui/themes';

export default function LicensePage() {
  return (
    <Box>
      <Heading size="6" mb="4">License Information</Heading>
      
      <Text as="p" mb="6" size="4">
        EatlyPOS offers two types of licenses to suit different business needs. Choose the one that best fits your requirements.
      </Text>

      <Flex direction="column" gap="6">
        {/* Regular License */}
        <Box>
          <Heading size="4" mb="4">Regular License</Heading>
          <Flex direction="column" gap="4">
            <Text as="p">
              The Regular License grants you a non-exclusive right to use EatlyPOS frontend template as a foundation
              to develop a fully functional Restaurant Management System for a single business entity.
            </Text>

            <Callout.Root color="gray">
              <Callout.Text>
                Use case example:
                <ul className="list-disc pl-6 space-y-2">
                  <li>A developer/agency can use EatlyPOS as a starting point to develop custom Restaurant Management System for their clients.</li>
                  <li>A restaurant owner hires developers to build their Restaurant Management System using EatlyPOS as the starting point. The developers
                    implements the necessary backend services, adds business logic, and customizes the UI to match the restaurant&apos;s needs.</li>
                  <li>A restaurant chain hires developers to develop EatlyPOS template into a complete Restaurant Management System and deploys it across all their branches,
                    as long as they are part of the same business entity. This includes implementing their own backend services, inventory
                    management, and other required functionalities.</li>
                </ul>
              </Callout.Text>
            </Callout.Root>

            <Box>
              <Heading size="3" mb="2">Permitted Uses</Heading>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use EatlyPOS as starting point for a single business entity</li>
                <li>Use EatlyPOS in multiple branches within the same business entity</li>
                <li>Create derivative works for your own use or for client</li>
              </ul>
            </Box>

            <Box>
              <Heading size="3" mb="2">Restrictions</Heading>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cannot use in multiple business entities</li>
                <li>Cannot resell or redistribute the software</li>
                <li>Cannot include in items for sale</li>
                <li>Cannot redistribute source code</li>
                <li>Cannot transfer the license to another business</li>
              </ul>
            </Box>
          </Flex>
        </Box>

        <Separator size="4" my="4" />

        {/* Extended License */}
        <Box>
          <Heading size="4" mb="4">Extended License</Heading>
          <Flex direction="column" gap="4">
            <Text as="p">
              The Extended License is designed for developers and agencies who want to use EatlyPOS as a starting point
              to develop custom Restaurant Management System solutions for their clients. This license allows you to create and sell your end products
              that incorporate EatlyPOS.
            </Text>

            <Callout.Root color="gray">
              <Callout.Text>
                Use case example:
                <ul className="list-disc pl-6 space-y-2">
                  <li>A development agency/developer can use EatlyPOS as a foundation, add custom features and modifications, and sell the resulting application to their clients. Each client can then use the end product under their own license.</li>
                </ul>
              </Callout.Text>
            </Callout.Root>

            <Box>
              <Heading size="3" mb="2">Permitted Uses</Heading>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use EatlyPOS as a starting point for single or multiple end products</li>
                <li>Sell the end product to multiple clients</li>
                <li>License and sublicense the end product</li>
                <li>Include the end product in commercial applications</li>
                <li>Distribute the end product to clients</li>
              </ul>
            </Box>

            <Box>
              <Heading size="3" mb="2">Restrictions</Heading>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cannot resell EatlyPOS as-is without modifications</li>
                <li>Cannot redistribute the original source code</li>
                <li>Cannot create a competing POS product template</li>
                <li>Cannot claim ownership of the original EatlyPOS</li>
              </ul>
            </Box>
          </Flex>
        </Box>

        <Separator size="4" my="4" />

        {/* Legal Notice */}
        <Box>
          <Heading size="4" mb="4">Legal Notice</Heading>
          <Box>
            <Text as="p" mb="2">
              EatlyPOS is protected by copyright laws and international treaties. Unauthorized reproduction or 
              distribution of this software, or any portion of it, may result in severe civil and criminal penalties, 
              and will be prosecuted to the maximum extent possible under law.
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
