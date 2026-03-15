import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { CalendarDays, Globe, Mail, MapPin, Phone, Plus, Radio, Users } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { CreateEventForm } from "@/components/dashboard/create-event-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { getUserBrandDashboardData } from "@/lib/brand";
import { createBrandEvent } from "@/lib/onboarding-actions";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLocalePath } from "@/i18n/locale-path";
import { resolveLocale } from "@/i18n/resolve-locale";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect(getLocalePath(locale, "/signin"));
  }

  const membership = await getUserBrandDashboardData(session.user.id);

  if (!membership?.brand.onboardingCompleted) {
    redirect(getLocalePath(locale, "/onboarding"));
  }

  const { brand } = membership;
  const eventAction = createBrandEvent.bind(null, session.user.id, brand.id);
  const publishedEvents = brand.events.filter((event) => event.status === "PUBLISHED");
  const upcomingEvents = brand.events.filter((event) => event.startsAt >= new Date());
  const stats = [
    {
      label: dictionary.dashboard.stats.events,
      value: String(brand.events.length),
      tone: "from-orange-500/30 to-orange-300/5",
    },
    {
      label: dictionary.dashboard.stats.published,
      value: String(publishedEvents.length),
      tone: "from-sky-500/25 to-sky-300/5",
    },
    {
      label: dictionary.dashboard.stats.upcoming,
      value: String(upcomingEvents.length),
      tone: "from-emerald-500/25 to-emerald-300/5",
    },
    {
      label: dictionary.dashboard.stats.team,
      value: String(brand.members.length),
      tone: "from-fuchsia-500/25 to-fuchsia-300/5",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0b1020] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.22),_transparent_28%),linear-gradient(135deg,_rgba(21,28,46,0.98),_rgba(9,13,24,0.96))] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
          <div className="border-b border-white/10 px-6 py-5 sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <BrandAvatar brand={brand} />
                <div className="space-y-3">
                  <div className="inline-flex rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-orange-200/90">
                    {dictionary.dashboard.pageBadge}
                  </div>
                  <div>
                    <h1 className="text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                      {brand.name}
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                      {brand.description || dictionary.dashboard.descriptionFallback}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-white/55 sm:text-sm">
                    <MetaPill icon={<Users className="size-4" />}>
                      {dictionary.dashboard.signedInAs}: {session.user.email}
                    </MetaPill>
                    <MetaPill icon={<Radio className="size-4" />}>@{brand.slug}</MetaPill>
                    <MetaPill icon={<MapPin className="size-4" />}>{brand.country}</MetaPill>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  className="h-11 rounded-full bg-white text-slate-950 hover:bg-white/90"
                >
                  <Link href={getLocalePath(locale, "/brand")}>
                    {dictionary.dashboard.manageBrand}
                  </Link>
                </Button>
                <SignOutButton locale={locale} label={dictionary.dashboard.signOut} />
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-6 py-5 sm:grid-cols-2 xl:grid-cols-4 sm:px-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-[28px] border border-white/10 bg-gradient-to-br ${stat.tone} p-5`}
              >
                <p className="text-sm text-white/55">{stat.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_360px]">
          <div className="space-y-6">
            <Card className="rounded-[32px] border-white/10 bg-white/[0.04] py-0 text-white backdrop-blur-xl">
              <CardHeader className="border-b border-white/10 px-6 py-6 sm:px-8">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-orange-400/15 text-orange-200">
                    <Plus className="size-5" />
                  </span>
                  {dictionary.dashboard.events.createTitle}
                </CardTitle>
                <p className="text-sm leading-7 text-white/58">
                  {dictionary.dashboard.events.createDescription}
                </p>
              </CardHeader>
              <CardContent className="px-6 py-6 sm:px-8">
                <CreateEventForm
                  action={eventAction}
                  locale={locale}
                  dictionary={dictionary.dashboard.events}
                />
              </CardContent>
            </Card>

            <Card className="rounded-[32px] border-white/10 bg-white/[0.04] py-0 text-white backdrop-blur-xl">
              <CardHeader className="border-b border-white/10 px-6 py-6 sm:px-8">
                <CardTitle className="text-xl">{dictionary.dashboard.events.feedTitle}</CardTitle>
                <p className="text-sm leading-7 text-white/58">
                  {dictionary.dashboard.events.feedDescription}
                </p>
              </CardHeader>
              <CardContent className="space-y-4 px-6 py-6 sm:px-8">
                {brand.events.length ? (
                  brand.events.map((event) => (
                    <article
                      key={event.id}
                      className="rounded-[28px] border border-white/10 bg-[#11182a] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.22)]"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/45">
                            <span className={statusClassName(event.status)}>
                              {dictionary.dashboard.events.statuses[event.status]}
                            </span>
                            <span>
                              {event.isPublic
                                ? dictionary.dashboard.events.visibilityPublic
                                : dictionary.dashboard.events.visibilityPrivate}
                            </span>
                          </div>
                          <h2 className="text-2xl font-semibold tracking-[-0.04em]">
                            {event.title}
                          </h2>
                          <p className="max-w-3xl text-sm leading-7 text-white/65">
                            {event.summary}
                          </p>
                        </div>
                        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/65">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="size-4 text-orange-200" />
                            {formatDate(locale, event.startsAt)}
                          </div>
                          {event.endsAt ? (
                            <div className="mt-2 text-white/45">
                              {dictionary.dashboard.events.until} {formatDate(locale, event.endsAt)}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <EventMeta
                          icon={<MapPin className="size-4" />}
                          label={dictionary.dashboard.events.venueCard}
                          value={event.venue || dictionary.dashboard.emptyValue}
                        />
                        <EventMeta
                          icon={<Globe className="size-4" />}
                          label={dictionary.dashboard.events.locationCard}
                          value={event.location || dictionary.dashboard.emptyValue}
                        />
                        <EventMeta
                          icon={<Users className="size-4" />}
                          label={dictionary.dashboard.events.capacityCard}
                          value={
                            event.capacity
                              ? String(event.capacity)
                              : dictionary.dashboard.emptyValue
                          }
                        />
                        <EventMeta
                          icon={<Radio className="size-4" />}
                          label={dictionary.dashboard.events.visibilityCard}
                          value={
                            event.isPublic
                              ? dictionary.dashboard.events.visibilityPublic
                              : dictionary.dashboard.events.visibilityPrivate
                          }
                        />
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[28px] border border-dashed border-white/12 bg-white/[0.03] px-6 py-10 text-center text-white/55">
                    <p className="text-lg font-medium text-white/82">
                      {dictionary.dashboard.events.emptyTitle}
                    </p>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-7">
                      {dictionary.dashboard.events.emptyDescription}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card className="rounded-[32px] border-white/10 bg-white/[0.04] py-0 text-white backdrop-blur-xl">
              <CardHeader className="border-b border-white/10 px-6 py-6">
                <CardTitle className="text-xl">{dictionary.dashboard.brandPanelTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-6 py-6">
                <PanelRow
                  icon={<Mail className="size-4" />}
                  label={dictionary.dashboard.contactEmail}
                  value={brand.contactEmail}
                />
                <PanelRow
                  icon={<Mail className="size-4" />}
                  label={dictionary.dashboard.supportEmail}
                  value={brand.supportEmail || dictionary.dashboard.emptyValue}
                />
                <PanelRow
                  icon={<Globe className="size-4" />}
                  label={dictionary.dashboard.website}
                  value={brand.website || dictionary.dashboard.emptyValue}
                  href={brand.website || undefined}
                />
                <PanelRow
                  icon={<Radio className="size-4" />}
                  label={dictionary.dashboard.tiktok}
                  value={brand.tiktokHandle ? `@${brand.tiktokHandle}` : dictionary.dashboard.emptyValue}
                />
                <PanelRow
                  icon={<Phone className="size-4" />}
                  label={dictionary.dashboard.phone}
                  value={brand.phone || dictionary.dashboard.emptyValue}
                />
              </CardContent>
            </Card>

            <Card className="rounded-[32px] border-white/10 bg-white/[0.04] py-0 text-white backdrop-blur-xl">
              <CardHeader className="border-b border-white/10 px-6 py-6">
                <CardTitle className="text-xl">{dictionary.dashboard.teamPanelTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-6 py-6">
                {brand.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-white">
                        {member.user.name || member.user.email || dictionary.dashboard.memberFallback}
                      </p>
                      <p className="text-sm text-white/45">{member.user.email}</p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/55">
                      {member.role}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </section>
      </div>
    </main>
  );
}

function BrandAvatar({
  brand,
}: {
  brand: {
    name: string;
    logoDataUrl: string | null;
    logoUrl: string | null;
  };
}) {
  const src = brand.logoDataUrl || brand.logoUrl;

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={brand.name}
        className="h-24 w-24 rounded-[30px] border border-white/10 object-cover shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
      />
    );
  }

  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-[30px] border border-white/10 bg-gradient-to-br from-orange-400/30 to-fuchsia-400/20 text-3xl font-semibold tracking-[-0.04em] shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
      {brand.name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function MetaPill({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
      {icon}
      {children}
    </span>
  );
}

function PanelRow({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/40">
        {icon}
        {label}
      </div>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="mt-2 block break-all text-sm text-white/82 hover:text-white"
        >
          {value}
        </a>
      ) : (
        <p className="mt-2 break-all text-sm text-white/82">{value}</p>
      )}
    </div>
  );
}

function EventMeta({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/40">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-sm text-white/82">{value}</p>
    </div>
  );
}

function formatDate(locale: string, value: Date) {
  return new Intl.DateTimeFormat(locale === "et" ? "et-EE" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function statusClassName(status: "DRAFT" | "PUBLISHED" | "CANCELED") {
  switch (status) {
    case "PUBLISHED":
      return "rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-emerald-200";
    case "CANCELED":
      return "rounded-full border border-rose-400/20 bg-rose-400/10 px-2.5 py-1 text-rose-200";
    default:
      return "rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-amber-200";
  }
}
