import { redirect } from "next/navigation";

import { getLocalePath } from "@/i18n/locale-path";
import { resolveLocale } from "@/i18n/resolve-locale";

export default async function LocalizedAuthErrorRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const query = await searchParams;
  const error = typeof query.error === "string" ? query.error : null;
  const target = new URLSearchParams();

  if (error) {
    target.set("error", error);
  }

  redirect(`${getLocalePath(locale, "/signin")}${target.toString() ? `?${target.toString()}` : ""}`);
}
