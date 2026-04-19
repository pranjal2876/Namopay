import { RouteCard } from "@/components/route-card";

export default function IntegrationsPage() {
  return (
    <section className="page-stack">
      <section className="hero-card hero-card-compact">
        <div className="hero-top">
          <div>
            <p className="eyebrow">Offline integrations</p>
            <h2>Choose your secure payment rail</h2>
            <p className="subtle">
              Open each integration as its own page: QR with countdown, Bluetooth pairing, or one-time transaction IDs.
            </p>
          </div>
        </div>
      </section>

      <section className="route-grid">
        <RouteCard
          href="/integrations/qr"
          eyebrow="QR"
          title="Dynamic QR"
          description="Launch the 5-minute encrypted QR flow with a premium countdown ring."
        />
        <RouteCard
          href="/integrations/bluetooth"
          eyebrow="Bluetooth"
          title="Bluetooth transfer"
          description="Pair device-to-device and queue offline money movement securely."
        />
        <RouteCard
          href="/integrations/secure-id"
          eyebrow="Secure ID"
          title="One-time transaction code"
          description="Create and consume a short-lived offline payment token."
        />
      </section>
    </section>
  );
}

