import { Heading, Text, Flex } from "@radix-ui/themes";
import { Folder, FileText } from "lucide-react";

const DirectoryItem = ({ name, description, isFolder = true }) => (
  <Flex gap="3" align="start" mb="2">
    {isFolder ? (
      <Folder className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
    ) : (
      <FileText className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
    )}
    <div>
      <Text as="div" weight="medium" size="3">{name}</Text>
      {description && (
        <Text as="div" color="gray" size="2">{description}</Text>
      )}
    </div>
  </Flex>
);

export default function ProjectStructure() {
  return (
    <div>
      <Heading as="h2" size="8" mb="4">Project Structure</Heading>
      
      <Text as="p" size="3" mb="4">
        EatlyPOS follows a modular and organized structure to maintain scalability and developer-friendly codebase.
        Here&apos;s an overview of the main directories and their purposes.
      </Text>

      <Heading as="h3" size="6" mb="3">Root Directory Structure</Heading>
      <Flex direction="column" gap="4" mb="6">
        <DirectoryItem 
          name="src/" 
          description="Main source code directory containing all application code"
        />
        <DirectoryItem 
          name="public/" 
          description="Static assets like images, fonts, and other public files"
        />
        <DirectoryItem 
          name="package.json" 
          description="Project dependencies and scripts"
          isFolder={false}
        />
        <DirectoryItem 
          name="next.config.mjs" 
          description="Next.js configuration"
          isFolder={false}
        />
        <DirectoryItem 
          name="tailwind.config.js" 
          description="Tailwind CSS configuration"
          isFolder={false}
        />
        <DirectoryItem 
          name="jsconfig.json" 
          description="JavaScript configuration with path aliases"
          isFolder={false}
        />
      </Flex>

      <Heading as="h3" size="6" mb="3">Source Directory (src/)</Heading>
      <Flex direction="column" gap="4" mb="6">
        <DirectoryItem 
          name="app/" 
          description="Next.js App Router directory containing all pages and layouts"
        />
        <DirectoryItem 
          name="components/" 
          description="Reusable React components organized by feature"
        />
        <DirectoryItem 
          name="contexts/" 
          description="React context providers and state management"
        />
        <DirectoryItem 
          name="data/" 
          description="Data files and mock data"
        />
        <DirectoryItem 
          name="hooks/" 
          description="Custom React hooks for reusable logic"
        />
        <DirectoryItem 
          name="styles/" 
          description="Global styles and theme configuration"
        />
        <DirectoryItem 
          name="types/" 
          description="TypeScript type definitions"
        />
        <DirectoryItem 
          name="utilities/" 
          description="Utility functions and helpers"
        />
      </Flex>

      <Heading as="h3" size="6" mb="3">App Directory (src/app/)</Heading>
      <Flex direction="column" gap="4" mb="6">
        <DirectoryItem 
          name="(default)/" 
          description="Default layout pages including dashboard and settings"
        />
        <DirectoryItem 
          name="(pos)/" 
          description="Point of Sale system pages with minimal layout"
        />
        <DirectoryItem 
          name="auth/" 
          description="Authentication related pages (login, register)"
        />
        <DirectoryItem 
          name="docs/" 
          description="Documentation pages with specialized layout"
        />
        <DirectoryItem 
          name="globals.css" 
          description="Global CSS imports (Tailwind, Radix UI, Date Range), CSS variables for theming, and dark mode support"
          isFolder={false}
        />
        <DirectoryItem 
          name="layout.tsx" 
          description="Root layout with theme providers (next-themes, Radix UI), font configuration, and global providers (Toaster, LoadingProgressBar)"
          isFolder={false}
        />
        <DirectoryItem 
          name="not-found.tsx" 
          description="Custom 404 page component"
          isFolder={false}
        />
      </Flex>

      <Heading as="h3" size="6" mb="3">Components Directory (src/components/)</Heading>
      <Flex direction="column" gap="4" mb="6">
        <DirectoryItem 
          name="admin-settings/" 
          description="Administrative settings components"
        />
        <DirectoryItem 
          name="common/" 
          description="Shared components used across multiple features"
        />
        <DirectoryItem 
          name="inventory/" 
          description="Inventory management components"
        />
        <DirectoryItem 
          name="loyalty-program/" 
          description="Customer loyalty program components"
        />
        <DirectoryItem 
          name="menu-management/" 
          description="Menu and product management components"
        />
        <DirectoryItem 
          name="purchasing/" 
          description="Purchase order and supplier management"
        />
        <DirectoryItem 
          name="sales/" 
          description="Sales reporting and analytics components"
        />
        <DirectoryItem 
          name="waste-management/" 
          description="Waste tracking and management components"
        />
      </Flex>

      <Heading as="h3" size="6" mb="3">Important Files</Heading>
      <Text as="p" size="3" mb="4">
        These are the key files that developers commonly work with:
      </Text>

      <Heading as="h4" size="4" mb="2">Layout & Navigation</Heading>
      <Flex direction="column" gap="4" mb="4">
        <DirectoryItem 
          name="src/app/layout.tsx" 
          description="Root layout with theme providers, global styles, and metadata"
          isFolder={false}
        />
        <DirectoryItem 
          name="src/app/(default)/layout.tsx" 
          description="Default layout with sidebar navigation and top bar"
          isFolder={false}
        />
        <DirectoryItem 
          name="src/app/(pos)/layout.tsx" 
          description="POS layout with minimal UI and full viewport"
          isFolder={false}
        />
        <DirectoryItem 
          name="src/components/common/Sidebar.tsx" 
          description="Main navigation sidebar component"
          isFolder={false}
        />
        <DirectoryItem 
          name="src/components/common/TopBar.tsx" 
          description="Top navigation bar with user menu and actions"
          isFolder={false}
        />
      </Flex>

      <Heading as="h4" size="4" mb="2">Styling & Theme</Heading>
      <Flex direction="column" gap="4" mb="4">
        <DirectoryItem 
          name="src/app/globals.css" 
          description="Global CSS imports (Tailwind, Radix UI, Date Range), CSS variables for theming, and dark mode support"
          isFolder={false}
        />
        <DirectoryItem 
          name="src/styles/custom.css" 
          description="Custom styles and overrides"
          isFolder={false}
        />
        <DirectoryItem 
          name="tailwind.config.js" 
          description="Tailwind CSS configuration"
          isFolder={false}
        />
      </Flex>

      <Heading as="h4" size="4" mb="2">Core Configuration</Heading>
      <Flex direction="column" gap="4" mb="4">
        <DirectoryItem 
          name="src/app/layout.tsx" 
          description="Root layout with theme providers (next-themes, Radix UI), font configuration, and global providers (Toaster, LoadingProgressBar)"
          isFolder={false}
        />
        <DirectoryItem 
          name="src/contexts/auth-context.tsx" 
          description="Authentication and user session management"
          isFolder={false}
        />
        <DirectoryItem 
          name="src/utilities/chartOptions.ts" 
          description="ApexCharts default configuration and themes"
          isFolder={false}
        />
        <DirectoryItem 
          name="jsconfig.json" 
          description="Path aliases and compiler options"
          isFolder={false}
        />
      </Flex>
    </div>
  );
} 