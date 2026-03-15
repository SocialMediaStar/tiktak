"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { LogoUploadField } from "@/components/brand/logo-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { getLocalePath } from "@/i18n/locale-path";
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
      router.push(getLocalePath(locale, "/dashboard"));
    }
  }, [locale, router, state.success]);

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="locale" value={locale} />

      <Section title={dictionary.sectionBrand}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={dictionary.nameLabel}>
            <Input
              name="name"
              placeholder={dictionary.namePlaceholder}
              required
              className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-950 placeholder:text-slate-400"
            />
          </Field>
          <Field label={dictionary.slugLabel}>
            <Input
              name="slug"
              placeholder={dictionary.slugPlaceholder}
              required
              className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-950 placeholder:text-slate-400"
            />
          </Field>
        </div>
        <Field label={dictionary.descriptionLabel}>
          <textarea
            name="description"
            required
            minLength={12}
            maxLength={300}
            placeholder={dictionary.descriptionPlaceholder}
            className="min-h-32 w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-orange-300/70"
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <LogoUploadField
            label={dictionary.logoUploadLabel}
            hint={dictionary.logoUploadHint}
            buttonLabel={dictionary.logoUploadButton}
            replaceLabel={dictionary.logoReplaceButton}
            removeLabel={dictionary.logoRemoveButton}
            emptyLabel={dictionary.logoEmpty}
            tone="light"
          />
          <Field label={dictionary.brandLocaleLabel}>
            <select
              name="brandLocale"
              defaultValue={locale}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none"
            >
              <option value="et">Eesti</option>
              <option value="en">English</option>
            </select>
          </Field>
        </div>
      </Section>

      <Section title={dictionary.sectionContact}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={dictionary.contactEmailLabel}>
            <Input
              name="contactEmail"
              type="email"
              required
              className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-950 placeholder:text-slate-400"
            />
          </Field>
          <Field label={dictionary.supportEmailLabel}>
            <Input
              name="supportEmail"
              type="email"
              className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-950 placeholder:text-slate-400"
            />
          </Field>
          <Field label={dictionary.websiteLabel}>
            <Input
              name="website"
              placeholder="https://..."
              className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-950 placeholder:text-slate-400"
            />
          </Field>
          <Field label={dictionary.tiktokLabel}>
            <Input
              name="tiktokHandle"
              placeholder="@brandname"
              className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-950 placeholder:text-slate-400"
            />
          </Field>
        </div>
      </Section>

      <Section title={dictionary.sectionBusiness}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={dictionary.companyNameLabel}>
            <Input
              name="companyName"
              className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-950 placeholder:text-slate-400"
            />
          </Field>
          <Field label={dictionary.phoneLabel}>
            <Input
              name="phone"
              className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-950 placeholder:text-slate-400"
            />
          </Field>
          <Field label={dictionary.countryLabel}>
            <Input
              name="country"
              placeholder={dictionary.countryPlaceholder}
              required
              className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-950 placeholder:text-slate-400"
            />
          </Field>
        </div>
      </Section>

      {state.message ? (
        <p className={state.success ? "text-sm text-emerald-700" : "text-sm text-amber-700"}>
          {state.message}
        </p>
      ) : null}

      <Button
        type="submit"
        className="h-12 rounded-full bg-slate-950 px-6 text-white hover:bg-slate-800"
        disabled={isPending}
      >
        {isPending ? dictionary.pending : dictionary.submit}
      </Button>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5 rounded-[32px] border border-slate-200 bg-slate-50/80 p-5 sm:p-6">
      <div>
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-slate-950">{title}</h2>
      </div>
      {children}
    </section>
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
      <span className="text-sm font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}
