'use server';

import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth-server';
import { admissionLeadStatusUpdateSchema } from '@/lib/validation';

export type ActionResult = { ok: true } | { ok: false; error: string };

async function requireAuth(): Promise<ActionResult | null> {
  const session = await getSession();
  if (!session?.user) return { ok: false, error: 'Not authenticated' };
  return null;
}

function revalidateSurfaces() {
  revalidatePath('/admin/admission-leads');
  revalidatePath('/admin');
}

export async function updateAdmissionLeadStatusAction(
  id: string,
  rawStatus: string,
): Promise<ActionResult> {
  const denied = await requireAuth();
  if (denied) return denied;

  const parsed = admissionLeadStatusUpdateSchema.safeParse({ status: rawStatus });
  if (!parsed.success) {
    return { ok: false, error: 'Invalid status (expected new or contacted).' };
  }

  try {
    await prisma.admissionLead.update({
      where: { id },
      data: { status: parsed.data.status },
    });
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return { ok: false, error: 'Lead not found' };
    }
    return { ok: false, error: e instanceof Error ? e.message : 'Database error' };
  }

  revalidateSurfaces();
  return { ok: true };
}

export async function deleteAdmissionLeadAction(id: string): Promise<ActionResult> {
  const denied = await requireAuth();
  if (denied) return denied;

  try {
    await prisma.admissionLead.delete({ where: { id } });
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return { ok: false, error: 'Lead not found' };
    }
    return { ok: false, error: e instanceof Error ? e.message : 'Database error' };
  }

  revalidateSurfaces();
  return { ok: true };
}
