import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "-y Group | AI Agent Dashboard",
  description: "3D Dashboard for -y Group AI Agent Conglomerate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
