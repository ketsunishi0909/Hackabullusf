'use client';

import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import AttendeeCard from '@/components/AttendeeCard';

const ScannerView = dynamic(() => import('@/components/ScannerView'), {
  ssr: false,
});

interface ScannedAttendee {
  name: string;
  email: string;
  checked_in_at: string | null;
  alreadyCheckedIn?: boolean;
}

export default function AdminDashboard({ userImage }: { userImage?: string }) {
  const [lastScan, setLastScan] = useState<ScannedAttendee | null>(null);
  const [scanError, setScanError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

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
        const res = await fetch(`/api/attendees/${payload.id}`, {
          method: 'PATCH',
        });
        const result = await res.json();

        if (res.status === 409) {
          setLastScan({
            name: payload.name,
            email: payload.email,
            checked_in_at: result.checked_in_at ?? null,
            alreadyCheckedIn: true,
          });
        } else if (!res.ok) {
          setScanError(result.error ?? 'Check-in failed');
        } else {
          setLastScan({
            name: result.name,
            email: result.email,
            checked_in_at: result.checked_in_at,
          });
        }
      } catch {
        setScanError('Network error');
      } finally {
        setProcessing(false);
      }
    },
    [processing]
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
      <div className="flex-1 min-h-0">
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
                checkedInAt={lastScan.checked_in_at}
                alreadyCheckedIn={lastScan.alreadyCheckedIn}
                checkedInByImage={lastScan.alreadyCheckedIn ? undefined : userImage}
              />
            )}
          </>
        )}
      </div>

      {/* FAB row — invisible spacer mirrors the list button so camera stays centered */}
      <div className="shrink-0 flex items-center justify-center gap-6 py-8">
        <div className="w-14 h-14 shrink-0 invisible" aria-hidden="true" />
        <button
          onClick={() => setCameraOpen((o) => !o)}
          disabled={processing}
          aria-label={cameraOpen ? 'Close camera' : 'Open camera to scan QR code'}
          className="w-24 h-24 rounded-full glass-panel flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform disabled:opacity-40"
        >
          {cameraOpen ? <CloseIcon /> : <CameraIcon />}
        </button>
        <a
          href="/admin/checked-in"
          className="w-14 h-14 rounded-full flex items-center justify-center text-white/40 hover:text-white/70 active:scale-95 transition-all shrink-0"
          aria-label="See checked in"
        >
          <ListIcon />
        </a>
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
