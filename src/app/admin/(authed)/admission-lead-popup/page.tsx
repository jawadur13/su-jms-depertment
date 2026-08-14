import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth-server';
import AdmissionLeadPopupForm from './AdmissionLeadPopupForm';

export const metadata = { title: 'Admission Lead Popup (CMS)' };

export default async function AdmissionLeadPopupAdminPage() {
  const session = await getSession();
  if (!session?.user) redirect('/admin/login');

  const settings = await prisma.admissionLeadPopupSettings.findUnique({
    where: { id: 'singleton' },
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <h1 className="text-2xl font-display font-bold text-gray-900">Admission Lead Popup</h1>
        <p className="mt-1 text-sm text-gray-500">
          Timed lead-capture popup shown once per browser session on the homepage. Submissions land in{' '}
          <a href="/admin/admission-leads" className="text-accent hover:underline">Admission Leads</a>.
        </p>
      </header>
      <AdmissionLeadPopupForm initial={settings} />
    </div>
  );
}
