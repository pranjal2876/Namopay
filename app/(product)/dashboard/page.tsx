import Link from "next/link";
import { RouteCard } from "@/components/route-card";
import { overviewData } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const params = await searchParams;
  const mode = params.mode === "offline" ? "offline" : "online";
  const isOffline = mode === "offline";

  return (
    <section className="page-stack">
      <section className="hero-card hero-card-compact">
        <div className="hero-top">
          <div>
            <p className="eyebrow">{isOffline ? "Offline journey" : "Online journey"}</p>
            <h2>{isOffline ? "Secure offline dashboard" : "Premium payments dashboard"}</h2>
            <p className="subtle">
              {isOffline
                ? "Use QR, Bluetooth, and secure offline codes, then sync once connectivity returns."
                : "Jump into send, receive, rewards, analytics, and linked-bank actions from a focused home."}
            </p>
          </div>
          <Link href={isOffline ? "/integrations" : "/payments/send"} className="primary inline-link">
            {isOffline ? "Open integrations" : "Send money"}
          </Link>
        </div>

        <div className="hero-grid">
          <article className="balance-card gradient-primary">
            <span>Bank Balance</span>
            <strong>{formatCurrency(overviewData.bankBalance)}</strong>
            <small>Linked with Axis, HDFC, and SBI</small>
          </article>
          <article className="balance-card gradient-secondary">
            <span>Offline Wallet</span>
            <strong>{formatCurrency(overviewData.offlineBalance)}</strong>
            <small>Instant tap-ready reserve for no-network payments</small>
          </article>
          <article className="balance-card gradient-tertiary">
            <span>Recent Signal</span>
            <strong>{overviewData.transactions.length} txns</strong>
            <small>Rewards, alerts, and fraud checks updating live</small>
          </article>
        </div>
      </section>

      <section className="route-grid">
        <RouteCard
          href="/payments/send"
          eyebrow="Move money"
          title="Send money"
          description="Pay by UPI ID, phone number, merchant handle, or smart routing."
        />
        <RouteCard
          href="/payments/receive"
          eyebrow="Collect"
          title="Receive money"
          description="Request payments, create collection links, and manage QR-based receiving."
        />
        <RouteCard
          href="/integrations"
          eyebrow="Integrations"
          title="Offline + device flows"
          description="Open QR, Bluetooth, and one-time secure ID experiences from one place."
        />
      </section>

      <section className="dashboard-grid">
        <article className="panel large">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Recent activity</p>
              <h2>Bank and wallet timeline</h2>
            </div>
            <span className={`pill ${isOffline ? "offline" : "online"}`}>{isOffline ? "Offline first" : "Realtime"}</span>
          </div>
          <div className="passbook-list">
            {overviewData.transactions.slice(0, 4).map((item) => (
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
              <p className="eyebrow">Action center</p>
              <h2>Quick redirects</h2>
            </div>
          </div>
          <div className="action-list">
            <Link href="/payments/send" className="ghost action-block">Send to contact</Link>
            <Link href="/payments/receive" className="ghost action-block">Request from friend</Link>
            <Link href="/integrations/qr" className="ghost action-block">Generate dynamic QR</Link>
            <Link href="/integrations/bluetooth" className="ghost action-block">Start Bluetooth flow</Link>
          </div>
        </article>
      </section>
    </section>
  );
}

