"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { defaultLocale, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLocalePath } from "@/i18n/locale-path";
import { prisma } from "@/lib/prisma";

export type OnboardingState = {
  success: boolean;
  message: string;
};

function normalizeOptionalString(value: FormDataEntryValue | null, max = 255) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

function normalizeLogoDataUrl(
  value: FormDataEntryValue | null,
  errorMessage: string,
) {
  return z
    .union([
      z.literal(""),
      z
        .string()
        .trim()
        .regex(/^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,[a-zA-Z0-9+/=]+$/, errorMessage)
        .max(3_000_000, errorMessage),
    ])
    .transform((input) => input || null)
    .safeParse(typeof value === "string" ? value : "");
}

export async function createBrandOnboarding(
  userId: string,
  _prevState: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const localeValue = formData.get("locale");
  const locale =
    typeof localeValue === "string" && isLocale(localeValue) ? localeValue : defaultLocale;
  const dictionary = getDictionary(locale).onboarding;

  const schema = z.object({
    name: z.string().trim().min(2, dictionary.validation.name),
    slug: z
      .string()
      .trim()
      .min(2, dictionary.validation.slug)
      .regex(/^[a-z0-9-]+$/, dictionary.validation.slugFormat),
    description: z.string().trim().min(12, dictionary.validation.description).max(300),
    contactEmail: z.email(dictionary.validation.contactEmail),
    supportEmail: z
      .union([z.literal(""), z.email(dictionary.validation.supportEmail)])
      .transform((value) => value || null),
    website: z
      .union([z.literal(""), z.url(dictionary.validation.website)])
      .transform((value) => value || null),
    tiktokHandle: z
      .string()
      .trim()
      .max(64)
      .transform((value) => value.replace(/^@/, "") || null),
    companyName: z
      .string()
      .trim()
      .max(120)
      .transform((value) => value || null),
    phone: z
      .string()
      .trim()
      .max(32)
      .transform((value) => value || null),
    country: z.string().trim().min(2, dictionary.validation.country),
    brandLocale: z.enum(locales),
  });

  const parsed = schema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    contactEmail: formData.get("contactEmail"),
    supportEmail: formData.get("supportEmail"),
    website: formData.get("website"),
    tiktokHandle: formData.get("tiktokHandle"),
    companyName: formData.get("companyName"),
    phone: formData.get("phone"),
    country: formData.get("country"),
    brandLocale: formData.get("brandLocale"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? dictionary.validation.generic,
    };
  }

  const logoDataUrl = normalizeLogoDataUrl(
    formData.get("logoDataUrl"),
    dictionary.validation.logoUpload,
  );

  if (!logoDataUrl.success) {
    return {
      success: false,
      message: logoDataUrl.error.issues[0]?.message ?? dictionary.validation.logoUpload,
    };
  }

  const existingMembership = await prisma.brandMember.findFirst({
    where: { userId },
    select: { id: true },
  });

  if (existingMembership) {
    return {
      success: false,
      message: dictionary.validation.alreadyExists,
    };
  }

  const existingBrand = await prisma.brand.findUnique({
    where: { slug: parsed.data.slug },
    select: { id: true },
  });

  if (existingBrand) {
    return {
      success: false,
      message: dictionary.validation.slugTaken,
    };
  }

  await prisma.brand.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      contactEmail: parsed.data.contactEmail,
      supportEmail: parsed.data.supportEmail,
      website: parsed.data.website,
      tiktokHandle: parsed.data.tiktokHandle,
      logoDataUrl: logoDataUrl.data,
      companyName: parsed.data.companyName,
      phone: parsed.data.phone,
      country: parsed.data.country,
      locale: parsed.data.brandLocale,
      onboardingCompleted: true,
      members: {
        create: {
          userId,
        },
      },
    },
  });

  revalidatePath(getLocalePath(locale, "/dashboard"));
  revalidatePath(getLocalePath(locale, "/onboarding"));

  return {
    success: true,
    message: dictionary.success,
  };
}

