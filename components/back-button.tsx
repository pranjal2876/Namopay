"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";

export function BackButton({ fallback = "/dashboard" }: { fallback?: Route }) {
  const router = useRouter();

  return (
    <button
      className="ghost back-button"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
          return;
        }
        router.push(fallback);
      }}
    >
      Back
    </button>
  );
}
