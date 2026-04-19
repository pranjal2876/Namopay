"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useNamoPay } from "@/components/namopay-provider";

type AuthTab = "login" | "signup";

export default function Home() {
  const router = useRouter();
  const { authReady, currentUser, authError, clearAuthError, signIn, signUp, setSelectedMode, clearActionMessage } = useNamoPay();
  const [tab, setTab] = useState<AuthTab>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = useMemo(() => email.trim() && password.trim() && (tab === "login" || name.trim()), [email, password, name, tab]);

  async function submitAuth(event: FormEvent) {
    event.preventDefault();
    clearAuthError();
    const success =
      tab === "login"
        ? await signIn({ email, password })
        : await signUp({ name, email, password });
    if (success) {
      setPassword("");
      setName("");
    }
  }

  function chooseMode(mode: "online" | "offline") {
    setSelectedMode(mode);
    clearActionMessage();
    router.push("/dashboard");
  }

  if (!authReady) {
    return null;
  }

  if (!currentUser) {
    return (
      <main className="shell landing-shell">
        <section className="landing-hero auth-hero">
          <div className="landing-copy">
            <p className="eyebrow">NamoPay</p>
            <h1 className="landing-title">Secure sign in to your hybrid payment app.</h1>
            <p className="subtle landing-subtle">
              Create your account once, come back anytime, and keep your NamoPay data personalized on this device.
            </p>
          </div>

          <section className="auth-card">
            <div className="auth-tabs">
              <button className={`ghost ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>
                Login
              </button>
              <button className={`ghost ${tab === "signup" ? "active" : ""}`} onClick={() => setTab("signup")}>
                Sign Up
              </button>
            </div>

            <form className="auth-form" onSubmit={submitAuth}>
              {tab === "signup" ? (
                <label>
                  Full name
                  <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Pranjal Sharma" />
                </label>
              ) : null}

              <label>
                Email
                <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" type="email" />
              </label>

              <label>
                Password
                <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter a secure password" type="password" />
              </label>

              {authError ? (
                <div className="notification-item warning">
                  <strong>Authentication</strong>
                  <p>{authError}</p>
                </div>
              ) : null}

              <button className="primary" type="submit" disabled={!canSubmit}>
                {tab === "login" ? "Login to NamoPay" : "Create account"}
              </button>
            </form>
          </section>
        </section>
      </main>
    );
  }

  return (
    <main className="shell landing-shell">
      <section className="landing-hero">
        <div className="landing-copy">
          <p className="eyebrow">NamoPay</p>
          <h1 className="landing-title">Welcome back, {currentUser.name}. Choose your payment mode.</h1>
          <p className="subtle landing-subtle">
            Your account is signed in and your app data is persistent on this device. Pick the journey you want to continue.
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
