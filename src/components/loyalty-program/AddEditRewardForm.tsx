"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Flex,
  TextField,
  TextArea,
  Button,
  Select,
  Text,
  Grid,
  Checkbox,
  Callout,
  Card,
  RadioGroup,
  AlertDialog,
  Badge
} from "@radix-ui/themes";
import { Upload, Info, Save, Send, X, Trash2, Power, OctagonX, CircleCheck } from "lucide-react";
import { LoyaltyReward, BranchScope } from '@/types/loyalty';
import { organization } from '@/data/CommonData';
import { membershipTiers } from '@/data/LoyaltyData';
import { menuItems } from '@/data/MenuData';
import { mockLoyaltyRewards } from '@/data/LoyaltyRewardsData';
import DateRangeInput from '@/components/common/DateRangeInput';
import SearchableSelect from '@/components/common/SearchableSelect';
import { Range } from 'react-date-range';
import { toast } from 'sonner';
import { PageHeading } from '@/components/common/PageHeading';
import Image from 'next/image';

const branches = organization.filter(org => org.id !== 'hq');
const branchOptions = branches.map(branch => ({ value: branch.id, label: branch.name }));

const defaultRewardState: Omit<LoyaltyReward, 'id' | 'status' | 'redemptionsCount'> = {
  name: '',
  description: '',
  type: 'Free Item',
  pointsRequired: 0,
  imageUrl: '',
  applicableTiers: [],
  branchScope: 'All',
  maxRedemptions: undefined,
  validityStartDate: undefined,
  validityEndDate: undefined,
  relatedItemId: undefined,
  discountPercentage: undefined,
  cashbackAmount: undefined,
};

interface AddEditRewardFormProps {
  rewardId?: string;
}

