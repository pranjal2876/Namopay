"use client";

import {
  createContext,
  FormEvent,
  ReactNode,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { categorySpending, monthlySpending, overviewData } from "@/lib/mock-data";
import {
  Language,
  Mode,
  NotificationItem,
  OverviewPayload,
  RewardCard,
  ThemeMode,
  Transaction
} from "@/lib/types";

type NamoPayContextValue = {
  theme: ThemeMode;
  language: Language;
  selectedMode: Mode;
  overview: OverviewPayload;
  offlineWallet: number;
  offlineQueue: Transaction[];
  notifications: NotificationItem[];
  rewards: RewardCard[];
  budget: number;
  search: string;
  chatInput: string;
  chatReply: string;
  voiceCommand: string;
  voiceResult: string;
  bluetoothStatus: string;
  qrSeconds: number;
  txTarget: string;
  txAmount: string;
  scratchOpened: boolean;
  actionMessage: string;
  allTransactions: Transaction[];
  filteredTransactions: Transaction[];
  pendingOfflineAmount: number;
  suspiciousCount: number;
  budgetUsed: number;
  budgetPercent: number;
  averageSpend: number;
  qrProgress: number;
  qrRingColor: string;
  qrPayload: string;
  monthlySpending: typeof monthlySpending;
  categorySpending: typeof categorySpending;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: Language) => void;
  setSelectedMode: (mode: Mode) => void;
  setBudget: (value: number) => void;
  setSearch: (value: string) => void;
  setChatInput: (value: string) => void;
  setVoiceCommand: (value: string) => void;
  setTxTarget: (value: string) => void;
  setTxAmount: (value: string) => void;
  createTransaction: (channel: Transaction["channel"], offline?: boolean) => boolean;
  syncOfflineQueue: () => Promise<void>;
  rechargeOfflineWallet: () => void;
  submitAssistant: (event: FormEvent) => Promise<void>;
  submitVoice: (event: FormEvent) => Promise<void>;
  unlockScratchCard: () => void;
  requestMoney: () => void;
  createPaymentLink: () => void;
  sendSplitReminder: () => void;
  clearActionMessage: () => void;
};

const NamoPayContext = createContext<NamoPayContextValue | null>(null);

function categoryForTarget(target: string): Transaction["category"] {
  const normalized = target.toLowerCase();
  if (normalized.includes("cafe") || normalized.includes("food")) return "Food";
  if (normalized.includes("metro") || normalized.includes("uber")) return "Travel";
  if (normalized.includes("electric") || normalized.includes("bill")) return "Bills";
  if (normalized.includes("mart") || normalized.includes("shop")) return "Shopping";
  return "Transfer";
}

function addAmountToBalance(current: OverviewPayload, amount: number) {
  return {
    ...current,
    bankBalance: current.bankBalance - amount,
    cashbackEarned: current.cashbackEarned + Math.round(amount * 0.01),
    rewardCoins: current.rewardCoins + Math.round(amount / 10)
  };
}

