"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ReactNode } from "react";
import { BackButton } from "@/components/back-button";
import { useNamoPay } from "@/components/namopay-provider";
import { getGreeting } from "@/lib/format";

const navItems: Array<{ href: Route; label: string }> = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/accounts", label: "Accounts" },
  { href: "/utilities", label: "Utilities" },
  { href: "/payments/send", label: "Send" },
  { href: "/payments/receive", label: "Receive" },
  { href: "/integrations", label: "Integrations" },
  { href: "/passbook", label: "Passbook" },
  { href: "/rewards", label: "Rewards" },
  { href: "/assistant", label: "Assistant" },
  { href: "/sync-center", label: "Sync" },
  { href: "/security", label: "Security" }
];

export function NamoPayShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const {
    currentUser,
    theme,
    language,
    setTheme,
    setLanguage,
    overview,
    offlineWallet,
    offlineQueue,
    pinUnlocked,
    setPinUnlocked,
    selectedMode,
    signOut
  } = useNamoPay();

  return (
    <main className="shell shell-spaced">
      <section className="app-frame">
        <div className="shell-toolbar">
          <BackButton fallback={pathname === "/dashboard" ? "/" : "/dashboard"} />
        </div>

        <header className="app-header">
          <div>
            <p className="eyebrow">NamoPay</p>
            <h1 className="app-title">
              {getGreeting()}, {overview.user}
            </h1>
            <p className="subtle">
              Hybrid payments with guided flows, secure offline rails, and premium blue-purple polish.
            </p>
            <p className="subtle">{currentUser?.email}</p>
          </div>
          <div className="header-actions">
            <button className="ghost" onClick={signOut}>
              Log Out
            </button>
            <button className={clsx("ghost", pinUnlocked && "active")} onClick={() => setPinUnlocked(!pinUnlocked)}>
              {pinUnlocked ? "Session Unlocked" : "Unlock Secure Session"}
            </button>
            <button className="ghost" onClick={() => setLanguage(language === "en" ? "hi" : "en")}>
              {language === "en" ? "EN / HI" : "HI / EN"}
            </button>
            <button className="ghost" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </header>

        <div className="status-strip">
          <div className="status-pill">Bank Rs {overview.bankBalance.toLocaleString("en-IN")}</div>
          <div className="status-pill">Offline Rs {offlineWallet.toLocaleString("en-IN")}</div>
          <div className="status-pill">{offlineQueue.length} queued for sync</div>
          <div className={`status-pill ${selectedMode}`}>{selectedMode === "online" ? "Online journey" : "Offline journey"}</div>
        </div>

        <nav className="top-nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={clsx("nav-link", pathname === item.href && "selected")}>
              {item.label}
            </Link>
          ))}
        </nav>

        {children}

        <nav className="mobile-nav">
          {[navItems[0], navItems[3], navItems[4], navItems[5], navItems[10]].map((item) => (
            <Link key={item.href} href={item.href} className={clsx("mobile-nav-link", pathname === item.href && "selected")}>
              {item.label}
            </Link>
          ))}
        </nav>
      </section>
    </main>
  );
}
