import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import getDb from '@/lib/db';

export async function POST(req: NextRequest) {
  const { name, email } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
  }

  const db = getDb();

  const existing = db.prepare('SELECT id FROM attendees WHERE email = ?').get(email);
  if (existing) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
  }

  const id = uuidv4();
  db.prepare(
    'INSERT INTO attendees (id, name, email) VALUES (?, ?, ?)'
  ).run(id, name, email);

  const attendee = db.prepare('SELECT * FROM attendees WHERE id = ?').get(id);
  return NextResponse.json(attendee, { status: 201 });
}

export async function GET(req: NextRequest) {
  const db = getDb();
  const attendees = db
    .prepare('SELECT * FROM attendees ORDER BY created_at DESC')
    .all() as Record<string, unknown>[];
  const checkins = db
    .prepare('SELECT attendee_id, type, checked_in_at FROM checkins')
    .all() as { attendee_id: string; type: string; checked_in_at: string }[];

  const checkinsById = checkins.reduce<Record<string, Record<string, string>>>(
    (acc, row) => {
      if (!acc[row.attendee_id]) acc[row.attendee_id] = {};
      acc[row.attendee_id][row.type] = row.checked_in_at;
      return acc;
    },
    {}
  );

  const enriched = attendees.map((a) => ({
    ...a,
    checkins: checkinsById[a.id as string] ?? {},
  }));

  const format = req.nextUrl.searchParams.get('format');
  if (format === 'csv') {
    const header = 'id,name,email,arrival_at,food1_at,food2_at,created_at';
    const rows = enriched.map((a) => {
      const checkins = a.checkins as Record<string, string | undefined>;
      return [
        a.id,
        a.name,
        a.email,
        checkins.arrival ?? '',
        checkins.food1 ?? '',
        checkins.food2 ?? '',
        a.created_at,
      ].join(',');
    });
    const csv = [header, ...rows].join('\n');
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="attendees.csv"',
      },
    });
  }

  return NextResponse.json(enriched);
}
