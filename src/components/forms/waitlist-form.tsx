"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { joinWaitlist, type WaitlistState } from "@/lib/actions";

const initialState: WaitlistState = {
  message: "",
  success: false,
};

export function WaitlistForm({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary["waitlist"];
}) {
  const formSchema = z.object({
    email: z.email(dictionary.invalidEmail),
  });
  type FormValues = z.infer<typeof formSchema>;
  const [state, formAction, isPending] = useActionState(joinWaitlist, initialState);
  const {
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="locale" value={locale} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          {...register("email")}
          name="email"
          type="email"
          placeholder={dictionary.placeholder}
          className="h-12 border-white/30 bg-white/80 text-sm text-slate-950 backdrop-blur"
        />
        <Button type="submit" className="h-12 px-6" disabled={isPending}>
          {isPending ? dictionary.pending : dictionary.submit}
        </Button>
      </div>
      {errors.email ? (
        <p className="text-sm text-amber-200">{errors.email.message}</p>
      ) : null}
      {state.message ? (
        <p className={state.success ? "text-sm text-emerald-200" : "text-sm text-amber-200"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
