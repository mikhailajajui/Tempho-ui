"use client";

import Link from "next/link";
import styles from "./HowItWorksSection.module.css";
import {
    IconCheck
} from "@tabler/icons-react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";

const steps = [
    {
        number: "1",
        title: "Apply",
        description: "Let our AI agent assist you in finding exactly what you need.",
        icon: <img src="/svg/Apply.png" alt="Apply" className={styles.stepIconImage} loading="lazy" decoding="async" />,
    },
    {
        number: "2",
        title: "Search",
        description: "Explore the right listings and schedule your viewings.",
        icon: <img src="/svg/search.png" alt="Search" className={styles.stepIconImage} loading="lazy" decoding="async" />,
    },
    {
        number: "3",
        title: "Settle",
        description: "Sign your lease and settle into your new home with ease.",
        icon: <img src="/svg/move.png" alt="Settle" className={styles.stepIconImage} loading="lazy" decoding="async" />,
    },
];

// Magnetic Button Component
function Magnetic({ children }: { children: React.ReactNode }) {
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

export function HowItWorksSection() {
    return (
        <section className={styles.howItWorksSection} id="how-it-works">
            {/* Decorative Assets */}
            <div className={styles.gl2}>
                <img src="/GL2.png" alt="" className={styles.decorativeImg} loading="lazy" decoding="async" />
            </div>
            <div className={styles.gr2}>
                <img src="/GR2.png" alt="" className={styles.decorativeImg} loading="lazy" decoding="async" />
            </div>

            <div className={styles.container}>
                <motion.header
                    className={styles.header}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                >
                    <h2 className={styles.title}>How it Works</h2>
                    <p className={styles.subtitle}>3 simple steps to your next home</p>
                </motion.header>

                <motion.div
                    className={styles.stepsGrid}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.15,
                            }
                        }
                    }}
                >
                    {steps.map((step, index) => (
                        <motion.div
                            className={styles.stepWrapper}
                            key={step.number}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } }
                            }}
                        >
                            <motion.article
                                className={`${styles.stepCard} ${index === 1 ? styles.highlightedCard : ""} ${index === 2 ? styles.darkCard : ""}`}
                                animate={{
                                    y: [0, -6, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: index * 0.4,
                                }}
                                whileHover={{
                                    scale: 1.03,
                                    transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] }
                                }}
                            >
                                <span className={styles.stepNumberInner}>{step.number}</span>
                                <div className={styles.iconWrap}>{step.icon}</div>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepDescription}>{step.description}</p>
                            </motion.article>
                        </motion.div>
                    ))}
                </motion.div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Magnetic>
                        <Link className={styles.ctaButton} href="/forms">
                            Get Started
                        </Link>
                    </Magnetic>
                </div>

                <motion.div
                    className={styles.trustBar}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                >
                    <span className={styles.trustItem}>
                        <IconCheck size={16} stroke={3} className={styles.trustIcon} /> Verified listings
                    </span>
                    <span className={styles.trustItem}>
                        <IconCheck size={16} stroke={3} className={styles.trustIcon} /> Secure process
                    </span>
                    <span className={styles.trustItem}>
                        <IconCheck size={16} stroke={3} className={styles.trustIcon} /> Reliability
                    </span>
                </motion.div>
            </div>
        </section>
    );
}
