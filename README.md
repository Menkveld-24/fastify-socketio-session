# Fastify Socket.IO Session

## Features

A plugin for [fastify](https://github.com/fastify/fastify) that adds sessions to the socket instances.

### Requirements
- [@mgcrea/fastify-session](https://github.com/mgcrea/fastify-session) For the sessions
- [fastify-socket.io](https://github.com/ducktors/fastify-socket.io) For Socket.io

## Install

```bash
npm install @mgcrea/fastify-session fastify-socket.io ...to_insert_this_package
```

## Example

```ts
import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import RedisStore from '@mgcrea/fastify-session-redis-store';
import fastifySession from '@mgcrea/fastify-session';
import Redis from 'ioredis';
import fastifyCookie from '@fastify/cookie';
import fastifySocket from 'fastify-socket.io';
import fastifySocketSession, { sessionRefreshMiddleware } from '..this_package_name';

const SESSION_TTL = 3600; // 1 day in seconds

const fastify = fastify(options);

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

fastify.get('/test', async (request, reply) => {
    // session is available at request.session
    request.session.get('myKey');
});

fastify.ready((err) => {
    if (err) throw err;

    fastify.io.on('connection', (socket) => {
        // This middleware refreshes the socket upon each request and disconnects the socket if it's expired
        socket.use(sessionRefreshMiddleware(socket));

        socket.on('pong', async () => {
            // The session is here available at socket.request.session
            const incr = socket.request.session.get('incremental') ?? 1;
            socket.request.session.set('incremental', parseInt(incr as string) + 1);

            await socket.request.session.save();
        });
    });
});

fastify.listen({ port: 3005 });
```

## License

```md
The MIT License

Copyright (c) 2023 Menkveld-24

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
