import { ReactNode } from "react";
import { ProtectedProduct } from "@/components/protected-product";

export default function ProductLayout({ children }: { children: ReactNode }) {
  return <ProtectedProduct>{children}</ProtectedProduct>;
}

