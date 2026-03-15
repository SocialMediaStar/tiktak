"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { OnboardingState } from "@/lib/onboarding-actions";

const initialState: OnboardingState = {
  success: false,
  message: "",
};

export function CreateEventForm({
  action,
  locale,
  dictionary,
}: {
  action: (state: OnboardingState, formData: FormData) => Promise<OnboardingState>;
  locale: Locale;
  dictionary: Dictionary["dashboard"]["events"];
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />

      <div className="grid gap-4 md:grid-cols-2">
        <Field label={dictionary.titleLabel}>
          <Input
            name="title"
            placeholder={dictionary.titlePlaceholder}
            required
            className="h-12 rounded-2xl border-white/12 bg-white/[0.045] px-4 text-white"
          />
        </Field>
        <Field label={dictionary.startsAtLabel}>
          <Input
            name="startsAt"
            type="datetime-local"
            required
            className="h-12 rounded-2xl border-white/12 bg-white/[0.045] px-4 text-white"
          />
        </Field>
      </div>

      <Field label={dictionary.summaryLabel}>
        <textarea
          name="summary"
          required
          minLength={12}
          maxLength={500}
          placeholder={dictionary.summaryPlaceholder}
          className="min-h-28 w-full rounded-[24px] border border-white/12 bg-white/[0.045] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-orange-300/40"
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label={dictionary.endsAtLabel}>
          <Input
            name="endsAt"
            type="datetime-local"
            className="h-12 rounded-2xl border-white/12 bg-white/[0.045] px-4 text-white"
          />
        </Field>
        <Field label={dictionary.venueLabel}>
          <Input
            name="venue"
            placeholder={dictionary.venuePlaceholder}
            className="h-12 rounded-2xl border-white/12 bg-white/[0.045] px-4 text-white"
          />
        </Field>
        <Field label={dictionary.locationLabel}>
          <Input
            name="location"
            placeholder={dictionary.locationPlaceholder}
            className="h-12 rounded-2xl border-white/12 bg-white/[0.045] px-4 text-white"
          />
        </Field>
        <Field label={dictionary.capacityLabel}>
          <Input
            name="capacity"
            type="number"
            min="1"
            placeholder="150"
            className="h-12 rounded-2xl border-white/12 bg-white/[0.045] px-4 text-white"
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label={dictionary.statusLabel}>
          <select
            name="status"
            defaultValue="PUBLISHED"
            className="h-12 w-full rounded-2xl border border-white/12 bg-[#101827] px-4 text-sm text-white outline-none"
          >
            <option value="DRAFT">{dictionary.statusDraft}</option>
            <option value="PUBLISHED">{dictionary.statusPublished}</option>
            <option value="CANCELED">{dictionary.statusCanceled}</option>
          </select>
        </Field>
        <Field label={dictionary.visibilityLabel}>
          <select
            name="visibility"
            defaultValue="public"
            className="h-12 w-full rounded-2xl border border-white/12 bg-[#101827] px-4 text-sm text-white outline-none"
          >
            <option value="public">{dictionary.visibilityPublic}</option>
            <option value="private">{dictionary.visibilityPrivate}</option>
          </select>
        </Field>
      </div>

      {state.message ? (
        <p className={state.success ? "text-sm text-emerald-200" : "text-sm text-amber-200"}>
          {state.message}
        </p>
      ) : null}

      <Button type="submit" className="h-12 rounded-full px-6" disabled={isPending}>
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
