import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { Card, CardContent } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { getUserBrandMembership } from "@/lib/brand";
import { getDictionary } from "@/i18n/get-dictionary";
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
    redirect(`/${locale}/signin`);
  }

  const membership = await getUserBrandMembership(session.user.id);

  if (membership?.brand.onboardingCompleted) {
    redirect(`/${locale}/dashboard`);
  }

  const action = createBrandOnboarding.bind(null, session.user.id);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,138,61,0.18),transparent_28%),linear-gradient(135deg,#1c1917,#0f172a)] px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.28em] text-orange-300/80">
            {dictionary.onboarding.eyebrow}
          </p>
          <h1 className="text-4xl font-semibold tracking-[-0.04em]">
            {dictionary.onboarding.title}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/68">
            {dictionary.onboarding.description}
          </p>
        </div>

        <Card className="border-white/10 bg-white/6 p-3 backdrop-blur-xl">
          <CardContent className="p-6">
            <OnboardingForm action={action} locale={locale} dictionary={dictionary.onboarding} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
