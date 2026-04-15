"use client";

import { jsPDF } from "jspdf";
import clsx from "clsx";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  FormEvent,
  startTransition,
  useDeferredValue,
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
import { t } from "@/lib/i18n";

const pieColors = ["#7cf7b4", "#66b3ff", "#ffd166", "#ff8fab", "#b794f4"];
const quickActions = [
  { label: "Scan", icon: "◎" },
  { label: "Pay", icon: "₹" },
  { label: "Request", icon: "↗" }
];

function currency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function categoryForTarget(target: string): Transaction["category"] {
  const normalized = target.toLowerCase();
  if (normalized.includes("cafe") || normalized.includes("food")) return "Food";
  if (normalized.includes("metro") || normalized.includes("uber")) return "Travel";
  if (normalized.includes("electric") || normalized.includes("bill")) return "Bills";
  if (normalized.includes("mart") || normalized.includes("shop")) return "Shopping";
  return "Transfer";
}

export function NamoPayApp() {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [language, setLanguage] = useState<Language>("en");
  const [mode, setMode] = useState<Mode>("online");
  const [overview, setOverview] = useState<OverviewPayload>(overviewData);
  const [offlineWallet, setOfflineWallet] = useState(overviewData.offlineBalance);
  const [offlineQueue, setOfflineQueue] = useState<Transaction[]>([]);
  const [qrSeconds, setQrSeconds] = useState(300);
  const [txTarget, setTxTarget] = useState("rahul@upi");
  const [txAmount, setTxAmount] = useState("500");
  const [budget, setBudget] = useState(overviewData.monthlyBudget);
  const [search, setSearch] = useState("");
  const [chatInput, setChatInput] = useState("How much did I spend this week?");
  const [chatReply, setChatReply] = useState(
    "You spent ₹6,420 this week. Food is rising faster than your usual pattern."
  );
  const [voiceCommand, setVoiceCommand] = useState("Send ₹500 to Rahul");
  const [voiceResult, setVoiceResult] = useState("Awaiting command");
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [bluetoothStatus, setBluetoothStatus] = useState("Nearby trusted device: Rahul's Phone");
  const [scratchOpened, setScratchOpened] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(overviewData.notifications);
  const [rewards, setRewards] = useState<RewardCard[]>(overviewData.rewards);
  const deferredSearch = useDeferredValue(search);

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
    const savedQueue = window.localStorage.getItem("namopay-offline-queue");
    const savedWallet = window.localStorage.getItem("namopay-offline-wallet");
    if (savedTheme) setTheme(savedTheme);
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedQueue) setOfflineQueue(JSON.parse(savedQueue) as Transaction[]);
    if (savedWallet) setOfflineWallet(Number(savedWallet));
  }, []);

  useEffect(() => {
    document.body.dataset.theme = theme;
    window.localStorage.setItem("namopay-theme", theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem("namopay-language", language);
    window.localStorage.setItem("namopay-offline-wallet", String(offlineWallet));
    window.localStorage.setItem("namopay-offline-queue", JSON.stringify(offlineQueue));
  }, [language, offlineWallet, offlineQueue]);

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
    const query = deferredSearch.trim().toLowerCase();
    if (!query) return allTransactions;
    return allTransactions.filter((item) =>
      [item.title, item.counterparty, item.category].some((part) => part.toLowerCase().includes(query))
    );
  }, [allTransactions, deferredSearch]);

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
  const qrRingColor = qrSeconds > 180 ? "#7cf7b4" : qrSeconds > 60 ? "#ffd166" : "#ff6b6b";
  const qrPayload = btoa(
    JSON.stringify({
      wallet: "NamoPay-Offline-241",
      amount: Number(txAmount || 0),
      timestamp: new Date().toISOString(),
      token: `NP-${qrSeconds}`
    })
  );

  const translatedGreeting = language === "hi" ? t(language, "greeting") : getGreeting();

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
    if (!amount) return;
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
        return;
      }
      setOfflineWallet((current) => current - amount);
      setOfflineQueue((current) => [entry, ...current]);
      addNotification({
        id: crypto.randomUUID(),
        title: "Offline payment queued",
        tone: "info",
        detail: `${currency(amount)} queued for sync using ${channel}.`
      });
      return;
    }

    setOverview((current) => ({
      ...current,
      bankBalance: current.bankBalance - amount,
      transactions: [entry, ...current.transactions],
      cashbackEarned: current.cashbackEarned + Math.round(amount * 0.01),
      rewardCoins: current.rewardCoins + Math.round(amount / 10)
    }));
    addNotification({
      id: crypto.randomUUID(),
      title: "Payment sent",
      tone: "success",
      detail: `${currency(amount)} sent to ${txTarget}.`
    });
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
    const successful = offlineQueue.filter((item) => !failedIds.has(item.id)).map((item) => ({ ...item, status: "Success" as const }));
    const failed = offlineQueue.filter((item) => failedIds.has(item.id)).map((item) => ({ ...item, status: "Failed" as const }));
    setOverview((current) => ({ ...current, transactions: [...successful, ...current.transactions] }));
    setOfflineQueue(failed);
    addNotification({
      id: crypto.randomUUID(),
      title: "Offline sync complete",
      tone: failed.length ? "warning" : "success",
      detail: failed.length ? `${successful.length} synced, ${failed.length} needs review.` : "All offline transactions synced successfully."
    });
  }

  function rechargeOfflineWallet() {
    const amount = 500;
    setOfflineWallet((current) => Math.min(2000, current + amount));
    setOverview((current) => ({ ...current, bankBalance: current.bankBalance - amount }));
    addNotification({
      id: crypto.randomUUID(),
      title: "Offline wallet recharged",
      tone: "success",
      detail: `${currency(amount)} moved to your offline wallet.`
    });
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

  function exportStatement() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("NamoPay Digital Passbook", 14, 18);
    doc.setFontSize(11);
    doc.text(`Generated on ${new Date().toLocaleString("en-IN")}`, 14, 26);
    filteredTransactions.slice(0, 12).forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.title} | ${item.channel} | ${item.status} | ${currency(item.amount)}`,
        14,
        40 + index * 8
      );
    });
    doc.save("namopay-statement.pdf");
  }

  function unlockScratchCard() {
    setScratchOpened(true);
    setRewards((current) =>
      current.map((item, index) => (index === 0 ? { ...item, cashback: "You won ₹120 cashback" } : item))
    );
    setOverview((current) => ({ ...current, cashbackEarned: current.cashbackEarned + 120 }));
  }

  return (
    <main className="shell">
      <section className="hero-card">
        <div className="hero-top">
          <div>
            <p className="eyebrow">NamoPay</p>
            <h1>
              {translatedGreeting}, {overview.user} <span className="wave">👋</span>
            </h1>
            <p className="subtle">
              Hybrid payments with offline resilience, AI guidance, rewards, and startup-grade polish.
            </p>
          </div>
          <div className="toolbar">
            <button className="ghost" onClick={() => setLanguage((current) => (current === "en" ? "hi" : "en"))}>
              {language === "en" ? "EN / HI" : "HI / EN"}
            </button>
            <button className="ghost" onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}>
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <button className={clsx("ghost", pinUnlocked && "active")} onClick={() => setPinUnlocked((current) => !current)}>
              {pinUnlocked ? "Biometric On" : "Unlock"}
            </button>
          </div>
        </div>

        <div className="hero-grid">
          <article className="balance-card gradient-primary">
            <span>{t(language, "bankBalance")}</span>
            <strong>{currency(overview.bankBalance)}</strong>
            <small>Linked with Axis • HDFC • SBI</small>
          </article>
          <article className="balance-card gradient-secondary">
            <span>{t(language, "offlineBalance")}</span>
            <strong>{currency(offlineWallet)}</strong>
            <small>Max ₹2,000 • works without internet</small>
          </article>
          <article className="balance-card gradient-tertiary">
            <span>{t(language, "rewards")}</span>
            <strong>{overview.rewardCoins} coins</strong>
            <small>{currency(overview.cashbackEarned)} cashback earned</small>
          </article>
        </div>

        <div className="quick-actions">
          {quickActions.map((action) => (
            <button key={action.label} className="action-chip">
              <span>{action.icon}</span>
              {t(language, action.label.toLowerCase())}
            </button>
          ))}
        </div>
      </section>

      <section className="mode-strip">
        <button className={clsx("mode-button", mode === "online" && "selected")} onClick={() => startTransition(() => setMode("online"))}>
          {t(language, "online")}
        </button>
        <button className={clsx("mode-button", mode === "offline" && "selected")} onClick={() => startTransition(() => setMode("offline"))}>
          {t(language, "offline")}
        </button>
        <button className="mode-button sync-button" onClick={syncOfflineQueue}>
          {t(language, "sync")} • {offlineQueue.length} queued
        </button>
      </section>

      <section className="dashboard-grid">
        <article className="panel large">
          <div className="panel-header">
            <div>
              <p className="eyebrow">{mode === "online" ? t(language, "online") : t(language, "offline")}</p>
              <h2>{mode === "online" ? "Pay anyone instantly" : "Offline innovation layer"}</h2>
            </div>
            <span className={clsx("pill", mode)}>{mode === "online" ? "Live rails" : "Store & sync"}</span>
          </div>

          {mode === "online" ? (
            <div className="online-grid">
              <div className="payment-card">
                <h3>Payments</h3>
                <label>
                  Pay to UPI / phone / merchant
                  <input value={txTarget} onChange={(event) => setTxTarget(event.target.value)} />
                </label>
                <label>
                  Amount
                  <input value={txAmount} onChange={(event) => setTxAmount(event.target.value)} />
                </label>
                <div className="button-row">
                  <button className="primary" onClick={() => createTransaction("UPI")}>
                    Send via UPI
                  </button>
                  <button className="secondary" onClick={() => createTransaction("Phone")}>
                    Phone Pay
                  </button>
                  <button className="secondary" onClick={() => createTransaction("QR")}>
                    Scan QR
                  </button>
                </div>
              </div>

              <div className="stack">
                <div className="mini-card">
                  <h3>{t(language, "utilities")}</h3>
                  <p>Mobile recharge, DTH, electricity bills, and merchant payments.</p>
                  <div className="tag-row">
                    <span className="tag">Mobile</span>
                    <span className="tag">DTH</span>
                    <span className="tag">Electricity</span>
                    <span className="tag">Merchant</span>
                  </div>
                </div>
                <div className="mini-card">
                  <h3>{t(language, "banking")}</h3>
                  <p>AI-based auto categorization, linked accounts, and real-time balance simulation.</p>
                  <div className="tag-row">
                    <span className="tag success">3 accounts linked</span>
                    <span className="tag">Auto-categorized</span>
                  </div>
                </div>
                <div className="mini-card">
                  <h3>{t(language, "split")}</h3>
                  <div className="split-list">
                    <div>
                      <strong>Goa Trip Villa</strong>
                      <p>Rahul ₹2,200 paid • Ananya pending ₹2,200</p>
                    </div>
                    <button className="secondary small">Send reminder</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="offline-grid">
              <div className="payment-card">
                <div className="panel-header">
                  <div>
                    <p className="eyebrow">{t(language, "qr")}</p>
                    <h3>5-minute dynamic QR</h3>
                  </div>
                  <button className="secondary small" onClick={() => setQrSeconds(300)}>
                    Refresh token
                  </button>
                </div>
                <div className="qr-zone">
                  <div
                    className="countdown-ring"
                    style={{
                      background: `conic-gradient(${qrRingColor} ${qrProgress}%, rgba(255,255,255,0.08) ${qrProgress}% 100%)`
                    }}
                  >
                    <div className="countdown-core">
                      <div className="qr-placeholder">
                        <span>{qrPayload.slice(0, 18)}</span>
                        <strong>Secure QR</strong>
                      </div>
                      <strong>
                        {Math.floor(qrSeconds / 60)}:{String(qrSeconds % 60).padStart(2, "0")}
                      </strong>
                    </div>
                  </div>
                </div>
                <p className="subtle">
                  Encrypted amount, wallet ID, timestamp, anti-reuse token, and sync validation built in.
                </p>
              </div>

              <div className="stack">
                <div className="mini-card">
                  <h3>{t(language, "transactionId")}</h3>
                  <p>One-time secure code</p>
                  <strong className="code-chip">NPX-{String(qrSeconds).padStart(4, "0")}</strong>
                  <button className="primary" onClick={() => createTransaction("Offline ID", true)}>
                    Use secure ID
                  </button>
                </div>
                <div className="mini-card">
                  <h3>{t(language, "bluetooth")}</h3>
                  <p>{bluetoothStatus}</p>
                  <button
                    className="secondary"
                    onClick={() => {
                      setBluetoothStatus("Secure pairing complete • Ready to transfer");
                      createTransaction("Bluetooth", true);
                    }}
                  >
                    Pair & transfer
                  </button>
                </div>
                <div className="mini-card">
                  <h3>{t(language, "recharge")}</h3>
                  <p>Recharge only while online. Max balance enforced at ₹2,000.</p>
                  <button className="primary" onClick={rechargeOfflineWallet}>
                    Add ₹500
                  </button>
                  <div className="wallet-meter">
                    <div style={{ width: `${(offlineWallet / 2000) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">{t(language, "budget")}</p>
              <h2>Smart budgeting</h2>
            </div>
            <span className={clsx("pill", budgetPercent >= 80 ? "warning" : "success")}>{budgetPercent}% used</span>
          </div>
          <label>
            Monthly budget
            <input value={budget} onChange={(event) => setBudget(Number(event.target.value) || 0)} />
          </label>
          <div className="budget-bar">
            <div style={{ width: `${budgetPercent}%` }} />
          </div>
          <div className="stats-grid compact">
            <div>
              <span>Total spend</span>
              <strong>{currency(budgetUsed)}</strong>
            </div>
            <div>
              <span>Average spend</span>
              <strong>{currency(averageSpend)}</strong>
            </div>
          </div>
          <p className="subtle">
            {budgetPercent >= 80
              ? "80% budget used. Slow down food and shopping to stay on track."
              : "You are within budget. Maintain this pace to improve weekly savings."}
          </p>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">{t(language, "notifications")}</p>
              <h2>Smart alerts</h2>
            </div>
            <span className="pill info">{notifications.length} live</span>
          </div>
          <div className="notification-list">
            {notifications.map((item) => (
              <div key={item.id} className={clsx("notification-item", item.tone)}>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel large">
          <div className="panel-header">
            <div>
              <p className="eyebrow">{t(language, "insights")}</p>
              <h2>Analytics and forecasting</h2>
            </div>
            <span className="pill success">AI categorized</span>
          </div>
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Monthly trends</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={monthlySpending}>
                  <defs>
                    <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#66b3ff" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#66b3ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.45)" />
                  <YAxis stroke="rgba(255,255,255,0.45)" />
                  <Tooltip contentStyle={{ background: "#081120", border: "1px solid rgba(255,255,255,0.1)" }} />
                  <Area type="monotone" dataKey="spend" stroke="#66b3ff" fill="url(#spendGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card">
              <h3>Category mix</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={categorySpending} dataKey="value" nameKey="name" innerRadius={56} outerRadius={88} paddingAngle={5}>
                    {categorySpending.map((entry, index) => (
                      <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#081120", border: "1px solid rgba(255,255,255,0.1)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="insight-banner">
            <div>
              <strong>You are overspending on food</strong>
              <p>Food spending is 18% higher than your 4-week baseline. Target one less premium meal this week.</p>
            </div>
            <div>
              <strong>You saved 15% this week</strong>
              <p>Smart routing and rewards reduced your effective spend by ₹940.</p>
            </div>
            <div>
              <strong>Predicted next expense</strong>
              <p>Travel recharge expected in 2 days based on recent commuting behavior.</p>
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">{t(language, "rewards")}</p>
              <h2>Cashback engine</h2>
            </div>
            <span className="pill success">{overview.rewardCoins} coins</span>
          </div>
          <div className="reward-list">
            {rewards.map((reward) => (
              <div key={reward.id} className={clsx("reward-card", reward.unlocked && "unlocked")}>
                <strong>{reward.title}</strong>
                <p>{reward.cashback}</p>
              </div>
            ))}
          </div>
          <button className="primary" onClick={unlockScratchCard} disabled={scratchOpened}>
            {scratchOpened ? "Scratch card claimed" : "Open scratch card"}
          </button>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">{t(language, "merchant")}</p>
              <h2>Merchant dashboard</h2>
            </div>
            <span className="pill success">{overview.merchant.completionRate}% success</span>
          </div>
          <div className="stats-grid compact">
            <div>
              <span>Today</span>
              <strong>{currency(overview.merchant.todayRevenue)}</strong>
            </div>
            <div>
              <span>Month</span>
              <strong>{currency(overview.merchant.monthRevenue)}</strong>
            </div>
            <div>
              <span>Avg ticket</span>
              <strong>{currency(overview.merchant.avgTicket)}</strong>
            </div>
          </div>
          <div className="merchant-qr">
            <strong>Accept with merchant QR</strong>
            <p>Static + dynamic QR acceptance with daily and monthly earnings analytics.</p>
          </div>
        </article>

        <article className="panel large">
          <div className="panel-header">
            <div>
              <p className="eyebrow">{t(language, "assistant")}</p>
              <h2>In-app finance copilot</h2>
            </div>
            <span className="pill info">AI active</span>
          </div>
          <div className="assistant-grid">
            <form className="assistant-form" onSubmit={submitAssistant}>
              <label>
                Ask NamoPay AI
                <input value={chatInput} onChange={(event) => setChatInput(event.target.value)} />
              </label>
              <button className="primary" type="submit">
                Ask assistant
              </button>
              <div className="assistant-reply">
                <strong>Answer</strong>
                <p>{chatReply}</p>
              </div>
            </form>
            <form className="assistant-form" onSubmit={submitVoice}>
              <label>
                Voice payment simulation
                <input value={voiceCommand} onChange={(event) => setVoiceCommand(event.target.value)} />
              </label>
              <button className="secondary" type="submit">
                Run voice pay
              </button>
              <div className="assistant-reply">
                <strong>Status</strong>
                <p>{voiceResult}</p>
              </div>
            </form>
          </div>
        </article>

        <article className="panel large">
          <div className="panel-header">
            <div>
              <p className="eyebrow">{t(language, "passbook")}</p>
              <h2>Transaction passbook</h2>
            </div>
            <div className="button-row">
              <input
                className="search-input"
                placeholder="Search merchant, person, or category"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button className="secondary small" onClick={exportStatement}>
                Download PDF
              </button>
            </div>
          </div>
          <div className="passbook-list">
            {filteredTransactions.map((item) => (
              <div key={item.id} className="passbook-row">
                <div>
                  <strong>{item.title}</strong>
                  <p>
                    {item.channel} • {item.category} • {new Date(item.timestamp).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="passbook-meta">
                  <strong className={item.direction === "credit" ? "credit" : "debit"}>
                    {item.direction === "credit" ? "+" : "-"}
                    {currency(item.amount)}
                  </strong>
                  <span className={clsx("pill", item.status.toLowerCase())}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">{t(language, "suspicious")}</p>
              <h2>Fraud detection</h2>
            </div>
            <span className="pill warning">{suspiciousCount} flagged</span>
          </div>
          <p className="subtle">
            Large-value spikes and repeated transfers trigger warnings before confirmation and again at sync time.
          </p>
          <div className="notification-item warning">
            <strong>Anti double-spending logic</strong>
            <p>Offline tokens are single-use, timestamp checked, and rejected on duplicate sync.</p>
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">{t(language, "sync")}</p>
              <h2>Offline sync engine</h2>
            </div>
            <span className="pill info">{currency(pendingOfflineAmount)} pending</span>
          </div>
          <p className="subtle">
            Local-first storage keeps offline transfers available without network, then resolves conflicts once connectivity returns.
          </p>
          <button className="primary" onClick={syncOfflineQueue}>
            Sync now
          </button>
        </article>
      </section>
    </main>
  );
}
