import { redirect } from "next/navigation";

import { defaultLocale } from "@/i18n/config";
import { getLocalePath } from "@/i18n/locale-path";

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

  redirect(`${getLocalePath(defaultLocale, "/signin")}${target.toString() ? `?${target.toString()}` : ""}`);
}
