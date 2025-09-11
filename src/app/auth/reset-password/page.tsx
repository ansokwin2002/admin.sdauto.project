"use client";

import { Suspense, useState } from "react";
import { Box, Flex, Text, Button, Container, Card, Heading, IconButton, TextField } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Check, AlertCircle, Eye, EyeOff, Lock } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { usePageTitle } from '@/hooks/usePageTitle';

const LogoHeading = () => {
  const { theme } = useTheme();
  return (
    <Box className="text-center" mb="6">
      <Flex direction="column" align="center" gap="4">
        <Image 
          src={theme === 'dark' ? '/images/logo-dark.png' : '/images/logo.png'} 
          alt="Logo" 
          width={130} 
          height={20} 
          priority 
        />
      </Flex>
    </Box>
  );
};

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // This would be where you'd call your API to reset the password
      // For example: await resetPassword(token, password);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setIsLoading(false);
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (err) {
      setError(`Failed to reset password. Please try again. ${err}`);
      setIsLoading(false);
    }
  };
  
  if (!token) {
    return (
      <Flex align="center" justify="center" className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Box className="w-full max-w-md p-8 mx-auto">
          <LogoHeading />
          
          <Card size="3">
            <Flex direction="column" align="center" gap="4" p="4">
              <Heading size="5">Invalid Reset Link</Heading>
              <Text as="p" size="2" align="center">
                This password reset link is invalid or has expired. Please request a new one.
              </Text>
              <Button 
                onClick={() => router.push("/auth/forgot-password")}
                className="!w-full"
                color="gray"
              >
                Back to Forgot Password
              </Button>
            </Flex>
          </Card>
        </Box>
      </Flex>
    );
  }
  
  if (success) {
    return (
      <Flex align="center" justify="center" className="min-h-screen">
        <Box className="w-full max-w-md p-8 mx-auto">
          <LogoHeading />
          
          <Flex direction="column" align="center" gap="4" p="4">
            <Check size={48} className="text-green-500" />
            <Heading size="5">Password Reset Successful!</Heading>
            <Text size="2" align="center">
              Your password has been successfully reset. You will be redirected to the login page in a few seconds.
            </Text>
          </Flex>
        </Box>
      </Flex>
    );
  }
  
  return (
    <Flex align="center" justify="center" className="min-h-screen">
      <Container size="2" className="max-w-md w-full mx-auto px-4">
        <LogoHeading />
        
        <Card size="3">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Flex align="center" gap="2" className="p-3 mb-4 bg-red-50 border border-red-200 rounded dark:bg-red-900/20 dark:border-red-900/50">
                <AlertCircle size={16} className="text-red-500" />
                <Text size="2" className="text-red-600 dark:text-red-400">{error}</Text>
              </Flex>
            )}
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium" htmlFor="password">
                New Password
              </Text>
              <TextField.Root
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full"
                required
              >
                <TextField.Slot>
                  <Lock size={16} />
                </TextField.Slot>
                <TextField.Slot>
                  <IconButton
                    size="1"
                    variant="ghost"
                    color="gray"
                    onClick={togglePasswordVisibility}
                    className="p-0 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </IconButton>
                </TextField.Slot>
              </TextField.Root>
            </Flex>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium" htmlFor="confirmPassword">
                Confirm Password
              </Text>
              <TextField.Root
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full"
                required
              >
                <TextField.Slot>
                  <Lock size={16} />
                </TextField.Slot>
                <TextField.Slot>
                  <IconButton
                    size="1"
                    variant="ghost"
                    color="gray"
                    onClick={toggleConfirmPasswordVisibility}
                    className="p-0 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </IconButton>
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
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </Box>
          </form>
        </Card>
        
        <Box className="text-center mt-4">
          <Text as="span" size="1" color="gray">
            <Link href="/auth/login">
              Back to Login
            </Link>
          </Text>
        </Box>
      </Container>
    </Flex>
  );
}

export default function ResetPassword() {
  usePageTitle('Reset Password');
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}