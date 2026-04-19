"use client";

import { useNamoPay } from "@/components/namopay-provider";

export function QRIntegrationView() {
  const { qrSeconds, qrProgress, qrRingColor, qrPayload, txAmount, setTxAmount, createTransaction } = useNamoPay();

  return (
    <section className="page-stack">
      <section className="hero-card hero-card-compact">
        <div className="hero-top">
          <div>
            <p className="eyebrow">Dynamic QR</p>
            <h2>5-minute secure QR payment page</h2>
            <p className="subtle">A standalone QR view with timer, encrypted payload simulation, and a direct route from the dashboard.</p>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="panel large">
          <div className="qr-zone">
            <div
              className="countdown-ring countdown-ring-blue"
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
        </article>

        <article className="panel">
          <p className="eyebrow">Configure amount</p>
          <label>
            Amount
            <input value={txAmount} onChange={(event) => setTxAmount(event.target.value)} />
          </label>
          <button className="primary" onClick={() => createTransaction("QR", true)}>Queue offline QR payment</button>
          <p className="subtle">Payload includes amount, wallet ID, timestamp, and a one-time anti-reuse token.</p>
        </article>
      </section>
    </section>
  );
}

