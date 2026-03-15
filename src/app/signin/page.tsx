import LocaleSignInPage from "@/app/[locale]/signin/page";
import { defaultLocale } from "@/i18n/config";

export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <LocaleSignInPage
      params={Promise.resolve({ locale: defaultLocale })}
      searchParams={searchParams}
    />
  );
}
