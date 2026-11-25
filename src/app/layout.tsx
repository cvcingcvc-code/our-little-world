import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "Our Little World | 我们的小世界 ❄️",
  description: "冬天很冷，幸好有你。专属两人的数字恋爱博物馆与点滴回忆空间。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="min-h-dvh antialiased" suppressHydrationWarning>
      <body className="min-h-dvh flex flex-col font-sans transition-colors duration-500 text-[var(--theme-text-primary)] selection:bg-[#FFD1DC] selection:text-[#292445]">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
