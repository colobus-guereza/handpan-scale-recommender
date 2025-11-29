import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "나에게 맞는 핸드팬 찾기",
    description: "국내 사용자들의 사용 후기를 기반으로 최적의 핸드팬 스케일을 추천합니다.",
};

import { ThemeProvider } from "@/components/ThemeProvider";
import IframeResizer from "@/components/IframeResizer";
import ThemeToggle from "@/components/ThemeToggle";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" className="h-full">
            <body className={`${inter.className} min-h-full m-0 p-0 overflow-y-auto transition-colors duration-500`}>
                <ThemeProvider>
                    <IframeResizer />
                    <div className="min-h-screen flex items-start justify-center w-full py-4 px-2">
                        <div className="w-full max-w-full px-2 md:px-4">
                            <div className="flex flex-col items-center space-y-4 glass-card p-4 rounded-3xl border border-glass-border relative transition-all duration-500">
                                {/* Theme Toggle Button (Top Right) */}
                                <div className="absolute top-4 right-4 z-50">
                                    <ThemeToggle />
                                </div>

                                <header className="text-center space-y-1 pt-2">
                                    <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-stardust dark:via-white dark:to-cosmic drop-shadow-sm">
                                        나에게 맞는 핸드팬 찾기
                                    </h1>
                                </header>

                                <main className="w-full">
                                    {children}
                                </main>
                            </div>
                        </div>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
