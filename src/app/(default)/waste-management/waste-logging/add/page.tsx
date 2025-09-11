'use client';

import { useRouter } from 'next/navigation';
import { Box } from '@radix-ui/themes';
import WasteLogForm from '@/components/waste-management/WasteLogForm';
import { WasteLog } from '@/types/inventory';
import { wasteLogs } from '@/data/WasteLogData';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function AddWasteLogPage() {
  usePageTitle('Add Waste Log');
  const router = useRouter();

  // Add waste log to the data array
  const addWasteLog = (wasteLog: Omit<WasteLog, 'id'>): WasteLog => {
    const newLog: WasteLog = {
      ...wasteLog,
      id: uuidv4()
    };
    
    wasteLogs.push(newLog);
    return newLog;
  };

  const handleAddWasteLog = (wasteLog: Omit<WasteLog, 'id'>) => {
    try {
      // Add the current branch ID (this would typically come from a context or state management)
      const logWithBranch = {
        ...wasteLog,
        branchId: 'br-1' // Hardcoded for now, would come from context in a real app
      };
      
      // Add the waste log
      const newLog = addWasteLog(logWithBranch);
      console.log('Added new waste log:', newLog);
      
      // Show success message
      toast.success('Waste log added successfully!');
      
      // Navigate back to the list page after a short delay
      setTimeout(() => {
        router.push('/waste-management/waste-logging');
      }, 500);
    } catch (error) {
      console.error('Error adding waste log:', error);
      toast.error('Failed to add waste log. Please try again.');
    }
  };

  const handleCancel = () => {
    router.push('/waste-management/waste-logging');
  };

  return (
    <Box className="space-y-4">
      <WasteLogForm
        onSubmit={handleAddWasteLog}
        onCancel={handleCancel}
        editingItem={null}
      />
    </Box>
  );
} 