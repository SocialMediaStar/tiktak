"use client";

import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import { getLocalePath } from "@/i18n/locale-path";

export function GoogleSignInButton({
  enabled,
  locale,
  label,
}: {
  enabled: boolean;
  locale: Locale;
  label: string;
}) {
  return (
    <Button
      type="button"
      className="w-full"
      disabled={!enabled}
      onClick={() => signIn("google", { callbackUrl: getLocalePath(locale, "/onboarding") })}
    >
      {label}
    </Button>
  );
}
