export const locales = ["et", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "et";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
