import { defaultLocale, type Locale } from "@/i18n/config";

export function getLocalePath(locale: Locale, path = "/") {
  const normalized = path === "" ? "/" : path.startsWith("/") ? path : `/${path}`;

  if (locale === defaultLocale) {
    return normalized;
  }

  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}
