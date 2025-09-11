'use client';

import SearchableSelect from '@/components/common/SearchableSelect';
import { organization } from '@/data/CommonData';
import {
  AlertDialog,
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Grid,
  Heading,
  RadioGroup,
  Select,
  Switch,
  Tabs,
  Text,
  TextArea,
  TextField,
} from '@radix-ui/themes';
import { Award, Clock, CreditCard, Save, Settings, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import { MembershipTier } from '@/types/loyalty';
import { toast } from 'sonner';
import { PageHeading } from '@/components/common/PageHeading';
import { usePageTitle } from '@/hooks/usePageTitle';

interface LoyaltyTierModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier: MembershipTier | null;
  onSave: (tier: MembershipTier) => void;
}

const LoyaltyTierModal: React.FC<LoyaltyTierModalProps> = ({
  open,
  onOpenChange,
  tier,
  onSave,
}) => {
  const [currentTier, setCurrentTier] = useState<Partial<MembershipTier>>(tier || {});
  const [benefitsString, setBenefitsString] = useState<string>('');

  React.useEffect(() => {
    const initialTier = tier || { name: '', minPoints: 0, benefits: [] };
    setCurrentTier(initialTier);
    setBenefitsString(initialTier.benefits?.join('\n') || '');
  }, [tier, open]);

  const handleSave = () => {
    if (!currentTier.name || currentTier.minPoints === undefined) {
      toast.error('Please fill in Tier Name and Threshold.');
      return;
    }
    const benefitsArray = benefitsString.split('\n').map(b => b.trim()).filter(b => b);

    onSave({
      id: tier?.id || Date.now().toString(),
      name: currentTier.name,
      minPoints: currentTier.minPoints,
      benefits: benefitsArray,
    } as MembershipTier);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Flex justify="between">
          <Dialog.Title>{tier ? 'Edit' : 'Add'} Loyalty Tier</Dialog.Title>
          <Dialog.Close>
            <Button variant="ghost" color="gray">
              <X size={16} />
            </Button>
          </Dialog.Close>
        </Flex>
        <Dialog.Description size="2" mb="4">
          Define the criteria and benefits for this loyalty tier.
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <Flex direction="column" gap="1">
            <Text as="label" size="2" weight="medium">
              Tier Name
            </Text>
            <TextField.Root
              value={currentTier.name || ''}
              onChange={(e) => setCurrentTier({ ...currentTier, name: e.target.value })}
              placeholder="e.g., Gold Member"
            />
          </Flex>
          <Flex direction="column" gap="1">
            <Text as="label" size="2" weight="medium">
              Threshold (Minimum Points)
            </Text>
            <TextField.Root
              type="number"
              value={currentTier.minPoints?.toString() || ''}
              onChange={(e) => setCurrentTier({ ...currentTier, minPoints: parseInt(e.target.value, 10) || 0 })}
              placeholder="e.g., 1000"
            />
          </Flex>
          <Flex direction="column" gap="1">
            <Text as="label" size="2" weight="medium">
              Benefits (One per line)
            </Text>
            <TextArea
              value={benefitsString}
              onChange={(e) => setBenefitsString(e.target.value)}
              placeholder="e.g., 10% off all orders\nFree drink coupon monthly"
              rows={3}
            />
          </Flex>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              <X size={16} />
              Cancel
            </Button>
          </Dialog.Close>
          <Button onClick={handleSave} color="green">
            <Save size={16} />
            Save Tier
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default function LoyaltyProgramSettingsPage() {
  usePageTitle('Loyalty Program Settings');
  const [branchEnablement, setBranchEnablement] = useState<'all' | 'specific'>('all');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

  const [tiers, setTiers] = useState<MembershipTier[]>([
    { id: '1', name: 'Bronze', minPoints: 0, benefits: ['Basic Rewards'] },
    { id: '2', name: 'Silver', minPoints: 1000, benefits: ['5% Discount'] },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<MembershipTier | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tierToDelete, setTierToDelete] = useState<MembershipTier | null>(null);
  
  const [activeTab, setActiveTab] = useState("general");

  const handleOpenModal = (tier: MembershipTier | null) => {
    setEditingTier(tier);
    setIsModalOpen(true);
  };

  const handleSaveTier = (tierToSave: MembershipTier) => {
    setTiers((prevTiers) => {
      const existingIndex = prevTiers.findIndex((t) => t.id === tierToSave.id);
      if (existingIndex > -1) {
        const updatedTiers = [...prevTiers];
        updatedTiers[existingIndex] = tierToSave;
        return updatedTiers;
      } else {
        return [...prevTiers, tierToSave];
      }
    });
    setIsModalOpen(false);
  };

  const handleOpenDeleteDialog = (tier: MembershipTier) => {
    setTierToDelete(tier);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteTier = () => {
    if (!tierToDelete) return;
    setTiers((prevTiers) => prevTiers.filter((t) => t.id !== tierToDelete.id));
    setIsDeleteDialogOpen(false);
    setTierToDelete(null);
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <Box>
      <Flex 
        direction={{ initial: "column", sm: "row" }} 
        justify="between" 
        align={{ initial: "stretch", sm: "center" }}
        gap={{ initial: "4", sm: "0" }}
        mb="5"
      >
        <PageHeading
          title="Loyalty Program Settings"
          description="Configure your restaurant's loyalty program settings"
          noMarginBottom
        />
      </Flex>

      <Tabs.Root defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="overflow-x-auto">
          <Tabs.Trigger value="general">
            <Flex gap="2" align="center">
              <Settings size={16} />
              <Text>General</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="points">
            <Flex gap="2" align="center">
              <CreditCard size={16} />
              <Text>Points</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="expiry">
            <Flex gap="2" align="center">
              <Clock size={16} />
              <Text>Expiry Rules</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="tiers">
            <Flex gap="2" align="center">
              <Award size={16} />
              <Text>Membership Tiers</Text>
            </Flex>
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="general">
          <Card size="3" mt="4">
            <Heading size="3" mb="5">General Settings</Heading>
            <Flex direction="column" gap="5">
              <Text as="label" size="2" weight="medium">
                <Flex align="center" gap="1">
                  <Switch color="green" size="1" defaultChecked />
                  Enable Loyalty Program
                </Flex>
              </Text>
              
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">
                  Eligibility Rules
                </Text>
                <TextField.Root
                  placeholder="Min."
                  type="number"
                  className="w-full sm:max-w-[220px]"
                >
                  <TextField.Slot>$</TextField.Slot>
                </TextField.Root>
                <Text size="1" color="gray">Minimum spend to earn points (e.g., 10)</Text>
              </Flex>
              
              <Flex direction="column" gap="2">
                <Text as="label" size="2" weight="medium">
                  Branch-Specific Enablement
                </Text>
                <RadioGroup.Root 
                  color="green"
                  defaultValue="all" 
                  value={branchEnablement} 
                  onValueChange={(value) => setBranchEnablement(value as 'all' | 'specific')} 
                  name="branch-enablement"
                >
                  <Flex 
                    direction={{ initial: "column", sm: "row" }}
                    gap="3"
                  >
                    <RadioGroup.Item value="all">All Branches</RadioGroup.Item>
                    <RadioGroup.Item value="specific">Specific Branches</RadioGroup.Item>
                  </Flex>
                </RadioGroup.Root>
                {branchEnablement === 'specific' && (
                  <Box mt="2">
                    <SearchableSelect
                      placeholder="Select Branches"
                      options={organization.filter(o => o.id !== 'hq').map(branch => ({
                        value: branch.id,
                        label: branch.name
                      }))}
                      isMulti={true}
                      usePortal={true}
                      isClearable={false}
                      value={selectedBranches}
                      onChange={(value) => setSelectedBranches(value as string[])}
                    />
                  </Box>
                )}
              </Flex>

              <Flex direction="column" gap="2">
                <Text as="label" size="2" weight="medium">Eligible Order Types</Text>
                <Flex 
                  direction={{ initial: "column", sm: "row" }}
                  gap={{ initial: "3", sm: "6" }}
                  wrap="wrap"
                >
                  <Text as="label" size="2">
                    <Flex gap="1" align="center">
                      <Switch color="green" size="1" defaultChecked />
                      In-Store
                    </Flex>
                  </Text>
                  <Text as="label" size="2">
                    <Flex gap="1" align="center">
                      <Switch color="green" size="1" defaultChecked />
                      Online Orders
                    </Flex>
                  </Text>
                  <Text as="label" size="2">
                    <Flex gap="1" align="center">
                      <Switch color="green" size="1" defaultChecked />
                      Dine-In
                    </Flex>
                  </Text>
                  <Text as="label" size="2">
                    <Flex gap="1" align="center">
                      <Switch color="green" size="1" />
                      Takeaway
                    </Flex>
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Flex justify="start" mt="5">
              <Button color="green" onClick={handleSaveSettings}>
                <Save size={16} />
                Save Settings
              </Button>
            </Flex>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="points">
          <Card size="3" mt="4">
            <Heading size="3" mb="5">Points Earning & Redemption</Heading>
            <Grid columns={{ initial: '1', sm: '2' }} gap="4" mb="4">
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Earning Rate</Text>
                <TextField.Root placeholder="Points per $ spent (e.g., 1)" type="number">
                  <TextField.Slot>Points/$</TextField.Slot>
                </TextField.Root>
              </Flex>

              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Points Rounding Rule</Text>
                <Select.Root defaultValue="round-up">
                  <Select.Trigger placeholder="Select rounding rule..." />
                  <Select.Content>
                    <Select.Item value="round-up">Round Up</Select.Item>
                    <Select.Item value="round-down">Round Down</Select.Item>
                    <Select.Item value="nearest-half">Nearest 0.5</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>
            </Grid>
            
            <Grid columns={{ initial: '1', sm: '2' }} gap="4">
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Redemption Conversion</Text>
                <TextField.Root placeholder="e.g., 100 points = $1" type="number">
                  <TextField.Slot>Points per $1</TextField.Slot>
                </TextField.Root>
              </Flex>

              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Maximum Discount Cap</Text>
                <TextField.Root placeholder="e.g., 500 points" type="number">
                  <TextField.Slot>Points per transaction</TextField.Slot>
                </TextField.Root>
              </Flex>
            </Grid>
            <Flex justify="start" mt="6">
              <Button color="green" onClick={handleSaveSettings}>
                <Save size={16} />
                Save Settings
              </Button>
            </Flex>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="expiry">
          <Card size="3" mt="4">
            <Heading size="3" mb="5">Points Expiration Settings</Heading>
            <Grid columns={{ initial: '1', sm: '2' }} gap="4" mb="4">
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Expiration Duration</Text>
                <Flex gap="2">
                  <TextField.Root placeholder="e.g., 6" type="number" style={{ width: 100 }} />
                  <Select.Root defaultValue="months">
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Item value="days">Days</Select.Item>
                      <Select.Item value="months">Months</Select.Item>
                      <Select.Item value="years">Years</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Flex>
              </Flex>

              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Expiry Logic</Text>
                <RadioGroup.Root defaultValue="rolling" name="expiry-logic" color="green">
                  <Flex direction="column" gap="2">
                    <RadioGroup.Item value="rolling">Rolling (Based on last activity)</RadioGroup.Item>
                    <RadioGroup.Item value="fixed">Fixed (e.g., end of year)</RadioGroup.Item>
                  </Flex>
                </RadioGroup.Root>
              </Flex>
            </Grid>
            
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">
                <Flex align="center" gap="2" mb="1">
                  <Switch color="green" size="1" />
                  <Box>
                    <Text as="p" weight="medium">Notify customers before points expire</Text>
                    <Text as="span" size="1" className="text-slate-500 dark:text-neutral-400">When enabled, customers will receive notifications about expiring points</Text>
                  </Box>
                </Flex>
              </Text>
            </Flex>
            <Flex justify="start" mt="5">
              <Button color="green" onClick={handleSaveSettings}>
                <Save size={16} />
                Save Settings
              </Button>
            </Flex>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="tiers">
          <Card size="3" mt="4">
            <Heading size="3" mb="5">Loyalty Tiers</Heading>
            <Flex direction="column" gap="3" mb="4">
              {tiers.sort((a, b) => a.minPoints - b.minPoints).map((tier) => (
                <Box key={tier.id} p="3" className="rounded-md border border-slate-200 dark:border-neutral-800">
                  <Flex justify="between" align="center">
                    <Box>
                      <Heading size="3">{tier.name}</Heading>
                      <Flex gap="1" direction="column" mt="1">
                        <Text size="2" color="gray">Threshold: {tier.minPoints} Points</Text>
                        <Text size="2" color="gray">Benefits: {tier.benefits.join(', ') || '-'}</Text>
                      </Flex>
                    </Box>
                    <Flex gap="2">
                      <Button variant="soft" color="gray" onClick={() => handleOpenModal(tier)}>Edit</Button>
                      <Button variant="soft" color="red" onClick={() => handleOpenDeleteDialog(tier)}><Trash2 size={16} /></Button>
                    </Flex>
                  </Flex>
                </Box>
              ))}
              <Button variant="outline" style={{ alignSelf: 'start' }} onClick={() => handleOpenModal(null)} >
                Add New Tier
              </Button>
            </Flex>
          </Card>

          <Card size="3" mt="4">
            <Heading size="3" mb="5">Tier Progression</Heading>
            <Grid columns={{ initial: '1', sm: '2' }} gap="4">
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">
                  <Flex align="center" gap="2">
                    <Switch color="green" size="1" defaultChecked />
                    <Box>
                      <Text as="p" weight="medium">Automatic Tier Promotion</Text>
                      <Text as="span" size="1" className="text-slate-500 dark:text-neutral-400">Customers will be automatically promoted when they reach the required points</Text>
                    </Box>
                  </Flex>
                </Text>
              </Flex>
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">
                  <Flex align="center" gap="2">
                    <Switch color="green" size="1" />
                    <Box>
                      <Text as="p" weight="medium">Automatic Tier Downgrade</Text>
                      <Text as="span" size="1" className="text-slate-500 dark:text-neutral-400">Based on inactivity or points expiration</Text>
                    </Box>
                  </Flex>
                </Text>
              </Flex>
            </Grid>
          </Card>
        </Tabs.Content>
      </Tabs.Root>

      <LoyaltyTierModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        tier={editingTier}
        onSave={handleSaveTier}
      />

      <AlertDialog.Root open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialog.Content style={{ maxWidth: 450 }}>
          <AlertDialog.Title>Delete Tier</AlertDialog.Title>
          <AlertDialog.Description size="2">
            Are you sure you want to delete the &quot;{tierToDelete?.name}&quot; tier?
            This action cannot be undone.
          </AlertDialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                <X size={16} />
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button variant="solid" color="red" onClick={handleDeleteTier}>
                <Trash2 size={16} />
                Delete Tier
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Box>
  );
}
