'use client';

import React, { useState } from 'react';
import { Box, Card, Flex, Text, Select, Switch, Button, Table, Badge, IconButton, Dialog, Heading } from '@radix-ui/themes';
import { Download, Trash2, RefreshCw, AlertTriangle } from 'lucide-react';
import { formatDate } from '@/utilities';
import CardHeading from '@/components/common/CardHeading';
import ConfirmDialog from '@/components/common/ConfirmDialog';

// Mock data for backup history
const mockBackupHistory = [
  {
    id: '1',
    dateTime: '2023-10-15 14:30:22',
    backupType: 'Database Only',
    size: '42 MB',
    status: 'Completed',
    downloadLink: '#'
  },
  {
    id: '2',
    dateTime: '2023-10-10 08:15:10',
    backupType: 'Full System',
    size: '236 MB',
    status: 'Completed',
    downloadLink: '#'
  },
  {
    id: '3',
    dateTime: '2023-10-05 23:45:05',
    backupType: 'Database Only',
    size: '40 MB',
    status: 'Completed',
    downloadLink: '#'
  }
];

export default function ManualBackup() {
  const [backupType, setBackupType] = useState('database');
  const [includeAttachments, setIncludeAttachments] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupToDelete, setBackupToDelete] = useState<string | null>(null);

  // Estimated size based on backup type and attachments
  const estimatedSize = backupType === 'database' 
    ? (includeAttachments ? '45-50 MB' : '40-45 MB')
    : (includeAttachments ? '230-250 MB' : '180-200 MB');
  
  const handleBackup = () => {
    setIsBackingUp(true);
    // Simulate backup process
    setTimeout(() => {
      setIsBackingUp(false);
      // In a real implementation, this would handle the actual backup
    }, 3000);
  };

  const handleDeleteConfirm = () => {
    if (backupToDelete) {
      // In a real implementation, this would handle deletion of backup
      console.log(`Deleting backup with ID: ${backupToDelete}`);
      setBackupToDelete(null);
    }
  };

  return (
    <Box>
      <Card size="3">
        <CardHeading title="Manual Backup" />
        
        <Flex gap="4" direction="column">
          <Flex gap="4" align="center">
            <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Backup Type</Text>
            <Select.Root value={backupType} onValueChange={setBackupType}>
              <Select.Trigger placeholder="Select backup type" />
              <Select.Content>
                <Select.Item value="database">Database Only</Select.Item>
                <Select.Item value="full">Full System</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>
          
          <Flex gap="4" align="center">
            <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Include Attachments</Text>
            <Switch color="green" checked={includeAttachments} onCheckedChange={setIncludeAttachments} />
          </Flex>
          
          <Flex gap="4" align="center">
            <Text as="label" size="2" weight="medium" style={{ width: '180px' }}>Estimated Size</Text>
            <Text color="gray">{estimatedSize}</Text>
          </Flex>
          
          <Flex gap="4" mt="2">
            <Button 
              color="green" 
              onClick={handleBackup} 
              disabled={isBackingUp}
            >
              <RefreshCw size={16} className={isBackingUp ? 'animate-spin' : ''} />
              {isBackingUp ? 'Backing Up...' : 'Start Backup'}
            </Button>
          </Flex>
        </Flex>      
      </Card>
      
      <Box mt="6">
        <CardHeading title="Backup History" mb="4" />
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Date/Time</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Backup Type</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Size</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="center">Download</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="center">Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          
          <Table.Body>
            {mockBackupHistory.map((backup) => (
              <Table.Row key={backup.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800">
                <Table.Cell>{formatDate(new Date(backup.dateTime))}</Table.Cell>
                <Table.Cell>{backup.backupType}</Table.Cell>
                <Table.Cell>{backup.size}</Table.Cell>
                <Table.Cell>
                  <Badge color="green" variant="soft">{backup.status}</Badge>
                </Table.Cell>
                <Table.Cell align="center">
                  <IconButton size="1" variant="outline" color="green">
                    <Download size={14} />
                  </IconButton>
                </Table.Cell>
                <Table.Cell align="center">
                  <IconButton 
                    size="1" 
                    variant="outline" 
                    color="red" 
                    onClick={() => setBackupToDelete(backup.id)}
                  >
                    <Trash2 size={14} />
                  </IconButton>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={!!backupToDelete}
        onOpenChange={(open) => !open && setBackupToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        description="Are you sure you want to delete this backup? This action cannot be undone."
        confirmText="Delete"
        variant="solid"
        color="red"
      />
    </Box>
  );
} 