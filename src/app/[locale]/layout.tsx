import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/i18n/resolve-locale";
import { isLocale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);

  return {
    title: dictionary.site.title,
    description: dictionary.site.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return children;
}
