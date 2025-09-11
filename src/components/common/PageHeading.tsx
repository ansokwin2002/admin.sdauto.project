"use client";

import { Heading, Text, Box, Flex } from "@radix-ui/themes";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface PageHeadingProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  showBackButton?: boolean;
  onBackClick?: () => void;
  noMarginBottom?: boolean;
  badge?: React.ReactNode;
}

export function PageHeading({ 
  title, 
  description, 
  children, 
  showBackButton = false,
  onBackClick,
  noMarginBottom = false,
  badge
}: PageHeadingProps) {
  const router = useRouter();
  
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };
  
  const headingContent = (
    <>
      <Flex align="center" gap="2" mb="1">
        <Heading as="h1" size="6">{title}</Heading>
        {badge && badge}
      </Flex>
      {children ? (
        children
      ) : (
        <Text as="p" size="2" color="gray">{description}</Text>
      )}
    </>
  );

  return (
    showBackButton ? (
      <Flex align="center" gap="2" mb={noMarginBottom ? "0" : "5"}>
        <ArrowLeft className="cursor-pointer text-gray-500 dark:text-neutral-600" onClick={handleBackClick} size={16} role="button" />
        <Box>
          {headingContent}
        </Box>
      </Flex>
    ) : (
      <Box mb={noMarginBottom ? "0" : "5"}>
        {headingContent}
      </Box>
    )
  );
}