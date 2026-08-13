import { MapPin } from 'lucide-react';

// Source: the department's official floor plan document
// (JMS_Department-Layout-Plan.pdf, 147/I Green Road campus). One row
// from the source ("Office of the of Examinations", Room 211) was
// dropped as a duplicate of "Office of the Controller of
// Examinations" (same room). University-wide offices are shared
// across departments and not tied to any one department's floor
// plan, so that list is maintained here directly.
type OfficeRow = { name: string; level: string };

const DEPARTMENT_OFFICES: OfficeRow[] = [
  { name: 'Office of the Head, Department of Journalism and Media Studies', level: 'Room 107' },
  { name: 'Office of the Department of Journalism and Media Studies', level: 'Room 107' },
];

const UNIVERSITY_OFFICES: OfficeRow[] = [
  { name: 'Office of the Vice Chancellor', level: 'Level 02' },
  { name: 'Office of the Pro-Vice Chancellor', level: 'Level 01' },
  { name: 'Office of the Treasurer', level: 'Room 507 · Level 04' },
  { name: 'Office of the Registrar', level: 'Level 01' },
  { name: 'Office of the Controller of Examinations', level: 'Room 211' },
  { name: 'Library', level: 'Ground Floor' },
  { name: 'Office of the Dean, Faculty of Arts and Humanities', level: 'Room 401 · Level 03' },
  { name: 'Office of the Students Welfare Department (SWD)', level: 'Room 311' },
  { name: 'Office of the Proctor', level: 'Room 307' },
  { name: 'Office of the HRDI', level: 'Level UG' },
  { name: 'Office of the Finance & Accounts (F&A) Director', level: 'Room 313 · Level 02' },
  { name: 'Office of the Accounts', level: 'Room 313 · Level 02' },
  { name: 'Admission Office', level: 'Level G' },
];

function GroupHeader({ label }: { label: string }) {
  return (
    <tr className="bg-accent/5">
      <td colSpan={2} className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
        {label}
      </td>
    </tr>
  );
}

function OfficeRows({ rows }: { rows: OfficeRow[] }) {
  return (
    <>
      {rows.map((row) => (
        <tr key={row.name} className="border-b border-gray-50 last:border-0 hover:bg-accent/5 transition-colors">
          <td className="px-5 py-3.5 text-sm font-semibold text-primary">{row.name}</td>
          <td className="px-5 py-3.5 text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
              <MapPin size={12} />
              {row.level}
            </span>
          </td>
        </tr>
      ))}
    </>
  );
}

export default function OfficeDirectory({ address }: { address: string }) {
  return (
    <section className="mb-14 md:mb-16">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-primary leading-tight">
          Where to Find Each Office
        </h2>
        <div className="mt-3 mx-auto h-1 w-16 bg-accent rounded-full" />
        <p className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
          <MapPin size={15} className="text-accent shrink-0" />
          {address}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-left bg-gray-50/60">
              <th className="px-5 py-2.5 text-[11px] font-bold tracking-wider uppercase text-gray-500">Office</th>
              <th className="px-5 py-2.5 text-[11px] font-bold tracking-wider uppercase text-gray-500 text-right">Level</th>
            </tr>
          </thead>
          <tbody>
            <GroupHeader label="This Department" />
            <OfficeRows rows={DEPARTMENT_OFFICES} />
            <GroupHeader label="University Offices" />
            <OfficeRows rows={UNIVERSITY_OFFICES} />
          </tbody>
        </table>
      </div>
    </section>
  );
}
