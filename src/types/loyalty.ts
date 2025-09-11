export interface MembershipTier {
  id: string;
  name: string;
  minPoints: number;
  benefits: string[];
};

export interface LoyaltyMember {
  id: string;
  name: string;
  memberId: string;
  email: string;
  phone: string;
  joinDate: string; // ISO date string
  tier: MembershipTier;
  points: number;
  lastActivity: string; // ISO date string
  status: 'Active' | 'Inactive'; // Add status field
  birthday?: string; // Optional, format YYYY-MM-DD
  tags?: string[];
  transactionHistory?: Transaction[];
  notes?: string;
  avatarUrl?: string; // Optional path to avatar image
};

export interface Transaction {
  id: string;
  date: string; // ISO date string
  type: 'earn' | 'redeem' | 'adjustment' | 'expiry';
  points: number; // Positive for earn/adjustment, negative for redeem/expiry
  description: string; // e.g., "Purchase", "Reward Redemption: Free Coffee", "Manual Adjustment", "Points Expired"
  relatedOrderId?: string; // Optional link to order
  relatedRewardId?: string; // Optional link to redeemed reward
};

// --- New Reward Type ---
export type RewardType = 'Free Item' | '% Discount' | 'Cashback';
export type RewardStatus = 'Active' | 'Expired' | 'Inactive' | 'Draft';
export type BranchScope = 'All' | string[]; // 'All' or array of branch IDs/names

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  type: RewardType;
  pointsRequired: number;
  status: RewardStatus;
  imageUrl?: string; // URL or path to the reward image
  validityStartDate?: Date;
  validityEndDate?: Date;
  applicableTiers: string[]; // Array of tier IDs
  branchScope: BranchScope;
  maxRedemptions?: number; // Optional total redemption cap
  redemptionsCount?: number; // Current count, managed by backend
  relatedItemId?: string; // For 'Free Item' type, link to menu item ID
  discountPercentage?: number; // For '% Discount' type
  cashbackAmount?: number; // For 'Cashback' type
};
// --- End New Reward Type --- 