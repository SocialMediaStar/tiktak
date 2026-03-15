import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailSignInForm } from "@/components/auth/email-signin-form";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";
import { hasAuthEnv, hasEmailAuthEnv } from "@/lib/env";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/i18n/resolve-locale";

export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,138,61,0.22),transparent_28%),linear-gradient(135deg,#1c1917,#0f172a)] p-6 text-white">
      <Card className="w-full max-w-md border-white/10 bg-white/10 backdrop-blur">
        <CardHeader>
          <CardTitle>{dictionary.signinPage.title}</CardTitle>
          <CardDescription className="text-white/70">
            {dictionary.signinPage.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <GoogleSignInButton
            enabled={hasAuthEnv}
            locale={locale}
            label={dictionary.signinPage.googleButton}
          />
          {!hasAuthEnv ? (
            <p className="text-sm text-amber-200">{dictionary.signinPage.missingConfig}</p>
          ) : null}
          <EmailSignInForm
            callbackUrl={`/${locale}/dashboard`}
            dictionary={dictionary.authModal}
            cta={dictionary.authModal.signin.cta}
            enabled={hasEmailAuthEnv}
            compact
          />
        </CardContent>
      </Card>
    </main>
  );
}
