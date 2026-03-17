import Link from "next/link";
import styles from "./GetMatchedSection.module.css";

type GetMatchedSectionProps = {
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
};

export function GetMatchedSection({
    title = "Find Your Right Home",
    subtitle = "Best platform for newcomers looking for their next home",
    ctaLabel = "Get Started",
    ctaHref = "/forms",
}: GetMatchedSectionProps) {
    return (
        <section className={styles.getMatchedSection} id="get-matched">
            <div className={styles.container}>
                <h2 className={styles.title}>
                    {title.split("\n").map((line, index) => (
                        <span className={styles.titleLine} key={line + index}>
                            {line}
                        </span>
                    ))}
                </h2>
                <p className={styles.subtitle}>{subtitle}</p>
                <Link className={styles.ctaButton} href={ctaHref}>
                    {ctaLabel}
                </Link>
            </div>
        </section>
    );
}
