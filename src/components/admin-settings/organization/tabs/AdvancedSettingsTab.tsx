import React, { useState } from 'react';
import { Box, Card, Flex, Grid, Heading, Separator, Switch, Text, TextField } from '@radix-ui/themes';
import { Branch } from '@/data/BranchData';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import CardHeading from '@/components/common/CardHeading';

interface AdvancedSettingsTabProps {
  branch: Branch;
  onUpdate: (updates: Partial<Branch>) => void;
}

export default function AdvancedSettingsTab({ branch, onUpdate }: AdvancedSettingsTabProps) {
  const [showStatusConfirmDialog, setShowStatusConfirmDialog] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<boolean | null>(null);
  
  // Handle status change request
  const handleStatusChangeRequest = (active: boolean) => {
    setPendingStatusChange(active);
    setShowStatusConfirmDialog(true);
  };
  
  // Confirm status change
  const confirmStatusChange = () => {
    if (pendingStatusChange !== null) {
      onUpdate({ status: pendingStatusChange ? 'active' : 'inactive' });
      setPendingStatusChange(null);
    }
  };
  
  // Update settings
  const handleSettingChange = <K extends keyof Branch['settings']>(
    setting: K,
    value: Branch['settings'][K]
  ) => {
    onUpdate({
      settings: {
        ...branch.settings,
        [setting]: value
      }
    });
  };
  
  return (
    <Box className="space-y-4">
      <Card size="3">
          <CardHeading title="Branch Status" />
          <Text as="label" size="2" weight="medium">
            <Flex align="center" gap="2">
              <Switch 
                color="green"
                checked={branch.status === 'active'}
                onCheckedChange={handleStatusChangeRequest}
              />
              <Box>
                <Text weight="bold">
                  {branch.status === 'active' ? 'Branch Active' : 'Branch Inactive'}
                </Text>
                <Text as="p" size="1" color="gray" mt="1">
                {branch.status === 'active' 
                  ? 'Branch is operational and visible in the system'
                  : 'Branch is inactive and not available for operations'
                }
                </Text>
              </Box>
            </Flex>
          </Text>        
      </Card>
      
      <Card size="3">
        <CardHeading title="Inventory & Menu Settings" />
        
        <Flex direction="column" gap="3">
          <Text as="label" size="2" weight="medium">
            <Flex align="center" gap="2">
              <Switch 
                color="green"
                checked={branch.settings.inventoryTracking}
                onCheckedChange={(checked) => 
                  handleSettingChange('inventoryTracking', checked)
                }
              />
              <Box>
                <Text weight="bold">Inventory Tracking</Text>
                <Text as="p" size="1" color="gray" mt="1">
                  Enable real-time inventory tracking for this branch
                </Text>
              </Box>
            </Flex>
          </Text>
          
          <Text as="label" size="2" weight="medium">
            <Flex align="center" gap="2">
              <Switch 
              color="green"
              checked={branch.settings.allowLocalMenuOverride}
              onCheckedChange={(checked) => 
                handleSettingChange('allowLocalMenuOverride', checked)
              }
            />
            <Box>
              <Text weight="bold">Allow Local Menu Override</Text>
              <Text as="p" size="1" color="gray" mt="1">
                Allow this branch to customize their menu independently
              </Text>
              </Box>
            </Flex>
          </Text>
        </Flex>
      </Card>
      
      {/* Confirmation dialog for status change */}
      <ConfirmDialog
        open={showStatusConfirmDialog}
        onOpenChange={setShowStatusConfirmDialog}
        onConfirm={confirmStatusChange}
        title={pendingStatusChange ? "Activate Branch" : "Deactivate Branch"}
        description={pendingStatusChange 
          ? "Are you sure you want to activate this branch? This will make it operational and visible throughout the system."
          : "Are you sure you want to deactivate this branch? This will make it unavailable for operations and hide it from active use."
        }
        confirmText={pendingStatusChange ? "Activate" : "Deactivate"}
        color={pendingStatusChange ? "green" : "red"}
      />
    </Box>
  );
} 