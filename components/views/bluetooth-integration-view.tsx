"use client";

import { useRouter } from "next/navigation";
import { useNamoPay } from "@/components/namopay-provider";

export function BluetoothIntegrationView() {
  const router = useRouter();
  const { bluetoothStatus, createTransaction, actionMessage } = useNamoPay();

  function handleBluetoothTransfer() {
    const success = createTransaction("Bluetooth", true);
    if (success) {
      router.push("/dashboard");
    }
  }

  return (
    <section className="page-stack">
      <section className="hero-card hero-card-compact">
        <div className="hero-top">
          <div>
            <p className="eyebrow">Bluetooth pay</p>
            <h2>Device-to-device offline transfer</h2>
            <p className="subtle">A dedicated pairing flow with confirmation copy instead of hiding Bluetooth inside a long dashboard.</p>
          </div>
        </div>
      </section>

      {actionMessage ? (
        <div className="notification-item success">
          <strong>Bluetooth status</strong>
          <p>{actionMessage}</p>
        </div>
      ) : null}

      <section className="dashboard-grid">
        <article className="panel large">
          <div className="device-stage">
            <div className="device-node">Your phone</div>
            <div className="device-bridge" />
            <div className="device-node">Trusted receiver</div>
          </div>
          <div className="notification-item info">
            <strong>Pairing state</strong>
            <p>{bluetoothStatus}</p>
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Ready to transfer</p>
          <h3>Secure handshake</h3>
          <p className="subtle">Use a signed pairing event, then queue the offline movement for later sync verification.</p>
          <button className="primary" onClick={handleBluetoothTransfer}>Pair and transfer</button>
        </article>
      </section>
    </section>
  );
}

