import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/app-header";
import { SiteFooter } from "@/components/layout/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "非遗有灵 | Lively Heritage",
  description: "输入灵感，生成非遗纹样、3D 文创贴图和可分享提案页。",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <AppHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
