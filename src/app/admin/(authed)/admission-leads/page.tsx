import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth-server';
import AdmissionLeadsList from './AdmissionLeadsList';

export const metadata = { title: 'Admission Leads' };

export default async function AdmissionLeadsPage() {
  const session = await getSession();
  if (!session?.user) redirect('/admin/login');

  const leads = await prisma.admissionLead.findMany({
    orderBy: { submittedAt: 'desc' },
  });

  const newCount = leads.filter((l) => l.status === 'new').length;

  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h1 className="text-2xl font-display font-bold text-gray-900">Admission Leads</h1>
        <p className="mt-1 text-sm text-gray-500">
          Submissions from the homepage admission popup. {leads.length} total
          {newCount > 0 ? ` · ${newCount} new` : ''}.
        </p>
      </header>

      <AdmissionLeadsList
        items={leads.map((l) => ({
          id:           l.id,
          fullName:     l.fullName,
          mobileNumber: l.mobileNumber,
          programName:  l.programName,
          status:       l.status,
          submittedAt:  l.submittedAt.toISOString(),
        }))}
      />
    </div>
  );
}
