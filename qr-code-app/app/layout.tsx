import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const audiowide = localFont({
  src: "../public/Fonts/Audiowide-Regular.ttf",
  variable: "--font-audiowide",
});

export const metadata: Metadata = {
  title: "HackaBull Check-In",
  description: "Attendee registration and check-in for HackaBull",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${audiowide.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
