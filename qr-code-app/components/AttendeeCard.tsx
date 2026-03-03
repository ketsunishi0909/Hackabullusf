'use client';

interface AttendeeCardProps {
  name: string;
  email: string;
  checkedInAt: string | null;
  alreadyCheckedIn?: boolean;
  checkedInByImage?: string;
}

export default function AttendeeCard({
  name,
  email,
  checkedInAt,
  alreadyCheckedIn,
  checkedInByImage,
}: AttendeeCardProps) {
  const variant = alreadyCheckedIn ? 'glass-panel--warning' : 'glass-panel--success';

  return (
    <div className={`glass-panel ${variant} rounded-lg px-4 py-3`} style={{ boxShadow: 'none' }}>
      {/* Name + email on one line */}
      <div className="flex items-center gap-2 min-w-0 mb-1">
        <div
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            alreadyCheckedIn ? 'bg-amber-400' : 'bg-emerald-400'
          }`}
        />
        <span className="font-semibold text-white text-sm shrink-0">{name}</span>
        <span className="text-white/35 text-sm truncate">{email}</span>
      </div>

      {/* Status line */}
      {alreadyCheckedIn ? (
        <p className="text-amber-400/80 text-xs pl-3.5">Already checked in</p>
      ) : (
        <p className="flex items-center gap-1.5 text-emerald-400/80 text-xs pl-3.5">
          Checked in at{' '}
          {checkedInAt ? new Date(checkedInAt).toLocaleTimeString() : '—'}
          {checkedInByImage && (
            <>
              {' '}by{' '}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={checkedInByImage}
                alt=""
                width={16}
                height={16}
                className="rounded-full opacity-75 inline-block"
              />
            </>
          )}
        </p>
      )}
    </div>
  );
}
