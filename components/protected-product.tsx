"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NamoPayShell } from "@/components/namopay-shell";
import { useNamoPay } from "@/components/namopay-provider";

export function ProtectedProduct({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { authReady, currentUser } = useNamoPay();

  useEffect(() => {
    if (authReady && !currentUser) {
      router.replace("/");
    }
  }, [authReady, currentUser, router]);

  if (!authReady || !currentUser) {
    return null;
  }

  return <NamoPayShell>{children}</NamoPayShell>;
}