export default function AddEditRewardForm({ rewardId }: AddEditRewardFormProps) {
  const router = useRouter();
  const isEditing = !!rewardId;
  const [formData, setFormData] = useState<Omit<LoyaltyReward, 'id' | 'status' | 'redemptionsCount'>>(
    defaultRewardState
  );
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [branchSelectionType, setBranchSelectionType] = useState<'All' | 'Specific'>('All');
  const [selectedBranches, setSelectedBranches] = useState<string[] | null>(null);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: undefined,
    endDate: undefined,
    key: 'selection',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(isEditing);
  const [initialRewardData, setInitialRewardData] = useState<LoyaltyReward | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (isEditing && rewardId) {
      setIsLoading(true);
      const fetchedReward = mockLoyaltyRewards.find(r => r.id === rewardId);

      if (fetchedReward) {
         setInitialRewardData(fetchedReward);
        const editData = { ...defaultRewardState, ...fetchedReward };
        setFormData(editData);
        setSelectedTiers(editData.applicableTiers);
        if (editData.branchScope === 'All') {
            setBranchSelectionType('All');
            setSelectedBranches(null);
        } else {
            setBranchSelectionType('Specific');
            setSelectedBranches(Array.isArray(editData.branchScope) ? editData.branchScope : []);
        }
        setDateRange({
            startDate: editData.validityStartDate,
            endDate: editData.validityEndDate,
            key: 'selection',
        });
      } else {
        console.error(`Reward with ID ${rewardId} not found.`);
        router.push('/loyalty-program/rewards');
      }
      setIsLoading(false);
    } else {
      setInitialRewardData(null);
      setFormData(defaultRewardState);
      setSelectedTiers([]);
      setBranchSelectionType('All');
      setSelectedBranches(null);
      setDateRange({ startDate: undefined, endDate: undefined, key: 'selection' });
      setIsLoading(false);
    }
    setFormErrors({});
  }, [rewardId, isEditing, router]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Reward name is required.";
    if (formData.pointsRequired <= 0) errors.pointsRequired = "Points must be greater than zero.";
    if (!formData.type) errors.type = "Reward type is required.";
    if (formData.type === '% Discount' && (formData.discountPercentage === undefined || formData.discountPercentage <= 0 || formData.discountPercentage > 100)) {
        errors.discountPercentage = "Discount must be between 1 and 100.";
    }
    if (formData.type === 'Cashback' && (formData.cashbackAmount === undefined || formData.cashbackAmount <= 0)) {
        errors.cashbackAmount = "Cashback amount must be greater than zero.";
    }
    if (formData.type === 'Free Item' && !formData.relatedItemId) {
        errors.relatedItemId = "Please select the free item.";
    }
    if (selectedTiers.length === 0) errors.applicableTiers = "Select at least one membership tier.";
    if (branchSelectionType === 'Specific' && (!selectedBranches || selectedBranches.length === 0)) {
        errors.branchScope = "Select at least one branch when 'Specific Branches' is chosen.";
    }
     if (dateRange.startDate && dateRange.endDate && dateRange.startDate > dateRange.endDate) {
      errors.validity = "Start date cannot be after end date.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
     const processedValue = type === 'number' ? (value === '' ? '' : Number(value)) : value;
    setFormData(prev => ({ ...prev, [name]: processedValue }));
     if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
     if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (name === 'type') {
        setFormData(prev => ({
            ...prev,
            discountPercentage: value !== '% Discount' ? undefined : prev.discountPercentage,
            cashbackAmount: value !== 'Cashback' ? undefined : prev.cashbackAmount,
            relatedItemId: value !== 'Free Item' ? undefined : prev.relatedItemId,
        }));
        setFormErrors(prev => ({
          ...prev,
          discountPercentage: '',
          cashbackAmount: '',
          relatedItemId: ''
        }));
    }
  };

  const handleTierChange = (tierId: string, checked: boolean) => {
    setSelectedTiers(prev =>
      checked ? [...prev, tierId] : prev.filter(id => id !== tierId)
    );
     if (formErrors.applicableTiers) {
       setFormErrors(prev => ({ ...prev, applicableTiers: '' }));
     }
  };

  const handleBranchSelectionTypeChange = (value: 'All' | 'Specific') => {
    setBranchSelectionType(value);
    if (value === 'All') {
      setSelectedBranches(null);
    } else if (value === 'Specific' && !selectedBranches) {
       setSelectedBranches([]);
    }
    if (formErrors.branchScope) {
      setFormErrors(prev => ({ ...prev, branchScope: '' }));
    }
  };

  const handleBranchMultiSelectChange = (value: string[] | null) => {
    setSelectedBranches(value);
    if (value && value.length > 0) {
        setBranchSelectionType('Specific');
    }
     if (formErrors.branchScope) {
       setFormErrors(prev => ({ ...prev, branchScope: '' }));
     }
  };

   const handleDateRangeChange = (range: Range) => {
    setDateRange(range);
     if (formErrors.validity) {
      setFormErrors(prev => ({ ...prev, validity: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
      console.log("Selected image:", file.name);
    }
  };

  const handleCancel = () => {
    router.push('/loyalty-program/rewards');
  };

  const handleSubmit = (publish: boolean) => {
     if (!validateForm()) {
      console.log("Form validation failed", formErrors);
      return;
    }

    const finalBranchScope: BranchScope = branchSelectionType === 'Specific' ? (selectedBranches || []) : 'All';
    let finalStatus: LoyaltyReward['status'] = publish ? 'Active' : 'Draft';
    if (isEditing && initialRewardData && !publish && initialRewardData.status !== 'Draft') {
       finalStatus = 'Draft';
    } else if (isEditing && initialRewardData && publish && initialRewardData.status === 'Expired') {
       finalStatus = 'Active';
    }

    const rewardData: Omit<LoyaltyReward, 'id'> & { id?: string } = {
      ...formData,
      applicableTiers: selectedTiers,
      branchScope: finalBranchScope,
      validityStartDate: dateRange.startDate,
      validityEndDate: dateRange.endDate,
      status: finalStatus,
      discountPercentage: formData.type === '% Discount' ? formData.discountPercentage : undefined,
      cashbackAmount: formData.type === 'Cashback' ? formData.cashbackAmount : undefined,
      relatedItemId: formData.type === 'Free Item' ? formData.relatedItemId : undefined,
    };

    if (isEditing && rewardId) {
      rewardData.id = rewardId;
      rewardData.redemptionsCount = initialRewardData?.redemptionsCount ?? 0;
      console.log("Updating Reward:", rewardData);
      const index = mockLoyaltyRewards.findIndex(r => r.id === rewardId);
      if (index !== -1) {
         mockLoyaltyRewards[index] = rewardData as LoyaltyReward;
      }
      toast.success(`Reward "${rewardData.name}" updated (${publish ? 'and published' : 'as draft'}).`);
    } else {
      rewardData.id = `REW${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      rewardData.redemptionsCount = 0;
      console.log("Creating Reward:", rewardData);
      mockLoyaltyRewards.push(rewardData as LoyaltyReward);
      toast.success(`Reward "${rewardData.name}" created (${publish ? 'and published' : 'as draft'}).`);
    }

    router.push('/loyalty-program/rewards');
  };

  const handleDelete = () => {
    if (rewardId) {
      const index = mockLoyaltyRewards.findIndex(r => r.id === rewardId);
      if (index !== -1) {
        mockLoyaltyRewards.splice(index, 1);
        toast.success("Reward deleted successfully");
        router.push('/loyalty-program/rewards');
      }
    }
  };

  const handleToggleStatus = () => {
    if (rewardId && initialRewardData) {
      const index = mockLoyaltyRewards.findIndex(r => r.id === rewardId);
      if (index !== -1) {
        const newStatus = initialRewardData.status === 'Active' ? 'Inactive' : 'Active';
        mockLoyaltyRewards[index] = {
          ...mockLoyaltyRewards[index],
          status: newStatus
        };
        toast.success(`Reward ${newStatus.toLowerCase()}`);
        router.push('/loyalty-program/rewards');
      }
    }
  };

  if (isLoading) {
     return <Box p="4"><Text>Loading reward details...</Text></Box>;
  }

  return (
    <Box>
       <Flex align="center" justify="between" gap="3" mb="4">
        <PageHeading
          title={isEditing ? initialRewardData?.name : 'Add New Reward'}
          description={isEditing ? 'Edit Reward' : 'Add new reward to the loyalty program'}
          showBackButton
          noMarginBottom
          onBackClick={handleCancel}
          badge={isEditing ? 
          <Badge
            variant="solid"
            color={initialRewardData.status === 'Active' ? 'green' : initialRewardData.status === 'Inactive' ? 'orange' : initialRewardData.status === 'Draft' ? 'blue' : 'gray'}
          >{initialRewardData.status}</Badge> 
          : null}
        />
      </Flex>

       {Object.keys(formErrors).length > 0 && (
          <Callout.Root color="red" role="alert" mb="4">
             <Callout.Icon>
                <Info />
             </Callout.Icon>
             <Callout.Text>
                Please fix the errors marked below before saving.
             </Callout.Text>
          </Callout.Root>
        )}

       <Grid columns={{ initial: '1', lg: '4' }} gap="5">

         <Card size="3" className="lg:col-span-3">
           <Flex direction="column" gap="4"> 
              <Flex direction="column" gap="1">
                <Text as="label" htmlFor="rewardName" size="2" weight="medium">Reward Name</Text>
                <TextField.Root
                  id="rewardName"
                  name="name"
                  placeholder="e.g., Free Coffee, 10% Off"
                  value={formData.name}
                  onChange={handleInputChange}
                  color={formErrors.name ? 'red' : undefined}
                />
                {formErrors.name && <Text size="1" color="red">{formErrors.name}</Text>}
              </Flex>

              <Flex direction="column" gap="1">
                <Text as="label" htmlFor="rewardDescription" size="2" weight="medium">Description</Text>
                <TextArea
                  id="rewardDescription"
                  name="description"
                  placeholder="Briefly describe the reward for the customer"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </Flex>

              <Flex direction="column" gap="2">
                <Text as="label" size="2" weight="medium">Applicable Membership Tiers</Text>
                <Grid columns={{ initial: '2', sm: '4'}} gap="2">
                  {membershipTiers.map(tier => (
                    <Text key={tier.id} as="label" size="2">
                      <Flex gap="2" align="center">
                        <Checkbox
                          checked={selectedTiers.includes(tier.id)}
                          onCheckedChange={(checked) => handleTierChange(tier.id, checked as boolean)}
                          color={formErrors.applicableTiers ? 'red' : undefined}
                        /> {tier.name}
                      </Flex>
                    </Text>
                  ))}
                </Grid>
                {formErrors.applicableTiers && <Text size="1" color="red">{formErrors.applicableTiers}</Text>}
              </Flex>

              <Flex direction="column" gap="2">
                <Text as="label" size="2" weight="medium">Applicable Branches</Text>
                <RadioGroup.Root 
                    value={branchSelectionType} 
                    onValueChange={(value) => handleBranchSelectionTypeChange(value as 'All' | 'Specific')}
                >
                    <Flex gap="2" align="center"> 
                        <RadioGroup.Item value="All" id="branchAll" />
                        <Text as="label" htmlFor="branchAll" size="2">All Branches</Text>
                    </Flex>
                    <Flex gap="2" align="center"> 
                        <RadioGroup.Item value="Specific" id="branchSpecific" />
                        <Text as="label" htmlFor="branchSpecific" size="2">Specific Branches</Text>
                    </Flex>
                </RadioGroup.Root>
                
                {branchSelectionType === 'Specific' && (
                  <Box mt="1">
                    <SearchableSelect
                      options={branchOptions}
                      value={selectedBranches}
                      onChange={handleBranchMultiSelectChange}
                      placeholder="Search & select branches..."
                      isMulti
                      isClearable={false}
                      usePortal={true}
                    />
                    {formErrors.branchScope && <Text size="1" color="red" mt="1">{formErrors.branchScope}</Text>}
                  </Box>
                )}
              </Flex>

              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Validity Period (Optional)</Text>
                <Text size="1" color="gray" mb="1">Leave blank if the reward doesn&apos;t expire.</Text>
                <DateRangeInput
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  placeholder="Select start and end date..."
                  position="top"
                />
                {formErrors.validity && <Text size="1" color="red">{formErrors.validity}</Text>}
              </Flex>
           </Flex>
         </Card>

         <Card size="3" className="lg:col-span-1">
           <Flex direction="column" gap="4"> 
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium" mb="1">Reward Image</Text>
                <Flex direction="column" gap="2" align="start">
                   {formData.imageUrl && (
                     <Image
                      src={formData.imageUrl}
                      alt="Reward preview"
                      width={564}
                      height={317}
                      className="object-cover w-full h-full rounded-md"
                     />
                   )}
                   <label htmlFor="imageUpload" style={{ cursor: 'pointer', width: '100%' }}>
                     <Button asChild variant="outline" style={{ width: '100%' }}>
                       <span><Upload size={14} style={{ marginRight: '4px' }}/> Upload Image</span>
                     </Button>
                     <input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }}/>
                   </label>
                </Flex>
              </Flex>

               <Flex direction="column" gap="1">
                <Text as="label" htmlFor="rewardType" size="2" weight="medium">Reward Type</Text>
                <Select.Root
                    name="type"
                    value={formData.type}
                    onValueChange={handleSelectChange('type')}
                >
                  <Select.Trigger id="rewardType" placeholder="Select type..." color={formErrors.type ? 'red' : undefined}/>
                  <Select.Content>
                    <Select.Item value="Free Item">Free Item</Select.Item>
                    <Select.Item value="% Discount">% Discount</Select.Item>
                    <Select.Item value="Cashback">Cashback</Select.Item>
                  </Select.Content>
                </Select.Root>
                {formErrors.type && <Text size="1" color="red">{formErrors.type}</Text>}
              </Flex>

              {formData.type === 'Free Item' && (
                <Flex direction="column" gap="1">
                  <Text as="label" htmlFor="relatedItemId" size="2" weight="medium">Select Item</Text>
                  <Select.Root
                      name="relatedItemId"
                      value={formData.relatedItemId || ''}
                      onValueChange={handleSelectChange('relatedItemId')}
                  >
                    <Select.Trigger id="relatedItemId" placeholder="Select menu item..." color={formErrors.relatedItemId ? 'red' : undefined}/>
                    <Select.Content position="popper">
                      {menuItems.map(item => (
                          <Select.Item key={item.id} value={item.id}>{item.name}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  {formErrors.relatedItemId && <Text size="1" color="red">{formErrors.relatedItemId}</Text>}
                </Flex>
              )}
              {formData.type === '% Discount' && (
                <Flex direction="column" gap="1">
                  <Text as="label" htmlFor="discountPercentage" size="1" weight="bold">Discount (%)</Text>
                  <TextField.Root
                    id="discountPercentage"
                    name="discountPercentage"
                    type="number"
                    placeholder="e.g., 15"
                    value={formData.discountPercentage ?? ''}
                    onChange={handleInputChange}
                    color={formErrors.discountPercentage ? 'red' : undefined}
                  >
                    <TextField.Slot>%</TextField.Slot>
                  </TextField.Root>
                  {formErrors.discountPercentage && <Text size="1" color="red">{formErrors.discountPercentage}</Text>}
                </Flex>
              )}
              {formData.type === 'Cashback' && (
                <Flex direction="column" gap="1">
                  <Text as="label" htmlFor="cashbackAmount" size="1" weight="bold">Cashback ($)</Text>
                  <TextField.Root
                      id="cashbackAmount"
                      name="cashbackAmount"
                      type="number"
                      placeholder="e.g., 5.00"
                      value={formData.cashbackAmount ?? ''}
                      onChange={handleInputChange}
                      color={formErrors.cashbackAmount ? 'red' : undefined}
                  >
                      <TextField.Slot>$</TextField.Slot>
                    </TextField.Root>
                    {formErrors.cashbackAmount && <Text size="1" color="red">{formErrors.cashbackAmount}</Text>}
                </Flex>
              )}

              <Flex direction="column" gap="1">
                <Text as="label" htmlFor="pointsRequired" size="2" weight="medium">Required Points</Text>
                <TextField.Root
                  id="pointsRequired"
                  name="pointsRequired"
                  type="number"
                  placeholder="e.g., 100"
                  value={formData.pointsRequired}
                  min="1"
                  onChange={handleInputChange}
                  color={formErrors.pointsRequired ? 'red' : undefined}
                />
                {formErrors.pointsRequired && <Text size="1" color="red">{formErrors.pointsRequired}</Text>}
              </Flex>

              <Flex direction="column" gap="1">
                <Text as="label" htmlFor="maxRedemptions" size="2" weight="medium">Max Redemptions</Text>
                <TextField.Root
                  id="maxRedemptions"
                  name="maxRedemptions"
                  type="number"
                  placeholder="Optional" 
                  value={formData.maxRedemptions ?? ''}
                  min="1"
                  onChange={handleInputChange}
                />
              </Flex>
           </Flex>
         </Card>

       </Grid>

       <Flex justify="between" mt="4">
        <Flex gap="4">
          <Button onClick={() => handleSubmit(true)} color="green">
            <Send size={16} /> {isEditing ? 'Update & Publish' : 'Save & Publish'}
          </Button>
          <Button variant="soft" color="green" onClick={() => handleSubmit(false)}>
            <Save size={16} /> Save Draft
          </Button>
          <Button variant="soft" color="gray" onClick={handleCancel}>
            <X size={16} /> Cancel
          </Button>
        </Flex>
        {isEditing && initialRewardData && (
          <Flex gap="4">
            <Button 
              variant="soft"
              color={initialRewardData.status === 'Active' ? 'gray' : 'green'}
              onClick={handleToggleStatus}
            >
              {initialRewardData.status === 'Active' ? 
              <>
                <OctagonX size={16} />
                Disable
              </>
              : 
              <>
                <CircleCheck size={16} />
                Enable
              </>
            }
            </Button>
            <Button 
              variant="soft" 
              color="red" 
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 size={16} />
              Delete
            </Button>
          </Flex>
        )}
      </Flex>

      <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialog.Content>
          <AlertDialog.Title>Delete Reward</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to delete this reward? This action cannot be undone.
          </AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button variant="solid" color="red" onClick={handleDelete}>
                Delete
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Box>
  );
} 