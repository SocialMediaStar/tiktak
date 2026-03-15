"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Dictionary } from "@/i18n/get-dictionary";

type EmailSigninFormProps = {
  callbackUrl: string;
  dictionary: Dictionary["authModal"];
  cta: string;
  compact?: boolean;
  enabled: boolean;
};

export function EmailSignInForm({
  callbackUrl,
  dictionary,
  cta,
  compact = false,
  enabled,
}: EmailSigninFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();

        startTransition(async () => {
          setStatus("idle");

          try {
            await signIn("email", {
              email,
              callbackUrl,
            });
          } catch {
            setStatus("error");
          }
        });
      }}
    >
      <label className="block space-y-2">
        <span className="text-sm text-white/72">{dictionary.emailAddress}</span>
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={dictionary.emailPlaceholder}
          className="h-12 rounded-2xl border-white/12 bg-white/[0.045] px-4 text-white placeholder:text-white/30"
        />
      </label>
      <Button
        type="submit"
        className="h-12 w-full rounded-2xl text-sm"
        disabled={isPending || !enabled || !email}
      >
      {isPending ? dictionary.emailPending : cta}
      </Button>
      {!enabled ? (
        <p className="text-xs leading-6 text-amber-200">{dictionary.emailMissingConfig}</p>
      ) : null}
      {status === "error" ? (
        <p className="text-xs leading-6 text-amber-200">{dictionary.emailError}</p>
      ) : null}
      {!compact ? (
        <p className="text-xs leading-6 text-white/48">{dictionary.emailNote}</p>
      ) : null}
    </form>
  );
}
