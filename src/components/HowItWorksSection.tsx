"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import Link from "next/link";
import { IconCheck } from "@tabler/icons-react";
import { motion, useMotionValue, useSpring } from "motion/react";

import { defaultSlides } from "./Landlords/constants";
import { renderWorkflowIcon } from "./Landlords/icons";
import type { PresentationSlide } from "./Landlords/types";
import styles from "./HowItWorksSection.module.css";

type HowItWorksAudience = "tenant" | "landlord";

type StepItem = {
  number: string;
  kicker?: string;
  title: string;
  description: string;
  icon: ReactNode;
};

type BenefitItem = {
  title: string;
  description: string;
};

type SectionContent = {
  eyebrow?: string;
  title: string;
  lead?: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  trustItems: string[];
  steps: StepItem[];
  benefits?: BenefitItem[];
  outcomeTitle?: string;
  outcomeDescription?: string;
};

const defaultTenantContent: SectionContent = {
  title: "How it Works",
  subtitle: "3 simple steps to your next home",
  ctaLabel: "Get Started",
  ctaHref: "/forms",
  trustItems: ["Verified listings", "Secure process", "Reliability"],
  steps: [
    {
      number: "1",
      title: "Apply",
      description: "Let our AI agent assist you in finding exactly what you need.",
      icon: (
        <img
          src="/svg/Apply.png"
          alt="Apply"
          className={styles.stepIconImage}
          loading="lazy"
          decoding="async"
        />
      ),
    },
    {
      number: "2",
      title: "Search",
      description: "Explore the right listings and schedule your viewings.",
      icon: (
        <img
          src="/svg/search.png"
          alt="Search"
          className={styles.stepIconImage}
          loading="lazy"
          decoding="async"
        />
      ),
    },
    {
      number: "3",
      title: "Settle",
      description: "Sign your lease and settle into your new home with ease.",
      icon: (
        <img
          src="/svg/move.png"
          alt="Settle"
          className={styles.stepIconImage}
          loading="lazy"
          decoding="async"
        />
      ),
    },
  ],
};

function getLandlordWorkflowSlide(): PresentationSlide | undefined {
  return defaultSlides.find((slide) => slide.variant === "workflow");
}

function getSectionContent(audience: HowItWorksAudience): SectionContent {
  if (audience !== "landlord") {
    return defaultTenantContent;
  }

  const workflowSlide = getLandlordWorkflowSlide();

  if (!workflowSlide?.workflowSteps) {
    return defaultTenantContent;
  }

  return {
    eyebrow: "Landlord workflow",
    title: "How it works",
    lead: "Three moves. One protected tenancy.",
    subtitle:
      "Tempho turns listing, protection, and approval into one clear sequence.",
    ctaLabel: "List Property",
    ctaHref: "/forms",
    trustItems: [
      "List clearly",
      "Protect early",
      "Lease cleanly",
    ],
    steps: workflowSlide.workflowSteps.map((step, index) => ({
      number: step.step,
      kicker: ["Set up", "Protect", "Close"][index],
      title:
        index === 0
          ? "List the property"
          : index === 1
            ? "Add protection"
            : "Approve and sign",
      description:
        index === 0
          ? "Publish the details tenants need to act."
          : index === 1
            ? "Activate Pensio Global before tenant approval."
            : "Confirm the tenant and move straight to lease.",
      icon: (
        <span className={styles.stepIconSvg} aria-hidden="true">
          {renderWorkflowIcon(step.icon)}
        </span>
      ),
    })),
    benefits: [
      {
        title: "Income stays steadier",
        description: "Fewer delays between listing and rent flow.",
      },
      {
        title: "Decisions get easier",
        description: "A clearer order reduces approval friction.",
      },
      {
        title: "Growth gets repeatable",
        description: "Use the same system across more units.",
      },
    ],
    outcomeTitle: "Less chasing. More clarity. Faster lease.",
    outcomeDescription:
      "A workflow that stays organized from listing to signature.",
  };
}

function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    x.set(distanceX * 0.35);
    y.set(distanceY * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
}

