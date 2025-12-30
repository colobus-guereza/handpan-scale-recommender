'use client';

import dynamic from 'next/dynamic';

// Dynamically import the test page content to avoid SSR issues with leva
const Digipan3DTestContent = dynamic(
    () => import('./Digipan3DTestContent'),
    { ssr: false, loading: () => <div className="w-full h-screen flex items-center justify-center bg-slate-900 text-white">Loading Developer Tools...</div> }
);

export default function Digipan3DTestPage() {
    return <Digipan3DTestContent />;
}
