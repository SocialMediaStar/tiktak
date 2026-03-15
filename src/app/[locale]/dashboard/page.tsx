import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { getUserBrandMembership } from "@/lib/brand";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/i18n/resolve-locale";

export default async function DashboardPage({
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

  if (!membership?.brand.onboardingCompleted) {
    redirect(`/${locale}/onboarding`);
  }

  return (
    <main className="min-h-screen bg-stone-950 p-6 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-white/50">{dictionary.dashboard.signedInAs}</p>
            <p className="text-base text-white">{session.user?.email}</p>
          </div>
          <SignOutButton locale={locale} label={dictionary.dashboard.signOut} />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>{dictionary.dashboard.welcome}</CardTitle>
          </CardHeader>
          <CardContent>{session.user?.email}</CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>{dictionary.dashboard.brand}</CardTitle>
          </CardHeader>
          <CardContent>{membership.brand.name ?? dictionary.dashboard.brandPlaceholder}</CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>{dictionary.dashboard.realtime}</CardTitle>
          </CardHeader>
          <CardContent>{dictionary.dashboard.realtimePlaceholder}</CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>{dictionary.dashboard.billing}</CardTitle>
          </CardHeader>
          <CardContent>{dictionary.dashboard.billingPlaceholder}</CardContent>
        </Card>
        </div>
      </div>
    </main>
  );
}
