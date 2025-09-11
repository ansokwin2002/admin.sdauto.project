"use client";
import { Flex, ScrollArea, Text } from "@radix-ui/themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { usePageTitle } from "@/hooks/usePageTitle";

const TopBar = ({ onMenuClick }) => {
  usePageTitle("Documentation");
  return (
    <div className="h-16 border-b border-gray-200 fixed top-0 left-0 right-0 bg-white z-50">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/docs" className="flex items-center gap-2">
            <Image src="/images/logo.png" width={130} height={20} alt="EatlyPOS" />
            <Text weight="bold" size="4"><Text className="hidden">EatlyPOS</Text> Documentation</Text>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">v1.0.0</span>
          <Link 
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

const DocSidebar = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  
  const isActive = (path) => pathname === path || pathname.startsWith(`${path}/`);
  
  const navItems = [
    {
      title: "Getting Started",
      path: "/docs/getting-started",
      children: [
        { title: "Introduction", path: "/docs/getting-started/introduction" },
        { title: "Installation", path: "/docs/getting-started/installation" },
        { title: "Project Structure", path: "/docs/getting-started/project-structure" },
      ]
    },
    {
      title: "User Interface",
      path: "/docs/ui",
      children: [
        { title: "UI Framework", path: "/docs/ui/ui-framework" },
        { title: "Layouts", path: "/docs/ui/layouts" },
      ]
    },
    {
      title: "Customization",
      path: "/docs/customization",
      children: [
        { title: "Styling", path: "/docs/customization/styling" },
        { title: "Adding Features", path: "/docs/customization/adding-features" },
      ]
    },
    {
      title: "Helpful Resources",
      path: "/docs/resources",
      children: [
        { title: "FAQ", path: "/docs/resources/faq" },
        { title: "Support", path: "/docs/resources/support" },
        { title: "License", path: "/docs/resources/license" },
        { title: "Changelog", path: "/docs/resources/changelog" }
      ]
    },
  ];
  
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        w-64 fixed top-16 bottom-0 border-r border-gray-200 bg-white z-40
        transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <ScrollArea className="h-full">
          <div className="p-4">
            <Flex direction="column" gap="5">
              {navItems.map((item) => (
                <div key={item.path}>
                  <Link 
                    href={item.path}
                    className={`block mb-2 font-medium ${isActive(item.path) ? 'text-orange-600' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    {item.title}
                  </Link>
                  
                  {item.children && (
                    <Flex direction="column" gap="2" className="ml-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          href={child.path}
                          className={`text-sm ${isActive(child.path) ? 'text-orange-600' : 'text-gray-600 dark:text-gray-400'}`}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </Flex>
                  )}
                </div>
              ))}
            </Flex>
          </div>
        </ScrollArea>
      </aside>
    </>
  );
};

const DocsLayoutClient = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="pt-16">
        <DocSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        <div className="lg:pl-64">
          <main className="p-4 lg:p-8">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default function DocsLayout({ children }) {
  return <DocsLayoutClient>{children}</DocsLayoutClient>;
} 