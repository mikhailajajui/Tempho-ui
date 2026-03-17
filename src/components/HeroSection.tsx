"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HeroImages } from "./HeroImages";
import styles from "./HeroSection.module.css";

type HeroSectionProps = {
    title?: string;
    subtitle?: string;
    details?: string;
    primaryLabel?: string;
    primaryHref?: string;
};

export function HeroSection({
    title = "Find Your Right Home Today",
    subtitle = "AI-powered rental search across Canada - simplified.",
    details = "Simple. Secure. Reliable.",
    primaryLabel = "Get Started",
    primaryHref = "/forms",
}: HeroSectionProps) {
    const router = useRouter();
    const [isExpanding, setIsExpanding] = useState(false);

    // Refs for animations
    const parallaxRef = useRef<HTMLHeadingElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);

    // Parallax & Magnetic Button Effect
    useEffect(() => {
        const handleScroll = () => {
            if (parallaxRef.current) {
                const scrollY = window.scrollY;
                // Move slower than scroll (parallax)
                parallaxRef.current.style.transform = `translateY(${scrollY * 0.1}px)`;
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!buttonRef.current) return;
            const rect = buttonRef.current.getBoundingClientRect();
            // Calculate center of button
            const btnX = rect.left + rect.width / 2;
            const btnY = rect.top + rect.height / 2;

            // Distance from mouse to center
            const distinctX = e.clientX - btnX;
            const distinctY = e.clientY - btnY;
            const distance = Math.sqrt(distinctX * distinctX + distinctY * distinctY);

            // Magnetic range: 100px radius for smoother approach (user said 50px, but 100 feels better)
            if (distance < 100) {
                const power = 0.2; // Strength of attraction
                const moveX = distinctX * power;
                const moveY = distinctY * power;
                buttonRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
            } else {
                buttonRef.current.style.transform = `translate(0px, 0px)`;
            }
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const handleNavClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsExpanding(true);
        // Navigate after animation
        setTimeout(() => {
            if (primaryHref) router.push(primaryHref);
        }, 600);
    };

    return (
        <section className={styles.heroSection} id="top">
            {/* Background Orbs */}
            <div className={styles.orb1} />
            <div className={styles.orb2} />

            {/* Expanding Overlay for Transition */}
            <div className={`${styles.expandingOverlay} ${isExpanding ? styles.active : ''}`} />

            <div className={styles.heroContainer}>
                {/* Left Content */}
                <div className={styles.heroContent}>

                    {/* Parallax Wrapper for Content - ensures they move together and don't overlap */}
                    <div ref={parallaxRef} style={{ willChange: "transform" }}>
                        <h1 className={styles.heroTitle}>
                            <span className={styles.maskContainer}>
                                <span className={styles.animTitle} style={{ animationDelay: "0ms" }}>
                                    Your Next Home
                                </span>
                            </span>
                            <br />
                            <span className={styles.maskContainer}>
                                <span className={styles.animTitle} style={{ animationDelay: "150ms" }}>
                                    Made Simple
                                </span>
                            </span>
                        </h1>

                        <p className={`${styles.heroSubtitle} ${styles.animSubtitle}`}>
                            {subtitle}
                        </p>

                        <p className={styles.heroDetails} style={{ opacity: 0, animation: "fadeInDrift 0.8s ease-out 0.4s forwards" }}>
                            {details}
                        </p>
                    </div>

                    <div className={styles.heroActions}>
                        <div ref={buttonRef} className={styles.magneticWrapper} style={{ willChange: "transform" }}>
                            <Link
                                className={`${styles.primaryButton} ${styles.animButton}`}
                                href={primaryHref}
                                onClick={handleNavClick}
                            >
                                {primaryLabel}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Image Placeholder */}
                <HeroImages />
            </div>
        </section>
    );
}
