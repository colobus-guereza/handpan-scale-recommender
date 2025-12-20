'use client';

import dynamic from 'next/dynamic';

// Dynamically import the home page content to avoid SSR issues with three.js
const HomePageContent = dynamic(
    () => import('./HomePageContent'),
    { ssr: false, loading: () => <div className="w-full h-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div> }
);

export default function HomePage() {
    return <HomePageContent />;
}
