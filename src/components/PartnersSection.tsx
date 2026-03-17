import styles from "./PartnersSection.module.css";

const logos = [
    "/LOGO CAROUSLE/1.png",
    "/LOGO CAROUSLE/2.png",
    "/LOGO CAROUSLE/3.png",
    "/LOGO CAROUSLE/4.png",
    "/LOGO CAROUSLE/5.png",
    "/LOGO CAROUSLE/6.png",
    "/LOGO CAROUSLE/7.png",
    "/LOGO CAROUSLE/8.png",
    "/LOGO CAROUSLE/10.png",
];

export function PartnersSection() {
    return (
        <section className={styles.partnersSection} id="collaborators">
            <div className={styles.container}>
                <header className={styles.header}>
                    <p className={styles.eyebrow}>Our Trusted Collaborators</p>
                    <h2 className={styles.title}>Collaborators</h2>
                    <p className={styles.subtitle}>
                        Proudly working with leading organizations to serve our community
                    </p>
                </header>

                <div className={styles.carousel}>
                    <div className={`${styles.row} ${styles.rowOne}`}>
                        <div className={styles.track}>
                            {[...logos, ...logos].map((src, index) => (
                                <div className={styles.logoCard} key={`logo-${src}-${index}`}>
                                    <img className={styles.logoImage} src={src} alt="" loading="lazy" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
