import { Language } from "./types";

type Dictionary = Record<string, string>;

const en: Dictionary = {
  greeting: "Good Evening",
  online: "Online Mode",
  offline: "Offline Mode",
  bankBalance: "Bank Balance",
  offlineBalance: "Offline Wallet",
  recentTransactions: "Recent Transactions",
  quickActions: "Quick Actions",
  scan: "Scan",
  pay: "Pay",
  request: "Request",
  rewards: "Rewards",
  insights: "AI Insights",
  merchant: "Merchant Mode",
  passbook: "Digital Passbook",
  assistant: "AI Assistant",
  budget: "Budget",
  sync: "Sync Engine",
  voice: "Voice Pay",
  suspicious: "Suspicious Activity",
  split: "Split Bills",
  utilities: "Utilities",
  banking: "Banking Layer",
  recharge: "Recharge Offline Wallet",
  qr: "Dynamic QR",
  bluetooth: "Bluetooth",
  transactionId: "Transaction ID",
  notifications: "Smart Notifications"
};

const hi: Dictionary = {
  greeting: "शुभ संध्या",
  online: "ऑनलाइन मोड",
  offline: "ऑफलाइन मोड",
  bankBalance: "बैंक बैलेंस",
  offlineBalance: "ऑफलाइन वॉलेट",
  recentTransactions: "हाल के लेनदेन",
  quickActions: "त्वरित एक्शन",
  scan: "स्कैन",
  pay: "पे",
  request: "अनुरोध",
  rewards: "रिवॉर्ड्स",
  insights: "एआई इनसाइट्स",
  merchant: "मर्चेंट मोड",
  passbook: "डिजिटल पासबुक",
  assistant: "एआई असिस्टेंट",
  budget: "बजट",
  sync: "सिंक इंजन",
  voice: "वॉइस पे",
  suspicious: "संदिग्ध गतिविधि",
  split: "बिल विभाजन",
  utilities: "यूटिलिटीज",
  banking: "बैंकिंग लेयर",
  recharge: "ऑफलाइन वॉलेट रिचार्ज",
  qr: "डायनामिक क्यूआर",
  bluetooth: "ब्लूटूथ",
  transactionId: "ट्रांजैक्शन आईडी",
  notifications: "स्मार्ट नोटिफिकेशन्स"
};

export function t(language: Language, key: string) {
  const dictionary = language === "hi" ? hi : en;
  return dictionary[key] ?? en[key] ?? key;
}