export function NamoPayProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [language, setLanguage] = useState<Language>("en");
  const [selectedMode, setSelectedMode] = useState<Mode>("online");
  const [overview, setOverview] = useState<OverviewPayload>(overviewData);
  const [offlineWallet, setOfflineWallet] = useState(overviewData.offlineBalance);
  const [offlineQueue, setOfflineQueue] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(overviewData.notifications);
  const [rewards, setRewards] = useState<RewardCard[]>(overviewData.rewards);
  const [budget, setBudget] = useState(overviewData.monthlyBudget);
  const [search, setSearch] = useState("");
  const [chatInput, setChatInput] = useState("How much did I spend this week?");
  const [chatReply, setChatReply] = useState(
    "You spent ₹6,420 this week. Food is rising faster than your usual pattern."
  );
  const [voiceCommand, setVoiceCommand] = useState("Send ₹500 to Rahul");
  const [voiceResult, setVoiceResult] = useState("Awaiting command");
  const [bluetoothStatus, setBluetoothStatus] = useState("Nearby trusted device: Rahul's Phone");
  const [qrSeconds, setQrSeconds] = useState(300);
  const [txTarget, setTxTarget] = useState("rahul@upi");
  const [txAmount, setTxAmount] = useState("500");
  const [scratchOpened, setScratchOpened] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    void fetch("/api/overview")
      .then((res) => res.json())
      .then((data: OverviewPayload) => {
        setOverview(data);
        setOfflineWallet(data.offlineBalance);
        setBudget(data.monthlyBudget);
      })
      .catch(() => setOverview(overviewData));
  }, []);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("namopay-theme") as ThemeMode | null;
    const savedLanguage = window.localStorage.getItem("namopay-language") as Language | null;
    const savedMode = window.localStorage.getItem("namopay-mode") as Mode | null;
    const savedQueue = window.localStorage.getItem("namopay-offline-queue");
    const savedWallet = window.localStorage.getItem("namopay-offline-wallet");
    if (savedTheme) setTheme(savedTheme);
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedMode) setSelectedMode(savedMode);
    if (savedQueue) setOfflineQueue(JSON.parse(savedQueue) as Transaction[]);
    if (savedWallet) setOfflineWallet(Number(savedWallet));
  }, []);

  useEffect(() => {
    document.body.dataset.theme = theme;
    window.localStorage.setItem("namopay-theme", theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem("namopay-language", language);
    window.localStorage.setItem("namopay-mode", selectedMode);
    window.localStorage.setItem("namopay-offline-wallet", String(offlineWallet));
    window.localStorage.setItem("namopay-offline-queue", JSON.stringify(offlineQueue));
  }, [language, selectedMode, offlineWallet, offlineQueue]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setQrSeconds((current) => (current <= 1 ? 300 : current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const allTransactions = useMemo(
    () => [...offlineQueue, ...overview.transactions].sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp)),
    [offlineQueue, overview.transactions]
  );

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return allTransactions;
    return allTransactions.filter((item) =>
      [item.title, item.counterparty, item.category].some((part) => part.toLowerCase().includes(query))
    );
  }, [allTransactions, search]);

  const budgetUsed = useMemo(
    () =>
      allTransactions
        .filter((item) => item.direction === "debit" && item.status !== "Failed")
        .reduce((sum, item) => sum + item.amount, 0),
    [allTransactions]
  );

  const budgetPercent = Math.min(100, Math.round((budgetUsed / Math.max(1, budget)) * 100));
  const averageSpend = Math.round(
    budgetUsed / Math.max(1, allTransactions.filter((item) => item.direction === "debit").length)
  );
  const pendingOfflineAmount = offlineQueue
    .filter((item) => item.status === "Pending")
    .reduce((sum, item) => sum + item.amount, 0);
  const suspiciousCount = allTransactions.filter((item) => item.suspicious).length;
  const qrProgress = (qrSeconds / 300) * 100;
  const qrRingColor = qrSeconds > 180 ? "#7b8cff" : qrSeconds > 60 ? "#8d6bff" : "#ff6db3";
  const qrPayload = btoa(
    JSON.stringify({
      wallet: "NamoPay-Offline-241",
      amount: Number(txAmount || 0),
      timestamp: new Date().toISOString(),
      token: `NP-${qrSeconds}`
    })
  );

  function addNotification(item: NotificationItem) {
    setNotifications((current) => [item, ...current].slice(0, 6));
  }

  function runFraudCheck(amount: number, target: string) {
    const repeated = allTransactions.filter((item) => item.counterparty === target && item.amount === amount).length >= 2;
    const isLarge = amount >= 8000;
    if (repeated || isLarge) {
      addNotification({
        id: crypto.randomUUID(),
        title: "Fraud shield alert",
        tone: "warning",
        detail: "This transaction looks unusual and needs extra confirmation."
      });
      return true;
    }
    return false;
  }

  function createTransaction(channel: Transaction["channel"], offline = false) {
    const amount = Number(txAmount || 0);
    if (!amount) {
      setActionMessage("Enter an amount before continuing.");
      return false;
    }
    const suspicious = runFraudCheck(amount, txTarget);
    const entry: Transaction = {
      id: `TXN-${Math.floor(Math.random() * 90000) + 10000}`,
      title: txTarget,
      amount,
      channel,
      status: offline ? "Pending" : "Success",
      category: categoryForTarget(txTarget),
      direction: "debit",
      timestamp: new Date().toISOString(),
      counterparty: txTarget,
      isOffline: offline,
      suspicious
    };

    if (offline) {
      if (offlineWallet - amount < 0) {
        addNotification({
          id: crypto.randomUUID(),
          title: "Offline wallet limit",
          tone: "warning",
          detail: "Recharge online before making this offline payment."
        });
        setActionMessage("Offline wallet balance is too low for this payment.");
        return false;
      }
      setOfflineWallet((current) => current - amount);
      setOfflineQueue((current) => [entry, ...current]);
      addNotification({
        id: crypto.randomUUID(),
        title: "Offline payment queued",
        tone: "info",
        detail: `₹${amount.toLocaleString("en-IN")} queued for sync using ${channel}.`
      });
      if (channel === "Bluetooth") {
        setBluetoothStatus("Secure pairing complete • Transfer queued");
      }
      setActionMessage(`Offline payment queued via ${channel}.`);
      return true;
    }

    setOverview((current) => ({
      ...addAmountToBalance(current, amount),
      transactions: [entry, ...current.transactions]
    }));
    addNotification({
      id: crypto.randomUUID(),
      title: "Payment sent",
      tone: "success",
      detail: `₹${amount.toLocaleString("en-IN")} sent to ${txTarget}.`
    });
    setActionMessage(`₹${amount.toLocaleString("en-IN")} sent successfully to ${txTarget}.`);
    return true;
  }

  async function syncOfflineQueue() {
    if (!offlineQueue.length) return;
    const response = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        offlineQueue: offlineQueue.map((item) => ({ id: item.id, amount: item.amount }))
      })
    });
    const result = (await response.json()) as {
      resolved: Array<{ id: string; status: "Success" | "Failed" }>;
    };
    const failedIds = new Set(result.resolved.filter((item) => item.status === "Failed").map((item) => item.id));
    const successful = offlineQueue
      .filter((item) => !failedIds.has(item.id))
      .map((item) => ({ ...item, status: "Success" as const }));
    const failed = offlineQueue
      .filter((item) => failedIds.has(item.id))
      .map((item) => ({ ...item, status: "Failed" as const }));
    setOverview((current) => ({ ...current, transactions: [...successful, ...current.transactions] }));
    setOfflineQueue(failed);
    addNotification({
      id: crypto.randomUUID(),
      title: "Offline sync complete",
      tone: failed.length ? "warning" : "success",
      detail: failed.length
        ? `${successful.length} synced, ${failed.length} needs review.`
        : "All offline transactions synced successfully."
    });
    setActionMessage(
      failed.length ? `${successful.length} payments synced, ${failed.length} need review.` : "All offline payments synced successfully."
    );
  }

  function rechargeOfflineWallet() {
    const amount = 500;
    setOfflineWallet((current) => Math.min(2000, current + amount));
    setOverview((current) => ({ ...current, bankBalance: current.bankBalance - amount }));
    addNotification({
      id: crypto.randomUUID(),
      title: "Offline wallet recharged",
      tone: "success",
      detail: "₹500 moved to your offline wallet."
    });
    setActionMessage("Offline wallet recharged with ₹500.");
  }

  async function submitAssistant(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: chatInput })
    });
    const data = (await response.json()) as { reply: string };
    startTransition(() => setChatReply(data.reply));
  }

  async function submitVoice(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/voice-pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: voiceCommand })
    });
    const data = (await response.json()) as { interpreted: string; status: string };
    setVoiceResult(`${data.interpreted} • ${data.status}`);
  }

  function unlockScratchCard() {
    setScratchOpened(true);
    setRewards((current) =>
      current.map((item, index) => (index === 0 ? { ...item, cashback: "You won ₹120 cashback" } : item))
    );
    setOverview((current) => ({ ...current, cashbackEarned: current.cashbackEarned + 120 }));
    setActionMessage("Scratch card opened. ₹120 cashback has been added.");
  }

  function requestMoney() {
    const amount = Number(txAmount || 0);
    setActionMessage(`Payment request for ₹${amount.toLocaleString("en-IN")} sent to ${txTarget}.`);
    addNotification({
      id: crypto.randomUUID(),
      title: "Request sent",
      tone: "info",
      detail: `Requested ₹${amount.toLocaleString("en-IN")} from ${txTarget}.`
    });
  }

  function createPaymentLink() {
    const amount = Number(txAmount || 0);
    setActionMessage(`Collection link created for ₹${amount.toLocaleString("en-IN")}.`);
    addNotification({
      id: crypto.randomUUID(),
      title: "Payment link ready",
      tone: "success",
      detail: `Shareable link generated for ₹${amount.toLocaleString("en-IN")}.`
    });
  }

  function sendSplitReminder() {
    setActionMessage("Reminder sent to pending group members.");
    addNotification({
      id: crypto.randomUUID(),
      title: "Reminder sent",
      tone: "info",
      detail: "Split bill reminder has been sent to pending members."
    });
  }

  function clearActionMessage() {
    setActionMessage("");
  }

  const value: NamoPayContextValue = {
    theme,
    language,
    selectedMode,
    overview,
    offlineWallet,
    offlineQueue,
    notifications,
    rewards,
    budget,
    search,
    chatInput,
    chatReply,
    voiceCommand,
    voiceResult,
    bluetoothStatus,
    qrSeconds,
    txTarget,
    txAmount,
    scratchOpened,
    actionMessage,
    allTransactions,
    filteredTransactions,
    pendingOfflineAmount,
    suspiciousCount,
    budgetUsed,
    budgetPercent,
    averageSpend,
    qrProgress,
    qrRingColor,
    qrPayload,
    monthlySpending,
    categorySpending,
    setTheme,
    setLanguage,
    setSelectedMode,
    setBudget,
    setSearch,
    setChatInput,
    setVoiceCommand,
    setTxTarget,
    setTxAmount,
    createTransaction,
    syncOfflineQueue,
    rechargeOfflineWallet,
    submitAssistant,
    submitVoice,
    unlockScratchCard,
    requestMoney,
    createPaymentLink,
    sendSplitReminder,
    clearActionMessage
  };

  return <NamoPayContext.Provider value={value}>{children}</NamoPayContext.Provider>;
}

export function useNamoPay() {
  const context = useContext(NamoPayContext);
  if (!context) {
    throw new Error("useNamoPay must be used within NamoPayProvider");
  }
  return context;
}
