'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Flex, Spinner, Text } from '@radix-ui/themes';
import WasteLogForm from '@/components/waste-management/WasteLogForm';
import { WasteLog } from '@/types/inventory';
import { wasteLogs } from '@/data/WasteLogData';
import { toast } from 'sonner';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function EditWasteLogPage() {
  usePageTitle('Edit Waste Log');
  const router = useRouter();
  const params = useParams();
  const logId = params.logId as string;
  
  const [wasteLog, setWasteLog] = useState<WasteLog | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get waste log by ID directly from data
  const getWasteLogById = (id: string): WasteLog | undefined => {
    return wasteLogs.find(log => log.id === id);
  };
  
  // Update waste log in the data array
  const updateWasteLog = (id: string, updates: Partial<WasteLog>): WasteLog | null => {
    const index = wasteLogs.findIndex(log => log.id === id);
    
    if (index === -1) {
      return null;
    }
    
    const updatedLog = {
      ...wasteLogs[index],
      ...updates
    };
    
    wasteLogs[index] = updatedLog;
    return updatedLog;
  };
  
  useEffect(() => {
    if (logId) {
      try {
        const log = getWasteLogById(logId);
        setWasteLog(log || null);
      } catch (error) {
        console.error(`Error fetching waste log with ID ${logId}:`, error);
        setError('Failed to load waste log data');
      } finally {
        setLoading(false);
      }
    }
  }, [logId]);
  
  const handleUpdateWasteLog = (updatedLog: Omit<WasteLog, 'id'> & { id?: string }) => {
    try {
      if (!logId) {
        throw new Error('Waste log ID is missing');
      }
      
      // Ensure we preserve the branch ID
      const logWithBranch = {
        ...updatedLog,
        branchId: wasteLog?.branchId || 'br-1' // Keep existing branch or default
      };
      
      // Update the waste log
      const result = updateWasteLog(logId, logWithBranch);
      
      if (!result) {
        throw new Error('Failed to update waste log');
      }
      
      console.log('Updated waste log:', result);
      
      // Show success message
      toast.success('Waste log updated successfully!');
      
      // Navigate back to the list page after a short delay
      setTimeout(() => {
        router.push('/waste-management/waste-logging');
      }, 500);
    } catch (error) {
      console.error('Error updating waste log:', error);
      toast.error('Failed to update waste log. Please try again.');
    }
  };
  
  const handleCancel = () => {
    router.push('/waste-management/waste-logging');
  };
  
  if (loading) {
    return (
      <Flex justify="center" align="center" style={{ height: '200px' }}>
        <Spinner size="3" />
      </Flex>
    );
  }
  
  if (error) {
    return <Text color="red">{error}</Text>;
  }
  
  if (wasteLog === null) {
    return <Box p="4"><Text color="red">Waste log not found.</Text></Box>;
  }
  
  if (wasteLog === undefined) {
    return <Box p="4"><Text>Loading...</Text></Box>;
  }
  
  return (
    <Box className="space-y-4">
      <WasteLogForm
        onSubmit={handleUpdateWasteLog}
        onCancel={handleCancel}
        editingItem={wasteLog}
      />
    </Box>
  );
} 