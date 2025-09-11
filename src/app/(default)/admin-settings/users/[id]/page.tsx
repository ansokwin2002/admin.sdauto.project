'use client';

import React, { use } from 'react';
import UserEditForm from '@/components/admin-settings/users/UserEditForm';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function UserEditPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  usePageTitle('Edit User');
  return <UserEditForm userId={unwrappedParams.id} />;
} 