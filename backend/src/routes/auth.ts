import { FastifyInstance } from 'fastify';

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
  verified_email: boolean;
}

export default async function authRoutes(fastify: FastifyInstance) {
  // POST /api/auth/google — verify Google access token, return JWT for staff
  fastify.post('/api/auth/google', async (request, reply) => {
    const { accessToken } = request.body as { accessToken?: string };

    if (!accessToken) {
      return reply.status(400).send({ error: 'accessToken is required' });
    }

    // Verify token with Google userinfo endpoint (no secret needed)
    let userInfo: GoogleUserInfo;
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        return reply.status(401).send({ error: 'Invalid Google token' });
      }
      userInfo = await res.json() as GoogleUserInfo;
    } catch {
      return reply.status(502).send({ error: 'Failed to verify token with Google' });
    }

    // Check allowed emails whitelist
    const allowedEmails = (process.env.ALLOWED_EMAILS ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (!allowedEmails.includes(userInfo.email.toLowerCase())) {
      return reply.status(403).send({ error: 'Access denied' });
    }

    // Issue JWT
    const jwt = fastify.jwt.sign(
      {
        email: userInfo.email,
        name: userInfo.name,
        image: userInfo.picture,
      },
      { expiresIn: '7d' }
    );

    return reply.send({
      token: jwt,
      user: {
        email: userInfo.email,
        name: userInfo.name,
        image: userInfo.picture,
      },
    });
  });
}
