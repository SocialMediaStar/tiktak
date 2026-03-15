"use client";

import { useActionState } from "react";

import { LogoUploadField } from "@/components/brand/logo-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Brand } from "@prisma/client";
import type { OnboardingState } from "@/lib/onboarding-actions";

const initialState: OnboardingState = {
  success: false,
  message: "",
};

export function BrandSettingsForm({
  action,
  locale,
  dictionary,
  brand,
}: {
  action: (
    state: OnboardingState,
    formData: FormData,
  ) => Promise<OnboardingState>;
  locale: Locale;
  dictionary: Dictionary["brandSettings"];
  brand: Brand;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="locale" value={locale} />

      <section className="grid gap-4 md:grid-cols-2">
        <Field label={dictionary.nameLabel}>
          <Input name="name" defaultValue={brand.name} required />
        </Field>
        <LogoUploadField
          label={dictionary.logoUploadLabel}
          hint={dictionary.logoUploadHint}
          buttonLabel={dictionary.logoUploadButton}
          replaceLabel={dictionary.logoReplaceButton}
          removeLabel={dictionary.logoRemoveButton}
          emptyLabel={dictionary.logoEmpty}
          initialValue={brand.logoDataUrl ?? brand.logoUrl}
        />
      </section>

      <Field label={dictionary.descriptionLabel}>
        <textarea
          name="description"
          required
          minLength={12}
          maxLength={300}
          defaultValue={brand.description ?? ""}
          className="min-h-32 w-full rounded-2xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-orange-300/40"
        />
      </Field>

      <section className="grid gap-4 md:grid-cols-2">
        <Field label={dictionary.contactEmailLabel}>
          <Input name="contactEmail" type="email" defaultValue={brand.contactEmail} required />
        </Field>
        <Field label={dictionary.supportEmailLabel}>
          <Input name="supportEmail" type="email" defaultValue={brand.supportEmail ?? ""} />
        </Field>
        <Field label={dictionary.websiteLabel}>
          <Input name="website" defaultValue={brand.website ?? ""} placeholder="https://..." />
        </Field>
        <Field label={dictionary.tiktokLabel}>
          <Input name="tiktokHandle" defaultValue={brand.tiktokHandle ?? ""} placeholder="@brand" />
        </Field>
        <Field label={dictionary.companyNameLabel}>
          <Input name="companyName" defaultValue={brand.companyName ?? ""} />
        </Field>
        <Field label={dictionary.phoneLabel}>
          <Input name="phone" defaultValue={brand.phone ?? ""} />
        </Field>
        <Field label={dictionary.countryLabel}>
          <Input name="country" defaultValue={brand.country} required />
        </Field>
        <Field label={dictionary.brandLocaleLabel}>
          <select
            name="brandLocale"
            defaultValue={brand.locale}
            className="h-12 w-full rounded-2xl border border-white/12 bg-[#101827] px-4 text-sm text-white outline-none"
          >
            <option value="et">Eesti</option>
            <option value="en">English</option>
          </select>
        </Field>
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
