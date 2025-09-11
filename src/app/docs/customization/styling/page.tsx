'use client';

import { Box, Heading, Text, Flex, Code } from '@radix-ui/themes';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function StylingDoc() {
  return (
    <Box>
      <Heading as="h2" size="8" mb="4">Styling Customization</Heading>
      
      <Text as="p" size="3" mb="4">
        EatlyPOS uses Radix UI Theme as its primary UI framework, with a carefully configured theme system that supports both light and dark modes.
      </Text>

      <Heading as="h3" size="6" mb="4">Theme Configuration</Heading>
      <Text as="p" size="3" mb="4">
        The application&apos;s theme is configured with the following settings:
      </Text>

      <Box mb="6">
          <code>src/app/layout.tsx</code>
          <SyntaxHighlighter language="tsx" style={oneDark}>
{`// Root Theme Configuration
<Theme 
  accentColor="orange"
  hasBackground={true}
  panelBackground="solid"
  appearance={isDarkMode ? 'dark' : 'light'}
>
  {children}
</Theme>`}
          </SyntaxHighlighter>
      </Box>

      <Heading as="h3" size="6" mb="4">CSS Variables</Heading>
      <Text as="p" size="3" mb="4">
        The application overrides Radix UI Themes variables and defines custom CSS variables for consistent theming:
      </Text>

      <Box mb="6">
        <code>src/app/globals.css</code>
        <SyntaxHighlighter language="css" style={oneDark}>
{`
/* Radix variables overrides */
/*
check the file for detailed overrides
*/


/* Theme specific */
:root {
  --primary: var(--orange-9);
  --primary75: var(--orange-7);
  --primary50: var(--orange-5);
  --primary25: var(--orange-3);
  --secondary: #26272b;
}`}
          </SyntaxHighlighter>
      </Box>

      <Heading as="h3" size="6" mb="4">Customizing Colors</Heading>
      <Text as="p" size="3" mb="4">
        To customize the application&apos;s color scheme:
      </Text>

      <Flex direction="column" gap="3" mb="6">
        <Text as="p" size="3">
          1. Modify the accent color in <Code>src/app/layout.tsx</Code> by updating the Theme component&apos;s <Code>accentColor</Code> prop.
        </Text>
        <Text as="p" size="3">
          2. Update the CSS variables in <Code>src/app/globals.css</Code> to match your brand colors. To change your brand color, provide your color to <code>--orange-9</code> Radix variable.
        </Text>
        <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
          <li>--primary: Main brand color</li>
          <li>--primary75: Brand color at 75% intensity</li>
          <li>--primary50: Brand color at 50% intensity</li>
          <li>--primary25: Brand color at 25% intensity</li>
          <li>--secondary: Secondary brand color</li>
          <li>--background: Background color</li>
          <li>--text: Text color</li>
        </ul>
      </Flex>

      <Heading as="h3" size="6" mb="4">Dark Mode</Heading>
      <Text as="p" size="3" mb="4">
        Dark mode is automatically supported through Radix UI Theme and next-themes. The application will:
      </Text>

      <Flex direction="column" gap="3" mb="6">
        <Text as="p" size="3">
          • Respect the user&apos;s system preferences by default
        </Text>
        <Text as="p" size="3">
          • Allow manual toggling between light and dark modes
        </Text>
        <Text as="p" size="3">
          • Persist the user&apos;s theme preference in localStorage
        </Text>
      </Flex>
    </Box>
  );
}
