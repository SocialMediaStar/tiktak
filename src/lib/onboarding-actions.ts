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
    logoUrl: z
      .union([z.literal(""), z.url(dictionary.validation.logoUrl)])
      .transform((value) => value || null),
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
    logoUrl: formData.get("logoUrl"),
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
      logoUrl: parsed.data.logoUrl,
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
    logoUrl: z
      .union([z.literal(""), z.url(dictionary.validation.logoUrl)])
      .transform((value) => value || null),
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
    logoUrl: formData.get("logoUrl"),
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
      logoUrl: parsed.data.logoUrl,
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
