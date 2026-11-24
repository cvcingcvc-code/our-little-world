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
    <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans transition-colors duration-500 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 selection:bg-rose-200 selection:text-rose-900">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
