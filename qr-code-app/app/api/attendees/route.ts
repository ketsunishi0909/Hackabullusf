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
  const attendees = db.prepare('SELECT * FROM attendees ORDER BY created_at DESC').all();

  const format = req.nextUrl.searchParams.get('format');
  if (format === 'csv') {
    const header = 'id,name,email,checked_in,checked_in_at,created_at';
    const rows = (attendees as Record<string, unknown>[]).map((a) =>
      [a.id, a.name, a.email, a.checked_in, a.checked_in_at ?? '', a.created_at].join(',')
    );
    const csv = [header, ...rows].join('\n');
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="attendees.csv"',
      },
    });
  }

  return NextResponse.json(attendees);
}
