"use client";

import { useRouter } from "next/navigation";
import { useNamoPay } from "@/components/namopay-provider";

export default function Home() {
  const router = useRouter();
  const { setSelectedMode, clearActionMessage } = useNamoPay();

  function chooseMode(mode: "online" | "offline") {
    setSelectedMode(mode);
    clearActionMessage();
    router.push("/dashboard");
  }

  return (
    <main className="shell landing-shell">
      <section className="landing-hero">
        <div className="landing-copy">
          <p className="eyebrow">NamoPay</p>
          <h1 className="landing-title">Choose how you want to move money today.</h1>
          <p className="subtle landing-subtle">
            Start with a mode picker, continue into the dashboard, then move through send, receive, QR, Bluetooth, and secure offline payment steps.
          </p>
        </div>

        <div className="mode-choice-grid">
          <button className="mode-choice mode-online" onClick={() => chooseMode("online")}>
            <p className="eyebrow">Online</p>
            <h2>Instant UPI-style payments</h2>
            <p>Bank-linked transfers, QR scans, requests, smart analytics, and rewards.</p>
            <span>Continue to Online Dashboard</span>
          </button>

          <button className="mode-choice mode-offline" onClick={() => chooseMode("offline")}>
            <p className="eyebrow">Offline</p>
            <h2>Pay without internet</h2>
            <p>Dynamic QR, Bluetooth pairing, transaction codes, wallet limits, and sync protection.</p>
            <span>Continue to Offline Dashboard</span>
          </button>
        </div>
      </section>
    </main>
  );
}
