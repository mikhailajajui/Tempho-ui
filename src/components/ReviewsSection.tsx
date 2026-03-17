"use client";

import { IconArrowLeft, IconArrowRight, IconQuote } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import styles from './ReviewsSection.module.css';

type Testimonial = {
    quote: string;
    highlight: string;
    name: string;
    designation: string;
    src: string;
    avatar: string;
    objectPosition?: string;
};

const testimonials = [
    {
        quote:
            "After a long search and some initial skepticism, I’m happy to say that Tempho helped me find my new apartment. The process was smooth, and I’m excited to move in and enjoy my stay. The room is so beautiful, i was actually worried if i moved in but i found what i call home and my worries were all for nothing. I’m definitely happy to recommend Tempho to others!",
        highlight: "found what i call home",
        name: "Aisosa Lisa Osagie",
        designation: "Verified Tenant",
        src: "/reviews/aisosa.png",
        avatar: "/reviews/aisosa.png",
        objectPosition: "center"
    },
    {
        quote:
            "I had a vacant room in my house for quite some time, and I was very particular about finding the right tenant. Working with Tempho was a game-changer. Though it took a bit of time, their persistence and dedication ensured that I found the perfect fit. I’m thrilled to welcome the new tenant and would gladly recommend Tempho to any other landlord.",
        highlight: "Working with Tempho was a game-changer",
        name: "Eseosa Lawani",
        designation: "Property Owner",
        src: "/reviews/eseosa.png",
        avatar: "/reviews/eseosa.png",
        objectPosition: "center"
    },
    {
        quote:
            "Finding a place that fits both my budget and my lifestyle used to be a headache. Tempho's search system felt like it actually understood what I needed. I'm now settled in a great spot with roommates who share my lifestyle. The whole experience was remarkably stress-free.",
        highlight: "remarkably stress-free",
        name: "Olumoroti Oshinowo",
        designation: "Verified User",
        src: "/reviews/olumoroti.png",
        avatar: "/reviews/olumoroti.png",
        objectPosition: "center"
    }
];

