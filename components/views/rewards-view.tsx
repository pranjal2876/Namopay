"use client";

import { useNamoPay } from "@/components/namopay-provider";
import { formatCurrency } from "@/lib/format";

export function RewardsView() {
  const { overview, rewards, unlockScratchCard, scratchOpened, redeemReward, actionMessage } = useNamoPay();

  return (
    <section className="page-stack">
      <section className="hero-card hero-card-compact">
        <div className="hero-top">
          <div>
            <p className="eyebrow">Rewards engine</p>
            <h2>Cashback, coins, and redeemable perks</h2>
            <p className="subtle">Turn payment activity into tangible value with scratch cards and coin redemptions.</p>
          </div>
          <div className="reward-summary">
            <strong>{overview.rewardCoins} coins</strong>
            <span>{formatCurrency(overview.cashbackEarned)} cashback earned</span>
          </div>
        </div>
      </section>

      {actionMessage ? (
        <div className="notification-item success">
          <strong>Rewards status</strong>
          <p>{actionMessage}</p>
        </div>
      ) : null}

      <section className="dashboard-grid">
        <article className="panel large">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Available offers</p>
              <h2>Redeem from your wallet</h2>
            </div>
          </div>
          <div className="reward-grid">
            {rewards.map((reward) => (
              <div key={reward.id} className={`reward-card ${reward.unlocked ? "unlocked" : ""}`}>
                <strong>{reward.title}</strong>
                <p>{reward.cashback}</p>
                <span>{reward.coinsCost ? `${reward.coinsCost} coins` : "Unlocked"}</span>
                <button className="ghost small" onClick={() => redeemReward(reward.id)}>Redeem</button>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Scratch card</p>
              <h2>Bonus unlock</h2>
            </div>
          </div>
          <p className="subtle">A daily engagement reward to make the app feel alive.</p>
          <button className="primary" onClick={unlockScratchCard} disabled={scratchOpened}>
            {scratchOpened ? "Scratch card claimed" : "Open scratch card"}
          </button>
        </article>
      </section>
    </section>
  );
}

