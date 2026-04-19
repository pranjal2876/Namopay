"use client";

import { useNamoPay } from "@/components/namopay-provider";

export function AssistantView() {
  const { assistantMessages, chatInput, setChatInput, submitAssistant, voiceCommand, setVoiceCommand, submitVoice, voiceResult } =
    useNamoPay();

  return (
    <section className="page-stack">
      <section className="hero-card hero-card-compact">
        <div className="hero-top">
          <div>
            <p className="eyebrow">AI assistant</p>
            <h2>Your in-app finance copilot</h2>
            <p className="subtle">Ask about spending, savings, offline sync, and voice-triggered payments from one conversational space.</p>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="panel large">
          <div className="assistant-thread">
            {assistantMessages.map((message) => (
              <div key={message.id} className={`assistant-bubble ${message.role}`}>
                {message.text}
              </div>
            ))}
          </div>
          <form className="assistant-form" onSubmit={submitAssistant}>
            <label>
              Ask NamoPay AI
              <input value={chatInput} onChange={(event) => setChatInput(event.target.value)} />
            </label>
            <button className="primary" type="submit">Ask assistant</button>
          </form>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Voice pay</p>
              <h2>Experimental control</h2>
            </div>
          </div>
          <form className="assistant-form" onSubmit={submitVoice}>
            <label>
              Voice command
              <input value={voiceCommand} onChange={(event) => setVoiceCommand(event.target.value)} />
            </label>
            <button className="secondary" type="submit">Run voice pay</button>
          </form>
          <div className="notification-item info">
            <strong>Voice result</strong>
            <p>{voiceResult}</p>
          </div>
        </article>
      </section>
    </section>
  );
}

