import { Heading, Text, Card, Flex } from "@radix-ui/themes";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const CodeBlock = ({ children, language = 'bash' }) => {
  // Ensure proper line breaks by replacing any Windows-style line endings
  const formattedCode = children.trim().replace(/\r\n/g, '\n');
  
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
  );
};

export default function Installation() {
  return (
    <div>
      <Heading as="h2" size="8" mb="4">Installation</Heading>
      
      <Text as="p" size="3" mb="4">
        Follow these steps to set up EatlyPOS in your development environment.
      </Text>

      <Heading as="h3" size="6" mb="4">Prerequisites</Heading>
      <Card mb="6" className="p-4">
        <Text as="p" size="3" mb="4">
          Before you begin, ensure you have the following installed:
        </Text>
        <Flex direction="column" gap="2">
          <Text as="div" size="3">• Node.js (version ^20.x)</Text>
          <Text as="div" size="3">• npm or yarn</Text>
          <Text as="div" size="3">• Git</Text>
        </Flex>
      </Card>

      <Heading as="h3" size="6" mb="4">Step 1: Extract the Template</Heading>
      <Text as="p" size="3" mb="4">
        In the zip file, there will be two folders: <code>eatlypos</code> and <code>eatlypos-demo</code>. The eatlypos-demo folder will contain a setup that mirrors the template demo available at https://demo.eatlypos.com with branding color demo panel.
        Normally, you want to choose <code>eatlypos</code> folder for your project. Extract it to your desired location:
      </Text>
      <CodeBlock>{`unzip eatlypos.zip
cd eatlypos`}</CodeBlock>

      <Heading as="h3" size="6" mb="4">Step 2: Install Dependencies</Heading>
      <Text as="p" size="3" mb="4">
        Install the required dependencies using npm or yarn:
      </Text>
      <CodeBlock>{`# Using npm
npm install

# Or using yarn
yarn install`}</CodeBlock>

      <Heading as="h3" size="6" mb="4">Step 3: Start Development Server</Heading>
      <Text as="p" size="3" mb="4">
        Run the development server:
      </Text>
      <CodeBlock>{`# Using npm
npm run dev

# Or using yarn
yarn dev`}</CodeBlock>
      
      <Text as="p" size="3" mb="6">
        The application will be available at http://localhost:3000
      </Text>

      <Heading as="h3" size="6" mb="4">Step 4: Build for Production</Heading>
      <Text as="p" size="3" mb="4">
        When you&apos;re ready to deploy, create a production build:
      </Text>
      <CodeBlock>{`# Using npm
npm run build
npm start

# Or using yarn
yarn build
yarn start`}</CodeBlock>
    </div>
  );
} 