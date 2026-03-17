import { useState, useEffect } from "react";
import styles from "./HeroImages.module.css";

export function HeroImages() {
    const [loadedCount, setLoadedCount] = useState(0);
    const [isFallbackReady, setIsFallbackReady] = useState(false);

    const criticalImages = ["/hero-images/p1-ic.webp", "/hero-images/p2-ic.webp", "/hero-images/p3-ic.webp"];

    // Once the 3 primary images are loaded, or the fallback timer hits
    const isReady = isFallbackReady || loadedCount >= criticalImages.length;

    useEffect(() => {
        // Fallback timer: if images take too long to report 'load', show them anyway after 2s
        const timer = setTimeout(() => {
            setIsFallbackReady(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`${styles.heroImageWrapper} ${isReady ? styles.ready : ""}`}>
            <div className={styles.pl2}></div>
            <div className={styles.pl1}></div>
            <div className={styles.pl3}></div>

            {/* Decorative Assets */}
            <div className={styles.gl1}>
                <img src="/GL2.png" alt="Decorative Left" className={styles.decorativeImg} loading="lazy" decoding="async" />
            </div>
            <div className={styles.gr1}>
                <img src="/GR2.png" alt="Decorative Right" className={styles.decorativeImg} loading="lazy" decoding="async" />
            </div>

            {/* Hidden Preloader with Event Tracking (Using standard <img> for reliable onLoad) */}
            <div style={{ position: 'absolute', width: 0, height: 0, opacity: 0, overflow: 'hidden' }} aria-hidden="true">
                {criticalImages.map((src) => (
                    <img
                        key={src}
                        src={src}
                        alt=""
                        onLoad={() => setLoadedCount(prev => prev + 1)}
                        onError={() => setLoadedCount(prev => prev + 1)} // Count errors as ready to avoid blocking UI
                    />
                ))}
            </div>
        </div>
    );
}
