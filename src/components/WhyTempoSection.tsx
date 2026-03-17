"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./WhyTempoSection.module.css";

const highlights = [
    {
        title: "AI-Powered Assistance",
        description:
            "We analyze your budget, location, and preferences to surface the best-fit rentals.",
    },
    {
        title: "Trusted Across Canada",
        description:
            "Over 1,000 renters served with support from public and community partners.",
    },
    {
        title: "Thorough Verification",
        description: "We ensure all listings are vetted for your safety and peace of mind.",
    },
    {
        title: "Quality Selection",
        description:
            "Access a curated list of properties that meet our high standards.",
    },
];

export function WhyTempoSection() {
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        const handleScroll = () => {
            if (!sectionRef.current || !containerRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Calculate progress through the viewport (0 at bottom, 1 at top)
            const scrollProgress = 1 - (rect.top + rect.height) / (viewportHeight + rect.height);
            const clampedProgress = Math.min(Math.max(scrollProgress, 0), 1);

            // Apply 40px movement range based on scroll
            const offset = (clampedProgress - 0.5) * 60;
            containerRef.current.style.setProperty("--scroll-offset", `${offset}px`);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => {
            if (sectionRef.current) observer.unobserve(sectionRef.current);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className={`${styles.whyTempoSection} ${isVisible ? styles.animateIn : ""}`}
            id="why-tempo"
        >
            <div className={styles.container} ref={containerRef}>
                <div className={styles.mediaCard}>
                    <div className={styles.photoPlaceholder}></div>
                </div>

                <div className={styles.content}>
                    <h2 className={styles.title}>Why Tempho</h2>
                    <ul className={styles.list}>
                        {highlights.map((item, index) => (
                            <li
                                className={`${styles.listItem} ${hoveredIndex !== null && hoveredIndex !== index ? styles.dimmed : ""}`}
                                key={item.title}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                style={{ transitionDelay: `${200 + index * 150}ms` } as React.CSSProperties}
                            >
                                <span className={styles.checkIcon} aria-hidden="true">
                                    <img src="/checkmark.svg" alt="" className={styles.checkSvg} />
                                </span>
                                <div className={styles.itemTextContent}>
                                    <p className={styles.itemTitle}>{item.title}</p>
                                    <p className={styles.itemDescription}>{item.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
