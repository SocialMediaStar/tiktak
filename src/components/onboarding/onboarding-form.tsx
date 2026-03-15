"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { OnboardingState } from "@/lib/onboarding-actions";

const initialState: OnboardingState = {
  success: false,
  message: "",
};

export function OnboardingForm({
  action,
  locale,
  dictionary,
}: {
  action: (
    state: OnboardingState,
    formData: FormData,
  ) => Promise<OnboardingState>;
  locale: Locale;
  dictionary: Dictionary["onboarding"];
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.success) {
      router.push(`/${locale}/dashboard`);
    }
  }, [locale, router, state.success]);

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="locale" value={locale} />

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{dictionary.sectionBrand}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={dictionary.nameLabel}>
            <Input name="name" placeholder={dictionary.namePlaceholder} required />
          </Field>
          <Field label={dictionary.slugLabel}>
            <Input name="slug" placeholder={dictionary.slugPlaceholder} required />
          </Field>
        </div>
        <Field label={dictionary.descriptionLabel}>
          <textarea
            name="description"
            required
            minLength={12}
            maxLength={300}
            placeholder={dictionary.descriptionPlaceholder}
            className="min-h-32 w-full rounded-2xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-orange-300/40"
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={dictionary.logoUrlLabel}>
            <Input name="logoUrl" placeholder="https://..." />
          </Field>
          <Field label={dictionary.brandLocaleLabel}>
            <select
              name="brandLocale"
              defaultValue={locale}
              className="h-12 w-full rounded-2xl border border-white/12 bg-[#101827] px-4 text-sm text-white outline-none"
            >
              <option value="et">Eesti</option>
              <option value="en">English</option>
            </select>
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{dictionary.sectionContact}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={dictionary.contactEmailLabel}>
            <Input name="contactEmail" type="email" required />
          </Field>
          <Field label={dictionary.supportEmailLabel}>
            <Input name="supportEmail" type="email" />
          </Field>
          <Field label={dictionary.websiteLabel}>
            <Input name="website" placeholder="https://..." />
          </Field>
          <Field label={dictionary.tiktokLabel}>
            <Input name="tiktokHandle" placeholder="@brandname" />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{dictionary.sectionBusiness}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={dictionary.companyNameLabel}>
            <Input name="companyName" />
          </Field>
          <Field label={dictionary.phoneLabel}>
            <Input name="phone" />
          </Field>
          <Field label={dictionary.countryLabel}>
            <Input name="country" placeholder={dictionary.countryPlaceholder} required />
          </Field>
        </div>
      </section>

      {state.message ? (
        <p className={state.success ? "text-sm text-emerald-200" : "text-sm text-amber-200"}>
          {state.message}
        </p>
      ) : null}

      <Button type="submit" className="h-12 rounded-2xl px-6" disabled={isPending}>
        {isPending ? dictionary.pending : dictionary.submit}
      </Button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-white/70">{label}</span>
      {children}
    </label>
  );
}
