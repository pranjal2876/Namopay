"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNamoPay } from "@/components/namopay-provider";

const utilityOptions = [
  { id: "mobile", title: "Mobile Recharge", detail: "Top up prepaid or postpaid numbers." },
  { id: "electricity", title: "Electricity Bill", detail: "Pay your monthly home or office bill." },
  { id: "dth", title: "DTH / OTT", detail: "Recharge TV and streaming packs." },
  { id: "merchant", title: "Merchant Pay", detail: "Pay neighborhood stores and local merchants." }
];

export function UtilitiesView() {
  const router = useRouter();
  const { setTxTarget, setTxAmount, clearActionMessage } = useNamoPay();

  function prepareUtility(title: string) {
    clearActionMessage();
    setTxTarget(title);
    setTxAmount("699");
    router.push("/payments/send");
  }

  return (
    <section className="page-stack">
      <section className="hero-card hero-card-compact">
        <div className="hero-top">
          <div>
            <p className="eyebrow">Utilities</p>
            <h2>Recharge, bills, and everyday merchant flows</h2>
            <p className="subtle">This fills out the everyday use cases people expect from a real payments super app.</p>
          </div>
          <Link href="/payments/send" className="secondary inline-link">Open payment rail</Link>
        </div>
      </section>

      <section className="route-grid">
        {utilityOptions.map((item) => (
          <button key={item.id} className="route-card route-button" onClick={() => prepareUtility(item.title)}>
            <p className="eyebrow">{item.id}</p>
            <h3>{item.title}</h3>
            <p className="subtle">{item.detail}</p>
            <span className="route-arrow">Start payment</span>
          </button>
        ))}
      </section>
    </section>
  );
}

