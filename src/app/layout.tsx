import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Layout } from "@/components/common/Layout";
import { ThemeProviderWrapper } from "@/components/common/ThemeProviderWrapper";
import Link from "next/link";

// Inter 폰트를 사용하되 다양한 font-weight 포함
const inter = Inter({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Priorify - 우선순위 기반 일정 관리",
  description: "우선순위를 설정하고 효율적으로 일정을 관리하세요.",
  keywords: "일정 관리, 우선순위, 시간 관리, 생산성, 스케줄링, 일정 시각화",
  authors: [{ name: "Priorify Team" }],
  // icons: {
  //   icon: "/favicon.ico",
  // },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-gray-50 dark:bg-gray-900`} suppressHydrationWarning>
        <ThemeProviderWrapper>
          <Layout>{children}</Layout>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
