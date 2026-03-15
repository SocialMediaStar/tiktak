import LocaleBrandPage from "@/app/[locale]/brand/page";
import { defaultLocale } from "@/i18n/config";

export default function BrandPage() {
  return <LocaleBrandPage params={Promise.resolve({ locale: defaultLocale })} />;
}
