import "server-only";

import type { Locale } from "@/i18n/config";

import en from "@/messages/en.json";
import et from "@/messages/et.json";

const dictionaries = {
  en,
  et,
} as const;

export type Dictionary = typeof et;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
