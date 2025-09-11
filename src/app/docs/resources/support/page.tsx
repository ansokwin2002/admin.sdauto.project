'use client';

import { Box, Heading, Text, Link } from '@radix-ui/themes';
import { ArrowRight } from 'lucide-react';

export default function SupportPage() {
  return (
    <Box>
      <Heading size="6" mb="6">Support</Heading>
      
      <Box mb="6">
        <Heading size="3" mb="2">Support Information</Heading>
        <Text as="p" mb="4">
          Support for EatlyPOS is available through our contact form at{' '}
          <Link href="https://eatlypos.com/support" target="_blank">
            eatlypos.com/support
          </Link>. Before reaching out, we recommend checking our FAQ section for quick answers to common questions.
        </Text>
      </Box>

      <Box mb="6">
        <Heading size="3" mb="2">Support Availability</Heading>
        <Text as="p" mb="4">
          Our dedicated support team operates on weekdays and aims to address your inquiries within 24 hours. 
          During peak periods and holidays, response times may extend up to 48 hours. We appreciate your 
          patience as we work to provide you with the best possible assistance.
        </Text>
      </Box>

      <Box mb="6">
        <Heading size="3" mb="2">What We Support</Heading>
        <Text as="p" mb="4">
          Our support services are exclusively available to verified EatlyPOS customers. We focus on 
          addressing template-specific issues, including bug fixes and error resolution. Please note that 
          custom modifications and third-party integrations fall outside our support scope.
        </Text>
      </Box>

      <Box>
        <Heading size="3" mb="2">Contact Us</Heading>
        <Text as="p" mb="4">
          Visit <Link href="https://eatlypos.com/support" target="_blank">eatlypos.com/support</Link>{' '}
          to submit your support request <ArrowRight className="inline w-4 h-4" />
        </Text>
      </Box>
    </Box>
  );
}
