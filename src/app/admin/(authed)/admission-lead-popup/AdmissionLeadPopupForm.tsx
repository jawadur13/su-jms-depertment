'use client';

import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import type { AdmissionLeadPopupSettings } from '@prisma/client';
import {
  updateAdmissionLeadPopupSettingsAction,
  type ActionResult,
} from '@/lib/admin-actions/admission-lead-popup';

type State = ActionResult | { ok: null };

export default function AdmissionLeadPopupForm({
  initial,
}: {
  initial: AdmissionLeadPopupSettings | null;
}) {
  const [state, formAction, pending] = useActionState<State, FormData>(
    updateAdmissionLeadPopupSettingsAction,
    { ok: null },
  );

  useEffect(() => {
    if (state.ok === true) toast.success('Popup settings saved');
    if (state.ok === false) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      <Card title="Behavior">
        <CheckboxField
          label="Show the popup on the homepage"
          name="enabled"
          defaultChecked={initial?.enabled ?? true}
        />
        <TextField
          label="Delay before showing (seconds)"
          name="delaySeconds"
          type="number"
          required
          defaultValue={String(initial?.delaySeconds ?? 15)}
        />
        <p className="text-xs text-gray-500 -mt-2">
          Shows once per browser session — a visitor who already saw it (or closed it) won&apos;t see it again until they close and reopen their browser tab.
        </p>
      </Card>

      <Card title="Content">
        <TextField
          label="Heading"
          name="heading"
          required
          defaultValue={initial?.heading ?? 'Start your journey with Sonargaon University'}
        />
        <TextAreaField
          label="Subheading"
          name="subheading"
          required
          rows={2}
          defaultValue={initial?.subheading ?? 'Get personalized admission guidance from our admission team.'}
        />
        <TextField
          label="Submit button text"
          name="buttonText"
          required
          defaultValue={initial?.buttonText ?? 'Get admission guidance'}
        />
        <TextField
          label="Footer note (under the button)"
          name="footerNote"
          required
          defaultValue={initial?.footerNote ?? 'Our admission team will contact you shortly.'}
        />
      </Card>

      {state.ok === false && (
        <div
          role="alert"
          className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
        >
          {state.error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="bg-primary hover:bg-primary/90 text-white font-medium rounded-lg px-5 py-2.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          {pending ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">{title}</h2>
      {children}
    </section>
  );
}

function TextField({
  label, name, defaultValue, required, placeholder, type = 'text',
}: { label: string; name: string; defaultValue?: string; required?: boolean; placeholder?: string; type?: string }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </label>
      <input id={name} name={name} type={type}
             defaultValue={defaultValue} required={required} placeholder={placeholder}
             className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent" />
    </div>
  );
}

function TextAreaField({
  label, name, defaultValue, required, rows = 3, placeholder,
}: { label: string; name: string; defaultValue?: string; required?: boolean; rows?: number; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </label>
      <textarea id={name} name={name}
                defaultValue={defaultValue} required={required} rows={rows} placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent resize-y" />
    </div>
  );
}

function CheckboxField({
  label, name, defaultChecked,
}: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="inline-flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
      <input type="checkbox" name={name} defaultChecked={defaultChecked}
             className="mt-0.5 w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent/50" />
      <span>{label}</span>
    </label>
  );
}
