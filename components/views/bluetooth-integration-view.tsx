"use client";

import { useRouter } from "next/navigation";
import { useNamoPay } from "@/components/namopay-provider";

export function BluetoothIntegrationView() {
  const router = useRouter();
  const { bluetoothStatus, createTransaction, actionMessage, devices, activeDeviceId, setActiveDeviceId, pairActiveDevice } =
    useNamoPay();

  function handleBluetoothTransfer() {
    const success = createTransaction("Bluetooth", true);
    if (success) {
      router.push("/sync-center");
    }
  }

  return (
    <section className="page-stack">
      <section className="hero-card hero-card-compact">
        <div className="hero-top">
          <div>
            <p className="eyebrow">Bluetooth pay</p>
            <h2>Device-to-device offline transfer</h2>
            <p className="subtle">Pick a nearby device, mark it trusted, then queue the transfer for later reconciliation.</p>
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
            <div className="device-node">Selected receiver</div>
          </div>
          <div className="notification-item info">
            <strong>Pairing state</strong>
            <p>{bluetoothStatus}</p>
          </div>
          <div className="device-list">
            {devices.map((device) => (
              <button
                key={device.id}
                className={`device-card ${activeDeviceId === device.id ? "selected-device" : ""}`}
                onClick={() => setActiveDeviceId(device.id)}
              >
                <strong>{device.name}</strong>
                <span>{device.trust === "trusted" ? "Trusted" : "New device"}</span>
                <span>{device.lastSeen} • {device.battery}% battery</span>
              </button>
            ))}
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Ready to transfer</p>
          <h3>Secure handshake</h3>
          <p className="subtle">Trust the device first, then queue the offline movement for later sync verification.</p>
          <div className="action-list">
            <button className="secondary" onClick={pairActiveDevice}>Pair selected device</button>
            <button className="primary" onClick={handleBluetoothTransfer}>Pair and transfer</button>
          </div>
        </article>
      </section>
    </section>
  );
}
