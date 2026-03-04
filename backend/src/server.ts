import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import attendeesRoutes from './routes/attendees.js';
import authRoutes from './routes/auth.js';
import pushRoutes from './routes/push.js';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: import('fastify').FastifyRequest, reply: import('fastify').FastifyReply) => Promise<void>;
  }
}

async function main() {
  const isDev = process.env.NODE_ENV !== 'production';
  const fastify = Fastify({
    logger: isDev
      ? {
          level: 'info',
          transport: {
            target: 'pino-pretty',
            options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
          },
        }
      : { level: 'info' },
  });

  // Plugins
  await fastify.register(cors, {
    origin: true,
    credentials: true,
  });

  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  });

  // Auth decorator
  fastify.decorate('authenticate', async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
  });

  // Log every request with body
  fastify.addHook('preHandler', (request, _reply, done) => {
    if (request.body) {
      request.log.info({ body: request.body }, `${request.method} ${request.url}`);
    }
    done();
  });

  // Routes
  await fastify.register(attendeesRoutes);
  await fastify.register(authRoutes);
  await fastify.register(pushRoutes);

  // Health check
  fastify.get('/health', async () => ({ ok: true }));

  // Start
  const port = Number(process.env.PORT ?? 3001);
  try {
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Backend running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();
