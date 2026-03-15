"use client";

import { useState } from "react";
import {
  Check,
  Chrome,
  LockKeyhole,
  Mail,
  Music2,
  Stars,
} from "lucide-react";
import { signIn } from "next-auth/react";

import { EmailSignInForm } from "@/components/auth/email-signin-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { getLocalePath } from "@/i18n/locale-path";

type AuthTab = "signin" | "signup";

type AuthModalProps = {
  defaultTab?: AuthTab;
  hasGoogleAuth: boolean;
  hasEmailAuth: boolean;
  locale: Locale;
  dictionary: Dictionary["authModal"];
  children: React.ReactNode;
};

export function AuthModal({
  defaultTab = "signin",
  hasGoogleAuth,
  hasEmailAuth,
  locale,
  dictionary,
  children,
}: AuthModalProps) {
  const [tab, setTab] = useState<AuthTab>(defaultTab);
  const config = dictionary[tab];

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        closeLabel={dictionary.close}
        className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden border-white/10 bg-[#0b1220] p-0 text-white shadow-[0_40px_120px_rgba(0,0,0,0.55)] sm:max-w-[720px] md:max-w-[880px] lg:max-w-[1040px]"
      >
        <div className="grid min-h-[680px] md:grid-cols-[360px_minmax(0,1fr)] lg:grid-cols-[400px_minmax(0,1fr)]">
          <aside className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.32),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.22),transparent_32%),linear-gradient(160deg,#1f2937,#111827_52%,#0b1220)] p-6 md:border-r md:border-b-0 md:p-8">
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(11,18,32,0.16))]" />
            <div className="relative flex h-full flex-col justify-between gap-8">
              <div className="space-y-5">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.28em] text-white/75 backdrop-blur">
                  <Stars className="size-3.5" />
                  {dictionary.creatorAccess}
                </div>
                <DialogHeader className="space-y-3">
                  <DialogTitle className="max-w-sm text-3xl leading-tight tracking-[-0.04em]">
                    {config.heroTitle}
                  </DialogTitle>
                  <DialogDescription className="max-w-md text-[15px] leading-7 text-white/70">
                    {config.heroCopy}
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="space-y-4">
                <div className="rounded-[28px] border border-white/12 bg-black/18 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                    {dictionary.includedInFlow}
                  </p>
                  <div className="mt-4 grid gap-3">
                    {dictionary.benefits.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/6 px-3 py-3"
                      >
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/12">
                          <Check className="size-4 text-orange-300" />
                        </span>
                        <span className="text-sm leading-6 text-white/78">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Metric label={dictionary.metricSetup} value={dictionary.metricSetupValue} />
                  <Metric label={dictionary.metricEmailFlow} value={dictionary.metricEmailFlowValue} />
                </div>
              </div>
            </div>
          </aside>

          <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_18%)] p-6 md:p-8">
            <Tabs value={tab} onValueChange={(value) => setTab(value as AuthTab)} className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <TabsList className="grid h-12 w-full max-w-[320px] grid-cols-2 rounded-full bg-white/8 p-1">
                  <TabsTrigger value="signin" className="rounded-full text-sm">
                    {dictionary.tabs.signIn}
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-full text-sm">
                    {dictionary.tabs.signUp}
                  </TabsTrigger>
                </TabsList>
                <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs text-white/58 sm:flex">
                  <LockKeyhole className="size-3.5" />
                  {dictionary.secureSession}
                </div>
              </div>

              <TabsContent value="signin" className="space-y-6">
                <AuthFormShell
                  locale={locale}
                  dictionary={dictionary}
                  eyebrow={dictionary.signin.eyebrow}
                  title={dictionary.signin.title}
                  description={dictionary.signin.description}
                  cta={dictionary.signin.cta}
                  hasGoogleAuth={hasGoogleAuth}
                  hasEmailAuth={hasEmailAuth}
                />
              </TabsContent>

              <TabsContent value="signup" className="space-y-6">
                <AuthFormShell
                  locale={locale}
                  dictionary={dictionary}
                  eyebrow={dictionary.signup.eyebrow}
                  title={dictionary.signup.title}
                  description={dictionary.signup.description}
                  cta={dictionary.signup.cta}
                  hasGoogleAuth={hasGoogleAuth}
                  hasEmailAuth={hasEmailAuth}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AuthFormShell({
  locale,
  dictionary,
  eyebrow,
  title,
  description,
  cta,
  hasGoogleAuth,
  hasEmailAuth,
}: {
  locale: Locale;
  dictionary: Dictionary["authModal"];
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  hasGoogleAuth: boolean;
  hasEmailAuth: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-orange-300/85">{eyebrow}</p>
        <h3 className="text-2xl font-semibold tracking-[-0.03em]">{title}</h3>
        <p className="max-w-xl text-sm leading-7 text-white/62">{description}</p>
      </div>

      <SocialButtons hasGoogleAuth={hasGoogleAuth} locale={locale} dictionary={dictionary} />
      <Divider label={dictionary.emailDivider} />
      <EmailSignInForm
        callbackUrl={getLocalePath(locale, "/onboarding")}
        verifyRequestUrl={getLocalePath(locale, "/verify-request")}
        dictionary={dictionary}
        cta={cta}
        enabled={hasEmailAuth}
      />
    </div>
  );
}

function SocialButtons({
  hasGoogleAuth,
  locale,
  dictionary,
}: {
  hasGoogleAuth: boolean;
  locale: Locale;
  dictionary: Dictionary["authModal"];
}) {
  return (
    <div className="grid gap-3">
      <Button
        type="button"
        variant="outline"
        className="h-14 justify-start gap-3 rounded-2xl border-white/12 bg-white/[0.045] px-4 text-left text-white hover:bg-white/10"
        disabled={!hasGoogleAuth}
        onClick={() => signIn("google", { callbackUrl: getLocalePath(locale, "/onboarding") })}
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-white/10">
          <Chrome className="size-4" />
        </span>
        <span className="flex min-w-0 flex-col items-start">
          <span className="text-sm font-medium">{dictionary.googleTitle}</span>
          <span className="text-xs text-white/45">{dictionary.googleCopy}</span>
        </span>
      </Button>
      <Button
        type="button"
        variant="outline"
        className="h-14 justify-start gap-3 rounded-2xl border-white/12 bg-white/[0.045] px-4 text-left text-white hover:bg-white/10"
        disabled
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-white/10">
          <Music2 className="size-4" />
        </span>
        <span className="flex min-w-0 flex-col items-start">
          <span className="text-sm font-medium">{dictionary.tiktokTitle}</span>
          <span className="text-xs text-white/45">{dictionary.tiktokCopy}</span>
        </span>
      </Button>
      {!hasGoogleAuth ? (
        <p className="text-xs leading-6 text-amber-200">
          {dictionary.googleDisabled}
        </p>
      ) : null}
      <p className="text-xs leading-6 text-white/48">{dictionary.tiktokNote}</p>
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <Separator className="bg-white/8" />
      <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-white/40">
        <Mail className="size-3.5" />
        {label}
      </span>
      <Separator className="bg-white/8" />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">{label}</p>
      <p className="mt-2 text-sm font-medium text-white/82">{value}</p>
    </div>
  );
}
