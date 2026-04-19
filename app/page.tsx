import Link from "next/link";

export default function Home() {
  return (
    <main className="shell landing-shell">
      <section className="landing-hero">
        <div className="landing-copy">
          <p className="eyebrow">NamoPay</p>
          <h1 className="landing-title">Choose how you want to move money today.</h1>
          <p className="subtle landing-subtle">
            Start with a premium mode picker, then move into a guided dashboard, dedicated send and receive flows, and secure QR and Bluetooth integrations.
          </p>
        </div>

        <div className="mode-choice-grid">
          <Link href="/dashboard?mode=online" className="mode-choice mode-online">
            <p className="eyebrow">Online</p>
            <h2>Instant UPI-style payments</h2>
            <p>Bank-linked transfers, QR scans, requests, smart analytics, and rewards.</p>
            <span>Continue to Online Dashboard</span>
          </Link>

          <Link href="/dashboard?mode=offline" className="mode-choice mode-offline">
            <p className="eyebrow">Offline</p>
            <h2>Pay without internet</h2>
            <p>Dynamic QR, Bluetooth pairing, transaction codes, wallet limits, and sync protection.</p>
            <span>Continue to Offline Dashboard</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

