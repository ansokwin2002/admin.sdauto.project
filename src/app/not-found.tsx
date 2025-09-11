'use client'

import { usePathname } from 'next/navigation'
import DefaultNotFound from './(default)/not-found'
import POSNotFound from './(pos)/not-found'

export default function NotFound() {
  const pathname = usePathname()
  
  // Check if the current path is within the POS route group
  if (pathname?.startsWith('/pos')) {
    return <POSNotFound />
  }
  
  // For all other routes, use the default not-found page
  return <DefaultNotFound />
} 