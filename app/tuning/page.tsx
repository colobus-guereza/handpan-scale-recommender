'use client';

import dynamic from 'next/dynamic';

// Dynamically import tuning page content to avoid SSR issues with three.js/leva
const TuningPageContent = dynamic(
    () => import('./TuningPageContent'),
    { ssr: false, loading: () => <div className="w-full h-screen flex items-center justify-center bg-black text-white">Loading Tuning Tools...</div> }
);

export default function TuningPage() {
    return <TuningPageContent />;
}
