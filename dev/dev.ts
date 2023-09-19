import createFastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import RedisStore from '@mgcrea/fastify-session-redis-store';
import fastifySession from '@mgcrea/fastify-session';
import Redis from 'ioredis';
import fastifyCookie from '@fastify/cookie';
import fastifySocket from 'fastify-socket.io';
import fastifySocketSession from '../src';

const SESSION_TTL = 3600; // 1 day in seconds

export const buildFastify = (options?: FastifyServerOptions): FastifyInstance => {
    const fastify = createFastify(options);

    fastify.register(fastifyCookie);
    fastify.register(fastifySession, {
        store: new RedisStore({
            client: new Redis({
                host: 'localhost',
                port: 6377,
            }),
            ttl: SESSION_TTL,
            prefix: 'session:',
        }),
        secret: 'a secret with minimum length of 32 characters',
        cookie: { maxAge: SESSION_TTL },
        cookieName: 'dev-fastify-socketio-session',
    });

    fastify.register(fastifySocket);
    fastify.register(fastifySocketSession);

    return fastify;
};

const fastify = buildFastify();

// reset the incremental value to 1
fastify.get('/test', async (request, reply) => {
    const incr = request.session.get('incremental') ?? 1;
    request.session.set('incremental', parseInt(incr as string) + 1);
    await request.session.save();

    await reply.send({ incr });
});

fastify.ready((err) => {
    if (err) throw err;

    console.log(fastify.printRoutes());

    // @ts-expect-error io is loaded via fastify-socket.io
    fastify.io.of('/dev-socket').on('connection', (socket) => {
        console.log('new connection');

        // each pong will increment the session value with 1 and save it
        socket.on('pong', async () => {
            console.log('pong');

            const incr = socket.request.session.get('incremental') ?? 1;
            socket.request.session.set('incremental', parseInt(incr as string) + 1);

            await socket.request.session.save();
        });
    });
});

fastify.listen({ port: 3005 });

console.log('Server running on http://localhost:3005');
