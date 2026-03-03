'use client';

import { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { googleCalendarUrl, icsContent } from '@/lib/event';

interface Attendee {
  id: string;
  name: string;
  email: string;
  checked_in: number;
  checked_in_at: string | null;
  created_at: string;
}

interface QRDisplayProps {
  attendee: Attendee;
}

export default function QRDisplay({ attendee }: QRDisplayProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [capturing, setCapturing] = useState(false);

  const payload = JSON.stringify({
    id: attendee.id,
    name: attendee.name,
    email: attendee.email,
  });

  async function screenshot() {
    if (!cardRef.current || capturing) return;
    setCapturing(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#0e0b2a',
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `hackabull-${attendee.name.replace(/\s+/g, '-')}.png`;
      link.click();
    } finally {
      setCapturing(false);
    }
  }

  function addToAppleCalendar() {
    const blob = new Blob([icsContent()], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hackabull-2026.ics';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div ref={cardRef} className="flex flex-col items-center gap-6 p-6 rounded-lg glass-panel">
      <div className="text-center">
        <p className="text-lg font-semibold text-white">You&apos;re registered!</p>
        <p className="text-white/40 text-sm mt-0.5">Show this QR code at check-in</p>
      </div>

      <div className="p-4 bg-white rounded-md shadow-lg">
        <QRCodeCanvas value={payload} size={200} />
      </div>

      <div className="text-center">
        <p className="font-medium text-white">{attendee.name}</p>
        <p className="text-sm text-white/40 mt-0.5">{attendee.email}</p>
      </div>

      <button
        onClick={screenshot}
        disabled={capturing}
        className="w-full bg-white text-slate-900 rounded-md py-2.5 text-sm font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <ScreenshotIcon />
        {capturing ? '😜 Say cheese!' : 'Screenshot'}
      </button>

      <div className="w-full flex items-center gap-3">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-white/30 shrink-0">save the event</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <div className="w-full flex flex-col gap-2.5">
        <a
          href={googleCalendarUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2.5 rounded-md py-2.5 text-sm font-medium text-white/80 border border-white/15 hover:bg-white/[0.07] hover:text-white hover:border-white/25 transition-all"
        >
          <GoogleCalendarIcon />
          Add to Google Calendar
        </a>

        <button
          onClick={addToAppleCalendar}
          className="w-full flex items-center justify-center gap-2.5 rounded-md py-2.5 text-sm font-medium text-white/80 border border-white/15 hover:bg-white/[0.07] hover:text-white hover:border-white/25 transition-all"
        >
          <AppleCalendarIcon />
          Add to Apple Calendar
        </button>
      </div>
    </div>
  );
}

function ScreenshotIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h6m-6 0v18m6-18h4a2 2 0 0 1 2 2v4m-6-6v18M3 9v6m18-6v6M3 15v4a2 2 0 0 0 2 2h4m-6-6h18m0 6v-4m0 4h-4m-2 0H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function GoogleCalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 2v3M16 2v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 13h2v2H8zM11 13h2v2h-2zM14 13h2v2h-2zM8 16h2v2H8zM11 16h2v2h-2z" fill="currentColor"/>
    </svg>
  );
}

function AppleCalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 2v3M16 2v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <text x="12" y="19" textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor">25</text>
    </svg>
  );
}
