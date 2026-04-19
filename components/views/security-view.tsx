"use client";

import { useNamoPay } from "@/components/namopay-provider";

const securitySignals = [
  { title: "Device trust", detail: "Trusted devices are required for Bluetooth and secure-session actions." },
  { title: "PIN lock", detail: "Sensitive money movement is gated behind secure session unlock." },
  { title: "Fraud shield", detail: "Large or repeated payments trigger extra review." }
];

export function SecurityView() {
  const { pinUnlocked, setPinUnlocked, notifications, suspiciousCount } = useNamoPay();

  return (
    <section className="page-stack">
      <section className="hero-card hero-card-compact">
        <div className="hero-top">
          <div>
            <p className="eyebrow">Security center</p>
            <h2>Session control, fraud checks, and trust signals</h2>
            <p className="subtle">A believable fintech experience needs visible trust, not just pretty screens.</p>
          </div>
          <button className="primary" onClick={() => setPinUnlocked(!pinUnlocked)}>
            {pinUnlocked ? "Lock secure session" : "Unlock secure session"}
          </button>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="panel large">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Core controls</p>
              <h2>Security posture</h2>
            </div>
          </div>
          <div className="notification-list">
            {securitySignals.map((signal) => (
              <div key={signal.title} className="notification-item info">
                <strong>{signal.title}</strong>
                <p>{signal.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Fraud status</p>
              <h2>Flagged items</h2>
            </div>
          </div>
          <p className="confirm-amount">{suspiciousCount}</p>
          <p className="subtle">Transactions currently flagged for extra review.</p>
        </article>

        <article className="panel large">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Alerts</p>
              <h2>Recent security notifications</h2>
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
