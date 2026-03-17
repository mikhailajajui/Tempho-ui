import styles from './PricingPlans.module.css';

export function PricingPlans({ creditScore = 720 }: { creditScore?: number }) {
    const showPaidPlans = creditScore >= 700;

    return (
        <div className={styles.container}>
            <ul className={styles.productPlans} style={!showPaidPlans ? { justifyContent: 'center' } : {}}>
                {!showPaidPlans && (
                    <li className={`${styles.productPlan} ${styles.plan1}`}>
                        <div className={styles.header}>
                            <h2 className={styles.title}>Free</h2>
                            <div className={styles.price}>
                                <div className={styles.priceContainer}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                        <span className={styles.priceValue}>$0</span>
                                        <span className={styles.frequency}>per month</span>
                                    </div>
                                </div>
                            </div>
                            <p className={styles.planDescription}>
                                Ideal for students, newcomers and minorities.
                            </p>
                        </div>

                        <a href="https://app.tempho.ca/" className={styles.btn}>
                            Get started
                        </a>

                        <div className={styles.featuresSection}>
                            <div className={styles.divider}></div>
                            <h3 className={styles.featuresHeadline}>Free, forever</h3>
                            <ul className={styles.featuresList}>
                                <li className={styles.check}>24/7 AI support</li>
                                <li className={styles.check}>Browse listings and book for free</li>
                                <li className={styles.check}>Join waiting list</li>
                            </ul>
                        </div>
                    </li>
                )}

                {showPaidPlans && (
                    <>
                        <li className={`${styles.productPlan} ${styles.plan2}`}>
                            <div className={styles.recommendedBadge}>Limited Offer</div>
                            <div className={styles.header}>
                                <h2 className={styles.title}>Basic</h2>
                                <div className={styles.price}>
                                    <div className={styles.priceContainer}>
                                        <span className={styles.strikePrice}>$200</span>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                            <span className={styles.priceValue}>$100</span>
                                            <span className={styles.frequency}>one-time payment</span>
                                        </div>
                                    </div>
                                </div>
                                <p className={styles.planDescription}>
                                    Best for professionals and business owners.
                                </p>
                            </div>

                            <a href="https://buy.stripe.com/00weVffEB9jndR0gQaaEE00" target="_blank" className={styles.btn}>
                                Get started
                            </a>

                            <div className={styles.featuresSection}>
                                <div className={styles.divider}></div>
                                <h3 className={styles.featuresHeadline}>Professional search:</h3>
                                <ul className={styles.featuresList}>
                                    <li className={styles.check}>Shared account executive</li>
                                    <li className={styles.check}>Get matched within 7 days or full refund</li>
                                    <li className={styles.check}>Money-back guarantee</li>
                                    <li className={styles.check}>Priority access on waiting list</li>
                                </ul>
                            </div>
                        </li>

                        <li className={`${styles.productPlan} ${styles.plan3}`}>
                            <div className={styles.header}>
                                <h2 className={styles.title}>Premium</h2>
                                <div className={styles.price}>
                                    <div className={styles.priceContainer}>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                            <span className={styles.priceValue}>Contact</span>
                                            <span className={styles.frequency}>us for pricing</span>
                                        </div>
                                    </div>
                                </div>
                                <p className={styles.planDescription}>
                                    For Senior Executives and Business Owners.
                                </p>
                            </div>

                            <a href="mailto:hello@tempho.ca" className={styles.btn}>
                                Contact us
                            </a>

                            <div className={styles.featuresSection}>
                                <div className={styles.divider}></div>
                                <h3 className={styles.featuresHeadline}>Concierge service:</h3>
                                <ul className={styles.featuresList}>
                                    <li className={styles.check}>Get matched within 48 hours or full refund</li>
                                    <li className={styles.check}>Money-back guarantee</li>
                                    <li className={styles.check}>Dedicated account executive</li>
                                    <li className={styles.check}>Arranged pick up and drop-off for viewings</li>
                                </ul>
                            </div>
                        </li>
                    </>
                )}
            </ul>

            <button className={styles.compareAll}>
                View all details <span>↓</span>
            </button>

            {/* Trust Badges */}
            <div className={styles.trustBadges}>
                <div className={styles.trustItem}>
                    <span className={styles.trustIcon}>🔒</span> Secure Transactions
                </div>
                <div className={styles.trustItem}>
                    <span className={styles.trustIcon}>✓</span> Verified Listings
                </div>
            </div>
        </div>
    );
}
