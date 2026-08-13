'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';

type Entry = { text: string; link: string };

type Props = {
  name: string;
  initialValue: unknown;
};

// Accepts the new { text, link }[] shape, and falls back to reading
// legacy string | string[] | { heading, items }[] publications data
// (pre-dating this editor) so existing rows still load for editing.
function normalize(v: unknown): Entry[] {
  if (v == null) return [];
  if (typeof v === 'string') return [{ text: v, link: '' }];
  if (Array.isArray(v)) {
    return v.flatMap((item): Entry[] => {
      if (typeof item === 'string') return [{ text: item, link: '' }];
      if (item && typeof item === 'object') {
        const obj = item as Record<string, unknown>;
        if (typeof obj.text === 'string') {
          return [{ text: obj.text, link: typeof obj.link === 'string' ? obj.link : '' }];
        }
        // Legacy grouped shape { heading, items }.
        if (Array.isArray(obj.items)) {
          return (obj.items as unknown[])
            .filter((i): i is string => typeof i === 'string')
            .map((text) => ({ text, link: '' }));
        }
      }
      return [];
    });
  }
  return [];
}

function serialize(entries: Entry[]): Entry[] | null {
  const cleaned = entries
    .map((e) => ({ text: e.text.trim(), link: e.link.trim() }))
    .filter((e) => e.text.length > 0);
  return cleaned.length === 0 ? null : cleaned;
}

export default function PublicationsEditor({ name, initialValue }: Props) {
  const [entries, setEntries] = useState<Entry[]>(normalize(initialValue));

  function addEntry() {
    setEntries([...entries, { text: '', link: '' }]);
  }
  function removeEntry(i: number) {
    setEntries(entries.filter((_, idx) => idx !== i));
  }
  function updateText(i: number, value: string) {
    setEntries(entries.map((e, idx) => (idx === i ? { ...e, text: value } : e)));
  }
  function updateLink(i: number, value: string) {
    setEntries(entries.map((e, idx) => (idx === i ? { ...e, link: value } : e)));
  }

  const serialized = serialize(entries);

  return (
    <div className="space-y-3 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">Publication</label>
        {entries.length === 0 && (
          <button
            type="button"
            onClick={addEntry}
            className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
          >
            <Plus size={12} /> Add publication
          </button>
        )}
      </div>

      {entries.length === 0 && (
        <p className="text-xs text-gray-400 italic">No content.</p>
      )}

      {entries.map((entry, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50/30">
          <div className="flex items-start gap-2">
            <textarea
              value={entry.text}
              onChange={(e) => updateText(i, e.target.value)}
              rows={2}
              placeholder="Full citation text"
              className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent resize-y bg-white"
            />
            <button
              type="button"
              onClick={() => removeEntry(i)}
              aria-label="Remove publication"
              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors mt-1"
            >
              <X size={16} />
            </button>
          </div>
          <input
            type="url"
            value={entry.link}
            onChange={(e) => updateLink(i, e.target.value)}
            placeholder="Link (optional) — e.g. https://doi.org/... — shown as a clickable link below the citation"
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent bg-white"
          />
        </div>
      ))}

      {entries.length > 0 && (
        <button
          type="button"
          onClick={addEntry}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
        >
          <Plus size={14} /> Add another publication
        </button>
      )}

      <input
        type="hidden"
        name={name}
        value={serialized === null ? '' : JSON.stringify(serialized)}
      />
    </div>
  );
}
