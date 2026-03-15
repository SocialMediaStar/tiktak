import Link from "next/link";
import { Sparkles } from "lucide-react";

import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";

export function LandingNavbar({
  hasGoogleAuth,
  hasEmailAuth,
  locale,
  dictionary,
}: {
  hasGoogleAuth: boolean;
  hasEmailAuth: boolean;
  locale: Locale;
  dictionary: Dictionary["nav"] & { authModal: Dictionary["authModal"] };
}) {
  return (
    <header className="sticky top-0 z-30">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white backdrop-blur"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-orange-400/90 text-slate-950">
            <Sparkles className="size-4" />
          </span>
          {dictionary.brand}
        </Link>

        <nav className="flex items-center gap-3">
          <AuthModal
            hasGoogleAuth={hasGoogleAuth}
            hasEmailAuth={hasEmailAuth}
            defaultTab="signin"
            locale={locale}
            dictionary={dictionary.authModal}
          >
            <Button
              variant="ghost"
              className="rounded-full border border-white/12 bg-white/6 px-5 text-white hover:bg-white/12"
            >
              {dictionary.signIn}
            </Button>
          </AuthModal>
          <AuthModal
            hasGoogleAuth={hasGoogleAuth}
            hasEmailAuth={hasEmailAuth}
            defaultTab="signup"
            locale={locale}
            dictionary={dictionary.authModal}
          >
            <Button className="rounded-full px-5">{dictionary.signUp}</Button>
          </AuthModal>
        </nav>
      </div>
    </header>
  );
}
