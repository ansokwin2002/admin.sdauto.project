'use client';

import { useRouter, useParams } from 'next/navigation';
import MemberDetails from '@/components/loyalty-program/MemberDetails';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function MemberDetailsPage() {
  usePageTitle('Member Details');
  const router = useRouter();
  const params = useParams();
  const memberId = params.memberId as string;

  const handleBackToList = () => {
    router.push('/loyalty-program/members');
  };

  if (!memberId) {
    return <div>Loading member details...</div>; 
  }

  return (
    <MemberDetails 
      memberId={memberId} 
      onBack={handleBackToList} 
    />
  );
} 