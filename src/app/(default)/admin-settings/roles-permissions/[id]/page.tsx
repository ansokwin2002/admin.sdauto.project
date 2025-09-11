'use client';

import React, { use } from 'react';
import RoleForm from '@/components/admin-settings/roles-permissions/RoleForm';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  usePageTitle('Edit Role');
  return <RoleForm roleId={unwrappedParams.id} />;
} 