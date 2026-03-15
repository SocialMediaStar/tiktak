"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState({
    name: "",
    slug: "",
    description: "",
    logoDataUrl: "",
    brandLocale: locale,
    contactEmail: "",
    supportEmail: "",
    website: "",
    tiktokHandle: "",
    companyName: "",
    phone: "",
    country: "",
  });

  function updateValue(
    key: keyof typeof formValues,
    value: string,
  ) {
    setFormValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  const steps = [
    {
      title: dictionary.sectionBrand,
      description: dictionary.stepBrandCopy,
      fields: (
        <>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.9fr)]">
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label={dictionary.nameLabel}>
                  <Input
                    name="name"
                    value={formValues.name}
                    onChange={(event) => updateValue("name", event.target.value)}
                    placeholder={dictionary.namePlaceholder}
                    required
                    className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-950 placeholder:text-slate-400"
                  />
                </Field>
                <Field label={dictionary.slugLabel}>
                  <div className="space-y-2">
                    <div className="flex h-12 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      <div className="hidden items-center border-r border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-500 sm:flex">
                        tiktak.ee/
                      </div>
                      <Input
                        name="slug"
                        value={formValues.slug}
                        onChange={(event) => updateValue("slug", event.target.value)}
                        placeholder={dictionary.slugPlaceholder}
                        required
                        className="h-full rounded-none border-0 bg-transparent px-4 text-slate-950 placeholder:text-slate-400 focus-visible:ring-0"
                      />
                    </div>
                    <p className="text-sm leading-6 text-slate-500">{dictionary.slugHint}</p>
                  </div>
                </Field>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-4 sm:p-5">
                <Field label={dictionary.descriptionLabel}>
                  <textarea
                    name="description"
                    value={formValues.description}
                    onChange={(event) => updateValue("description", event.target.value)}
                    required
                    minLength={12}
                    maxLength={300}
                    placeholder={dictionary.descriptionPlaceholder}
                    className="min-h-44 w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-orange-300/70"
                  />
                </Field>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[28px] border border-slate-200 bg-white p-4 sm:p-5">
                <LogoUploadField
                  label={dictionary.logoUploadLabel}
                  hint={dictionary.logoUploadHint}
                  buttonLabel={dictionary.logoUploadButton}
                  replaceLabel={dictionary.logoReplaceButton}
                  removeLabel={dictionary.logoRemoveButton}
                  emptyLabel={dictionary.logoEmpty}
                  tone="light"
                  layout="compact"
                  value={formValues.logoDataUrl}
                  onValueChange={(value) => updateValue("logoDataUrl", value)}
                />
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 sm:p-5">
                <Field label={dictionary.brandLocaleLabel}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <LanguageOption
                      active={formValues.brandLocale === "et"}
                      label="Eesti"
                      value="et"
                      onSelect={(value) => updateValue("brandLocale", value)}
                    />
                    <LanguageOption
                      active={formValues.brandLocale === "en"}
                      label="English"
                      value="en"
                      onSelect={(value) => updateValue("brandLocale", value)}
                    />
                  </div>
                </Field>
                <input type="hidden" name="brandLocale" value={formValues.brandLocale} />
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      title: dictionary.sectionContact,
      description: dictionary.stepContactCopy,
      fields: (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={dictionary.contactEmailLabel}>
            <Input
              name="contactEmail"
              type="email"
              value={formValues.contactEmail}
              onChange={(event) => updateValue("contactEmail", event.target.value)}
              required
              className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-950 placeholder:text-slate-400"
            />
          </Field>
          <Field label={dictionary.supportEmailLabel}>
            <Input
              name="supportEmail"
              type="email"
              value={formValues.supportEmail}
              onChange={(event) => updateValue("supportEmail", event.target.value)}
              className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-950 placeholder:text-slate-400"
            />
          </Field>
          <Field label={dictionary.websiteLabel}>
            <Input
              name="website"
              value={formValues.website}
              onChange={(event) => updateValue("website", event.target.value)}
              placeholder="https://..."
              className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-950 placeholder:text-slate-400"
            />
          </Field>
          <Field label={dictionary.tiktokLabel}>
            <Input
              name="tiktokHandle"
              value={formValues.tiktokHandle}
              onChange={(event) => updateValue("tiktokHandle", event.target.value)}
              placeholder="@brandname"
              className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-950 placeholder:text-slate-400"
            />
          </Field>
        </div>
      ),
    },
    {
      title: dictionary.sectionBusiness,
      description: dictionary.stepLaunchCopy,
      fields: (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={dictionary.companyNameLabel}>
            <Input
              name="companyName"
              value={formValues.companyName}
              onChange={(event) => updateValue("companyName", event.target.value)}
              className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-950 placeholder:text-slate-400"
            />
          </Field>
          <Field label={dictionary.phoneLabel}>
            <Input
              name="phone"
              value={formValues.phone}
              onChange={(event) => updateValue("phone", event.target.value)}
              className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-950 placeholder:text-slate-400"
            />
          </Field>
          <Field label={dictionary.countryLabel}>
            <Input
              name="country"
              value={formValues.country}
              onChange={(event) => updateValue("country", event.target.value)}
              placeholder={dictionary.countryPlaceholder}
              required
              className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-950 placeholder:text-slate-400"
            />
          </Field>
        </div>
      ),
    },
  ] as const;

  useEffect(() => {
    if (state.success) {
      router.push(getLocalePath(locale, "/dashboard"));
    }
  }, [locale, router, state.success]);

  const isLastStep = currentStep === steps.length - 1;

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="name" value={formValues.name} />
      <input type="hidden" name="slug" value={formValues.slug} />
      <input type="hidden" name="description" value={formValues.description} />
      <input type="hidden" name="logoDataUrl" value={formValues.logoDataUrl} />
      <input type="hidden" name="contactEmail" value={formValues.contactEmail} />
      <input type="hidden" name="supportEmail" value={formValues.supportEmail} />
      <input type="hidden" name="website" value={formValues.website} />
      <input type="hidden" name="tiktokHandle" value={formValues.tiktokHandle} />
      <input type="hidden" name="companyName" value={formValues.companyName} />
      <input type="hidden" name="phone" value={formValues.phone} />
      <input type="hidden" name="country" value={formValues.country} />

      <div className="flex flex-wrap items-center gap-3">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isComplete = index < currentStep;

          return (
            <button
              key={step.title}
              type="button"
              onClick={() => setCurrentStep(index)}
              className={
                isActive
                  ? "rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                  : isComplete
                    ? "rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700"
                    : "rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500"
              }
            >
              {index + 1}. {step.title}
            </button>
          );
        })}
      </div>

      <Section title={steps[currentStep].title} description={steps[currentStep].description}>
        {steps[currentStep].fields}
      </Section>

      {state.message ? (
        <p className={state.success ? "text-sm text-emerald-700" : "text-sm text-amber-700"}>
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-500">
          {dictionary.stepCounter
            .replace("{current}", String(currentStep + 1))
            .replace("{total}", String(steps.length))}
        </div>
        <div className="flex items-center gap-3">
          {currentStep > 0 ? (
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-full border-slate-200 bg-white px-5 text-slate-900 hover:bg-slate-100"
              onClick={() => setCurrentStep((step) => step - 1)}
            >
              <ChevronLeft className="size-4" />
              {dictionary.back}
            </Button>
          ) : null}
          {isLastStep ? (
            <Button
              type="submit"
              className="h-12 rounded-full bg-slate-950 px-6 text-white hover:bg-slate-800"
              disabled={isPending}
            >
              {isPending ? dictionary.pending : dictionary.submit}
            </Button>
          ) : (
            <Button
              type="button"
              className="h-12 rounded-full bg-slate-950 px-6 text-white hover:bg-slate-800"
              onClick={() => setCurrentStep((step) => step + 1)}
            >
              {dictionary.next}
              <ChevronRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5 rounded-[32px] border border-slate-200 bg-slate-50/80 p-5 sm:p-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-slate-950">{title}</h2>
        <p className="text-sm leading-7 text-slate-600">{description}</p>
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

function LanguageOption({
  active,
  label,
  value,
  onSelect,
}: {
  active: boolean;
  label: string;
  value: string;
  onSelect: (value: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={
        active
          ? "rounded-[22px] border border-slate-900 bg-slate-900 px-4 py-4 text-left text-white"
          : "rounded-[22px] border border-slate-200 bg-white px-4 py-4 text-left text-slate-600 hover:border-slate-300"
      }
    >
      <div className="text-sm font-medium">{label}</div>
    </button>
  );
}
