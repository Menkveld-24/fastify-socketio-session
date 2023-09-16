import createFastify, { FastifyInstance, FastifyServerOptions } from "fastify";
import RedisStore from "@mgcrea/fastify-session-redis-store";
import fastifySession from "@mgcrea/fastify-session";
import Redis from "ioredis";
import fastifyCookie from "@fastify/cookie";
import fastifySocket from "fastify-socket.io";
import fastifySocketSession from "./src/plugin";

const SESSION_TTL = 3600; // 1 day in seconds

export const buildFastify = (options?: FastifyServerOptions): FastifyInstance => {
  const fastify = createFastify(options);

  fastify.register(fastifyCookie);
  fastify.register(fastifySession, {
    store: new RedisStore({ client: new Redis({
        'host': 'localhost',
        'port': 6377,
    }), ttl: SESSION_TTL, 'prefix': "session:" }),
    secret: "a secret with minimum length of 32 characters",
    cookie: { maxAge: SESSION_TTL },
    cookieName: "ptv2-session"
  });

  fastify.register(fastifySocket);
  fastify.register(fastifySocketSession);

  return fastify;
};

const fastify = buildFastify();

fastify.ready(err => {
  if (err) throw err
  fastify.io.of('/socket').on('connection', socket => {
      console.log('new connection');

      socket.on('pong', async () => {
          console.log('pong');
          const incr = socket.request.session.get('incremental') ?? 1;
          console.log(incr);
          socket.request.session.set('incremental', parseInt(incr as string) + 1);
          await socket.request.session.save();
      });
  });
});

fastify.listen({ port: 3005 });

console.log('Server running on http://localhost:3005');
