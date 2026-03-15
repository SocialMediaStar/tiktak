import Link from "next/link";
import { MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/i18n/resolve-locale";

export default async function VerifyRequestPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const query = await searchParams;
  const email = typeof query.email === "string" ? query.email : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,138,61,0.20),transparent_28%),linear-gradient(135deg,#1c1917,#0f172a)] p-6 text-white">
      <Card className="w-full max-w-xl border-white/10 bg-white/8 p-3 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] text-orange-300">
            <MailCheck className="size-3.5" />
            {dictionary.verifyRequest.eyebrow}
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-[-0.04em]">
              {dictionary.verifyRequest.title}
            </h1>
            <p className="max-w-lg text-base leading-8 text-white/70">
              {dictionary.verifyRequest.description}
            </p>
            {email ? (
              <p className="text-sm text-white/55">
                {email}
              </p>
            ) : null}
          </div>
          <div className="rounded-[28px] border border-white/10 bg-black/16 p-5 text-sm leading-7 text-white/58">
            {dictionary.verifyRequest.note}
          </div>
          <Button asChild className="rounded-2xl px-5">
            <Link href={`/${locale}/signin`}>{dictionary.verifyRequest.back}</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
