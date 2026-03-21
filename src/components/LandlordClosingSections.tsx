"use client";

import { useId, useState } from "react";
import Link from "next/link";
import {
  landlordClosingContent,
  landlordClosingFaqs,
} from "../app/landlords/content";
import styles from "./LandlordClosingSections.module.css";

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

type CtaButtonProps = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

function CtaButton({ href, label, variant = "primary" }: CtaButtonProps) {
  const className =
    variant === "primary" ? styles.primaryButton : styles.secondaryButton;

  if (isExternalHref(href)) {
    return (
      <a
        className={className}
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        {label}
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {label}
    </Link>
  );
}

export function LandlordClosingSections() {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const faqId = useId();

  return (
    <section className={styles.sectionShell} aria-label="Landlord closing steps">
      <div className={styles.container}>
        <section className={styles.faqSection} id="landlord-faq">
          <div className={styles.sectionHeader}>
            <p className="ll-eyebrow-bar">{landlordClosingContent.faq.eyebrow}</p>
            <h2 className="ll-headline">{landlordClosingContent.faq.title}</h2>
            <p className="ll-intro">{landlordClosingContent.faq.intro}</p>
          </div>

          <div className={styles.faqList}>
            {landlordClosingFaqs.map((item, index) => {
              const isOpen = openIndex === index;
              const panelId = `${faqId}-panel-${index}`;
              const buttonId = `${faqId}-button-${index}`;

              return (
                <article
                  key={item.question}
                  className={`${styles.faqCard} ${isOpen ? styles.faqCardOpen : ""}`}
                >
                  <button
                    id={buttonId}
                    type="button"
                    className={styles.faqButton}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  >
                    <span className={styles.faqNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.faqQuestion}>{item.question}</span>
                    <span className={styles.faqIcon} aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={styles.faqAnswerWrap}
                    hidden={!isOpen}
                  >
                    <p className={styles.faqAnswer}>{item.answer}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.dualSection} id="book-photo-or-start-listing">
          <div className={`${styles.dualPanel} ${styles.dualCopy}`}>
            <p className="ll-eyebrow-bar">
              {landlordClosingContent.dualCta.eyebrow}
            </p>
            <h3 className="ll-headline">{landlordClosingContent.dualCta.title}</h3>
            <p className="ll-intro">{landlordClosingContent.dualCta.description}</p>
          </div>

          <div className={`${styles.dualPanel} ${styles.dualActions}`}>
            <div className={styles.actionCard}>
              <span className="ll-pill">Listing path</span>
              <h4 className={styles.actionTitle}>Move straight into the form.</h4>
              <p className={styles.actionText}>
                Best when the property details are ready and you want the listing
                process underway now.
              </p>
              <CtaButton
                href={landlordClosingContent.dualCta.listingHref}
                label={landlordClosingContent.dualCta.listingLabel}
              />
            </div>

            <div className={`${styles.actionCard} ${styles.actionCardAccent}`}>
              <span className="ll-pill">Photo path</span>
              <h4 className={styles.actionTitle}>Reserve the visual asset first.</h4>
              <p className={styles.actionText}>
                Best when you want to claim the photography offer and line up the
                marketing visuals before launch.
              </p>
              <CtaButton
                href={landlordClosingContent.dualCta.photoHref}
                label={landlordClosingContent.dualCta.photoLabel}
                variant="secondary"
              />
            </div>
          </div>
        </section>

        <section className={styles.offerSection} id="claim-free-photo">
          <div className={styles.offerCard}>
            <div className={styles.offerContent}>
              <p className="ll-eyebrow-bar">
                {landlordClosingContent.offer.eyebrow}
              </p>
              <h3 className="ll-headline">{landlordClosingContent.offer.title}</h3>
              <p className="ll-intro">{landlordClosingContent.offer.description}</p>
              <div className={styles.offerPoints}>
                {landlordClosingContent.offer.supportingPoints.map((point) => (
                  <span key={point} className={styles.offerPoint}>
                    <span className="ll-bullet" aria-hidden="true" />
                    {point}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.offerAction}>
              <CtaButton
                href={landlordClosingContent.offer.ctaHref}
                label={landlordClosingContent.offer.ctaLabel}
                variant="secondary"
              />
            </div>
          </div>
        </section>

        <section className={styles.urgencySection} id="list-property-now">
          <div className={styles.urgencyCard}>
            <span className={styles.urgencyBadge}>
              {landlordClosingContent.urgency.badge}
            </span>
            <div className={styles.urgencyCopy}>
              <p className="ll-eyebrow">{landlordClosingContent.urgency.eyebrow}</p>
              <h3 className="ll-headline">{landlordClosingContent.urgency.title}</h3>
              <p className="ll-intro">{landlordClosingContent.urgency.description}</p>
            </div>
            <CtaButton
              href={landlordClosingContent.urgency.ctaHref}
              label={landlordClosingContent.urgency.ctaLabel}
            />
          </div>
        </section>
      </div>
    </section>
  );
}
