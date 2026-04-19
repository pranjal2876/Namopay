"use client";

import { useNamoPay } from "@/components/namopay-provider";
import { formatCurrency } from "@/lib/format";

export function SyncCenterView() {
  const { offlineQueue, pendingOfflineAmount, syncOfflineQueue, notifications, actionMessage } = useNamoPay();

  return (
    <section className="page-stack">
      <section className="hero-card hero-card-compact">
        <div className="hero-top">
          <div>
            <p className="eyebrow">Sync center</p>
            <h2>Resolve offline payments and conflicts</h2>
            <p className="subtle">Track queued offline transactions, sync them when connected, and review potential conflicts or fraud checks.</p>
          </div>
          <button className="primary" onClick={() => void syncOfflineQueue()}>Sync now</button>
        </div>
      </section>

      {actionMessage ? (
        <div className="notification-item success">
          <strong>Sync status</strong>
          <p>{actionMessage}</p>
        </div>
      ) : null}

      <section className="dashboard-grid">
        <article className="panel large">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Queued payments</p>
              <h2>{offlineQueue.length} items awaiting reconciliation</h2>
            </div>
            <span className="pill offline">{formatCurrency(pendingOfflineAmount)} pending</span>
          </div>
          <div className="passbook-list">
            {offlineQueue.length ? (
              offlineQueue.map((item) => (
                <div key={item.id} className="passbook-row">
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.channel} • {item.category}</p>
                  </div>
                  <div className="passbook-meta">
                    <strong className="debit">-{formatCurrency(item.amount)}</strong>
                    <span className={`pill ${item.status.toLowerCase()}`}>{item.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="notification-item success">
                <strong>All clear</strong>
                <p>No offline transactions are waiting to sync right now.</p>
              </div>
            )}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Risk feed</p>
              <h2>Smart notifications</h2>
            </div>
          </div>
          <div className="notification-list">
            {notifications.slice(0, 4).map((item) => (
              <div key={item.id} className={`notification-item ${item.tone}`}>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </section>
  );
}
