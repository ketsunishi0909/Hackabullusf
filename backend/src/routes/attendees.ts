import { FastifyInstance } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import getDb from '../db.js';

export default async function attendeesRoutes(fastify: FastifyInstance) {
  // POST /api/attendees — register attendee
  fastify.post('/api/attendees', async (request, reply) => {
    const { name, email } = request.body as { name?: string; email?: string };

    if (!name || !email) {
      return reply.status(400).send({ error: 'Name and email are required' });
    }

    const db = getDb();

    const existing = db.prepare('SELECT id FROM attendees WHERE email = ?').get(email);
    if (existing) {
      return reply.status(409).send({ error: 'Email already registered' });
    }

    const id = uuidv4();
    db.prepare(
      'INSERT INTO attendees (id, name, email) VALUES (?, ?, ?)'
    ).run(id, name, email);

    const attendee = db.prepare('SELECT * FROM attendees WHERE id = ?').get(id);
    return reply.status(201).send(attendee);
  });

  // GET /api/attendees — list all (JWT required) or ?format=csv
  fastify.get('/api/attendees', { onRequest: [fastify.authenticate] }, async (request, reply) => {
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

    interface EnrichedAttendee extends Record<string, unknown> {
      id: string;
      name: string;
      email: string;
      created_at: string;
      checkins: Record<string, string>;
    }

    const enriched = attendees.map((a) => ({
      ...(a as EnrichedAttendee),
      checkins: checkinsById[a.id as string] ?? {},
    })) as EnrichedAttendee[];

    const format = (request.query as Record<string, string>).format;
    if (format === 'csv') {
      const header = 'id,name,email,arrival_at,food1_at,food2_at,created_at';
      const rows = enriched.map((a) => {
        const c = a.checkins as Record<string, string | undefined>;
        return [
          a.id,
          `"${a.name.replace(/"/g, '""')}"`,
          `"${a.email.replace(/"/g, '""')}"`,
          c.arrival ?? '',
          c.food1 ?? '',
          c.food2 ?? '',
          a.created_at,
        ].join(',');
      });
      const csv = [header, ...rows].join('\n');
      return reply
        .header('Content-Type', 'text/csv')
        .header('Content-Disposition', 'attachment; filename="attendees.csv"')
        .send(csv);
    }

    return reply.send(enriched);
  });

  // GET /api/attendees/:id — get single attendee (attendee view)
  fastify.get('/api/attendees/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const db = getDb();

    const attendee = db.prepare('SELECT * FROM attendees WHERE id = ?').get(id);
    if (!attendee) {
      return reply.status(404).send({ error: 'Attendee not found' });
    }

    const checkins = db
      .prepare('SELECT type, checked_in_at FROM checkins WHERE attendee_id = ?')
      .all(id) as { type: string; checked_in_at: string }[];

    const checkinsMap = checkins.reduce<Record<string, string>>((acc, row) => {
      acc[row.type] = row.checked_in_at;
      return acc;
    }, {});

    return reply.send({ ...attendee, checkins: checkinsMap });
  });

  // PATCH /api/attendees/:id — check-in by type (JWT required)
  fastify.patch('/api/attendees/:id', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const db = getDb();

    const attendee = db.prepare('SELECT * FROM attendees WHERE id = ?').get(id) as
      | Record<string, unknown>
      | undefined;

    if (!attendee) {
      return reply.status(404).send({ error: 'Attendee not found' });
    }

    const body = (request.body as Record<string, string> | null) ?? {};
    const queryType = (request.query as Record<string, string>).type;
    const type = ((body.type ?? queryType ?? 'arrival') as string).toLowerCase();

    const allowedTypes = new Set(['arrival', 'food1', 'food2']);
    if (!allowedTypes.has(type)) {
      return reply.status(400).send({ error: 'Invalid check-in type' });
    }

    const existing = db
      .prepare('SELECT checked_in_at FROM checkins WHERE attendee_id = ? AND type = ?')
      .get(id, type) as { checked_in_at: string } | undefined;

    if (existing) {
      return reply.status(409).send({
        error: 'Already checked in',
        checked_in_at: existing.checked_in_at,
        type,
      });
    }

    const now = new Date().toISOString();
    db.prepare(
      'INSERT INTO checkins (attendee_id, type, checked_in_at) VALUES (?, ?, ?)'
    ).run(id, type, now);

    const updated = db.prepare('SELECT * FROM attendees WHERE id = ?').get(id) as Record<string, unknown>;
    return reply.send({ ...updated, check_in_type: type, checked_in_at: now });
  });
}
