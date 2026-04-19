import { ReactNode } from "react";
import { NamoPayShell } from "@/components/namopay-shell";

export default function ProductLayout({ children }: { children: ReactNode }) {
  return <NamoPayShell>{children}</NamoPayShell>;
}

