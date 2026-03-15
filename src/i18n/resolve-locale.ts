import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

export function resolveLocale(locale: string): Locale {
  return isLocale(locale) ? locale : defaultLocale;
}
