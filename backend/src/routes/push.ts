import { FastifyInstance } from 'fastify';
import getDb from '../db.js';

export default async function pushRoutes(fastify: FastifyInstance) {
  // POST /api/push/token — store device push token
  fastify.post('/api/push/token', async (request, reply) => {
    const { token, platform, attendee_id } = request.body as {
      token?: string;
      platform?: string;
      attendee_id?: string;
    };

    if (!token || !platform) {
      return reply.status(400).send({ error: 'token and platform are required' });
    }

    const validPlatforms = new Set(['ios', 'android', 'web']);
    if (!validPlatforms.has(platform)) {
      return reply.status(400).send({ error: 'Invalid platform' });
    }

    const db = getDb();

    try {
      db.prepare(
        `INSERT INTO push_tokens (attendee_id, token, platform)
         VALUES (?, ?, ?)
         ON CONFLICT(token) DO UPDATE SET attendee_id = excluded.attendee_id`
      ).run(attendee_id ?? null, token, platform);
    } catch {
      return reply.status(500).send({ error: 'Failed to store token' });
    }

    return reply.status(201).send({ ok: true });
  });

  // POST /api/push/send — send notification (stub)
  fastify.post('/api/push/send', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { title, body, attendee_id } = request.body as {
      title?: string;
      body?: string;
      attendee_id?: string;
    };

    if (!title || !body) {
      return reply.status(400).send({ error: 'title and body are required' });
    }

    // TODO: integrate Firebase Admin SDK for real push delivery
    fastify.log.info({ title, body, attendee_id }, 'push/send stub called');

    return reply.send({ ok: true, stub: true });
  });
}
