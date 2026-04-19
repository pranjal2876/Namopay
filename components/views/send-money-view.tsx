"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNamoPay } from "@/components/namopay-provider";
import { formatCurrency } from "@/lib/format";

export function SendMoneyView() {
  const router = useRouter();
  const { txTarget, txAmount, setTxTarget, setTxAmount, createTransaction, notifications, actionMessage } = useNamoPay();

  function handleSend(channel: "UPI" | "Phone" | "Merchant") {
    const success = createTransaction(channel);
    if (success) {
      router.push("/dashboard");
    }
  }

  return (
    <section className="page-stack">
      <section className="hero-card hero-card-compact">
        <div className="hero-top">
          <div>
            <p className="eyebrow">Send money</p>
            <h2>Choose the rail, confirm the amount, then send</h2>
            <p className="subtle">Dedicated money movement flow for UPI handles, phone numbers, merchant pay, and QR redirection.</p>
          </div>
          <div className="button-row">
            <Link href="/integrations/qr" className="secondary inline-link">Open QR tools</Link>
            <Link href="/payments/receive" className="ghost inline-link">Go to receive</Link>
          </div>
        </div>
      </section>

      {actionMessage ? (
        <div className="notification-item success">
          <strong>Transfer status</strong>
          <p>{actionMessage}</p>
        </div>
      ) : null}

      <section className="dashboard-grid">
        <article className="panel large">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Primary transfer</p>
              <h2>Send by UPI or phone</h2>
            </div>
          </div>
          <div className="form-grid">
            <label>
              UPI ID / phone / merchant
              <input value={txTarget} onChange={(event) => setTxTarget(event.target.value)} />
            </label>
            <label>
              Amount
              <input value={txAmount} onChange={(event) => setTxAmount(event.target.value)} />
            </label>
          </div>
          <div className="button-row">
            <button className="primary" onClick={() => handleSend("UPI")}>Send via UPI</button>
            <button className="secondary" onClick={() => handleSend("Phone")}>Send via phone</button>
            <button className="ghost" onClick={() => handleSend("Merchant")}>Pay merchant</button>
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Smart suggestions</p>
              <h2>Guided options</h2>
            </div>
          </div>
          <div className="action-list">
            <button className="ghost action-block" onClick={() => setTxTarget("rahul@upi")}>
              Rahul • frequent contact
            </button>
            <button className="ghost action-block" onClick={() => setTxTarget("electromart@upi")}>
              ElectroMart • merchant
            </button>
            <button className="ghost action-block" onClick={() => setTxTarget("metro@upi")}>
              Delhi Metro • travel
            </button>
          </div>
        </article>

        <article className="panel large">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Recent signals</p>
              <h2>Payment alerts</h2>
            </div>
          </div>
          <div className="notification-list">
            {notifications.slice(0, 3).map((item) => (
              <div key={item.id} className={`notification-item ${item.tone}`}>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Amount preview</p>
              <h2>Confirmation</h2>
            </div>
          </div>
          <p className="confirm-amount">{formatCurrency(Number(txAmount || 0))}</p>
          <p className="subtle">Fraud checks and cashback simulation will apply automatically before the transfer posts.</p>
        </article>
      </section>
    </section>
  );
}

