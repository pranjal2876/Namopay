"use client";

import { useNamoPay } from "@/components/namopay-provider";
import { formatCurrency } from "@/lib/format";

export function PassbookView() {
  const { filteredTransactions, search, setSearch, exportPassbook, actionMessage } = useNamoPay();

  return (
    <section className="page-stack">
      <section className="hero-card hero-card-compact">
        <div className="hero-top">
          <div>
            <p className="eyebrow">Digital passbook</p>
            <h2>Search, inspect, and export your money trail</h2>
            <p className="subtle">A bank-style ledger with searchable history across online and offline rails.</p>
          </div>
          <button className="primary" onClick={exportPassbook}>Download PDF</button>
        </div>
      </section>

      {actionMessage ? (
        <div className="notification-item success">
          <strong>Passbook status</strong>
          <p>{actionMessage}</p>
        </div>
      ) : null}

      <section className="panel">
        <label>
          Search by merchant, person, or category
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try food, Rahul, QR, shopping" />
        </label>
      </section>

      <section className="panel">
        <div className="passbook-list">
          {filteredTransactions.map((item) => (
            <div key={item.id} className="passbook-row">
              <div>
                <strong>{item.title}</strong>
                <p>
                  {item.counterparty} • {item.channel} • {new Date(item.timestamp).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="passbook-meta">
                <strong className={item.direction === "credit" ? "credit" : "debit"}>
                  {item.direction === "credit" ? "+" : "-"}
                  {formatCurrency(item.amount)}
                </strong>
                <span className={`pill ${item.status.toLowerCase()}`}>{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

