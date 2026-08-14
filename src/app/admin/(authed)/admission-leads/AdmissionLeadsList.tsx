'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Phone, GraduationCap, Check, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminListItems } from '@/lib/hooks/useAdminListItems';
import { useConfirm } from '@/components/admin/ConfirmDialogProvider';
import {
  deleteAdmissionLeadAction,
  updateAdmissionLeadStatusAction,
} from '@/lib/admin-actions/admission-leads';

type LeadRow = {
  id:           string;
  fullName:     string;
  mobileNumber: string;
  programName:  string;
  status:       string;
  submittedAt:  string;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    day:    '2-digit',
    month:  'short',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  });
}

const STATUS_STYLES: Record<string, { label: string; cls: string }> = {
  new:       { label: 'New',       cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  contacted: { label: 'Contacted', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

export default function AdmissionLeadsList({ items: initialItems }: { items: LeadRow[] }) {
  const router = useRouter();
  const confirm = useConfirm();
  const { items, removeById } = useAdminListItems(initialItems);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, string>>({});

  function statusOf(row: LeadRow) {
    return statusOverrides[row.id] ?? row.status;
  }

  async function handleStatus(id: string, next: 'new' | 'contacted') {
    const res = await updateAdmissionLeadStatusAction(id, next);
    if (res.ok) {
      setStatusOverrides((prev) => ({ ...prev, [id]: next }));
      toast.success(`Marked as ${next}`);
      router.refresh();
    } else {
      toast.error(res.error);
    }
  }

  async function handleDelete(id: string, name: string) {
    const ok = await confirm({
      title: 'Delete lead?',
      message: `"${name}"'s submission will be removed permanently. This cannot be undone.`,
      confirmLabel: 'Delete',
      variant: 'danger',
    });
    if (!ok) return;
    const res = await deleteAdmissionLeadAction(id);
    if (res.ok) {
      removeById(id);
      toast.success('Lead removed');
      router.refresh();
    } else {
      toast.error(res.error);
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-dashed border-gray-300 rounded-lg">
        <Clock size={24} className="text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">No leads yet.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((row) => {
        const status = statusOf(row);
        const style = STATUS_STYLES[status] ?? STATUS_STYLES.new;
        return (
          <li key={row.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="font-semibold text-gray-900">{row.fullName}</span>
                <span className={`text-[10px] uppercase tracking-wider font-bold border rounded px-2 py-0.5 ${style.cls}`}>
                  {style.label}
                </span>
                <span className="text-xs text-gray-400">{formatDate(row.submittedAt)}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
                <a
                  href={`tel:${row.mobileNumber}`}
                  className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
                >
                  <Phone size={12} className="text-accent shrink-0" />
                  {row.mobileNumber}
                </a>
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap size={12} className="text-accent shrink-0" />
                  {row.programName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => handleStatus(row.id, status === 'new' ? 'contacted' : 'new')}
                aria-label={status === 'new' ? 'Mark as contacted' : 'Mark as new'}
                title={status === 'new' ? 'Mark as contacted' : 'Mark as new'}
                className="p-2 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                <Check size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(row.id, row.fullName)}
                aria-label={`Delete ${row.fullName}`}
                className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
