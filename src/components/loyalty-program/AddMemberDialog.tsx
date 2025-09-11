'use client';

import { useState } from 'react';
import { Dialog, Flex, Text, TextField, Select, Button } from '@radix-ui/themes';
import { X, Save } from 'lucide-react';
import { LoyaltyMember } from '@/types/loyalty';
import { membershipTiers } from '@/data/LoyaltyData';
import { toast } from 'sonner';

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMember: (member: Partial<LoyaltyMember>) => void;
}

export default function AddMemberDialog({ open, onOpenChange, onAddMember }: AddMemberDialogProps) {
  const [newMember, setNewMember] = useState<Partial<LoyaltyMember>>({
    name: '',
    email: '',
    phone: '',
    tier: membershipTiers[0],
    status: 'Active',
    points: 0,
  });

  const handleAddMember = () => {
    onAddMember(newMember);
    setNewMember({
      name: '',
      email: '',
      phone: '',
      tier: membershipTiers[0],
      status: 'Active',
      points: 0,
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Flex justify="between">
          <Dialog.Title>Add New Member</Dialog.Title>
          <Dialog.Close>
            <Button size="1" color="gray" variant="ghost">
              <X size={16} />
            </Button>
          </Dialog.Close>
        </Flex>
        <Dialog.Description size="2" mb="4">
          Enter the details for the new loyalty program member.
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <Flex direction="column" gap="1">
            <Text as="label" size="2" weight="medium">Name</Text>
            <TextField.Root
              placeholder="Enter member name"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            />
          </Flex>

          <Flex direction="column" gap="1">
            <Text as="label" size="2" weight="medium">Email</Text>
            <TextField.Root
              type="email"
              placeholder="Enter email address"
              value={newMember.email}
              onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
            />
          </Flex>

          <Flex direction="column" gap="1">
            <Text as="label" size="2" weight="medium">Phone</Text>
            <TextField.Root
              placeholder="Enter phone number"
              value={newMember.phone}
              onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
            />
          </Flex>

          <Flex direction="column" gap="1">
            <Text as="label" size="2" weight="medium">Initial Tier</Text>
            <Select.Root
              value={newMember.tier?.id}
              onValueChange={(value) => {
                const selectedTier = membershipTiers.find(tier => tier.id === value);
                if (selectedTier) {
                  setNewMember({ ...newMember, tier: selectedTier });
                }
              }}
            >
              <Select.Trigger placeholder="Select tier" />
              <Select.Content>
                {membershipTiers.map((tier) => (
                  <Select.Item key={tier.id} value={tier.id}>
                    {tier.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>

          <Flex direction="column" gap="1">
            <Text as="label" size="2" weight="medium">Initial Points</Text>
            <TextField.Root
              type="number"
              placeholder="Enter initial points"
              value={newMember.points}
              onChange={(e) => setNewMember({ ...newMember, points: parseInt(e.target.value) || 0 })}
            />
          </Flex>
        </Flex>

        <Flex gap="3" mt="6" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              <X size={16} />
              Cancel
            </Button>
          </Dialog.Close>
          <Button color="green" onClick={handleAddMember}>
            <Save size={16} />
            Add Member
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
