'use client'

import { Box, Button, Container, Flex, Heading, Text } from '@radix-ui/themes'
import { ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <Container size="3">
      <Flex 
        direction="column" 
        align="center" 
        justify="center" 
        gap="6" 
        py="9" 
        style={{ minHeight: 'calc(100vh - 200px)' }}
      >
        <Box className="text-center">
          <Heading as="h1" size="9" className="mb-2">404</Heading>
          <Heading as="h2" size="6" className="mb-4">Page Not Found</Heading>
          <Text as="p" size="3" className="text-slate-9 mb-6">
            The page you are looking for doesn&apos;t exist or has been moved.
          </Text>
        </Box>
        
        <Flex gap="4">
          <Button 
            onClick={() => router.back()} 
            color="gray"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <Button 
            asChild
            color="green"
          >
            <Link href="/">
              <Home size={16} />
              Go to Dashboard
            </Link>
          </Button>
        </Flex>
      </Flex>
    </Container>
  )
}