"use client";

import React from 'react';
import AddEditRewardForm from '@/components/loyalty-program/AddEditRewardForm';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function AddRewardPage() {
  usePageTitle('Add Reward');
  return (
    <AddEditRewardForm />
  );
} 