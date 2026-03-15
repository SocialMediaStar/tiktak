import { redirect } from "next/navigation";

import { defaultLocale } from "@/i18n/config";

export default async function AuthErrorRedirectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : null;
  const target = new URLSearchParams();

  if (error) {
    target.set("error", error);
  }

  redirect(`/${defaultLocale}/signin${target.toString() ? `?${target.toString()}` : ""}`);
}
