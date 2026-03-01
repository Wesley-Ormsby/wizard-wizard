import type { ReactNode } from "react";
import "./Details.css";
import { ChevronDown } from "lucide-react";

interface CardProps {
  summary: string;
  open?: boolean;
  children: ReactNode;
}
export function Details({ summary, open = false, children }: CardProps) {
  return (
    <details className="detail-component" open={open}>
      <summary><span>{summary}</span><ChevronDown aria-hidden></ChevronDown></summary>
      <div className="detail-dropdown">{children}</div>
    </details>
  );
}