export async function updateBrandProfile(
  userId: string,
  brandId: string,
  _prevState: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const localeValue = formData.get("locale");
  const locale =
    typeof localeValue === "string" && isLocale(localeValue) ? localeValue : defaultLocale;
  const dictionary = getDictionary(locale).brandSettings;

  const schema = z.object({
    name: z.string().trim().min(2, dictionary.validation.name),
    description: z.string().trim().min(12, dictionary.validation.description).max(300),
    contactEmail: z.email(dictionary.validation.contactEmail),
    supportEmail: z
      .union([z.literal(""), z.email(dictionary.validation.supportEmail)])
      .transform((value) => value || null),
    website: z
      .union([z.literal(""), z.url(dictionary.validation.website)])
      .transform((value) => value || null),
    tiktokHandle: z
      .string()
      .trim()
      .max(64)
      .transform((value) => value.replace(/^@/, "") || null),
    companyName: z
      .string()
      .trim()
      .max(120)
      .transform((value) => value || null),
    phone: z
      .string()
      .trim()
      .max(32)
      .transform((value) => value || null),
    country: z.string().trim().min(2, dictionary.validation.country),
    brandLocale: z.enum(locales),
  });

  const parsed = schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    contactEmail: formData.get("contactEmail"),
    supportEmail: formData.get("supportEmail"),
    website: formData.get("website"),
    tiktokHandle: formData.get("tiktokHandle"),
    companyName: formData.get("companyName"),
    phone: formData.get("phone"),
    country: formData.get("country"),
    brandLocale: formData.get("brandLocale"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? dictionary.validation.generic,
    };
  }

  const logoDataUrl = normalizeLogoDataUrl(
    formData.get("logoDataUrl"),
    dictionary.validation.logoUpload,
  );

  if (!logoDataUrl.success) {
    return {
      success: false,
      message: logoDataUrl.error.issues[0]?.message ?? dictionary.validation.logoUpload,
    };
  }

  const membership = await prisma.brandMember.findFirst({
    where: {
      userId,
      brandId,
    },
    select: { id: true },
  });

  if (!membership) {
    return {
      success: false,
      message: dictionary.validation.unauthorized,
    };
  }

  await prisma.brand.update({
    where: { id: brandId },
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      contactEmail: parsed.data.contactEmail,
      supportEmail: parsed.data.supportEmail,
      website: parsed.data.website,
      tiktokHandle: parsed.data.tiktokHandle,
      logoDataUrl: logoDataUrl.data,
      companyName: parsed.data.companyName,
      phone: parsed.data.phone,
      country: parsed.data.country,
      locale: parsed.data.brandLocale,
    },
  });

  revalidatePath(getLocalePath(locale, "/dashboard"));
  revalidatePath(getLocalePath(locale, "/brand"));

  return {
    success: true,
    message: dictionary.success,
  };
}

export async function createBrandEvent(
  userId: string,
  brandId: string,
  _prevState: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const localeValue = formData.get("locale");
  const locale =
    typeof localeValue === "string" && isLocale(localeValue) ? localeValue : defaultLocale;
  const dictionary = getDictionary(locale).dashboard.events;

  const schema = z
    .object({
      title: z.string().trim().min(3, dictionary.validation.title).max(120),
      summary: z.string().trim().min(12, dictionary.validation.summary).max(500),
      startsAt: z.string().trim().min(1, dictionary.validation.startsAt),
      endsAt: z.string().trim().optional(),
      venue: z.string().trim().max(120).optional(),
      location: z.string().trim().max(120).optional(),
      capacity: z.string().trim().optional(),
      status: z.enum(["DRAFT", "PUBLISHED", "CANCELED"]),
      visibility: z.enum(["public", "private"]),
    })
    .superRefine((data, ctx) => {
      const startsAt = new Date(data.startsAt);
      const endsAt = data.endsAt ? new Date(data.endsAt) : null;

      if (Number.isNaN(startsAt.getTime())) {
        ctx.addIssue({
          code: "custom",
          message: dictionary.validation.startsAt,
          path: ["startsAt"],
        });
      }

      if (data.endsAt && (!endsAt || Number.isNaN(endsAt.getTime()))) {
        ctx.addIssue({
          code: "custom",
          message: dictionary.validation.endsAt,
          path: ["endsAt"],
        });
      }

      if (endsAt && startsAt > endsAt) {
        ctx.addIssue({
          code: "custom",
          message: dictionary.validation.endsAfterStart,
          path: ["endsAt"],
        });
      }
    });

  const parsed = schema.safeParse({
    title: formData.get("title"),
    summary: formData.get("summary"),
    startsAt: formData.get("startsAt"),
    endsAt: normalizeOptionalString(formData.get("endsAt")),
    venue: normalizeOptionalString(formData.get("venue"), 120) ?? "",
    location: normalizeOptionalString(formData.get("location"), 120) ?? "",
    capacity: normalizeOptionalString(formData.get("capacity"), 12) ?? "",
    status: formData.get("status"),
    visibility: formData.get("visibility"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? dictionary.validation.generic,
    };
  }

  const membership = await prisma.brandMember.findFirst({
    where: {
      userId,
      brandId,
    },
    select: { id: true },
  });

  if (!membership) {
    return {
      success: false,
      message: dictionary.validation.unauthorized,
    };
  }

  const capacityValue = parsed.data.capacity ? Number.parseInt(parsed.data.capacity, 10) : null;

  if (parsed.data.capacity && (!capacityValue || capacityValue < 1)) {
    return {
      success: false,
      message: dictionary.validation.capacity,
    };
  }

  await prisma.event.create({
    data: {
      brandId,
      title: parsed.data.title,
      summary: parsed.data.summary,
      startsAt: new Date(parsed.data.startsAt),
      endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : null,
      venue: parsed.data.venue || null,
      location: parsed.data.location || null,
      capacity: capacityValue,
      status: parsed.data.status,
      isPublic: parsed.data.visibility === "public",
    },
  });

  revalidatePath(getLocalePath(locale, "/dashboard"));

  return {
    success: true,
    message: dictionary.success,
  };
}
