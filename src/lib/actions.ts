"use server";

import { z } from "zod";

import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export type WaitlistState = {
  message: string;
  success: boolean;
};

export async function joinWaitlist(
  _prevState: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const localeValue = formData.get("locale");
  const locale =
    typeof localeValue === "string" && isLocale(localeValue) ? localeValue : defaultLocale;
  const dictionary = getDictionary(locale).waitlist;
  const subscriberSchema = z.object({
    email: z.email(dictionary.invalidEmail),
  });
  const parsed = subscriberSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      message: parsed.error.issues[0]?.message ?? dictionary.invalidInput,
      success: false,
    };
  }

  return {
    message: dictionary.success.replace("{email}", parsed.data.email),
    success: true,
  };
}
