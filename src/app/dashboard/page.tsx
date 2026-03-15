import LocaleDashboardPage from "@/app/[locale]/dashboard/page";
import { defaultLocale } from "@/i18n/config";

export default function DashboardPage() {
  return <LocaleDashboardPage params={Promise.resolve({ locale: defaultLocale })} />;
}
