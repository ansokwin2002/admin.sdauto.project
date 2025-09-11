"use client";
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Text, Flex } from "@radix-ui/themes";

interface OrderTimerProps {
  timeReceived: Date;
  isCompleted: boolean;
  color?: "gray" | "green" | "red";
}

export default function OrderTimer({ timeReceived, isCompleted, color }: OrderTimerProps) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const getTimeDifference = () => {
      if (isCompleted) {
        const diffInMinutes = Math.floor((Date.now() - timeReceived.getTime()) / (1000 * 60));
        return `${diffInMinutes}:00`;
      }
      
      const diffInMinutes = Math.floor((Date.now() - timeReceived.getTime()) / (1000 * 60));
      const seconds = String(Math.floor((Date.now() / 1000) % 60)).padStart(2, '0');
      return `${diffInMinutes}:${seconds}`;
    };

    setTime(getTimeDifference());
    
    if (!isCompleted) {
      const timer = setInterval(() => {
        setTime(getTimeDifference());
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [timeReceived, isCompleted]);

  return (
    <Flex as="span" display="inline-flex" align="center" gap="1">
      <Clock size={16} color={color} />
      <Text size="3" color={color}>
        {time}
      </Text>
    </Flex>
  );
} 