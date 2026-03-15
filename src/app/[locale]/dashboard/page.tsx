import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
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

  if (!session) {
    redirect(`/${locale}/signin`);
  }

  return (
    <main className="min-h-screen bg-stone-950 p-6 text-white">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>{dictionary.dashboard.welcome}</CardTitle>
          </CardHeader>
          <CardContent>{session.user?.email}</CardContent>
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
    </main>
  );
}
