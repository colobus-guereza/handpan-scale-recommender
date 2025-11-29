"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import VibeSelector, { Vibe } from "@/components/VibeSelector";
import ScaleList from "@/components/ScaleList";

export default function Home() {
    const [step, setStep] = useState<'selection' | 'result'>('selection');
    const [selectedVibe, setSelectedVibe] = useState<Vibe | null>(null);

    const handleVibeSelect = (vibe: Vibe) => {
        setSelectedVibe(vibe);
        setStep('result');
    };

    const handleBack = () => {
        setStep('selection');
        setSelectedVibe(null);
    };

    return (
        <AnimatePresence mode="wait">
            {step === 'selection' ? (
                <motion.div
                    key="selection"
                    className="w-full"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                >
                    <VibeSelector onSelect={handleVibeSelect} />
                </motion.div>
            ) : (
                <motion.div
                    key="result"
                    className="w-full"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {selectedVibe && (
                        <ScaleList selectedVibe={selectedVibe} onBack={handleBack} />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
