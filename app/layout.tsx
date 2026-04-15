import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NamoPay",
  description:
    "NamoPay is a next-gen hybrid payment platform blending online UPI flows, offline wallet intelligence, AI insights, rewards, and merchant tooling."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

