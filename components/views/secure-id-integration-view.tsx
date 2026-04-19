"use client";

import { useRouter } from "next/navigation";
import { useNamoPay } from "@/components/namopay-provider";

export function SecureIdIntegrationView() {
  const router = useRouter();
  const { qrSeconds, createTransaction, actionMessage } = useNamoPay();

  function handleSecureId() {
    const success = createTransaction("Offline ID", true);
    if (success) {
      router.push("/dashboard");
    }
  }

  return (
    <section className="page-stack">
      <section className="hero-card hero-card-compact">
        <div className="hero-top">
          <div>
            <p className="eyebrow">Secure ID</p>
            <h2>One-time offline transaction code</h2>
            <p className="subtle">Short validity, sync verification, and anti-double-spend behavior in a focused screen.</p>
          </div>
        </div>
      </section>

      {actionMessage ? (
        <div className="notification-item success">
          <strong>Secure ID status</strong>
          <p>{actionMessage}</p>
        </div>
      ) : null}

      <section className="dashboard-grid">
        <article className="panel large">
          <div className="token-card">
            <p className="eyebrow">Live token</p>
            <h3>NPX-{String(qrSeconds).padStart(4, "0")}</h3>
            <p className="subtle">This code is valid only for the current secure window and will be checked during sync.</p>
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Use code</p>
          <h3>Queue payment</h3>
          <button className="primary" onClick={handleSecureId}>Use secure ID</button>
        </article>
      </section>
    </section>
  );
}
