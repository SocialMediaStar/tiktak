"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";

export function SignOutButton({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className="rounded-full border-white/12 bg-white/6 text-white hover:bg-white/10"
      onClick={() => signOut({ callbackUrl: `/${locale}` })}
    >
      <LogOut className="size-4" />
      {label}
    </Button>
  );
}
