"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import styles from "./pricing.module.css";
import { PricingPlans } from "@/components/PricingPlans";

const GOOGLE_MAPS_LIBRARIES: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"];
const CREDIT_SCORE_MIN = 300;
const CREDIT_SCORE_MAX = 850;

export default function PricingPage() {
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [lowScoreThankYou, setLowScoreThankYou] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [submissionId, setSubmissionId] = useState("");
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const router = useRouter();

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: GOOGLE_MAPS_LIBRARIES,
    });

    const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    const onPlaceChanged = () => {
        if (autocompleteRef.current !== null) {
            const place = autocompleteRef.current.getPlace();
            if (place.formatted_address) {
                setLocation(place.formatted_address);
            } else if (place.name) {
                setLocation(place.name);
            }
        }
    };

    // Step 1 State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("");
    const [occupants, setOccupants] = useState(1);
    const [rooms, setRooms] = useState(1);

    // Step 2 State
    const [location, setLocation] = useState("");
    const [moveInDate, setMoveInDate] = useState("");
    const [budget, setBudget] = useState("");
    const [monthlyHouseholdIncome, setMonthlyHouseholdIncome] = useState("");
    const [parking, setParking] = useState("");
    const [accommodationType, setAccommodationType] = useState("Basement");

    // Step 3 State
    const [creditScore, setCreditScore] = useState<number | null>(null);
    const [creditScoreInteracted, setCreditScoreInteracted] = useState(false);
    const [showCreditHint, setShowCreditHint] = useState(false);
    const [pulseSlider, setPulseSlider] = useState(false);
    const [showSliderNudge, setShowSliderNudge] = useState(false);
    const [hasShownSliderNudge, setHasShownSliderNudge] = useState(false);

    useEffect(() => {
        if (currentStep === 3 && !hasShownSliderNudge) {
            setShowSliderNudge(true);
            setHasShownSliderNudge(true);

            const timer = window.setTimeout(() => {
                setShowSliderNudge(false);
            }, 420);

            return () => window.clearTimeout(timer);
        }
    }, [currentStep, hasShownSliderNudge]);

    useEffect(() => {
        if (!pulseSlider) return;
        const timer = window.setTimeout(() => setPulseSlider(false), 380);
        return () => window.clearTimeout(timer);
    }, [pulseSlider]);

    // Load state from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem('tempho_pricing_form');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.submissionId) setSubmissionId(parsed.submissionId);
                if (parsed.name) setName(parsed.name);
                if (parsed.email) setEmail(parsed.email);
                if (parsed.phone) setPhone(parsed.phone);
                if (parsed.gender) setGender(parsed.gender);
                if (parsed.occupants) setOccupants(parsed.occupants);
                if (parsed.rooms) setRooms(parsed.rooms);
                if (parsed.location) setLocation(parsed.location);
                if (parsed.moveInDate) setMoveInDate(parsed.moveInDate);
                if (parsed.budget) setBudget(parsed.budget);
                if (parsed.monthlyHouseholdIncome) setMonthlyHouseholdIncome(parsed.monthlyHouseholdIncome);
                if (parsed.parking) setParking(parsed.parking);
                if (parsed.accommodationType) setAccommodationType(parsed.accommodationType);
                if (parsed.creditScoreInteracted === true && typeof parsed.creditScore === "number") {
                    setCreditScore(parsed.creditScore);
                    setCreditScoreInteracted(true);
                } else {
                    setCreditScore(null);
                    setCreditScoreInteracted(false);
                }
                if (parsed.currentStep) setCurrentStep(parsed.currentStep);
            } catch (e) {
                console.error("Failed to load form data", e);
            }
        }

        // Ensure a stable submission id exists for incremental updates
        const existingId = savedData ? (() => {
            try {
                const parsed = JSON.parse(savedData);
                return parsed.submissionId;
            } catch {
                return null;
            }
        })() : null;

        if (!existingId) {
            const newId = (typeof crypto !== "undefined" && "randomUUID" in crypto)
                ? crypto.randomUUID()
                : `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
            setSubmissionId(newId);
            localStorage.setItem('tempho_pricing_form', JSON.stringify({
                ...(savedData ? JSON.parse(savedData) : {}),
                submissionId: newId
            }));
        }
    }, []);

    // Save state to localStorage on change
    useEffect(() => {
        const dataToSave = {
            submissionId,
            name, email, phone, gender, occupants, rooms,
            location, moveInDate, budget, monthlyHouseholdIncome, parking, accommodationType,
            creditScore, creditScoreInteracted, currentStep
        };
        localStorage.setItem('tempho_pricing_form', JSON.stringify(dataToSave));
    }, [submissionId, name, email, phone, gender, occupants, rooms, location, moveInDate, budget, monthlyHouseholdIncome, parking, accommodationType, creditScore, creditScoreInteracted, currentStep]);

    const ensureSubmissionId = () => {
        let id = submissionId;
        if (!id) {
            id = (typeof crypto !== "undefined" && "randomUUID" in crypto)
                ? crypto.randomUUID()
                : `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
            setSubmissionId(id);
            const savedData = localStorage.getItem('tempho_pricing_form');
            const parsed = savedData ? (() => {
                try { return JSON.parse(savedData); } catch { return {}; }
            })() : {};
            localStorage.setItem('tempho_pricing_form', JSON.stringify({
                ...parsed,
                submissionId: id
            }));
        }
        return id;
    };

    const submitToSheets = async (step: number, id: string) => {
        const payload = new URLSearchParams({
            submissionId: id,
            name,
            email,
            phone,
            gender,
            occupants: String(occupants),
            rooms: String(rooms),
            location,
            moveInDate,
            budget,
            monthlyHouseholdIncome,
            parking,
            accommodationType,
            creditScore: creditScore === null ? "" : String(creditScore),
            currentStep: String(step),
            updatedAt: new Date().toISOString(),
        });

        const response = await fetch(
            "api/forms",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                },
                body: payload.toString(),
            }
        );

        if (!response.ok) {
            const body = await response.text().catch(() => "");
            console.warn("Sheets proxy failed", response.status, body);
            return;
        }
    };

    const triggerCreditGuardrailFeedback = () => {
        if (creditScoreInteracted) return;
        setShowCreditHint(true);
        setPulseSlider(false);
        window.requestAnimationFrame(() => setPulseSlider(true));
    };

    const handleCreditScoreChange = (value: number) => {
        setCreditScore(value);
        setCreditScoreInteracted(true);
        setShowCreditHint(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (currentStep === 1) {
            const id = ensureSubmissionId();
            // Fire and forget - don't await
            submitToSheets(1, id).catch(err =>
                console.error("Failed to submit step 1 to Google Sheets", err)
            );

            setCurrentStep(2);
            window.scrollTo(0, 0);
        } else if (currentStep === 2) {
            const id = ensureSubmissionId();
            // Fire and forget - don't await
            submitToSheets(2, id).catch(err =>
                console.error("Failed to submit step 2 to Google Sheets", err)
            );

            setCurrentStep(3);
            window.scrollTo(0, 0);
        } else {
            if (!creditScoreInteracted || creditScore === null) {
                triggerCreditGuardrailFeedback();
                return;
            }

            const id = ensureSubmissionId();
            // Fire and forget - don't await
            submitToSheets(3, id).catch(err =>
                console.error("Failed to submit step 3 to Google Sheets", err)
            );

            if (creditScore < 700) {
                setLowScoreThankYou(true);
                setTimeout(() => {
                    router.push("/");
                }, 3000);
                return;
            }

            setFormSubmitted(true);
            // Optional: Scroll to top of plans on mobile
            if (window.innerWidth <= 1024) {
                const rightPanel = document.querySelector(`.${styles.rightPanel}`);
                rightPanel?.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <div className={styles.pricingPage} data-submitted={formSubmitted}>
            {/* Left Panel: Application Form */}
            <div className={styles.leftPanel}>
                <div className={styles.logoContainer}>
                    <img src="/tempho-logo.png" alt="Tempho" className={styles.logo} />
                </div>
                <div className={styles.progressContainer}>
                    <div className={styles.stepIndicator}>Step {currentStep} of 3: {currentStep === 1 ? 'About You' : currentStep === 2 ? 'Tell Us More' : 'Financials'}</div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: currentStep === 1 ? '33%' : currentStep === 2 ? '66%' : '100%' }}></div>
                    </div>
                </div>

                {lowScoreThankYou ? (
                    <div className={styles.thankYou}>
                        <h1 className={styles.formTitle}>Thanks for applying</h1>
                        <p className={styles.formSubtitle}>
                            We have received your application. You will be redirected to the home page shortly.
                        </p>
                        <Link href="/" className={styles.backLink}>Go to Home now</Link>
                    </div>
                ) : (
                    <>
                        <div className={styles.formHeader}>
                            <h1 className={styles.formTitle}>{currentStep === 1 ? "Let's Get Started!" : currentStep === 2 ? "Tell Us More" : "One Last Thing"}</h1>
                        </div>

                        <form className={styles.applicationForm} onSubmit={handleSubmit}>
                            <div className={styles.formBody}>
                                {currentStep === 1 && (
                                    <>
                                {/* Full Name */}
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel} htmlFor="name">Full Name *</label>
                                    <div className={styles.inputWrapper}>
                                        <div className={styles.inputIcon}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="12" cy="7" r="4"></circle>
                                            </svg>
                                        </div>
                                        <input
                                            className={styles.modernInput}
                                            type="text"
                                            id="name"
                                            placeholder="Jane Doe"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel} htmlFor="email">Email Address *</label>
                                    <div className={styles.inputWrapper}>
                                        <div className={styles.inputIcon}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                <polyline points="22,6 12,13 2,6"></polyline>
                                            </svg>
                                        </div>
                                        <input
                                            className={styles.modernInput}
                                            type="email"
                                            id="email"
                                            placeholder="jane.doe@email.com"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel} htmlFor="phone">Phone Number *</label>
                                    <div className={styles.inputWrapper}>
                                        <div className={styles.inputIcon}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                            </svg>
                                        </div>
                                        <input
                                            className={styles.modernInput}
                                            type="tel"
                                            id="phone"
                                            placeholder="+1 (555) 123-467"
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Gender Segmented Control */}
                                <div className={styles.fieldGroup}>
                                    <label className={styles.groupLabel}>Gender *</label>
                                    <div className={styles.segmentedControl}>
                                        {['Female', 'Male', 'Prefer not to say'].map((g) => (
                                            <button
                                                key={g}
                                                type="button"
                                                className={`${styles.segmentBtn} ${gender === g ? styles.active : ''}`}
                                                onClick={() => setGender(g)}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Occupants Stepper */}
                                <div className={styles.fieldGroup}>
                                    <label className={styles.groupLabel}>Number of Occupants *</label>
                                    <div className={styles.stepper}>
                                        <button type="button" className={styles.stepBtn} onClick={() => setOccupants(Math.max(1, occupants - 1))}>−</button>
                                        <span className={styles.stepValue}>{occupants}</span>
                                        <button type="button" className={styles.stepBtn} onClick={() => setOccupants(Math.min(10, occupants + 1))}>+</button>
                                    </div>
                                </div>
                            </>
                        )}

                                {currentStep === 2 && (
                                    <>
                                {/* Location Preferences */}
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel} htmlFor="location">Where do you want to be close to? *</label>
                                    <div className={styles.inputWrapper}>
                                        <div className={styles.inputIcon}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                <circle cx="12" cy="10" r="3"></circle>
                                            </svg>
                                        </div>
                                        {isLoaded ? (
                                            <div className={styles.inputWrapperInternal}>
                                                <Autocomplete
                                                    onLoad={onLoad}
                                                    onPlaceChanged={onPlaceChanged}
                                                >
                                                    <input
                                                        className={styles.modernInput}
                                                        type="text"
                                                        id="location"
                                                        name="address"
                                                        autoComplete="street-address"
                                                        placeholder="Postal code, address, or landmark"
                                                        required
                                                        value={location}
                                                        onChange={(e) => setLocation(e.target.value)}
                                                        style={{ width: '100%' }}
                                                    />
                                                </Autocomplete>
                                                <button
                                                    type="button"
                                                    className={styles.locateBtn}
                                                    title="Use current location"
                                                    onClick={() => {
                                                        if (navigator.geolocation) {
                                                            navigator.geolocation.getCurrentPosition((position) => {
                                                                const { latitude, longitude } = position.coords;
                                                                setLocation(`${latitude}, ${longitude}`);
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                        <circle cx="12" cy="10" r="3"></circle>
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className={styles.inputWrapperInternal}>
                                                <input
                                                    className={styles.modernInput}
                                                    type="text"
                                                    id="location"
                                                    name="address"
                                                    autoComplete="street-address"
                                                    placeholder={loadError ? "Google Maps failed to load" : "Loading address search..."}
                                                    required
                                                    value={location}
                                                    onChange={(e) => setLocation(e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Move In Date */}
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel} htmlFor="moveInDate">Desired Move-in Date *</label>
                                    <div className={styles.inputWrapper}>
                                        <div className={styles.inputIcon}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                            </svg>
                                        </div>
                                        <input
                                            className={styles.modernInput}
                                            type="date"
                                            id="moveInDate"
                                            required
                                            value={moveInDate}
                                            onChange={(e) => setMoveInDate(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Monthly Budget */}
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel} htmlFor="budget">Monthly Budget *</label>
                                    <div className={styles.inputWrapper}>
                                        <div className={styles.inputIcon}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="12" y1="1" x2="12" y2="23"></line>
                                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                            </svg>
                                        </div>
                                        <input
                                            className={styles.modernInput}
                                            type="text"
                                            id="budget"
                                            placeholder="e.g. 2000"
                                            required
                                            value={budget}
                                            onChange={(e) => setBudget(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Monthly Household Income */}
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel} htmlFor="monthlyHouseholdIncome">Monthly Household Income *</label>
                                    <div className={styles.inputWrapper}>
                                        <div className={styles.inputIcon}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="12" y1="1" x2="12" y2="23"></line>
                                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                            </svg>
                                        </div>
                                        <input
                                            className={styles.modernInput}
                                            type="text"
                                            id="monthlyHouseholdIncome"
                                            placeholder="e.g. 4500"
                                            required
                                            value={monthlyHouseholdIncome}
                                            onChange={(e) => setMonthlyHouseholdIncome(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Parking */}
                                <div className={styles.fieldGroup}>
                                    <label className={styles.groupLabel}>Parking Required? *</label>
                                    <div className={styles.segmentedControl}>
                                        {['Yes', 'No'].map((opt) => (
                                            <button
                                                key={opt}
                                                type="button"
                                                className={`${styles.segmentBtn} ${parking === opt ? styles.active : ''}`}
                                                onClick={() => setParking(opt)}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Accommodation Type */}
                                <div className={styles.fieldGroup}>
                                    <label className={styles.groupLabel}>Accommodation Type *</label>
                                    <div className={styles.segmentedControl}>
                                        {['Basement', 'Condo', 'House'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                className={`${styles.segmentBtn} ${accommodationType === type ? styles.active : ''}`}
                                                onClick={() => setAccommodationType(type)}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Rooms Stepper */}
                                <div className={styles.fieldGroup}>
                                    <label className={styles.groupLabel}>Number of Rooms *</label>
                                    <div className={styles.stepper}>
                                        <button type="button" className={styles.stepBtn} onClick={() => setRooms(Math.max(1, rooms - 1))}>−</button>
                                        <span className={styles.stepValue}>{rooms}</span>
                                        <button type="button" className={styles.stepBtn} onClick={() => setRooms(Math.min(10, rooms + 1))}>+</button>
                                    </div>
                                </div>
                            </>
                        )}

                                {currentStep === 3 && (
                                    <div className={styles.sliderContainer}>
                                        <label className={styles.scoreLabel}>What is your approximate credit score?</label>
                                        <p className={styles.microTrustText}>This is only an estimate and won&apos;t affect your credit.</p>

                                        {creditScoreInteracted && creditScore !== null ? (
                                            <div className={styles.scoreDisplay} style={{ color: creditScore >= 720 ? '#10B981' : creditScore >= 650 ? '#EAB308' : '#F97316' }}>
                                                {creditScore}
                                                <div className={styles.scoreTierText}>
                                                    {creditScore >= 720 ? "Excellent" : creditScore >= 690 ? "Very Good" : creditScore >= 630 ? "Good" : "Fair"}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={styles.scorePrompt}>Slide to select your approximate credit score</div>
                                        )}

                                        <div className={styles.rangeWrapper}>
                                            <input
                                                type="range"
                                                min={CREDIT_SCORE_MIN}
                                                max={CREDIT_SCORE_MAX}
                                                step="10"
                                                value={creditScore ?? CREDIT_SCORE_MIN}
                                                onChange={(e) => handleCreditScoreChange(Number(e.target.value))}
                                                className={`${styles.rangeInput} ${pulseSlider ? styles.rangePulse : ''} ${showSliderNudge ? styles.rangeNudge : ''}`}
                                                style={{
                                                    background: `linear-gradient(to right, #FFD55A 0%, #FFD55A ${((creditScore ?? CREDIT_SCORE_MIN) - CREDIT_SCORE_MIN) / (CREDIT_SCORE_MAX - CREDIT_SCORE_MIN) * 100}%, #f3f4f6 ${((creditScore ?? CREDIT_SCORE_MIN) - CREDIT_SCORE_MIN) / (CREDIT_SCORE_MAX - CREDIT_SCORE_MIN) * 100}%, #f3f4f6 100%)`
                                                }}
                                            />
                                            <div className={styles.rangeLabels}>
                                                <span>{CREDIT_SCORE_MIN}</span>
                                                <span>{CREDIT_SCORE_MAX}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={styles.actionArea}>
                                {currentStep === 1 ? (
                                    <>
                                        <button type="submit" className={styles.continueBtn}>
                                            Next Step <span>›</span>
                                        </button>
                                        <Link href="/" className={styles.backLink}>Go Back</Link>
                                    </>
                                ) : (
                                    <div className={styles.buttonGroup}>
                                        <button type="button" className={styles.backBtn} onClick={() => setCurrentStep(currentStep - 1)}>
                                            Back
                                        </button>
                                        <div className={styles.ctaWrap}>
                                            {currentStep === 3 && !creditScoreInteracted && (
                                                <button
                                                    type="button"
                                                    className={styles.ctaGuard}
                                                    onClick={triggerCreditGuardrailFeedback}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            triggerCreditGuardrailFeedback();
                                                        }
                                                    }}
                                                    aria-label="Slide credit score to continue"
                                                />
                                            )}
                                            <button
                                                type="submit"
                                                className={`${styles.continueBtn} ${currentStep === 3 && !creditScoreInteracted ? styles.continueBtnDisabled : ''}`}
                                                disabled={currentStep === 3 && !creditScoreInteracted}
                                            >
                                                {currentStep === 3 ? 'View Details' : 'Next Step'} <span>›</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {currentStep === 3 && showCreditHint && (
                                    <p className={styles.creditHint}>Just one quick slide to continue</p>
                                )}
                            </div>
                        </form>
                    </>
                )}
            </div>

            {/* Right Panel: Pricing Plans */}
            <div className={styles.rightPanel}>
                {/* Overlay Lock */}
                {!formSubmitted && !lowScoreThankYou && (
                    <div className={styles.overlay}>
                        <div className={styles.lockIcon}>🔒</div>
                        <div className={styles.overlayText}>
                            Complete Step 3 to view details
                        </div>
                    </div>
                )}
                {lowScoreThankYou && (
                    <div className={styles.overlay}>
                        <div className={styles.overlayText}>
                            Thanks for applying. Redirecting to home...
                        </div>
                    </div>
                )}

                <div className={styles.formHeader}>
                    <h2 className={styles.formTitle}>Your Best Matches</h2>
                    <p className={styles.formSubtitle}>Based on your preferences, here are the best options for you.</p>
                </div>
                <div className={styles.plansContainer} style={!formSubmitted ? { pointerEvents: 'none', userSelect: 'none' } : {}}>
                    <PricingPlans creditScore={creditScore ?? undefined} />
                </div>
                <Link href="/" className={styles.backLink}>Back to Home</Link>
            </div>
        </div>
    );
}
