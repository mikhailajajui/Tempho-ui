"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./NavSection.module.css";

type NavLink = {
    label: string;
    href: string;
};

type NavSectionProps = {
    logoSrc?: string;
    links?: NavLink[];
    ctaLabel?: string;
    ctaHref?: string;
};

export function NavSection({
    logoSrc = "/tempho-logo.png",
    links = [
        { label: "How It Works", href: "#how-it-works" },
        { label: "Why Tempo", href: "#why-tempo" },
        { label: "Collaborators", href: "#collaborators" },
        { label: "Testimonials", href: "#testimonials" },
    ],
    ctaLabel = "Get Started",
    ctaHref = "/forms",
}: NavSectionProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Close menu when a link is clicked
    const closeMenu = () => setIsMenuOpen(false);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    return (
        <header className={styles.navSection}>
            <div className={styles.navInner}>
                <a className={styles.brand} href="#top" onClick={closeMenu}>
                    <img src={logoSrc} alt="TempHo Logo" />
                </a>

                <button
                    className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <nav className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`} aria-label="Primary">
                    {links.map((link, index) => (
                        <a
                            key={link.href}
                            className={styles.navLink}
                            href={link.href}
                            onClick={closeMenu}
                            style={{ transitionDelay: isMenuOpen ? `${0.1 + index * 0.1}s` : '0s' }}
                        >
                            {link.label}
                        </a>
                    ))}
                    <Link
                        className={`${styles.navCta} ${styles.mobileCta}`}
                        href={ctaHref}
                        onClick={closeMenu}
                        style={{ transitionDelay: isMenuOpen ? `${0.1 + links.length * 0.1}s` : '0s' }}
                    >
                        {ctaLabel}
                    </Link>
                </nav>

                <Link className={`${styles.navCta} ${styles.desktopCta}`} href={ctaHref}>
                    {ctaLabel}
                </Link>
            </div>
            {/* Overlay for mobile menu */}
            {isMenuOpen && <div className={styles.overlay} onClick={closeMenu} />}
        </header>
    );
}
