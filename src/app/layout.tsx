import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ProjectSidebar } from "@/components/layout/ProjectSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EticLab — Formation technique",
  description: "Comprends chaque brique technologique, du code à la mise en production. Modules clairs, guidés par IA.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white pb-[48px] pt-[57px] text-gray-900">
        <Navbar />
        <ProjectSidebar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
