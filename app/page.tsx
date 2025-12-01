"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import VibeSelector, { Vibe, VIBES } from "@/components/VibeSelector";
import ScaleList from "@/components/ScaleList";

export default function Home() {
    // 초기값을 '요가명상힐링' (meditation)으로 설정
    const initialVibe = VIBES.find(v => v.id === 'meditation') || null;
    const [step, setStep] = useState<'selection' | 'result'>('result');
    const [selectedVibe, setSelectedVibe] = useState<Vibe | null>(initialVibe);

    const handleVibeSelect = (vibe: Vibe) => {
        setSelectedVibe(vibe);
        setStep('result');
    };

    const handleBack = () => {
        setStep('selection');
        setSelectedVibe(null);
    };

    return (
        <div className="w-full">
            {step === 'selection' ? (
                <div className="w-full">
                    <VibeSelector onSelect={handleVibeSelect} />
                </div>
            ) : (
                <div className="w-full">
                    {selectedVibe && (
                        <ScaleList
                            selectedVibe={selectedVibe}
                            onBack={handleBack}
                            onChangeVibe={handleVibeSelect}
                        />
                    )}
                </div>
            )}
        </div>
    );

}
