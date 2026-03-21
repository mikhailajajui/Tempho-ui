import type { ReactNode } from "react";

type SupportIcon = "screening" | "legal" | "rent" | "management";
type WorkflowIcon = "listing" | "agreement" | "lease";

export function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l7 3.2v5.4c0 4.4-2.6 8.4-7 10.4-4.4-2-7-6-7-10.4V6.2L12 3z" />
      <path d="M9 12.2l2 2 4-4.2" />
    </svg>
  );
}

export function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 2L5 14h5l-1 8 8-12h-5l1-8z" />
    </svg>
  );
}

export function HomeShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 10.8L12 4l8.5 6.8" />
      <path d="M5.5 9.8V19.5h13V9.8" />
      <path d="M8.2 13h4.3" />
      <path d="M8.2 15.8h3.1" />
      <path d="M14.4 12.2l1.5 1.5 2.8-2.9" />
    </svg>
  );
}

export function AgreementDocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7.5 3.5z" />
      <path d="M14 3.5V8h4" />
      <path d="M8.5 11h7" />
      <path d="M8.5 13.8h5.5" />
      <path d="M9.2 17l1.5 1.5 3-3.2" />
    </svg>
  );
}

export function LeaseSignatureIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.5 4.5h8l3 3V18a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 6.5 18z" />
      <path d="M14.5 4.5v3h3" />
      <path d="M8.7 10.3h6.3" />
      <path d="M8.7 13.1h4.4" />
      <path d="M8.4 16.7c1.2-1.7 2.1-2.4 2.9-2.4.7 0 1.1.6 1.7 1.2.5.5.9.9 1.5.9.5 0 1-.2 1.5-.7" />
      <path d="M14.8 18.2l2.7-2.7" />
      <path d="M17.9 14.9l1.3 1.3" />
    </svg>
  );
}

export function ScaleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4v16" />
      <path d="M7 7h10" />
      <path d="M5 7l-2.5 4.5a2.7 2.7 0 0 0 5 0L5 7z" />
      <path d="M19 7l-2.5 4.5a2.7 2.7 0 0 0 5 0L19 7z" />
      <path d="M8 20h8" />
    </svg>
  );
}

export function CheckBadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l7 4v5c0 4.5-2.8 8.5-7 10-4.2-1.5-7-5.5-7-10V7l7-4z" />
      <path d="M8.8 12.1l2.1 2.1 4.5-4.5" />
    </svg>
  );
}

export function UserCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15.5 19.5a6.7 6.7 0 0 0-11 0" />
      <circle cx="10" cy="8" r="3.2" />
      <path d="M17 10.8l1.8 1.8 3.2-3.4" />
    </svg>
  );
}

export function GavelIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.5 4.5l5 5" />
      <path d="M12 7l5 5" />
      <path d="M4.5 19.5l8-8" />
      <path d="M3 21h8" />
      <path d="M11 3l3 3-2.5 2.5-3-3z" />
      <path d="M16 8l3 3-2.5 2.5-3-3z" />
    </svg>
  );
}

export function WalletFlowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v1.5" />
      <path d="M4 8.5h14a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 16.5z" />
      <path d="M15 13h5" />
      <path d="M7 12h3" />
      <path d="M8.5 10.5L7 12l1.5 1.5" />
    </svg>
  );
}

export function ConversationShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 16.5A3.5 3.5 0 0 1 1.5 13V7A3.5 3.5 0 0 1 5 3.5h8A3.5 3.5 0 0 1 16.5 7v2.5" />
      <path d="M5 16.5V20l3.2-2.4" />
      <path d="M18 12l4 1.8v3c0 2.5-1.5 4.7-4 5.7-2.5-1-4-3.2-4-5.7v-3z" />
      <path d="M16.6 16.6l1 1 1.8-1.9" />
    </svg>
  );
}

export function renderSupportIcon(icon?: SupportIcon): ReactNode {
  if (icon === "screening") return <UserCheckIcon />;
  if (icon === "legal") return <GavelIcon />;
  if (icon === "rent") return <WalletFlowIcon />;
  if (icon === "management") return <ConversationShieldIcon />;
  return <CheckBadgeIcon />;
}

export function renderWorkflowIcon(icon?: WorkflowIcon): ReactNode {
  if (icon === "listing") return <HomeShieldIcon />;
  if (icon === "agreement") return <AgreementDocumentIcon />;
  if (icon === "lease") return <LeaseSignatureIcon />;
  return <BoltIcon />;
}

export function renderPackageIcon(index: number): ReactNode {
  if (index === 0) return <ScaleIcon />;
  if (index === 1) return <ShieldIcon />;
  return <BoltIcon />;
}
