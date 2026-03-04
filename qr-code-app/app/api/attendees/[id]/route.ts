import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();

  const attendee = db.prepare('SELECT * FROM attendees WHERE id = ?').get(id) as
    | { [key: string]: unknown }
    | undefined;

  if (!attendee) {
    return NextResponse.json({ error: 'Attendee not found' }, { status: 404 });
  }

  let body: { type?: string } = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const queryType = req.nextUrl.searchParams.get('type') ?? undefined;
  const type = (body.type ?? queryType ?? 'arrival').toLowerCase();
  const allowedTypes = new Set(['arrival', 'food1', 'food2']);
  if (!allowedTypes.has(type)) {
    return NextResponse.json(
      { error: 'Invalid check-in type' },
      { status: 400 }
    );
  }

  const existing = db
    .prepare('SELECT checked_in_at FROM checkins WHERE attendee_id = ? AND type = ?')
    .get(id, type) as { checked_in_at: string } | undefined;
  if (existing) {
    return NextResponse.json(
      { error: 'Already checked in', checked_in_at: existing.checked_in_at, type },
      { status: 409 }
    );
  }

  const now = new Date().toISOString();
  db.prepare(
    'INSERT INTO checkins (attendee_id, type, checked_in_at) VALUES (?, ?, ?)'
  ).run(id, type, now);

  const updated = db.prepare('SELECT * FROM attendees WHERE id = ?').get(id);
  return NextResponse.json({ ...updated, check_in_type: type, checked_in_at: now });
}