export const ReviewsSection = ({
    autoplay = false,
}: {
    autoplay?: boolean;
}) => {
    const [active, setActive] = useState(0);

    const handleNext = () => {
        setActive((prev) => (prev + 1) % testimonials.length);
    };

    const handlePrev = () => {
        setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const isActive = (index: number) => {
        return index === active;
    };

    useEffect(() => {
        if (autoplay) {
            const interval = setInterval(handleNext, 8000);
            return () => clearInterval(interval);
        }
    }, [autoplay]);

    // Use deterministic rotations to avoid hydration mismatches.
    const rotations = useMemo(
        () => testimonials.map((_, index) => ((index * 7) % 19) - 9),
        []
    );

    return (
        <section id="testimonials" className="bg-[#0A0A0B] min-h-[633px] h-auto md:h-[633px] overflow-visible relative flex flex-col justify-center py-12 md:py-0">
            {/* Wave Divider attached to the top */}
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180" style={{ transform: 'translateY(-99%)' }}>
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px] fill-[#0A0A0B]">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                </svg>
            </div>

            <div className="mx-auto w-[92%] md:w-[85%] max-w-[1400px] px-4 font-sans antialiased md:px-8 lg:px-12 relative z-10">
                <div className="relative grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-[40%_60%] lg:gap-16 items-center">

                    {/* Left Column: Text Content & Headers */}
                    <div className="flex flex-col justify-center py-1 md:py-4 order-2 md:order-1">

                        {/* Header Section Aligned Over Text */}
                        <div className="mb-2 md:mb-4 text-left">
                            <h2 className="font-display text-lg md:text-3xl font-bold text-white mb-1 md:mb-2">Loved by Thousands</h2>
                            <p className="font-serif text-[10px] md:text-sm text-gray-400 max-w-md">
                                Don't just take our word for it. Here's what our community has to say.
                            </p>
                        </div>

                        {/* Aggregate Rating */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-2 mb-2 md:mb-4 bg-neutral-900/50 w-fit px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-neutral-800"
                        >
                            <div className="flex gap-0.5 md:gap-1">
                                {[1, 2, 3, 4].map(i => (
                                    <svg key={i} className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                                <svg key={5} className="w-3 h-3 md:w-4 md:h-4 text-neutral-600 fill-current opacity-50" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                            <span className="text-[10px] md:text-sm font-medium text-white">4.2 based on 40 reviews</span>
                        </motion.div>

                        <div className="min-h-[120px] md:min-h-[200px] flex flex-col justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={active}
                                    initial={{
                                        y: 10,
                                        opacity: 0,
                                    }}
                                    animate={{
                                        y: 0,
                                        opacity: 1,
                                    }}
                                    exit={{
                                        y: -5,
                                        opacity: 0,
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        ease: "easeInOut",
                                    }}
                                >
                                    <div className="relative">
                                        <IconQuote className="absolute -top-3 -left-2 w-4 h-4 md:w-6 md:h-6 text-neutral-800 opacity-50 rotate-180" />
                                        <p className="text-[13px] md:text-xl font-medium text-white leading-relaxed font-serif relative z-10">
                                            {testimonials[active].quote.split(" ").map((word, index) => {
                                                const cleanWord = word.replace(/[^a-zA-Z]/g, "");
                                                const isBold = testimonials[active].highlight.includes(cleanWord) && cleanWord.length > 3;

                                                return (
                                                    <span
                                                        key={index}
                                                        className={`inline-block mr-1 md:mr-1.5 ${isBold ? 'text-white font-bold' : 'text-gray-300'}`}
                                                    >
                                                        {word}
                                                    </span>
                                                )
                                            })}
                                        </p>
                                    </div>

                                    {/* Author Block */}
                                    <div className="mt-1.5 md:mt-4">
                                        <h3 className="text-[11px] md:text-sm font-bold text-white">
                                            {testimonials[active].name}
                                        </h3>
                                        <p className="text-[7px] md:text-[10px] text-gray-500 uppercase tracking-wider">
                                            {testimonials[active].designation}
                                        </p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="flex gap-3 mt-3 md:mt-6">
                            <button
                                onClick={handlePrev}
                                className="group/button flex h-9 w-9 md:h-12 md:w-12 items-center justify-center rounded-full bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600 transition-all"
                                aria-label="Previous review"
                            >
                                <IconArrowLeft className="h-4 w-4 md:h-6 md:w-6 text-neutral-400 transition-transform duration-300 group-hover/button:rotate-12 group-hover/button:text-white" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="group/button flex h-9 w-9 md:h-12 md:w-12 items-center justify-center rounded-full bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600 transition-all"
                                aria-label="Next review"
                            >
                                <IconArrowRight className="h-4 w-4 md:h-6 md:w-6 text-neutral-400 transition-transform duration-300 group-hover/button:-rotate-12 group-hover/button:text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Right Column: People Images */}
                    <div className="relative h-[180px] md:h-[400px] w-full order-1 md:order-2 flex items-center justify-center">
                        <AnimatePresence>
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={testimonial.src}
                                    initial={{
                                        opacity: 0,
                                        scale: 0.9,
                                        z: -100,
                                        rotate: rotations[index],
                                    }}
                                    animate={{
                                        opacity: isActive(index) ? 1 : 0.7,
                                        scale: isActive(index) ? 1 : 0.9,
                                        z: isActive(index) ? 0 : -100,
                                        rotate: isActive(index) ? 0 : rotations[index],
                                        zIndex: isActive(index)
                                            ? 40
                                            : testimonials.length + 2 - index,
                                        y: isActive(index) ? [0, -20, 0] : 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.9,
                                        z: 100,
                                        rotate: rotations[index],
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute inset-0 origin-bottom flex items-center justify-center"
                                >
                                    <div className="relative w-full max-w-[500px] h-full">
                                        <img
                                            src={testimonial.src}
                                            alt={testimonial.name}
                                            draggable={false}
                                            className="h-full w-full object-cover shadow-2xl"
                                            style={{
                                                borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
                                                objectPosition: testimonial.objectPosition || "center"
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </section>
    );
};
