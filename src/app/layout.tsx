import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Our Little World | 我们的小世界",
  description: "冬天很冷，幸好有你。记录专属两人的点点滴滴与美好瞬间。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900">
        {children}
      </body>
    </html>
  );
}
