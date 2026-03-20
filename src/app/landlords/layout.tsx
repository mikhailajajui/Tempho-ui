import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Landlords | Tempho",
  description: "List your property and find quality tenants with guaranteed rent insurance.",
};

type LandlordsLayoutProps = {
  children: React.ReactNode;
};

export default function LandlordsLayout({ children }: LandlordsLayoutProps) {
  return (
    <div className="min-h-dvh w-full overflow-x-hidden">
      {children}
    </div>
  );
}
