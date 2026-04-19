import Link from "next/link";
import type { Route } from "next";
import { ReactNode } from "react";

export function RouteCard({
  href,
  eyebrow,
  title,
  description,
  children
}: {
  href: Route;
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <Link href={href} className="route-card">
      <p className="eyebrow">{eyebrow}</p>
      <h3>{title}</h3>
      <p className="subtle">{description}</p>
      {children}
      <span className="route-arrow">Open</span>
    </Link>
  );
}
