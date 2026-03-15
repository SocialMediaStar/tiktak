"use client";

import { useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export function LogoUploadField({
  label,
  hint,
  buttonLabel,
  replaceLabel,
  removeLabel,
  emptyLabel,
  initialValue,
  tone = "dark",
  value,
  onValueChange,
}: {
  label: string;
  hint: string;
  buttonLabel: string;
  replaceLabel: string;
  removeLabel: string;
  emptyLabel: string;
  initialValue?: string | null;
  tone?: "dark" | "light";
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(initialValue ?? "");
  const [error, setError] = useState("");
  const currentPreview = value ?? preview;

  function setNextValue(nextValue: string) {
    if (onValueChange) {
      onValueChange(nextValue);
      return;
    }

    setPreview(nextValue);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError(hint);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(hint);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const nextValue = typeof reader.result === "string" ? reader.result : "";
      setNextValue(nextValue);
      setError("");
    };
    reader.onerror = () => {
      setError(hint);
    };
    reader.readAsDataURL(file);
  }

  const isLight = tone === "light";

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <span className={isLight ? "text-sm font-medium text-slate-600" : "text-sm text-white/70"}>
          {label}
        </span>
        <div
          className={
            isLight
              ? "flex items-center gap-4 rounded-[28px] border border-slate-200 bg-slate-50 p-4"
              : "flex items-center gap-4 rounded-[28px] border border-white/10 bg-white/[0.045] p-4"
          }
        >
          <div
            className={
              isLight
                ? "flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[24px] border border-slate-200 bg-white"
                : "flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-[#162030]"
            }
          >
            {currentPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentPreview} alt="" className="h-full w-full object-cover" />
            ) : (
              <span
                className={
                  isLight
                    ? "px-3 text-center text-[11px] uppercase tracking-[0.22em] text-slate-400"
                    : "px-3 text-center text-[11px] uppercase tracking-[0.22em] text-white/35"
                }
              >
                {emptyLabel}
              </span>
            )}
          </div>

          <div className="space-y-3">
            <input type="hidden" name="logoDataUrl" value={currentPreview} />
            <input
              ref={fileInputRef}
              id={inputId}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className={
                  isLight
                    ? "h-10 rounded-full border-slate-200 bg-white px-4 text-slate-900 hover:bg-slate-100"
                    : "h-10 rounded-full border-white/12 bg-white/5 px-4 text-white hover:bg-white/10"
                }
                onClick={() => fileInputRef.current?.click()}
              >
                {currentPreview ? replaceLabel : buttonLabel}
              </Button>
              {currentPreview ? (
                <Button
                  type="button"
                  variant="ghost"
                  className={
                    isLight
                      ? "h-10 rounded-full px-4 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                      : "h-10 rounded-full px-4 text-white/70 hover:bg-white/8 hover:text-white"
                  }
                  onClick={() => {
                    setNextValue("");
                    setError("");
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  {removeLabel}
                </Button>
              ) : null}
            </div>
            <p className={isLight ? "text-xs leading-6 text-slate-500" : "text-xs leading-6 text-white/45"}>
              {error || hint}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
