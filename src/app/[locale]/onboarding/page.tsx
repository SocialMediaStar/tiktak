import { Building2, CircleCheckBig, Globe2, Sparkles } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { authOptions } from "@/lib/auth";
import { getUserBrandMembership } from "@/lib/brand";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLocalePath } from "@/i18n/locale-path";
import { resolveLocale } from "@/i18n/resolve-locale";
import { createBrandOnboarding } from "@/lib/onboarding-actions";

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect(getLocalePath(locale, "/signin"));
  }

  const membership = await getUserBrandMembership(session.user.id);

  if (membership?.brand.onboardingCompleted) {
    redirect(getLocalePath(locale, "/dashboard"));
  }

  const action = createBrandOnboarding.bind(null, session.user.id);
  const steps = [
    {
      icon: <Building2 className="size-5" />,
      title: dictionary.onboarding.stepBrandTitle,
      copy: dictionary.onboarding.stepBrandCopy,
    },
    {
      icon: <Globe2 className="size-5" />,
      title: dictionary.onboarding.stepContactTitle,
      copy: dictionary.onboarding.stepContactCopy,
    },
    {
      icon: <Sparkles className="size-5" />,
      title: dictionary.onboarding.stepLaunchTitle,
      copy: dictionary.onboarding.stepLaunchCopy,
    },
  ];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)] xl:gap-8">
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="overflow-hidden rounded-[36px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.16),_transparent_28%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-8">
              <div className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.26em] text-orange-700">
                {dictionary.onboarding.setupLabel}
              </div>

              <div className="mt-6 space-y-4">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
                  {dictionary.onboarding.eyebrow}
                </p>
                <h1 className="max-w-sm text-4xl font-semibold tracking-[-0.05em] text-slate-950">
                  {dictionary.onboarding.title}
                </h1>
                <p className="max-w-md text-base leading-8 text-slate-600">
                  {dictionary.onboarding.description}
                </p>
              </div>

              <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">
                  {dictionary.onboarding.helperTitle}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {dictionary.onboarding.helperDescription}
                </p>
              </div>

              <div className="mt-8 space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className="flex gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.05)]"
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      {step.icon}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                          0{index + 1}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold tracking-[-0.02em] text-slate-950">
                        {step.title}
                      </h3>
                      <p className="text-sm leading-7 text-slate-600">{step.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.08)]">
            <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{dictionary.onboarding.eyebrow}</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                    {dictionary.onboarding.title}
                  </h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  <CircleCheckBig className="size-4" />
                  {dictionary.onboarding.submitNote}
                </div>
              </div>
            </div>

            <div className="px-6 py-6 sm:px-8 sm:py-8">
              <OnboardingForm action={action} locale={locale} dictionary={dictionary.onboarding} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
