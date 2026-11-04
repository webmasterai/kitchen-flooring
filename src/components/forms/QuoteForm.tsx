"use client";

import { useId, useState, type FormEvent } from "react";
import { quoteServiceOptions } from "@/lib/content";
import { IconLock } from "@/components/icons/Icons";
import { cn } from "@/lib/cn";

type FieldErrors = Record<string, string[] | undefined>;

export type QuoteFormCopy = {
  heading?: string;
  body?: string;
  submitLabel?: string;
  privacyNote?: string;
  successMessage?: string;
  emailSkippedMessage?: string;
  emailFailedMessage?: string;
  labels?: Partial<{
    name: string;
    email: string;
    phone: string;
    service: string;
    areaSize: string;
    budget: string;
    message: string;
  }>;
  placeholders?: Partial<{
    name: string;
    email: string;
    phone: string;
    areaSize: string;
    message: string;
  }>;
  budgetOptions?: Array<{ value: string; label: string }>;
};

type Props = {
  compact?: boolean;
  variant?: "default" | "contact";
  formIdAttr?: string;
  copy?: QuoteFormCopy;
  className?: string;
  defaultService?: string;
};

export function QuoteForm({
  compact = false,
  variant = "default",
  formIdAttr,
  copy,
  className,
  defaultService,
}: Props) {
  const formId = useId();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [notifyNote, setNotifyNote] = useState<string | null>(null);

  const isContact = variant === "contact";
  const labels = {
    name: copy?.labels?.name ?? "Name",
    email: copy?.labels?.email ?? "Email",
    phone: copy?.labels?.phone ?? "Phone",
    service: copy?.labels?.service ?? "Service Interested In",
    areaSize: copy?.labels?.areaSize ?? "Area size",
    budget: copy?.labels?.budget ?? "Budget",
    message: copy?.labels?.message ?? "Tell us about your project",
  };
  const placeholders = copy?.placeholders ?? {};
  const budgetOptions = copy?.budgetOptions ?? [];
  const submitLabel = copy?.submitLabel ?? "Request My Free Quote";
  const successMessage =
    copy?.successMessage ?? "Thanks — your request was saved. We’ll follow up soon.";
  const privacyNote =
    copy?.privacyNote ?? "We’ll use your details to respond to your inquiry.";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFormError(null);
    setErrors({});
    setSuccessId(null);
    setNotifyNote(null);

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const json = (await res.json()) as {
        ok?: boolean;
        id?: string;
        error?: string;
        fieldErrors?: FieldErrors;
        notificationStatus?: string;
      };

      if (!res.ok) {
        setErrors(json.fieldErrors || {});
        setFormError(json.error || "Unable to submit your request.");
        return;
      }

      setSuccessId(json.id || "saved");
      if (json.notificationStatus === "skipped") {
        setNotifyNote(
          copy?.emailSkippedMessage ??
            "Your request was saved. Email notification is not configured on this server.",
        );
      } else if (json.notificationStatus === "failed") {
        setNotifyNote(
          copy?.emailFailedMessage ??
            "Your request was saved, but we could not send the notification email.",
        );
      }
      form.reset();
    } catch {
      setFormError("Network error. Please try again or call us.");
    } finally {
      setPending(false);
    }
  }

  const fieldClass = cn(
    "w-full bg-white text-sm text-charcoal placeholder:text-charcoal-soft/70 focus:border-forest",
    isContact
      ? "rounded-md border border-border/90 px-3.5 py-[0.85rem]"
      : "border border-border px-3 py-3",
  );

  return (
    <form
      id={formIdAttr}
      onSubmit={onSubmit}
      className={cn(
        isContact
          ? "rounded-xl border border-border/50 bg-white p-6 shadow-[0_8px_30px_rgba(28,33,30,0.06)] sm:p-8"
          : `border border-border/80 bg-white shadow-[0_1px_2px_rgba(28,33,30,0.04)] ${compact ? "p-5 sm:p-6" : "p-6 sm:p-8"}`,
        className,
      )}
      noValidate
      aria-describedby={formError ? `${formId}-form-error` : undefined}
    >
      <h2
        className={cn(
          "heading-display text-charcoal",
          isContact ? "text-[1.85rem] sm:text-[2.05rem]" : "mb-4 text-[1.75rem] sm:mb-5 sm:text-[1.95rem]",
        )}
      >
        {copy?.heading ?? "Request a Free Quote"}
      </h2>
      {copy?.body ? (
        <p className="mt-3 mb-6 max-w-xl text-[0.98rem] leading-relaxed text-charcoal-soft">
          {copy.body}
        </p>
      ) : null}

      {successId ? (
        <div
          className="mb-4 space-y-2 border border-forest/30 bg-forest-muted px-4 py-3 text-sm text-forest-deep"
          role="status"
        >
          <p>{successMessage}</p>
          {notifyNote ? <p className="text-xs opacity-90">{notifyNote}</p> : null}
          {process.env.NODE_ENV === "development" ? (
            <p className="text-xs opacity-70">Ref: {successId}</p>
          ) : null}
        </div>
      ) : null}

      {formError ? (
        <p
          id={`${formId}-form-error`}
          className="mb-4 border border-error/30 bg-red-50 px-4 py-3 text-sm text-error"
          role="alert"
        >
          {formError}
        </p>
      ) : null}

      <div className={cn("grid", isContact ? "gap-4" : "gap-3.5")}>
        <div className={cn("grid sm:grid-cols-2", isContact ? "gap-4" : "gap-3.5")}>
          <div>
            <label htmlFor={`${formId}-name`} className="mb-1.5 block text-sm font-medium">
              {labels.name}
              {isContact ? <span className="text-forest"> *</span> : null}
            </label>
            <input
              id={`${formId}-name`}
              name="name"
              autoComplete="name"
              required
              placeholder={placeholders.name}
              className={fieldClass}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? `${formId}-name-error` : undefined}
            />
            {errors.name ? (
              <p id={`${formId}-name-error`} className="mt-1 text-xs text-error">
                {errors.name[0]}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor={`${formId}-email`} className="mb-1.5 block text-sm font-medium">
              {labels.email}
              {isContact ? <span className="text-forest"> *</span> : null}
            </label>
            <input
              id={`${formId}-email`}
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder={placeholders.email}
              className={fieldClass}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email ? (
              <p className="mt-1 text-xs text-error">{errors.email[0]}</p>
            ) : null}
          </div>
        </div>

        <div className={cn("grid sm:grid-cols-2", isContact ? "gap-4" : "gap-3.5")}>
          <div>
            <label htmlFor={`${formId}-phone`} className="mb-1.5 block text-sm font-medium">
              {labels.phone}
              <span className="text-forest"> *</span>
            </label>
            <input
              id={`${formId}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              placeholder={placeholders.phone}
              className={fieldClass}
              aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone ? (
              <p className="mt-1 text-xs text-error">{errors.phone[0]}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor={`${formId}-service`} className="mb-1.5 block text-sm font-medium">
              {labels.service}
              <span className="text-forest"> *</span>
            </label>
            <select
              id={`${formId}-service`}
              name="service"
              required
              defaultValue={
                defaultService &&
                quoteServiceOptions.some((opt) => opt.value === defaultService)
                  ? defaultService
                  : ""
              }
              className={fieldClass}
              aria-invalid={Boolean(errors.service)}
            >
              <option value="" disabled>
                Select a service
              </option>
              {quoteServiceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.service ? (
              <p className="mt-1 text-xs text-error">{errors.service[0]}</p>
            ) : null}
          </div>
        </div>

        {!compact ? (
          <div className={cn("grid sm:grid-cols-2", isContact ? "gap-4" : "gap-4")}>
            <div>
              <label htmlFor={`${formId}-area`} className="mb-1.5 block text-sm font-medium">
                {labels.areaSize}{" "}
                <span className="font-normal text-charcoal-soft">(optional)</span>
              </label>
              <input
                id={`${formId}-area`}
                name="areaSize"
                placeholder={placeholders.areaSize}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor={`${formId}-budget`} className="mb-1.5 block text-sm font-medium">
                {labels.budget}{" "}
                <span className="font-normal text-charcoal-soft">(optional)</span>
              </label>
              {budgetOptions.length > 0 ? (
                <select
                  id={`${formId}-budget`}
                  name="budget"
                  defaultValue=""
                  className={fieldClass}
                >
                  <option value="">Select an option</option>
                  {budgetOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input id={`${formId}-budget`} name="budget" className={fieldClass} />
              )}
            </div>
          </div>
        ) : null}

        <div>
          <label htmlFor={`${formId}-message`} className="mb-1.5 block text-sm font-medium">
            {labels.message}
            <span className="text-forest"> *</span>
          </label>
          <textarea
            id={`${formId}-message`}
            name="message"
            rows={compact ? 4 : isContact ? 5 : 5}
            required
            className={fieldClass}
            placeholder={placeholders.message ?? "Tell us about your project..."}
            aria-invalid={Boolean(errors.message)}
          />
          {errors.message ? (
            <p className="mt-1 text-xs text-error">{errors.message[0]}</p>
          ) : null}
        </div>

        <div className="hidden" aria-hidden="true">
          <label htmlFor={`${formId}-website`}>Leave blank</label>
          <input
            id={`${formId}-website`}
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-full items-center justify-center gap-2 bg-forest px-5 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-70"
          aria-busy={pending}
        >
          {pending ? "Sending…" : `${submitLabel} →`}
        </button>

        {isContact || copy?.privacyNote ? (
          <p className="flex items-start gap-2 text-xs leading-relaxed text-charcoal-soft">
            <IconLock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest" size={14} />
            <span>{privacyNote}</span>
          </p>
        ) : null}
      </div>
    </form>
  );
}
