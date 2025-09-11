"use client";

import { Box } from "@radix-ui/themes";
import { useEffect } from "react";

export default function POSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Disable zoom on mobile browsers
  useEffect(() => {
    // Add meta tag to disable zooming
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(meta);
    }

    // Add meta title
    const titleMeta = document.querySelector('title');
    if (titleMeta) {
      titleMeta.textContent = "EatlyPOS | Next.js Restaurant Management System Template";
    } else {
      const newTitleElement = document.createElement('title');
      newTitleElement.textContent = "EatlyPOS | Next.js Restaurant Management System Template";
      document.head.appendChild(newTitleElement);
    }
    
    // Cleanup function
    return () => {
      const metaTag = document.querySelector('meta[name="viewport"]');
      if (metaTag) {
        metaTag.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    };
  }, []);

  return (      
    <Box height="100vh" className="bg-background">
      <Box height="100vh" className="overflow-auto p-4">
        {children}
      </Box>
    </Box>
  );
}
