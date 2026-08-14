'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { X as XIcon, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

const HONEYPOT_NAME = 'website';
// sessionStorage (not localStorage) — the popup should reappear on a
// fresh visit next session, just not re-interrupt the same tab twice.
const STORAGE_KEY = 'admission_lead_popup_seen';

type Settings = {
  delaySeconds: number;
  heading: string;
  subheading: string;
  buttonText: string;
  footerNote: string;
};

type ProgramOption = { id: string; programName: string };

type FormState = {
  fullName: string;
  mobileNumber: string;
  programName: string;
};

const EMPTY: FormState = { fullName: '', mobileNumber: '', programName: '' };

export default function AdmissionLeadPopup({
  settings,
  programs,
}: {
  settings: Settings;
  programs: readonly ProgramOption[];
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [honeypot, setHoneypot] = useState('');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    timerRef.current = window.setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(STORAGE_KEY, '1');
    }, Math.max(1, settings.delaySeconds) * 1000);
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pending]);

  function close() {
    if (pending) return;
    setOpen(false);
    setTimeout(() => {
      setSubmitted(false);
      setForm(EMPTY);
      setHoneypot('');
    }, 200);
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    try {
      const res = await fetch('/api/admission-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, [HONEYPOT_NAME]: honeypot }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(typeof data?.error === 'string' ? data.error : 'Submission failed');
        return;
      }
      setSubmitted(true);
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setPending(false);
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admission-lead-popup-title"
      className="fixed inset-0 z-[95] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 bg-black/60"
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto p-7 md:p-8">
        <button
          type="button"
          onClick={close}
          disabled={pending}
          aria-label="Close dialog"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors disabled:opacity-50"
        >
          <XIcon size={16} />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mb-4">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-lg font-display font-bold text-primary mb-1">Thank you!</h3>
            <p className="text-sm text-gray-600 max-w-xs mx-auto">{settings.footerNote}</p>
            <button
              type="button"
              onClick={close}
              className="mt-6 inline-flex items-center justify-center px-5 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2
              id="admission-lead-popup-title"
              className="text-xl md:text-2xl font-display font-bold text-primary leading-snug pr-8 mb-2"
            >
              {settings.heading}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">{settings.subheading}</p>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Field label="Full name">
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  placeholder="As written on your certificate"
                  autoComplete="name"
                  className={inputClass}
                />
              </Field>

              <Field label="Mobile number">
                <input
                  type="tel"
                  required
                  value={form.mobileNumber}
                  onChange={(e) => update('mobileNumber', e.target.value)}
                  placeholder="01XXXXXXXXX"
                  autoComplete="tel"
                  className={inputClass}
                />
              </Field>

              <Field label="Programme you are interested in">
                <select
                  required
                  value={form.programName}
                  onChange={(e) => update('programName', e.target.value)}
                  className={inputClass}
                >
                  <option value="" disabled>Choose a programme</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.programName}>{p.programName}</option>
                  ))}
                </select>
              </Field>

              {/* Honeypot — hidden from real users + assistive tech. */}
              <div
                aria-hidden="true"
                className="absolute left-[-9999px] w-px h-px overflow-hidden opacity-0 pointer-events-none"
              >
                <label htmlFor="admission-lead-website">Website</label>
                <input
                  id="admission-lead-website"
                  type="text"
                  name={HONEYPOT_NAME}
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={pending}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary to-accent text-white text-sm font-bold rounded-full shadow-lg hover:shadow-xl hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                {pending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    {settings.buttonText}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400">{settings.footerNote}</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

const inputClass =
  'w-full px-4 py-3 bg-gray-100 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-primary mb-1.5">
        {label}
        <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
      </label>
      {children}
    </div>
  );
}
