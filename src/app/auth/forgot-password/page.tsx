'use client';

import { useState } from 'react';
import { Box, Container, Flex, Heading, Text, Button, Card, TextField } from '@radix-ui/themes';
import { ArrowLeft, Mail } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function ForgotPasswordPage() {
  usePageTitle('Forgot Password');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate password reset request
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (error) {
      console.error('Password reset request failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex className="h-screen">
      {/* Left side - Full height image (same as login page) */}
      <div className="hidden md:block w-1/2 relative">
        <Image
          src="/images/restaurant-counter.png"
          alt="Restaurant counter"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="p-8 text-white text-center">
            <Heading size="8" className="mb-4 text-white">EatlyPOS</Heading>
            <Text size="5" className="text-white/90">Managing your restaurant made easy</Text>
          </div>
        </div>
      </div>

      {/* Right side - Forgot password form */}
      <Flex 
        direction="column" 
        justify="end"
        className="w-full md:w-1/2 px-4 sm:px-6 lg:px-8 py-12"
      >
        <Box className="flex-grow"></Box>
        
        <Box className="text-center" mb="6">
          <Flex direction="column" align="center" gap="4">
            <Image 
              src={theme === 'dark' ? '/images/logo-dark.png' : '/images/logo.png'} 
              alt="EatlyPOS Logo" 
              width={130} 
              height={20}
            />
            <Heading size="5">Reset your password</Heading>
          </Flex>
        </Box>

        <Container size="2" className="max-w-md w-full mx-auto">
          {!isSubmitted ? (
            <>
              <Button 
                variant="ghost"
                onClick={() => router.push('/auth/login')}
                mb="4"
              >
                <ArrowLeft size={18} />
                Back to login
              </Button>
              <Card size="3">
                <Box className="mb-4">
                  <Text size="2">Enter your email and we&apos;ll send you instructions to reset your password</Text>
                </Box>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Email Address</Text>
                    <TextField.Root
                      type="email"
                      placeholder="your@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full"
                    >
                      <TextField.Slot>
                        <Mail size={16} />
                      </TextField.Slot>
                    </TextField.Root>
                  </Flex>

                  <Box>
                    <Button 
                      type="submit" 
                      className="!w-full" 
                      disabled={isLoading}
                      size="3"
                    >
                      {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                    </Button>
                  </Box>
                </form>
              </Card>
            </>
          ) : (
            <Card size="3" className="text-center p-4">
              <Heading size="5" className="mb-4">Check your email</Heading>
              <Text as="p" size="2" mb="6">
                We&apos;ve sent password reset instructions to <strong>{email}</strong>. 
                Please check your inbox and follow the link provided.
              </Text>
              <Button 
                onClick={() => router.push('/auth/login')}
                size="3"
                className="!w-full"
              >
                Return to Sign In
              </Button>
            </Card>
          )}
        </Container>
        
        <Box className="text-center mt-8 mb-4">
          <Text as="p" size="1" color="gray">
            © {new Date().getFullYear()} EatlyPOS. All rights reserved.
          </Text>
          <Text as="p" size="1" color="gray">
            Version 1.0.0 (Build 001)
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
} 