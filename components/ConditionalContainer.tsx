'use client';

import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

export default function ConditionalContainer({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isCategorySlider = pathname?.includes('/category-slider');

    if (isCategorySlider) {
        return (
            <>
                {/* 투명 문자 하나만 넣어서 본문 유지 */}
                <span className="opacity-0">.</span>
                {children}
            </>
        );
    }

    return (
        <div className="min-h-screen flex items-start justify-center w-full py-4 px-2">
            <div className="w-full max-w-full px-2 md:px-4">
                <div className="flex flex-col items-center space-y-4 glass-card p-4 rounded-3xl border border-glass-border relative min-h-[600px]">
                    {/* Theme Toggle Button (Top Right) - Hidden as requested */}
                    <div className="absolute top-4 right-4 z-50 hidden">
                        <ThemeToggle />
                    </div>

                    <header className="text-center space-y-1 pt-2">
                        <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 dark:text-slate-400 drop-shadow-sm">
                            나에게 맞는 핸드팬 찾기
                        </h1>
                    </header>

                    <main className="w-full">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}


