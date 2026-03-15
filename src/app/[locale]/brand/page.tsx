import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { BrandSettingsForm } from "@/components/brand/brand-settings-form";
import { Card, CardContent } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { getUserBrandMembership } from "@/lib/brand";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLocalePath } from "@/i18n/locale-path";
import { resolveLocale } from "@/i18n/resolve-locale";
import { updateBrandProfile } from "@/lib/onboarding-actions";

export default async function BrandPage({
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

  if (!membership?.brand) {
    redirect(getLocalePath(locale, "/onboarding"));
  }

  const action = updateBrandProfile.bind(null, session.user.id, membership.brand.id);

  return (
    <main className="min-h-screen bg-stone-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.28em] text-orange-300/80">
            {dictionary.brandSettings.eyebrow}
          </p>
          <h1 className="text-4xl font-semibold tracking-[-0.04em]">
            {dictionary.brandSettings.title}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/68">
            {dictionary.brandSettings.description}
          </p>
        </div>

        <Card className="border-white/10 bg-white/6 p-3 backdrop-blur-xl">
          <CardContent className="p-6">
            <BrandSettingsForm
              action={action}
              locale={locale}
              dictionary={dictionary.brandSettings}
              brand={membership.brand}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
