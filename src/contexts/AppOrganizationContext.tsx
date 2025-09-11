'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { OrganizationEntity, organization } from '@/data/CommonData';

interface AppOrganizationContextType {
  activeEntity: OrganizationEntity;
  setActiveEntity: (entity: OrganizationEntity) => void;
}

export const AppOrganizationContext = createContext<AppOrganizationContextType>({
  activeEntity: {} as OrganizationEntity,
  setActiveEntity: () => {},
});

interface AppOrganizationProviderProps {
  children: ReactNode;
}

export const AppOrganizationProvider = ({ children }: AppOrganizationProviderProps) => {
  // Default to HQ (first item in organization array)
  const [activeEntity, setActiveEntity] = useState<OrganizationEntity>(
    organization.find(entity => entity.id === 'hq') || organization[0]
  );

  return (
    <AppOrganizationContext.Provider value={{ activeEntity, setActiveEntity }}>
      {children}
    </AppOrganizationContext.Provider>
  );
};

export const useAppOrganization = () => useContext(AppOrganizationContext); 