'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { OrganizationEntity, organization } from '@/data/CommonData';

interface FilterBranchContextType {
  activeBranchFilter: OrganizationEntity | null;
  setActiveBranchFilter: (branch: OrganizationEntity | null) => void;
}

const FilterBranchContext = createContext<FilterBranchContextType>({
  activeBranchFilter: null,
  setActiveBranchFilter: () => {},
});

export function FilterBranchProvider({ children }: { children: ReactNode }) {
  const [activeBranchFilter, setActiveBranchFilter] = useState<OrganizationEntity | null>(null);

  return (
    <FilterBranchContext.Provider value={{ activeBranchFilter, setActiveBranchFilter }}>
      {children}
    </FilterBranchContext.Provider>
  );
}

export function useFilterBranch() {
  return useContext(FilterBranchContext);
} 