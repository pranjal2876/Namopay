export type Mode = "online" | "offline";

export type ThemeMode = "dark" | "light";

export type Language = "en" | "hi";

export type TransactionStatus = "Success" | "Pending" | "Failed";

export type TransactionChannel =
  | "UPI"
  | "QR"
  | "Phone"
  | "Offline ID"
  | "Bluetooth"
  | "Merchant"
  | "Bill"
  | "Reward";

export type TransactionCategory =
  | "Food"
  | "Travel"
  | "Shopping"
  | "Bills"
  | "Transfer"
  | "Rewards"
  | "Merchant";

export type TransactionDirection = "credit" | "debit";

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  channel: TransactionChannel;
  status: TransactionStatus;
  category: TransactionCategory;
  direction: TransactionDirection;
  timestamp: string;
  counterparty: string;
  isOffline?: boolean;
  suspicious?: boolean;
};

export type NotificationItem = {
  id: string;
  title: string;
  tone: "info" | "warning" | "success";
  detail: string;
};

export type RewardCard = {
  id: string;
  title: string;
  cashback: string;
  unlocked: boolean;
  coinsCost?: number;
};

export type MerchantSummary = {
  todayRevenue: number;
  monthRevenue: number;
  completionRate: number;
  avgTicket: number;
};

export type DevicePeer = {
  id: string;
  name: string;
  trust: "trusted" | "new";
  lastSeen: string;
  battery: number;
};

export type InsightItem = {
  id: string;
  title: string;
  detail: string;
  tone: "info" | "warning" | "success";
};

export type SplitRoom = {
  id: string;
  title: string;
  total: number;
  pendingCount: number;
  members: Array<{
    name: string;
    amount: number;
    paid: boolean;
  }>;
};

export type AssistantMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export type OverviewPayload = {
  user: string;
  bankBalance: number;
  offlineBalance: number;
  monthlyBudget: number;
  budgetUsed: number;
  rewardCoins: number;
  cashbackEarned: number;
  transactions: Transaction[];
  notifications: NotificationItem[];
  rewards: RewardCard[];
  merchant: MerchantSummary;
  insights: InsightItem[];
  devices: DevicePeer[];
  splitRooms: SplitRoom[];
};
