'use client';

import { useEffect, useState } from 'react';
import PageTitle from '@/components/PageTitle';

interface Attendee {
  id: string;
  name: string;
  email: string;
  checkins?: {
    arrival?: string;
    food1?: string;
    food2?: string;
  };
}

export default function CheckedInPage() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'arrival' | 'food1' | 'food2'>('arrival');

  useEffect(() => {
    fetch('/api/attendees')
      .then((r) => r.json())
      .then((data: Attendee[]) => {
        const checked = data
          .filter((a) => a.checkins?.arrival)
          .sort((a, b) => {
            if (!a.checkins?.arrival) return 1;
            if (!b.checkins?.arrival) return -1;
            return (
              new Date(b.checkins.arrival).getTime() -
              new Date(a.checkins.arrival).getTime()
            );
          });
        setAttendees(checked);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function exportCSV() {
    window.location.href = '/api/attendees?format=csv';
  }

  return (
    <main
      className="min-h-screen p-4"
      style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}
    >
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <a
            href="/admin"
            className="flex items-center gap-1.5 text-sm text-white/35 hover:text-white/65 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </a>
          <button
            onClick={exportCSV}
            className="px-4 py-1.5 text-xs font-medium text-white/45 border border-white/[0.12] rounded-md hover:text-white/70 hover:border-white/25 transition-colors"
          >
            Export CSV
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <PageTitle fontSize={44}>Checked In</PageTitle>
          {!loading && (
            <p className="text-white/40 text-sm mt-1">
              {attendees.filter((a) => a.checkins?.[filterType]).length}{' '}
              {attendees.filter((a) => a.checkins?.[filterType]).length === 1
                ? 'attendee'
                : 'attendees'}
            </p>
          )}
        </div>

        <div className="mb-4 flex items-center justify-center gap-2 text-xs text-white/50">
          <span className="uppercase tracking-wide text-white/35">Type</span>
          {(['arrival', 'food1', 'food2'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-full border transition-colors ${
                filterType === type
                  ? 'text-white border-white/40 bg-white/10'
                  : 'text-white/45 border-white/10 hover:text-white/70 hover:border-white/25'
              }`}
            >
              {type === 'food1' ? 'Food 1' : type === 'food2' ? 'Food 2' : 'Arrival'}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <p className="text-center text-white/30 text-sm animate-pulse">Loading…</p>
        ) : attendees.filter((a) => a.checkins?.[filterType]).length === 0 ? (
          <div className="text-center py-16 text-white/25 text-sm">
            No attendees checked in for this type yet.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {attendees
              .filter((a) => a.checkins?.[filterType])
              .sort((a, b) => {
                const aTime = a.checkins?.[filterType];
                const bTime = b.checkins?.[filterType];
                if (!aTime) return 1;
                if (!bTime) return -1;
                return new Date(bTime).getTime() - new Date(aTime).getTime();
              })
              .map((a, i) => (
              <div key={a.id} className="glass-panel rounded-lg px-4 py-3 flex items-center gap-3">
                <span className="text-white/20 text-xs w-5 text-right shrink-0">{i + 1}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{a.name}</p>
                  <p className="text-white/40 text-xs truncate">{a.email}</p>
                </div>
                {a.checkins?.[filterType] && (
                  <span className="text-white/30 text-xs shrink-0">
                    {new Date(a.checkins[filterType] as string).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
