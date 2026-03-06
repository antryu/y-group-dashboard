import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "_y Holdings | AI Agent Dashboard",
  description: "3D Dashboard for _y Holdings AI Agent Conglomerate",
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
