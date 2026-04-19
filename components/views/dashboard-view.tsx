"use client";

import Link from "next/link";
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
import { RouteCard } from "@/components/route-card";
import { useNamoPay } from "@/components/namopay-provider";
import { formatCurrency } from "@/lib/format";

const pieColors = ["#7b8cff", "#9b6bff", "#b36dff", "#6fe6c5", "#ff8ccf"];

export function DashboardView() {
  const {
    selectedMode,
    overview,
    offlineWallet,
    filteredTransactions,
    actionMessage,
    clearActionMessage,
    monthlySpending,
    categorySpending,
    insights,
    splitRooms,
    budgetPercent,
    budgetUsed,
    pendingOfflineAmount
  } = useNamoPay();
  const isOffline = selectedMode === "offline";

  return (
    <section className="page-stack">
      <section className="hero-card hero-card-compact">
        <div className="hero-top">
          <div>
            <p className="eyebrow">{isOffline ? "Offline journey" : "Online journey"}</p>
            <h2>{isOffline ? "Secure offline dashboard" : "Premium payments dashboard"}</h2>
            <p className="subtle">
              {isOffline
                ? "Use QR, Bluetooth, and secure codes, then sync the offline ledger once connectivity returns."
                : "Move from spend to insights, rewards, and collection flows from a focused financial control center."}
            </p>
          </div>
          <div className="button-row">
            <Link href={isOffline ? "/integrations" : "/payments/send"} className="primary inline-link">
              {isOffline ? "Open integrations" : "Send money"}
            </Link>
            <Link href="/assistant" className="secondary inline-link">Ask AI</Link>
          </div>
        </div>

        {actionMessage ? (
          <div className="notification-item success">
            <div className="panel-header">
              <div>
                <strong>Latest action</strong>
                <p>{actionMessage}</p>
              </div>
              <button className="ghost small" onClick={clearActionMessage}>
                Dismiss
              </button>
            </div>
          </div>
        ) : null}

        <div className="hero-grid">
          <article className="balance-card gradient-primary">
            <span>Bank Balance</span>
            <strong>{formatCurrency(overview.bankBalance)}</strong>
            <small>Linked with Axis, HDFC, and SBI</small>
          </article>
          <article className="balance-card gradient-secondary">
            <span>Offline Wallet</span>
            <strong>{formatCurrency(offlineWallet)}</strong>
            <small>{formatCurrency(pendingOfflineAmount)} pending offline sync value</small>
          </article>
          <article className="balance-card gradient-tertiary">
            <span>Budget Health</span>
            <strong>{budgetPercent}% used</strong>
            <small>{formatCurrency(budgetUsed)} spent this month</small>
          </article>
        </div>
      </section>

      <section className="route-grid route-grid-wide">
        <RouteCard
          href="/payments/send"
          eyebrow="Move money"
          title="Send money"
          description="Pay by UPI, phone number, merchant handle, or guided QR routing."
        />
        <RouteCard
          href="/payments/receive"
          eyebrow="Collect"
          title="Receive money"
          description="Request funds, create collection links, and manage split rooms."
        />
        <RouteCard
          href="/integrations"
          eyebrow="Offline rails"
          title="QR and Bluetooth"
          description="Run device pairing, secure IDs, and dynamic QR-based offline transfers."
        />
        <RouteCard
          href="/passbook"
          eyebrow="History"
          title="Digital passbook"
          description="Search transactions, inspect outcomes, and export your statement."
        />
      </section>

      <section className="dashboard-grid">
        <article className="panel large">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Spend analytics</p>
              <h2>Financial pulse</h2>
            </div>
            <span className={`pill ${isOffline ? "offline" : "online"}`}>{isOffline ? "Offline first" : "Realtime"}</span>
          </div>
          <div className="chart-surface">
            <div className="chart-card">
              <h3>Monthly trend</h3>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={monthlySpending}>
                  <defs>
                    <linearGradient id="dashboardSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7b8cff" stopOpacity={0.75} />
                      <stop offset="95%" stopColor="#7b8cff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip />
                  <Area type="monotone" dataKey="spend" stroke="#7b8cff" fill="url(#dashboardSpend)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card">
              <h3>Category mix</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={categorySpending} dataKey="value" nameKey="name" innerRadius={52} outerRadius={84} paddingAngle={4}>
                    {categorySpending.map((entry, index) => (
                      <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">AI insights</p>
              <h2>What needs attention</h2>
            </div>
          </div>
          <div className="notification-list">
            {insights.map((item) => (
              <div key={item.id} className={`notification-item ${item.tone}`}>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel large">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Transaction stream</p>
              <h2>Bank and wallet timeline</h2>
            </div>
            <Link href="/passbook" className="ghost inline-link">Open passbook</Link>
          </div>
          <div className="passbook-list">
            {filteredTransactions.slice(0, 5).map((item) => (
              <div key={item.id} className="passbook-row">
                <div>
                  <strong>{item.title}</strong>
                  <p>
                    {item.channel} • {item.category}
                  </p>
                </div>
                <div className="passbook-meta">
                  <strong className={item.direction === "credit" ? "credit" : "debit"}>
                    {item.direction === "credit" ? "+" : "-"}
                    {formatCurrency(item.amount)}
                  </strong>
                  <span className={`pill ${item.status.toLowerCase()}`}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Social rooms</p>
              <h2>Shared payments</h2>
            </div>
          </div>
          <div className="notification-list">
            {splitRooms.map((room) => (
              <div key={room.id} className="notification-item info">
                <strong>{room.title}</strong>
                <p>
                  {formatCurrency(room.total)} total • {room.pendingCount} pending member{room.pendingCount > 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </section>
  );
}
