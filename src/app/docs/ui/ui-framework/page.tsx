'use client';

import { Box, Flex, Heading, Link, Text } from '@radix-ui/themes';
import { ExternalLink } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const CodeBlock = ({ children }) => {
  const formattedCode = children.trim().replace(/\r\n/g, '\n');
  
  return (
    <Box className="mb-4 rounded-md overflow-hidden">
      <SyntaxHighlighter
        language="jsx"
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: '14px',
        }}
      >
        {formattedCode}
      </SyntaxHighlighter>
    </Box>
  );
};

export default function UIDoc() {
  return (
    <Box>
      <Heading as="h2" size="8" mb="4">UI Framework</Heading>
      
      <Text as="p" size="3" mb="4">
        EatlyPOS uses Radix UI Theme as its primary UI framework. Radix Themes is a comprehensive design system that provides a set of pre-built components with consistent styling and behavior.
      </Text>

      <Heading as="h3" size="6" mb="4">Theme Configuration</Heading>
      <Box mb="6">
        <Text as="p" size="3" mb="4">
          The application uses the following theme configuration:
        </Text>
        <CodeBlock>
{`<Theme 
  accentColor="orange"
  hasBackground={true}
  panelBackground="solid"
  appearance={isDarkMode ? 'dark' : 'light'}
>
  {children}
</Theme>`}
        </CodeBlock>
        <Link href="https://www.radix-ui.com/themes/docs" target="_blank">
          <Flex align="center" gap="2">
            Learn more about Radix UI Theme <ExternalLink className="w-4 h-4" />
          </Flex>
        </Link>
      </Box>

      <Heading as="h3" size="6" mb="4">Best Practices</Heading>
      <Text as="p" size="3" mb="4">When working with UI components:</Text>
      <Flex direction="column" gap="2">
        <Text as="div" size="3">• Use Radix UI Theme components for consistent styling</Text>
        <Text as="div" size="3">• Follow the existing component patterns</Text>
        <Text as="div" size="3">• Maintain consistent spacing using theme tokens</Text>
        <Text as="div" size="3">• Use theme-provided color tokens for consistency</Text>
        <Text as="div" size="3">• Leverage responsive variants for different screen sizes</Text>
      </Flex>
    </Box>
  );
}
