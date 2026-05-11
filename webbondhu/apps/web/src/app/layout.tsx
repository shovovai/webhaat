import type { Metadata } from "next";
import { Geist, Hind_Siliguri } from "next/font/google";
import "../styles/globals.css";
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const hind = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-hind-siliguri" });
export const metadata: Metadata = { title: "WebBondhu — Bangladesh Business OS", description: "AI-powered Bangla-first SaaS platform for Bangladesh SMEs." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="bn" className="dark"><body className={`${geist.variable} ${hind.variable} font-bangla bg-background text-white antialiased`}>{children}</body></html>; }
