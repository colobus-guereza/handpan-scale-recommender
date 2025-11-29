import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "나에게 맞는 핸드팬 찾기",
    description: "국내 사용자들의 사용 후기를 기반으로 최적의 핸드팬 스케일을 추천합니다.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" className="h-full">
            <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-full m-0 p-0 overflow-y-auto`}>
                <div className="min-h-screen flex items-start justify-center w-full py-8 px-4">
                    <div className="w-full max-w-3xl">
                        <div className="flex flex-col items-center space-y-10 bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50">
                            <header className="text-center space-y-3">
                                <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900">
                                    나에게 맞는 핸드팬 찾기
                                </h1>
                            </header>

                            <main className="w-full">
                                {children}
                            </main>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
