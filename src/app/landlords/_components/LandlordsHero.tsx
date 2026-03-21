import { LandlordPresentationV2 } from "../../../components/Landlords/LandlordPresentationV2";
import { LandlordsBelowFoldSections } from "./LandlordsBelowFoldSections";
import { landlordHeroContent } from "../content";

export function LandlordsHero() {
  return (
    <LandlordPresentationV2
      ctaLabel={landlordHeroContent.ctaLabel}
      ctaHref={landlordHeroContent.ctaHref}
      videoSrc={landlordHeroContent.videoSrc}
      videoPoster={landlordHeroContent.videoPoster}
      slides={[...landlordHeroContent.slides]}
    >
      <LandlordsBelowFoldSections />
    </LandlordPresentationV2>
  );
}
