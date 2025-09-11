'use client'

import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import '@/styles/custom.css'
import { ThemeProvider, useTheme } from "next-themes";
import { ReactNode, useEffect, useState } from "react";
import { Theme } from "@radix-ui/themes";
import { Toaster } from "sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: 'swap',
});

// Script to run before React hydrates the page
const themeScript = `
  (function() {
    try {
      const storedTheme = localStorage.getItem('theme') || 'light'; // Default to 'light'
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
      document.documentElement.style.colorScheme = storedTheme;
    } catch (e) {
      console.error('Error setting initial theme:', e);
    }
  })();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${plusJakartaSans.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="theme">
          <RadixThemeWrapper>
            {children}
            <ThemedToaster />
          </RadixThemeWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}

// New component to handle theme syncing
function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Use light theme during SSR and initial render
  // After mounting, use the resolvedTheme from next-themes
  const theme = mounted ? resolvedTheme : 'light';
  
  return <Toaster richColors position="top-right" theme={theme as 'light' | 'dark'} />;
}

function RadixThemeWrapper({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Set mounted state once component mounts
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // During SSR, use a default value (false for light mode)
  // After mounting, use the resolvedTheme from next-themes
  const isDarkMode = mounted 
    ? resolvedTheme === 'dark'
    : false; // Default to light theme during SSR
  
  return (
    <Theme 
      accentColor="orange"
      hasBackground={true}
      panelBackground="solid"
      appearance={isDarkMode ? 'dark' : 'light'}
    >
      {children}
    </Theme>
  );
}