import Link from "next/link";
import styles from "./FooterImageSection.module.css";

export function FooterImageSection() {
    return (
        <section className={styles.footerImageSection} aria-label="Footer image">
            <div className={styles.footerOverlay} aria-hidden="true" />
            <div className={styles.footerCard}>
                <div className={styles.brandRow}>
                    <img className={styles.footerLogo} src="/tempho-logo.png" alt="TempHo Logo" loading="lazy" decoding="async" />
                    <div className={styles.addressRow}>
                        <span className={styles.pin} aria-hidden="true">•</span>
                        <span>8 Nelson Street West, L6X 1B7, Brampton Ontario</span>
                    </div>
                </div>
                <div className={styles.divider} />
                <div className={styles.linksGrid}>
                    <div>
                        <h3 className={styles.columnTitle}>Quick Links</h3>
                        <Link href="/forms" className={styles.linkItem} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', display: 'block', textDecoration: 'none' }}>
                            <p className={styles.linkItem}>Apply Now</p>
                        </Link>
                        <Link href="/forms" className={styles.linkItem} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', display: 'block', textDecoration: 'none' }}>
                            <p className={styles.linkItem}>Visit TempHo</p>
                        </Link>
                    </div>
                    <div>
                        <h3 className={styles.columnTitle}>LEGAL</h3>
                        <p className={styles.linkItem}>Terms &amp; Conditions</p>
                        <p className={styles.linkItem}>Privacy Policy</p>
                        <p className={styles.linkItem}>Cookie Policy</p>
                    </div>
                    <div>
                        <h3 className={styles.columnTitle}>SOCIAL MEDIA</h3>
                        <div className={styles.socialRow}>
                            <a href="https://www.instagram.com/tempho_inc/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <img src="/social media/instagram.png" alt="Instagram" className={styles.socialIcon} />
                            </a>
                            <a href="https://www.linkedin.com/company/tempho-inc/?originalSubdomain=calinke" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                <img src="/social media/linkedin.png" alt="LinkedIn" className={styles.socialIcon} />
                            </a>
                            <a href="https://www.facebook.com/p/TempHo-61555267181243/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <img src="/social media/facebook.png" alt="Facebook" className={styles.socialIcon} />
                            </a>
                            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                                <img src="/social media/tik tok.png" alt="TikTok" className={styles.socialIcon} />
                            </a>
                        </div>
                    </div>
                </div>
                <p className={styles.footerNote}>
                    2025 TempHo. All rights reserved. | Collaboration with Peel Region, Salvation Army, Rest Centers, Polycultural, Algoma University
                    Proudly supported by City of Brampton BHive and TBDC
                </p>
            </div>
        </section>
    );
}
