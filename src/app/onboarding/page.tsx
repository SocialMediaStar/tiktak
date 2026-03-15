import LocaleOnboardingPage from "@/app/[locale]/onboarding/page";
import { defaultLocale } from "@/i18n/config";

export default function OnboardingPage() {
  return <LocaleOnboardingPage params={Promise.resolve({ locale: defaultLocale })} />;
}
