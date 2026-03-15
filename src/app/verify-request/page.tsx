import { redirect } from "next/navigation";

import { getLocaleFromCallbackUrl } from "@/i18n/get-locale-from-callback-url";

export default async function VerifyRequestRedirectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const callbackUrl = typeof params.callbackUrl === "string" ? params.callbackUrl : null;
  const email = typeof params.email === "string" ? params.email : null;
  const locale = getLocaleFromCallbackUrl(callbackUrl);

  const target = new URLSearchParams();

  if (email) {
    target.set("email", email);
  }

  redirect(`/${locale}/verify-request${target.toString() ? `?${target.toString()}` : ""}`);
}
