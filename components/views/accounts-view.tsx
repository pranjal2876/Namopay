"use client";

import Link from "next/link";
import { useNamoPay } from "@/components/namopay-provider";
import { formatCurrency } from "@/lib/format";

const linkedAccounts = [
  { bank: "Axis Bank", account: "•••• 2145", status: "Primary", balance: 68450 },
  { bank: "HDFC Bank", account: "•••• 8891", status: "Linked", balance: 42100 },
  { bank: "SBI", account: "•••• 1102", status: "Linked", balance: 17900 }
];

const upiHandles = ["pranjal@upi", "pranjal2876@okaxis", "namopay.pranjal@oksbi"];

export function AccountsView() {
  const { overview, selectedMode } = useNamoPay();

  return (
    <section className="page-stack">
      <section className="hero-card hero-card-compact">
        <div className="hero-top">
          <div>
            <p className="eyebrow">Accounts and rails</p>
            <h2>Banking layer, UPI handles, and money sources</h2>
            <p className="subtle">A fintech app should feel credible at the account layer too, not only at the payment screen.</p>
          </div>
          <Link href={selectedMode === "offline" ? "/sync-center" : "/payments/send"} className="primary inline-link">
            {selectedMode === "offline" ? "Review sync" : "Pay from account"}
          </Link>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="panel large">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Linked banks</p>
              <h2>Funding sources</h2>
            </div>
          </div>
          <div className="notification-list">
            {linkedAccounts.map((account) => (
              <div key={account.account} className="notification-item info">
                <strong>{account.bank}</strong>
                <p>
                  {account.account} • {account.status} • {formatCurrency(account.balance)}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">UPI identity</p>
              <h2>Handles</h2>
            </div>
          </div>
          <div className="notification-list">
            {upiHandles.map((handle) => (
              <div key={handle} className="notification-item success">
                <strong>{handle}</strong>
                <p>Verified and ready for bank-linked and merchant payments.</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel large">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Net worth view</p>
              <h2>Combined liquidity</h2>
            </div>
          </div>
          <div className="hero-grid">
            <article className="balance-card gradient-primary">
              <span>Total linked bank funds</span>
              <strong>{formatCurrency(overview.bankBalance)}</strong>
              <small>Available for instant bank-backed payments</small>
            </article>
            <article className="balance-card gradient-secondary">
              <span>Offline float</span>
              <strong>{formatCurrency(overview.offlineBalance)}</strong>
              <small>Reserved for no-network payment continuity</small>
            </article>
            <article className="balance-card gradient-tertiary">
              <span>Cashback wallet</span>
              <strong>{formatCurrency(overview.cashbackEarned)}</strong>
              <small>Rewards and redemption value in one place</small>
            </article>
          </div>
        </article>
      </section>
    </section>
  );
}

