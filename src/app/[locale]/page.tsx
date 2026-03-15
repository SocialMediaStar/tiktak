import { Bolt, CreditCard, Radio, ShieldCheck } from "lucide-react";

import { WaitlistForm } from "@/components/forms/waitlist-form";
import { ShuffleGrid } from "@/components/landing/shuffle-grid";
import { LandingNavbar } from "@/components/landing/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hasAuthEnv, hasEmailAuthEnv } from "@/lib/env";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/i18n/resolve-locale";

const icons = [Radio, ShieldCheck, CreditCard, Bolt] as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,137,54,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.18),transparent_24%),linear-gradient(135deg,#1c1917,#111827_45%,#0f172a)] text-white">
      <LandingNavbar
        hasGoogleAuth={hasAuthEnv}
        hasEmailAuth={hasEmailAuthEnv}
        locale={locale}
        dictionary={{ ...dictionary.nav, authModal: dictionary.authModal }}
      />
      <section className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl gap-14 px-6 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 backdrop-blur">
            {dictionary.landing.badge}
          </div>
          <h1 className="mt-8 max-w-3xl text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
            {dictionary.landing.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
            {dictionary.landing.description}
          </p>
          <div className="mt-8 max-w-xl">
            <WaitlistForm locale={locale} dictionary={dictionary.waitlist} />
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {dictionary.landing.features.map((feature, index) => {
              const Icon = icons[index];

              return (
                <Card key={feature.title} className="border-white/10 bg-white/6 text-white backdrop-blur">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <Icon className="h-5 w-5 text-orange-300" />
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-7 text-white/72">
                    {feature.copy}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-full rounded-[36px] border border-white/10 bg-white/6 p-4 backdrop-blur-xl">
            <ShuffleGrid
              labels={dictionary.landing.shuffleCards}
              moduleLabel={dictionary.landing.moduleLabel}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
