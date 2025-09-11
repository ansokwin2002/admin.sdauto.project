'use client';

import { useEffect } from 'react';
import { setPageTitle } from '@/utilities/pageTitle';

export const usePageTitle = (title: string) => {
  useEffect(() => {
    setPageTitle(title);
  }, [title]);
}; 