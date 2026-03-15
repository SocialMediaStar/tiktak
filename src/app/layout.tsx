import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AuthSessionProvider } from "@/components/providers/session-provider";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dictionary = getDictionary(defaultLocale);

export const metadata: Metadata = {
  title: dictionary.site.title,
  description: dictionary.site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
