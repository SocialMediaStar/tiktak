import "server-only";

import { Resend } from "resend";
import type { SendVerificationRequestParams } from "next-auth/providers/email";

import { env } from "@/lib/env";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLocaleFromCallbackUrl } from "@/i18n/get-locale-from-callback-url";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendAuthEmail({
  identifier,
  url,
}: SendVerificationRequestParams) {
  const locale = getLocaleFromUrl(url);
  const dictionary = getDictionary(locale).authEmail;
  const host = new URL(url).host;

  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: identifier,
    subject: dictionary.subject.replace("{host}", host),
    text: buildText({ dictionary, url, host }),
    html: buildHtml({ dictionary, url, host }),
  });

  if (error) {
    throw new Error(`Auth email could not be sent: ${error.message}`);
  }
}

function getLocaleFromUrl(url: string) {
  const callbackUrl = new URL(url).searchParams.get("callbackUrl");
  return getLocaleFromCallbackUrl(callbackUrl);
}

function buildText({
  dictionary,
  url,
  host,
}: {
  dictionary: ReturnType<typeof getDictionary>["authEmail"];
  url: string;
  host: string;
}) {
  return `${dictionary.title.replace("{host}", host)}\n${dictionary.copy}\n${url}\n\n${dictionary.ignore}`;
}

function buildHtml({
  dictionary,
  url,
  host,
}: {
  dictionary: ReturnType<typeof getDictionary>["authEmail"];
  url: string;
  host: string;
}) {
  const title = dictionary.title.replace("{host}", host);

  return `
  <body style="margin:0;background:#0b1220;padding:32px 16px;font-family:Inter,Arial,sans-serif;color:#e5e7eb;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;border-radius:28px;overflow:hidden;background:linear-gradient(160deg,#1f2937,#0f172a);border:1px solid rgba(255,255,255,0.08);">
      <tr>
        <td style="padding:32px 32px 16px;">
          <div style="display:inline-block;border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.06);border-radius:999px;padding:8px 12px;font-size:11px;letter-spacing:0.24em;text-transform:uppercase;color:rgba(255,255,255,0.72);">
            TikPop
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:0 32px 8px;font-size:34px;line-height:1.15;font-weight:700;color:#ffffff;">
          ${escapeHtml(title)}
        </td>
      </tr>
      <tr>
        <td style="padding:0 32px 24px;font-size:16px;line-height:1.8;color:rgba(255,255,255,0.72);">
          ${escapeHtml(dictionary.copy)}
        </td>
      </tr>
      <tr>
        <td style="padding:0 32px 24px;">
          <a href="${url}" target="_blank" style="display:inline-block;border-radius:16px;background:#f97316;padding:14px 20px;font-size:15px;font-weight:700;color:#fff;text-decoration:none;">
            ${escapeHtml(dictionary.button)}
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding:0 32px 32px;font-size:13px;line-height:1.8;color:rgba(255,255,255,0.48);">
          ${escapeHtml(dictionary.ignore)}
        </td>
      </tr>
    </table>
  </body>`;
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
