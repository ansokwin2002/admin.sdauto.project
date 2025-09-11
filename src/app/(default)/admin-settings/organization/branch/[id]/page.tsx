'use client';

import { use } from 'react';
import BranchForm from '@/components/admin-settings/organization/BranchForm';

export default function EditBranchPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  return <BranchForm branchId={unwrappedParams.id} />;
} 