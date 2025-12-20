import type { Metadata } from "next";
import "./globals.css";

// 폰트 로딩 실패 시 대체를 위해 시스템 폰트 사용
const inter = { className: "font-sans" };

export const metadata: Metadata = {
    title: "나에게 맞는 핸드팬 스케일 찾기",
    description: "국내 사용자들의 사용 후기를 기반으로 최적의 핸드팬 스케일을 추천합니다.",
};

import { ThemeProvider } from "@/components/ThemeProvider";
import IframeResizer from "@/components/IframeResizer";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" className="h-full">
            <body className={`${inter.className} min-h-full m-0 p-0 overflow-y-auto`}>
                <ThemeProvider>
                    <IframeResizer />
                    <div className="min-h-screen w-full py-4">
                        {children}
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
