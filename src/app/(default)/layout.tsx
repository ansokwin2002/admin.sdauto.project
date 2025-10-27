"use client";

import { Box, Flex } from "@radix-ui/themes";
import TopBar from "@/components/common/TopBar";
import Sidebar from "@/components/common/Sidebar";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { AppOrganizationProvider } from "@/contexts/AppOrganizationContext";
import { Text } from "@radix-ui/themes";
import ProgressBar from '@/components/common/ProgressBar';
import { useRouter, usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarWidth = '280px';
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const onScroll = useCallback(() => {
    const mainContent = document.querySelector('[data-main-content]');
    if (mainContent) {
      const scrollPosition = mainContent.scrollTop;
      setIsScrolled(scrollPosition > 50);
    }
  }, []);

  useEffect(() => {
    const mainContent = document.querySelector('[data-main-content]');
    if (mainContent) {
      mainContent.addEventListener('scroll', onScroll);
      return () => {
        mainContent.removeEventListener('scroll', onScroll);
      };
    }
  }, [onScroll]);

  const pathname = usePathname();
  const pageTitle = useMemo(() => {
    const map: Record<string, string> = {
      "/": "Dashboard",
      "/dashboard": "Dashboard",
      "/home": "Home",
      "/settings": "Settings",
      "/sliders": "Sliders",
    };
    if (map[pathname]) return map[pathname];
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) return "Dashboard";
    return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" / ");
  }, [pathname]);

  useEffect(() => {
    document.title = `${pageTitle} | SDAUTO`;
  }, [pageTitle]);
  
  return (
    <AppOrganizationProvider>
      <ProgressBar />
      <Box className="flex flex-col h-screen overflow-x-hidden">
        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <Box 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <Box 
          style={{ position: 'fixed', zIndex: 20, width: sidebarWidth, height: '100vh' }} 
          className={`transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[280px] lg:translate-x-0'}`}
        >
          <Sidebar width={sidebarWidth} onClose={() => setIsSidebarOpen(false)} />
        </Box>
        
        {/* Main content area */}
        <Box 
          className="h-screen overflow-y-auto lg:ml-[280px] lg:w-[calc(100%-280px)] min-w-0"
          data-main-content
        >
          {/* Top bar */}
          <TopBar isScrolled={isScrolled} onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          
          {/* Page content */}
          <Box className="flex-1 overflow-y-auto">
            <Box className="w-full flex justify-center py-6">
              <Box className="px-4 w-full">
                {children}
              </Box>
            </Box>
          </Box>
          
          {/* Footer */}
          <Box className="py-4 mt-auto">
            <Flex justify="center">
              <Text size="1" className="text-gray-400 dark:text-neutral-600 text-center">&copy; {new Date().getFullYear()} SDAUTO. All rights reserved.</Text>
            </Flex>
          </Box>
        </Box>
      </Box>
    </AppOrganizationProvider>
  );
}