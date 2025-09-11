import { Heading, Text, Flex } from "@radix-ui/themes";
import { CheckCircle } from "lucide-react";

const FeatureItem = ({ title, description }) => (
  <Flex gap="3" align="start">
    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
    <div>
      <Text as="div" weight="medium" size="3">{title}</Text>
      <Text as="div" color="gray" size="2">{description}</Text>
    </div>
  </Flex>
);

export default function Introduction() {
  return (
    <div>
      <Heading as="h2" size="8" mb="4">Introduction</Heading>
      
      <Text as="p" size="3" mb="4">
        EatlyPOS is a Next.js-based Restaurant Management System template designed for developers, agencies or restaurant owners who want to build their own restaurant management system. 
        This frontend template provides a solid foundation for building custom restaurant management solutions with modern web technologies.
      </Text>

      <Heading as="h3" size="6" mb="4">Core Features</Heading>
      <Flex direction="column" gap="4" mb="6">
        <FeatureItem 
          title="Next.js 15 & React 19" 
          description="Built with the latest Next.js features including App Router, Server Components, and React Server Components."
        />
        <FeatureItem 
          title="Radix UI Theme System" 
          description="Consistent and accessible UI components with built-in dark mode support."
        />
        <FeatureItem 
          title="Multi-Branch Architecture" 
          description="Built-in support for managing multiple restaurant branches with role-based access control."
        />
        <FeatureItem 
          title="TypeScript" 
          description="Full TypeScript support with strict type checking for better development experience."
        />
        <FeatureItem 
          title="Modern Development Stack" 
          description="Includes ESLint, Prettier, and modern development tools preconfigured."
        />
        <FeatureItem 
          title="Fully Responsive Design" 
          description="Optimized for all screen sizes with a mobile-first approach, ensuring seamless experience across devices."
        />
      </Flex>
    </div>
  );
} 