export function HowItWorksSection({
  audience = "tenant",
}: {
  audience?: HowItWorksAudience;
}) {
  const content = getSectionContent(audience);
  const isLandlord = audience === "landlord";

  return (
    <section
      className={`${styles.howItWorksSection} ${isLandlord ? styles.landlordSection : ""}`}
      id="how-it-works"
    >
      <div className={styles.gl2}>
        <img
          src="/GL2.png"
          alt=""
          className={styles.decorativeImg}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className={styles.gr2}>
        <img
          src="/GR2.png"
          alt=""
          className={styles.decorativeImg}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className={`${styles.container} ${isLandlord ? styles.landlordContainer : ""}`}>
        <motion.header
          className={`${styles.header} ${isLandlord ? styles.landlordHeader : ""}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        >
          {content.eyebrow ? <p className={styles.sectionEyebrow}>{content.eyebrow}</p> : null}
          <h2 className={`${styles.title} ${isLandlord ? styles.landlordTitle : ""}`}>
            {content.title}
          </h2>
          {content.lead ? <p className={styles.sectionLead}>{content.lead}</p> : null}
          <p className={`${styles.subtitle} ${isLandlord ? styles.landlordSubtitle : ""}`}>
            {content.subtitle}
          </p>
        </motion.header>

        <motion.div
          className={`${styles.stepsGrid} ${isLandlord ? styles.landlordStepsGrid : ""}`}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {content.steps.map((step, index) => (
            <motion.div
              className={`${styles.stepWrapper} ${isLandlord ? styles.landlordStepWrapper : ""}`}
              key={step.number}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
                },
              }}
            >
              <motion.article
                className={`${styles.stepCard} ${!isLandlord && index === 1 ? styles.highlightedCard : ""} ${!isLandlord && index === 2 ? styles.darkCard : ""} ${isLandlord ? styles.landlordStepCard : ""} ${isLandlord && index === 1 ? styles.landlordStepRaised : ""}`}
                animate={isLandlord ? undefined : { y: [0, -6, 0] }}
                transition={
                  isLandlord
                    ? undefined
                    : {
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.4,
                      }
                }
                whileHover={{
                  scale: isLandlord ? 1.01 : 1.03,
                  y: isLandlord ? -4 : undefined,
                  transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
                }}
              >
                <span className={styles.stepNumberInner}>{step.number}</span>
                <div className={styles.iconWrap}>{step.icon}</div>
                {step.kicker ? <p className={styles.stepKicker}>{step.kicker}</p> : null}
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </motion.article>
              {isLandlord && index < content.steps.length - 1 ? (
                <div className={styles.stepConnector} aria-hidden="true" />
              ) : null}
            </motion.div>
          ))}
        </motion.div>

        {content.benefits?.length ? (
          <motion.div
            className={styles.benefitsGrid}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {content.benefits.map((benefit, index) => (
              <article className={styles.benefitCard} key={benefit.title}>
                <span className={styles.benefitNumber}>0{index + 1}</span>
                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                <p className={styles.benefitDescription}>{benefit.description}</p>
              </article>
            ))}
          </motion.div>
        ) : null}

        {content.outcomeTitle ? (
          <motion.div
            className={styles.outcomeCard}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className={styles.outcomeEyebrow}>End state</p>
            <h3 className={styles.outcomeTitle}>{content.outcomeTitle}</h3>
            {content.outcomeDescription ? (
              <p className={styles.outcomeDescription}>{content.outcomeDescription}</p>
            ) : null}
          </motion.div>
        ) : null}

        <div className={styles.ctaWrap}>
          <Magnetic>
            <Link className={styles.ctaButton} href={content.ctaHref}>
              {content.ctaLabel}
            </Link>
          </Magnetic>
        </div>

        <motion.div
          className={`${styles.trustBar} ${isLandlord ? styles.landlordTrustBar : ""}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          {content.trustItems.map((item) => (
            <span className={styles.trustItem} key={item}>
              <IconCheck size={16} stroke={3} className={styles.trustIcon} /> {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
