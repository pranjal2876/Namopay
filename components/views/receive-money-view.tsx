"use client";

import Link from "next/link";
import { useNamoPay } from "@/components/namopay-provider";
import { formatCurrency } from "@/lib/format";

export function ReceiveMoneyView() {
  const { txAmount, setTxAmount, overview } = useNamoPay();

  return (
    <section className="page-stack">
      <section className="hero-card hero-card-compact">
        <div className="hero-top">
          <div>
            <p className="eyebrow">Receive money</p>
            <h2>Collect through requests, rooms, and merchant-style links</h2>
            <p className="subtle">This screen is focused on incoming flows so users never have to hunt through a long landing page.</p>
          </div>
          <Link href="/integrations/qr" className="primary inline-link">Create receive QR</Link>
        </div>
      </section>

      <section className="route-grid">
        <article className="panel">
          <p className="eyebrow">Request money</p>
          <h3>Share amount with one tap</h3>
          <label>
            Request amount
            <input value={txAmount} onChange={(event) => setTxAmount(event.target.value)} />
          </label>
          <div className="button-row">
            <button className="primary">Request from contact</button>
            <button className="secondary">Create payment link</button>
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Split room</p>
          <h3>Group payment collection</h3>
          <div className="notification-item info">
            <strong>Weekend villa</strong>
            <p>Rahul paid {formatCurrency(2200)} • Ananya pending {formatCurrency(2200)}</p>
          </div>
          <button className="ghost action-block">Send reminder</button>
        </article>

        <article className="panel">
          <p className="eyebrow">Collection health</p>
          <h3>Funds ready</h3>
          <p className="confirm-amount">{formatCurrency(overview.bankBalance)}</p>
          <p className="subtle">Linked account ready to receive bank and merchant settlements in real time.</p>
        </article>
      </section>
    </section>
  );
}

