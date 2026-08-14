'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth-server';
import { admissionLeadPopupSettingsUpdateSchema } from '@/lib/validation';

export type ActionResult = { ok: true } | { ok: false; error: string };

function getStr(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === 'string' ? v.trim() : '';
}
function getBool(fd: FormData, key: string): boolean {
  return fd.get(key) === 'on';
}

export async function updateAdmissionLeadPopupSettingsAction(
  _prev: ActionResult | { ok: null },
  formData: FormData,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session?.user) return { ok: false, error: 'Not authenticated' };

  const raw = {
    enabled:      getBool(formData, 'enabled'),
    delaySeconds: Number(getStr(formData, 'delaySeconds')),
    heading:      getStr(formData, 'heading'),
    subheading:   getStr(formData, 'subheading'),
    buttonText:   getStr(formData, 'buttonText'),
    footerNote:   getStr(formData, 'footerNote'),
  };

  const parsed = admissionLeadPopupSettingsUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`).join('; '),
    };
  }

  try {
    await prisma.admissionLeadPopupSettings.upsert({
      where: { id: 'singleton' },
      create: { id: 'singleton', ...parsed.data },
      update: parsed.data,
    });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Database error' };
  }

  revalidatePath('/admin/admission-lead-popup');
  revalidatePath('/admin');
  // Homepage-only, not layout-wide.
  revalidatePath('/');
  return { ok: true };
}
