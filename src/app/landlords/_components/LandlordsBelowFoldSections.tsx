import dynamic from "next/dynamic";
import { ScrollSnapSection } from "../../../components/Landlords/ScrollSnapSection";
import { landlordHeroContent } from "../content";

const HowItWorksSection = dynamic(
  () =>
    import("../../../components/HowItWorksSection").then(
      (mod) => mod.HowItWorksSection
    ),
  { ssr: true }
);

const FooterImageSection = dynamic(
  () =>
    import("../../../components/FooterImageSection").then(
      (mod) => mod.FooterImageSection
    ),
  { ssr: true }
);

const LandlordClosingSections = dynamic(
  () =>
    import("../../../components/LandlordClosingSections").then(
      (mod) => mod.LandlordClosingSections
    ),
  { ssr: true }
);

const belowFoldSections = [
  {
    id: "how-it-works",
    Component: () => <HowItWorksSection audience="landlord" />,
  },
  { id: "landlord-closing", Component: LandlordClosingSections },
  { id: "footer", Component: FooterImageSection },
] as const;

export function LandlordsBelowFoldSections() {
  return belowFoldSections.map(({ id, Component }, offset) => (
    <ScrollSnapSection
      key={id}
      index={landlordHeroContent.belowFoldStart + offset}
      background="bg-white"
    >
      <div className="w-full">
        <Component />
      </div>
    </ScrollSnapSection>
  ));
}
