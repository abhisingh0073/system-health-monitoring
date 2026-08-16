import type { Metadata } from "next";
import { Header } from "@/components/Header";
import "./globals.css";
import SocketProvider from "@/providers/SocketProvider";

export const metadata: Metadata = {
  title: "System Health Monitor",
  description: "Real-time infrastructure monitoring dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SocketProvider>
           <Header />
           <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
        </SocketProvider>
      </body>
    </html>
  );
}
