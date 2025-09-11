"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import AddEditRewardForm from '@/components/loyalty-program/AddEditRewardForm';
import { Box } from '@radix-ui/themes';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function EditRewardPage() {
  usePageTitle('Edit Reward');
  const params = useParams();
  const rewardId = params.rewardId as string;

  return (
    <Box>
      {rewardId ? <AddEditRewardForm rewardId={rewardId} /> : <p>Reward ID not found.</p>}
    </Box>
  );
} 