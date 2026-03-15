import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

export function getLocaleFromCallbackUrl(callbackUrl?: string | null): Locale {
  if (!callbackUrl) {
    return defaultLocale;
  }

  const pathname = new URL(callbackUrl, "http://localhost").pathname;
  const [, maybeLocale] = pathname.split("/");

  return maybeLocale && isLocale(maybeLocale) ? maybeLocale : defaultLocale;
}
