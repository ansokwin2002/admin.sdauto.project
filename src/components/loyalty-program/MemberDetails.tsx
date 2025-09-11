'use client';

import { useState, useEffect } from 'react';
import { Box, Flex, Heading, Text, Button, Card, Tabs, Table, Badge, TextField, Dialog, IconButton, Inset, Separator, Switch, RadioGroup } from '@radix-ui/themes';
import { Plus, CreditCard, User, Calendar, Mail, Phone, AlertCircle, X, Save, Edit2, FileText, History, TrendingUp, TrendingDown, Settings } from 'lucide-react';
import { LoyaltyMember, Transaction } from '@/types/loyalty';
import { loyaltyMembers } from '@/data/LoyaltyData';
import { formatDate } from '@/utilities';
import { toast } from 'sonner';
import { PageHeading } from '@/components/common/PageHeading';
interface MemberDetailsProps {
  memberId: string;
  onBack: () => void;
}

export default function MemberDetails({ memberId, onBack }: MemberDetailsProps) {
  const [member, setMember] = useState<LoyaltyMember | null>(null);
  const [pointsToAdjust, setPointsToAdjust] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [isAddingPoints, setIsAddingPoints] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  
  // Editing states
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedPhone, setEditedPhone] = useState('');

  // Add this after the other state variables
  const [activeTab, setActiveTab] = useState('all');

  // Fetch member data based on ID
  useEffect(() => {
    const foundMember = loyaltyMembers.find((m) => m.id === memberId);
    if (foundMember) {
      setMember(foundMember);
      setEditedName(foundMember.name);
      setEditedEmail(foundMember.email);
      setEditedPhone(foundMember.phone);
    }
  }, [memberId]);

  if (!member) {
    return <Text>Loading...</Text>;
  }

  const handlePointAdjustment = () => {
    if (!member || !pointsToAdjust || !adjustmentReason) return;

    const points = parseInt(pointsToAdjust);
    if (isNaN(points) || points <= 0) return;

    const finalPoints = isAddingPoints ? points : -points;

    // Create a new transaction record using the Transaction type
    const newTransaction: Transaction = { 
      id: `txn-${Date.now()}`,
      date: new Date().toISOString(),
      type: 'adjustment',
      points: finalPoints,
      description: adjustmentReason,
    };

    // Update the member with new transaction and adjusted points
    const updatedMember = {
      ...member,
      points: member.points + finalPoints,
      transactionHistory: [newTransaction, ...(member.transactionHistory || [])],
      lastActivity: new Date().toISOString(),
    };

    // In a real application, you would call an API to update the member
    setMember(updatedMember);

    // Reset form
    setPointsToAdjust('');
    setAdjustmentReason('');
    setOpenDialog(false);
    toast.success('Points adjusted successfully!');
  };
  
  const handleStartEditing = () => {
    setIsEditing(true);
  };
  
  const handleSaveEdits = () => {
    if (!member) return;
    
    // Update the member with edited fields
    const updatedMember = {
      ...member,
      name: editedName,
      email: editedEmail,
      phone: editedPhone
    };
    
    // In a real application, you would call an API to update the member
    setMember(updatedMember);
    setIsEditing(false);
    toast.success('Member details updated successfully!');
  };
  
  const handleCancelEdit = () => {
    // Reset to original values
    if (member) {
      setEditedName(member.name);
      setEditedEmail(member.email);
      setEditedPhone(member.phone);
    }
    setIsEditing(false);
  };

  // Function to get color for transaction type
  const getTransactionTypeColor = (type: Transaction['type']) => {
    switch (type) {
      case 'earn':
        return 'green';
      case 'redeem':
        return 'red';
      case 'adjustment':
        return 'purple';
      case 'expiry':
        return 'orange';
      default:
        return 'gray';
    }
  };

  // Filter transactions based on active tab
  const getFilteredTransactions = (): Transaction[] => {
    const history = member.transactionHistory || [];
    if (activeTab === 'all') {
      return history;
    } else if (activeTab === 'earned') {
      return history.filter(txn => 
        txn.type === 'earn' || (txn.type === 'adjustment' && txn.points > 0)
      );
    } else if (activeTab === 'spent') {
      return history.filter(txn => 
        txn.type === 'redeem' || txn.type === 'expiry' || (txn.type === 'adjustment' && txn.points < 0)
      );
    } else if (activeTab === 'adjustments') {
      return history.filter(txn => txn.type === 'adjustment');
    }
    return history;
  };

  return (
    <Box className="space-y-4">
      {/* Back Button and Header */}
      <Flex 
        direction={{ initial: "column", sm: "row" }} 
        justify="between" 
        align={{ initial: "stretch", sm: "center" }}
        gap={{ initial: "4", sm: "0" }}
      >
        <PageHeading
          title={member.name}
          description="View and manage member details"
          showBackButton
          onBackClick={onBack}
          noMarginBottom
        />
        
        <Flex 
          direction={{ initial: "column", sm: "row" }}
          align={{ initial: "stretch", sm: "center" }} 
          gap="4"
        >
          <Text as="label" size="2" weight="medium">
            <Flex gap="2">
              <Switch
                color="green"
                checked={member.status === 'Active'} 
                onCheckedChange={() => {
                  const newStatus = member.status === 'Active' ? 'Inactive' : 'Active';
                  setMember({ ...member, status: newStatus });
                }}
              />
              Set as {member.status === 'Active' ? 'Inactive' : 'Active'}
            </Flex>
          </Text>
          <Button onClick={() => setOpenDialog(true)} className="w-full sm:w-auto">
            <Plus size={16} />
            Adjust Points
          </Button>
        </Flex>
      </Flex>

      {/* Member Overview Card */}
      <Card size="4" className="overflow-hidden">
        <Flex 
          direction={{ initial: "column", lg: "row" }} 
          gap="4"
        >
          <Box className="flex-grow">
            <Flex 
              direction={{ initial: "column", sm: "row" }}
              align={{ initial: "start", sm: "center" }} 
              gap="2" 
              mb="4"
            >
              <User size={16} />
              {isEditing ? (
                <TextField.Root 
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Member name"
                  className="w-full sm:min-w-60"
                />
              ) : (
                <Heading size="4">{member.name}</Heading>
              )}
              <Badge variant="solid" color={member.status === 'Active' ? 'green' : 'red'}>
                {member.status}
              </Badge>
            </Flex>

            <Flex direction="column" gap="3">
              <Flex 
                direction={{ initial: "column", sm: "row" }}
                align={{ initial: "start", sm: "center" }} 
                gap="2"
              >
                <Mail size={16} className="text-gray-500" />
                {isEditing ? (
                  <TextField.Root 
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full sm:min-w-60"
                  />
                ) : (
                  <Text>{member.email}</Text>
                )}
              </Flex>
              <Flex 
                direction={{ initial: "column", sm: "row" }}
                align={{ initial: "start", sm: "center" }} 
                gap="2"
              >
                <Phone size={16} className="text-gray-500" />
                {isEditing ? (
                  <TextField.Root 
                    value={editedPhone}
                    onChange={(e) => setEditedPhone(e.target.value)}
                    placeholder="Phone number"
                    className="w-full sm:min-w-60"
                  />
                ) : (
                  <Text>{member.phone}</Text>
                )}
              </Flex>
              <Flex gap="2">
                {isEditing ? (
                  <>
                    <Button size="1" color="green" onClick={handleSaveEdits}>
                      <Save size={12} />
                      Save Changes
                    </Button>
                    <Button size="1" variant="soft" color="gray" onClick={handleCancelEdit}>
                      <X size={12} />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button size="1" color="gray" variant="soft" onClick={handleStartEditing}>
                    <Edit2 size={12} />
                    Edit Details
                  </Button>
                )}
              </Flex>
              <Separator size="4" />
              <Flex 
                direction={{ initial: "column", sm: "row" }}
                align={{ initial: "start", sm: "center" }} 
                gap="2"
              >
                <Calendar size={16} className="text-gray-500" />
                <Text>Member since {formatDate(new Date(member.joinDate))}</Text>
              </Flex>
              <Flex 
                direction={{ initial: "column", sm: "row" }}
                align={{ initial: "start", sm: "center" }} 
                gap="2"
              >
                <Calendar size={16} className="text-gray-500" />
                <Text>Last activity {formatDate(new Date(member.lastActivity))}</Text>
              </Flex>
            </Flex>
          </Box>

          <Box className="w-full lg:w-96">
            <Box
              className="rounded-lg shadow-lg"
              style={{
                background: 
                  member.tier.name === 'Platinum' ? 'linear-gradient(135deg, #6d5dac, #9c4dc4)' : 
                  member.tier.name === 'Gold' ? 'linear-gradient(135deg,rgb(223, 191, 7),rgb(224, 148, 7))' : 
                  member.tier.name === 'Silver' ? 'linear-gradient(135deg, #c0c0c0, #8a8a8a)' : 
                  'linear-gradient(135deg, #cd7f32, #b06520)',
                color: 'white',
                width: '100%',
              }}
            >
              <Box p="4">
                <Flex 
                  direction={{ initial: "column", sm: "row" }}
                  justify="between" 
                  align={{ initial: "start", sm: "start" }}
                >
                  <Box>
                    <Text size="1" weight="bold">LOYALTY TIER</Text>
                    <Heading size="4" mt="1" style={{ color: 'white' }}>{member.tier.name}</Heading>
                  </Box>
                  <CreditCard size={24} />
                </Flex>
                
                <Box mt="4" pt="3" className="text-center border-t border-white/20">
                  <Text size="1" weight="bold">TOTAL POINTS</Text>
                  <Heading size="6" mt="1" className="text-white">
                    {member.points.toLocaleString()}
                  </Heading>
                </Box>
                
                <Flex 
                  direction={{ initial: "column", sm: "row" }}
                  mt="4" 
                  justify="between" 
                  align={{ initial: "start", sm: "center" }}
                  gap={{ initial: "2", sm: "0" }}
                >
                  <Box>
                    <Text size="1" weight="bold">MEMBER ID:</Text>
                    <Text size="2" ml="2">{member.memberId}</Text>
                  </Box>
                  <Box>
                    <Text size="1" weight="bold">JOINED:</Text>
                    <Text size="1" ml="2">{formatDate(new Date(member.joinDate))}</Text>
                  </Box>
                </Flex>
              </Box>
            </Box>
          </Box>
        </Flex>
      </Card>

      {/* Tabs for Transaction History */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="overflow-x-auto">
          <Tabs.Trigger value="all">
            <Flex gap="2" align="center">
              <History size={16} />
              <Text>All Transactions</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="earned">
            <Flex gap="2" align="center">
              <TrendingUp size={16} />
              <Text>Points Earned</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="spent">
            <Flex gap="2" align="center">
              <TrendingDown size={16} />
              <Text>Points Spent/Expired</Text>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="adjustments">
            <Flex gap="2" align="center">
              <Settings size={16} />
              <Text>Adjustments</Text>
            </Flex>
          </Tabs.Trigger>
        </Tabs.List>

        <Box mt="4" className="overflow-x-auto">
          <Inset>
            <Table.Root variant="surface">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Points</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Related Info</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {getFilteredTransactions().length > 0 ? (
                  getFilteredTransactions().map((transaction) => (
                    <Table.Row key={transaction.id}>
                      <Table.Cell>{formatDate(new Date(transaction.date))}</Table.Cell>
                      <Table.Cell>
                        <Badge variant="soft" color={getTransactionTypeColor(transaction.type)}>
                          {transaction.type}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Text 
                          weight="medium" 
                          color={transaction.points > 0 ? 'green' : transaction.points < 0 ? 'red' : undefined}
                        >
                          {transaction.points > 0 ? `+${transaction.points}` : transaction.points}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>{transaction.description}</Table.Cell>
                      <Table.Cell>
                        {transaction.relatedOrderId && (
                          <Flex align="center" gap="1">
                            <FileText size={14} /> Order: {transaction.relatedOrderId}
                          </Flex>
                        )}
                        {transaction.relatedRewardId && (
                          <Flex align="center" gap="1">
                            Reward: {transaction.relatedRewardId}
                          </Flex>
                        )}
                        {!transaction.relatedOrderId && !transaction.relatedRewardId && '-'}
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={5}>
                      <Flex align="center" justify="center" gap="2" py="4">
                        <AlertCircle size={16} />
                        <Text>No transaction history found</Text>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Root>
          </Inset>
        </Box>
      </Tabs.Root>

      {/* Point Adjustment Dialog */}
      <Dialog.Root open={openDialog} onOpenChange={setOpenDialog}>
        <Dialog.Content>
          <Flex justify="between">
            <Dialog.Title>Adjust Member Points</Dialog.Title>
            <Dialog.Close>
              <IconButton size="2" variant="ghost" color="gray">
                <X size={16} />
              </IconButton>
            </Dialog.Close>
          </Flex>
          <Dialog.Description size="2" mb="4">
            {`Add or remove points from ${member.name}'s account.`}
          </Dialog.Description>

          <Flex direction="column" gap="3">
            <Text size="2" weight="medium">Point Adjustment Type</Text>
            <Box>
              <RadioGroup.Root 
                value={isAddingPoints ? 'add' : 'deduct'} 
                onValueChange={(value) => setIsAddingPoints(value === 'add')}
              >
                <Flex 
                  direction={{ initial: "column", sm: "row" }}
                  gap="4"
                >
                  <Text as="label" size="2">
                    <Flex gap="2" align="center">
                      <RadioGroup.Item value="add" /> (+) Add Points
                    </Flex>
                  </Text>
                  <Text as="label" size="2">
                    <Flex gap="2" align="center">
                      <RadioGroup.Item value="deduct" /> (-) Deduct Points
                    </Flex>
                  </Text>
                </Flex>
              </RadioGroup.Root>
            </Box>

            <Box>
              <Text as="label" size="2" mb="1" weight="medium">
                Points Amount
              </Text>
              <TextField.Root 
                type="number" 
                placeholder="Enter points" 
                value={pointsToAdjust}
                onChange={(e) => setPointsToAdjust(e.target.value)}
              />
            </Box>

            <Box>
              <Text as="label" size="2" mb="1" weight="medium">
                Reason for Adjustment
              </Text>
              <TextField.Root 
                placeholder="Enter reason" 
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
              />
            </Box>
          </Flex>

          <Flex 
            direction={{ initial: "column", sm: "row" }}
            gap="3" 
            mt="4" 
            justify="end"
          >
            <Dialog.Close>
              <Button variant="soft" color="gray" className="w-full sm:w-auto">
                <X size={16} />
                Cancel
              </Button>
            </Dialog.Close>
            <Button color="green" onClick={handlePointAdjustment} className="w-full sm:w-auto">
              <Save size={16} />
              Confirm Adjustment
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
} 