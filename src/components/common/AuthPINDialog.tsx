"use client";
import { useState } from "react";
import { Dialog, Flex, Text, Button, Box } from "@radix-ui/themes";
import { LogOut, X } from "lucide-react";

interface AuthPINDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (username: string) => void;
  onLogout?: () => void;
  currentUser?: string;
}

export default function AuthPINDialog({ open, onOpenChange, onSuccess, onLogout, currentUser }: AuthPINDialogProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  // Mock user data - in real app, this would come from a database
  const users = {
    "1234": "Jane",
    "5678": "John",
    "9012": "Mike"
  };

  const handleSubmit = () => {
    if (users[pin as keyof typeof users]) {
      onSuccess(users[pin as keyof typeof users]);
      setPin("");
      setError("");
      onOpenChange(false);
    } else {
      setError("Invalid PIN. Please try again.");
      setPin("");
    }
  };

  const handlePinChange = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError("");
      
      // Auto-submit when 4 digits are entered
      if (newPin.length === 4) {
        setTimeout(() => {
          if (users[newPin as keyof typeof users]) {
            onSuccess(users[newPin as keyof typeof users]);
            setPin("");
            setError("");
            onOpenChange(false);
          } else {
            setError("Invalid PIN. Please try again.");
            setPin("");
          }
        }, 300); // Small delay for better UX
      }
    }
  };

  const handleClear = () => {
    setPin("");
    setError("");
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError("");
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content size="2">
        <Flex justify="between" align="center" mb="4">
          <div />
          <Dialog.Close>
            <Button variant="ghost" color="gray">
              <X size={18} />
            </Button>
          </Dialog.Close>
        </Flex>

        <Flex direction="column" gap="3">
          <Box>
            <Dialog.Title className="text-center">Enter PIN</Dialog.Title>
            <Text as="div" size="1" mb="3" align="center">For demo purposes, use PIN: 1234, 5678, or 9012</Text>
            <Flex justify="center" mb="3">
              <Flex gap="2">
                {[0, 1, 2, 3].map(i => (
                  <Box 
                    key={i} 
                    style={{ 
                      width: '15px', 
                      height: '15px', 
                      borderRadius: '50%', 
                      background: i < pin.length ? 'black' : 'none',
                      border: '1px solid black'
                    }} 
                  />
                ))}
              </Flex>
            </Flex>
            {error && (
              <Text size="1" color="red" mt="1" as="div" align="center">
                {error}
              </Text>
            )}
          </Box>

          <Flex direction="column" gap="2" align="center">
            {/* Number pad rows */}
            {[
              [1, 2, 3],
              [4, 5, 6],
              [7, 8, 9],
              ['C', 0, '⌫']
            ].map((row, rowIndex) => (
              <Flex key={rowIndex} gap="2">
                {row.map((num, i) => (
                  <Button 
                    key={i}
                    variant="soft"
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      fontSize: '18px'
                    }}
                    onClick={() => {
                      if (num === 'C') handleClear();
                      else if (num === '⌫') handleBackspace();
                      else handlePinChange(num.toString());
                    }}
                  >
                    {num}
                  </Button>
                ))}
              </Flex>
            ))}
          </Flex>

          
          <Flex justify="center" gap="4" mt="6">
          {currentUser && (
            <>
              <Button
                size="4"
                color="red" 
                variant="soft"
                onClick={() => {
                  onLogout();
                  onOpenChange(false);
                }}
              >
                <LogOut size={18} />
                Logout
              </Button>
              <Button
                size="4"
                variant="soft"
                color="gray"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </>
            )}
          </Flex>
          
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
} 