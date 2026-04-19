import { OverviewPayload } from "./types";

export const overviewData: OverviewPayload = {
  user: "Pranjal",
  bankBalance: 128450,
  offlineBalance: 1280,
  monthlyBudget: 40000,
  budgetUsed: 32150,
  rewardCoins: 1285,
  cashbackEarned: 1840,
  transactions: [
    {
      id: "TXN-9012",
      title: "Cafe Aether",
      amount: 420,
      channel: "QR",
      status: "Success",
      category: "Food",
      direction: "debit",
      timestamp: "2026-04-15T18:10:00.000Z",
      counterparty: "Cafe Aether"
    },
    {
      id: "TXN-9011",
      title: "Rahul",
      amount: 500,
      channel: "Offline ID",
      status: "Pending",
      category: "Transfer",
      direction: "debit",
      timestamp: "2026-04-15T15:32:00.000Z",
      counterparty: "Rahul",
      isOffline: true
    },
    {
      id: "TXN-9010",
      title: "Metro Card Recharge",
      amount: 1200,
      channel: "UPI",
      status: "Success",
      category: "Travel",
      direction: "debit",
      timestamp: "2026-04-14T10:45:00.000Z",
      counterparty: "Delhi Metro"
    },
    {
      id: "TXN-9009",
      title: "Salary Credit",
      amount: 58000,
      channel: "UPI",
      status: "Success",
      category: "Transfer",
      direction: "credit",
      timestamp: "2026-04-12T06:15:00.000Z",
      counterparty: "Acme Labs"
    },
    {
      id: "TXN-9008",
      title: "NamoPay Cashback",
      amount: 150,
      channel: "Reward",
      status: "Success",
      category: "Rewards",
      direction: "credit",
      timestamp: "2026-04-11T20:00:00.000Z",
      counterparty: "NamoPay"
    },
    {
      id: "TXN-9007",
      title: "ElectroMart",
      amount: 8900,
      channel: "Merchant",
      status: "Success",
      category: "Shopping",
      direction: "debit",
      timestamp: "2026-04-10T16:42:00.000Z",
      counterparty: "ElectroMart",
      suspicious: true
    }
  ],
  notifications: [
    {
      id: "N1",
      title: "Budget watch",
      tone: "warning",
      detail: "You have used 80% of your April budget."
    },
    {
      id: "N2",
      title: "Fraud shield",
      tone: "warning",
      detail: "A large merchant payment looked unusual. Tap to review."
    },
    {
      id: "N3",
      title: "Rewards unlocked",
      tone: "success",
      detail: "Scratch card worth up to Rs 250 is ready."
    }
  ],
  rewards: [
    {
      id: "R1",
      title: "Foodie Friday",
      cashback: "Flat Rs 60 cashback",
      unlocked: true,
      coinsCost: 120
    },
    {
      id: "R2",
      title: "Metro Moves",
      cashback: "2x coins on travel",
      unlocked: true,
      coinsCost: 180
    },
    {
      id: "R3",
      title: "Merchant Booster",
      cashback: "1.5% cashback",
      unlocked: false,
      coinsCost: 260
    }
  ],
  merchant: {
    todayRevenue: 28450,
    monthRevenue: 415600,
    completionRate: 98.4,
    avgTicket: 1260
  },
  insights: [
    {
      id: "I1",
      title: "Food spend is trending high",
      detail: "Food is 18% above your monthly baseline. A weekend cap can help preserve your budget.",
      tone: "warning"
    },
    {
      id: "I2",
      title: "You saved 15% this week",
      detail: "Rewards and efficient routing saved an estimated Rs 940 across the last 7 days.",
      tone: "success"
    },
    {
      id: "I3",
      title: "Travel recharge predicted soon",
      detail: "Your commute pattern suggests a metro recharge in the next 48 hours.",
      tone: "info"
    }
  ],
  devices: [
    {
      id: "D1",
      name: "Rahul's Phone",
      trust: "trusted",
      lastSeen: "2 mins ago",
      battery: 74
    },
    {
      id: "D2",
      name: "Cafe POS",
      trust: "trusted",
      lastSeen: "12 mins ago",
      battery: 91
    },
    {
      id: "D3",
      name: "Nearby Device",
      trust: "new",
      lastSeen: "Just now",
      battery: 63
    }
  ],
  splitRooms: [
    {
      id: "S1",
      title: "Weekend Villa",
      total: 6600,
      pendingCount: 1,
      members: [
        { name: "Pranjal", amount: 2200, paid: true },
        { name: "Rahul", amount: 2200, paid: true },
        { name: "Ananya", amount: 2200, paid: false }
      ]
    },
    {
      id: "S2",
      title: "Team Lunch",
      total: 2400,
      pendingCount: 2,
      members: [
        { name: "Pranjal", amount: 800, paid: true },
        { name: "Kabir", amount: 800, paid: false },
        { name: "Nisha", amount: 800, paid: false }
      ]
    }
  ]
};

export const monthlySpending = [
  { month: "Jan", spend: 26800, saved: 9200 },
  { month: "Feb", spend: 30200, saved: 7600 },
  { month: "Mar", spend: 28750, saved: 11250 },
  { month: "Apr", spend: 32150, saved: 7850 }
];

export const categorySpending = [
  { name: "Food", value: 8400 },
  { name: "Travel", value: 6200 },
  { name: "Shopping", value: 10450 },
  { name: "Bills", value: 3800 },
  { name: "Transfer", value: 3300 }
];
