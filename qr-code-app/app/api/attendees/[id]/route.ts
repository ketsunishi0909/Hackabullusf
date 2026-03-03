import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();

  const attendee = db.prepare('SELECT * FROM attendees WHERE id = ?').get(id) as
    | { checked_in: number; [key: string]: unknown }
    | undefined;

  if (!attendee) {
    return NextResponse.json({ error: 'Attendee not found' }, { status: 404 });
  }

  if (attendee.checked_in) {
    return NextResponse.json({ error: 'Already checked in' }, { status: 409 });
  }

  const now = new Date().toISOString();
  db.prepare(
    'UPDATE attendees SET checked_in = 1, checked_in_at = ? WHERE id = ?'
  ).run(now, id);

  const updated = db.prepare('SELECT * FROM attendees WHERE id = ?').get(id);
  return NextResponse.json(updated);
}
