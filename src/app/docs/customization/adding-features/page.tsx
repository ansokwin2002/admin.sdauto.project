import { Box, Callout, Code, Heading, Text } from "@radix-ui/themes"
import { AlertCircle } from "lucide-react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

const CodeBlock = ({ children, language = 'bash' }) => {
  const formattedCode = children.trim().replace(/\r\n/g, '\n')
  
  return (
    <div className="mb-4 rounded-md overflow-hidden">
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: '14px',
        }}
      >
        {formattedCode}
      </SyntaxHighlighter>
    </div>
  )
}

export default function AddingFeaturesDoc() {
  return (
    <Box>
      <Heading as="h2" size="8" mb="4">Adding Features</Heading>
      
      <Text as="p" size="3" mb="4">
        Learn how to add custom features and modules to EatlyPOS.
      </Text>

      <Box mb="6">
        <Heading size="4" mb="4">Overview</Heading>
        <Text as="p" mb="4">
          EatlyPOS is designed to be extensible, allowing you to add custom features and modules to meet your specific business needs. This guide will walk you through the process of adding new features to your EatlyPOS installation.
        </Text>
      </Box>

      <Box mb="6">
        <Heading size="4" mb="4">Project Structure</Heading>
        <Text as="p" mb="4">
          Before adding new features, it&apos;s important to understand where different components should be placed:
        </Text>
        <CodeBlock>
          {`src/
  ├── app/              # Next.js app router pages
  ├── components/       # Reusable React components organized by feature
  ├── contexts/         # React context providers and state management
  ├── data/             # Data files and mock data
  ├── styles/           # Global styles and theme configuration
  ├── types/           # TypeScript type definitions
  └── utilities/       # Utility functions and helpers`}
        </CodeBlock>
      </Box>

      <Box mb="6">
        <Heading size="4" mb="4">Adding a New Feature</Heading>
        <Text as="p" mb="4">
          To add a new feature to EatlyPOS, follow these steps:
        </Text>
        <CodeBlock>
          {`// src/components/my-feature/my-component.tsx
import { Box } from "@radix-ui/themes"

export function MyComponent() {
  return (
    <Box>
      {/* Your component content */}
    </Box>
  )
}`}
        </CodeBlock>
      </Box>

      <Box mb="6">
        <Heading size="4" mb="4">Adding a New Feature</Heading>
        <Text as="p" mb="4">
          To add a new feature to EatlyPOS, follow these steps:
        </Text>
        
        <Heading size="3" mb="2">1. Create Feature Directory</Heading>
        <Text as="p" mb="4">
          Start by creating a new directory in the <Code>src/features</Code> folder for your feature:
        </Text>
        <CodeBlock>
        {`mkdir src/features/my-feature`}
        </CodeBlock>

        <Heading size="3" mb="2">2. Create Feature Components</Heading>
        <Text as="p" mb="4">
          Create the necessary components for your feature. Follow this basic structure:
        </Text>
        <CodeBlock>
        {`// src/components/my-feature/my-component.tsx
import { Box } from "@radix-ui/themes"

export function MyComponent() {
  return (
    <Box>
      {/* Your component content */}
    </Box>
  )
}`}
        </CodeBlock>

        <Heading size="3" mb="2">3. Add Feature Route</Heading>
        <Text as="p" mb="4">
          Create a new route for your feature in the appropriate section of the app:
        </Text>
        <CodeBlock
        >
       {`// src/app/(default)/my-feature/page.tsx
import { MyFeature } from "@/components/my-feature"

export default function MyFeaturePage() {
  return <MyFeature />
}`}
        </CodeBlock>
        <Callout.Root>
          <Callout.Icon>
            <AlertCircle size={18} />
          </Callout.Icon>
          <Callout.Text>Remember to follow the existing code style and patterns when adding new features. Use Radix Theme components for UI elements and maintain consistent file naming conventions.</Callout.Text>
        </Callout.Root>
      </Box>

      <Box mb="6">
        <Heading size="4" mb="4">Best Practices</Heading>
        <Text as="p" mb="2">When adding new features, keep these guidelines in mind:</Text>
        <Box pl="4">
          <ul className="list-disc">
            <li>Use TypeScript for type safety and better development experience</li>
            <li>Follow the existing project structure and naming conventions</li>
            <li>Utilize Radix Theme components for consistent UI</li>
            <li>Write unit tests for critical functionality</li>
            <li>Keep components modular and reusable</li>
            <li>Document your code and update relevant documentation</li>
          </ul>
        </Box>
      </Box>

      <Box>
        <Heading size="4" mb="4">Contributing</Heading>
        <Text as="p" mb="4">
          If you&apos;ve developed a feature, consider contributing it back to the main project:
        </Text>
        <Box pl="4">
          <ul className="list-disc">
            <li>Fork the repository</li>
            <li>Create a new branch for your feature</li>
            <li>Submit a pull request with a clear description of your feature</li>
            <li>Include documentation and tests</li>
          </ul>
        </Box>
      </Box>
    </Box>
  )
}
