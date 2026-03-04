'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import AttendeeCard from '@/components/AttendeeCard';

const ScannerView = dynamic(() => import('@/components/ScannerView'), {
  ssr: false,
});

interface ScannedAttendee {
  id: string;
  name: string;
  email: string;
  checkins?: {
    arrival?: string;
    food1?: string;
    food2?: string;
  };
  lastAttemptType?: 'arrival' | 'food1' | 'food2';
  alreadyCheckedIn?: boolean;
}

interface AttendeeRecord {
  id: string;
  name: string;
  email: string;
  checkins?: {
    arrival?: string;
    food1?: string;
    food2?: string;
  };
}

export default function AdminDashboard({ userImage }: { userImage?: string }) {
  const [lastScan, setLastScan] = useState<ScannedAttendee | null>(null);
  const [scanError, setScanError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [checkInType, setCheckInType] = useState<'arrival' | 'food1' | 'food2'>('arrival');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  const typeRowRef = useRef<HTMLDivElement>(null);
  const arrivalRef = useRef<HTMLButtonElement>(null);
  const food1Ref = useRef<HTMLButtonElement>(null);
  const food2Ref = useRef<HTMLButtonElement>(null);
  const [typeOffset, setTypeOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AttendeeRecord[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [attendeesCache, setAttendeesCache] = useState<AttendeeRecord[] | null>(null);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  const getTypeRef = useCallback((type: 'arrival' | 'food1' | 'food2') => {
    if (type === 'arrival') return arrivalRef;
    if (type === 'food1') return food1Ref;
    return food2Ref;
  }, []);

  const updateTypeOffset = useCallback(() => {
    if (typeMenuOpen) {
      setTypeOffset(0);
      return;
    }
    const container = typeRowRef.current;
    const active = getTypeRef(checkInType).current;
    if (!container || !active) return;
    const containerRect = container.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    const activeCenter = activeRect.left + activeRect.width / 2;
    setTypeOffset(containerCenter - activeCenter);
  }, [checkInType, getTypeRef, typeMenuOpen]);

  useLayoutEffect(() => {
    updateTypeOffset();
  }, [updateTypeOffset]);

  useEffect(() => {
    if (!typeMenuOpen) return;
    const handleResize = () => updateTypeOffset();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [typeMenuOpen, updateTypeOffset]);

  useEffect(() => {
    if (!searchOpen || attendeesCache) return;
    setSearchLoading(true);
    setSearchError('');
    fetch('/api/attendees')
      .then((r) => r.json())
      .then((data: AttendeeRecord[]) => setAttendeesCache(data))
      .catch(() => setSearchError('Failed to load attendees'))
      .finally(() => setSearchLoading(false));
  }, [searchOpen, attendeesCache]);

  useEffect(() => {
    if (!lastScan?.id) return;

    const currentId = lastScan.id;
    const ensureDetails = async () => {
      let records = attendeesCache;
      if (!records) {
        try {
          const res = await fetch('/api/attendees');
          records = (await res.json()) as AttendeeRecord[];
          setAttendeesCache(records);
        } catch {
          return;
        }
      }
      const record = records.find((a) => a.id === currentId);
      if (!record) return;
      setLastScan((prev) =>
        prev && prev.id === currentId
          ? { ...prev, checkins: record.checkins ?? {} }
          : prev
      );
    };

    ensureDetails();
  }, [checkInType, lastScan?.id, attendeesCache]);

  useEffect(() => {
    if (!searchOpen) return;
    if (!attendeesCache) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSearchResults([]);
      return;
    }
    const results = attendeesCache.filter((a) => {
      const nameMatch = a.name.toLowerCase().includes(q);
      const emailMatch = a.email.toLowerCase().includes(q);
      return nameMatch || emailMatch;
    });
    setSearchResults(results);
  }, [searchOpen, searchQuery, attendeesCache]);

  const handleScan = useCallback(
    async (data: string) => {
      if (processing) return;

      let payload: { id: string; name: string; email: string };
      try {
        payload = JSON.parse(data);
      } catch {
        setScanError('Invalid QR code');
        setCameraOpen(false);
        return;
      }

      if (!payload.id) {
        setScanError('QR code missing attendee ID');
        setCameraOpen(false);
        return;
      }

      setCameraOpen(false);
      setProcessing(true);
      setScanError('');

      try {
        const res = await fetch(
          `/api/attendees/${payload.id}?type=${encodeURIComponent(checkInType)}`,
          {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: checkInType }),
          }
        );
        const result = await res.json();

        if (res.status === 409) {
          setLastScan({
            id: payload.id,
            name: payload.name,
            email: payload.email,
            checkins: {
              [checkInType]: result.checked_in_at ?? null,
            },
            lastAttemptType: result.type ?? checkInType,
            alreadyCheckedIn: true,
          });
        } else if (!res.ok) {
          setScanError(result.error ?? 'Check-in failed');
        } else {
          setLastScan({
            id: payload.id,
            name: result.name,
            email: result.email,
            checkins: {
              [result.check_in_type ?? checkInType]: result.checked_in_at ?? null,
            },
            lastAttemptType: result.check_in_type ?? checkInType,
            alreadyCheckedIn: false,
          });
        }
      } catch {
        setScanError('Network error');
      } finally {
        setProcessing(false);
      }
    },
    [processing, checkInType]
  );

  return (
    <div className="flex flex-col flex-1 min-h-0">

      {/* Header */}
      <div className="mb-4 shrink-0">
        <h1
          className="text-xl font-semibold text-white"
          style={{
            fontFamily: 'var(--font-audiowide)',
            fontStyle: 'italic',
            display: 'inline-block',
            transform: 'perspective(600px) rotateY(-4deg) skewX(-6deg)',
            transformOrigin: 'left center',
          }}
        >
          Check-In
        </h1>
        <p className="text-white/35 text-sm mt-0.5">Scan attendee QR codes</p>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 pb-40">
        {searchOpen && (
          <div className="mb-6">
            {searchLoading ? (
              <p className="text-center text-white/30 text-sm animate-pulse">Loading…</p>
            ) : searchError ? (
              <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-300 text-sm">
                {searchError}
              </div>
            ) : searchQuery.trim().length === 0 ? (
              <p className="text-center text-white/30 text-sm">
                Type a name or email to search.
              </p>
            ) : searchResults.length === 0 ? (
              <p className="text-center text-white/30 text-sm">
                No attendees found.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {searchResults.map((a) => {
                  const checkedInAt = a.checkins?.[checkInType] ?? null;
                  return (
                    <AttendeeCard
                      key={a.id}
                      name={a.name}
                      email={a.email}
                      checkedInAt={checkedInAt}
                      checkInType={checkInType}
                      alreadyCheckedIn={Boolean(checkedInAt)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
        {cameraOpen ? (
          <div className="rounded-lg overflow-hidden glass-panel">
            <ScannerView onScan={handleScan} />
          </div>
        ) : (
          <>
            {processing && (
              <p className="text-center text-white/40 text-sm animate-pulse mb-4">
                Processing...
              </p>
            )}

            {scanError && (
              <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-300 text-sm">
                {scanError}
              </div>
            )}

            {lastScan && (
              <AttendeeCard
                name={lastScan.name}
                email={lastScan.email}
                checkedInAt={lastScan.checkins?.[checkInType] ?? null}
                checkInType={checkInType}
                alreadyCheckedIn={
                  lastScan.alreadyCheckedIn && lastScan.lastAttemptType === checkInType
                }
                checkedInByImage={lastScan.alreadyCheckedIn ? undefined : userImage}
              />
            )}
          </>
        )}
      </div>

      {/* FAB row — invisible spacer mirrors the list button so camera stays centered */}
      <div
        className="fixed left-0 right-0 flex items-center justify-center gap-6"
        style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
      >
        {searchOpen && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
            style={{
              background:
                'linear-gradient(180deg, rgba(8,10,24,0) 0%, rgba(8,10,24,0.55) 45%, rgba(8,10,24,0.9) 100%)',
            }}
          />
        )}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: 'calc(100% + 20px)' }}
        >
          <div
            ref={typeRowRef}
            className="flex items-center gap-2 transition-transform duration-200"
            style={{ transform: `translateX(${typeMenuOpen ? 0 : typeOffset}px)` }}
          >
            {(() => {
              const order = ['arrival', 'food1', 'food2'] as const;
              const label = (type: (typeof order)[number]) =>
                type === 'food1' ? 'Food 1' : type === 'food2' ? 'Food 2' : 'Arrival';
              const currentIndex = order.indexOf(checkInType);
              const leftOptions =
                checkInType === 'arrival' ? [] : order.slice(0, currentIndex);
              const rightOptions =
                checkInType === 'food2' ? [] : order.slice(currentIndex + 1);
              return (
                <>
                  {leftOptions.map((type, index) => (
                    <button
                      key={`${type}-${index}`}
                      ref={getTypeRef(type)}
                      onClick={() => {
                        setCheckInType(type);
                        setTypeMenuOpen(false);
                      }}
                      className={`px-3 py-1 rounded-full border text-xs transition-all duration-200 ${
                        typeMenuOpen
                          ? 'opacity-100 translate-x-0 pointer-events-auto text-white/45 border-white/10 hover:text-white/70 hover:border-white/25'
                          : 'opacity-0 -translate-x-2 pointer-events-none'
                      }`}
                    >
                      {label(type)}
                    </button>
                  ))}

                  <button
                    ref={getTypeRef(checkInType)}
                    onClick={() => setTypeMenuOpen((open) => !open)}
                    className="px-3 py-1 rounded-full border text-xs text-white border-white/40 bg-white/10 hover:bg-white/[0.14] transition-colors"
                    aria-label="Select check-in type"
                  >
                    {label(checkInType)}
                  </button>

                  {rightOptions.map((type, index) => (
                    <button
                      key={`${type}-${index}`}
                      ref={getTypeRef(type)}
                      onClick={() => {
                        setCheckInType(type);
                        setTypeMenuOpen(false);
                      }}
                      className={`px-3 py-1 rounded-full border text-xs transition-all duration-200 ${
                        typeMenuOpen
                          ? 'opacity-100 translate-x-0 pointer-events-auto text-white/45 border-white/10 hover:text-white/70 hover:border-white/25'
                          : 'opacity-0 translate-x-2 pointer-events-none'
                      }`}
                    >
                      {label(type)}
                    </button>
                  ))}
                </>
              );
            })()}
          </div>
        </div>
        {searchOpen && (
          <div
            className="absolute left-1/2 -translate-x-1/2 z-20"
            style={{ bottom: 'calc(11.5rem + env(safe-area-inset-bottom))' }}
          >
            <div className="glass-panel rounded-full px-4 py-2.5 flex items-center gap-2">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search attendee"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none w-56"
              />
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="text-white/40 hover:text-white/70 transition-colors"
                aria-label="Close search"
              >
                <CloseIcon />
              </button>
            </div>
          </div>
        )}
        <a
          href="/admin/checked-in"
          className="w-14 h-14 rounded-full flex items-center justify-center text-white/40 hover:text-white/70 active:scale-95 transition-all shrink-0"
          aria-label="See checked in"
        >
          <ListIcon />
        </a>
        <button
          onClick={() => setCameraOpen((o) => !o)}
          disabled={processing}
          aria-label={cameraOpen ? 'Close camera' : 'Open camera to scan QR code'}
          className="w-24 h-24 rounded-full glass-panel flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform disabled:opacity-40"
        >
          {cameraOpen ? <CloseIcon /> : <CameraIcon />}
        </button>
        <button
          type="button"
          onClick={() => setSearchOpen((open) => !open)}
          className="w-14 h-14 rounded-full flex items-center justify-center text-white/40 hover:text-white/70 active:scale-95 transition-all shrink-0"
          aria-label="Search attendees"
        >
          <SearchIcon />
        </button>
      </div>

    </div>
  );
}

function CameraIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
