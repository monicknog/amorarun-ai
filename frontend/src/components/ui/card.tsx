import type { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export function Card({ children, className = "" }: CardProps): JSX.Element {
  return <div className={`rounded-2xl border border-zinc-200 bg-white/80 ${className}`}>{children}</div>;
}