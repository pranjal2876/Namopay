# NamoPay

NamoPay is a premium hybrid payment web app demo built with Next.js and TypeScript. It combines online UPI-style payments, offline wallet flows, AI finance insights, rewards, fraud warnings, merchant tools, passbook exports, and bilingual UI support in one cohesive product experience.

## Highlights

- Online payment rail simulation for UPI ID, phone number, and QR-style flows
- Offline wallet with max balance enforcement, local queueing, and sync conflict resolution
- 5-minute dynamic QR experience with anti-reuse token simulation
- Bluetooth and transaction-ID offline transfer flows
- AI insights dashboard with spending analytics and budgeting guidance
- Rewards engine with coins, cashback, and scratch-card interaction
- Social payment room preview with reminders
- Fraud detection heuristics for large and repeated payments
- English and Hindi toggle
- Merchant analytics dashboard
- Digital passbook with PDF statement export
- In-app finance assistant and voice payment simulation

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Recharts for analytics
- jsPDF for statement download

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Endpoints

- `GET /api/overview`
- `POST /api/sync`
- `POST /api/assistant`
- `POST /api/voice-pay`

## Product Notes

- Offline transactions are stored locally and synced later.
- Fraud checks are heuristic and demo-oriented, not real banking security.
- Biometric unlock, Bluetooth transfer, and voice pay are simulated in-browser experiences.
- The app is structured so a real backend, auth, and payment rails can be swapped in later.

## Deployment

The app is deployment-ready for Vercel or any Node-compatible Next.js host after installing dependencies:

```bash
npm run build
npm run start
```
