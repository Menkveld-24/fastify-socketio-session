import fastifyPlugin from 'fastify-plugin';
import { Socket } from 'socket.io';
import { IncomingMessage, ServerResponse } from 'http';
import { serialize } from 'cookie';
import { CookieSerializeOptions } from '@fastify/cookie';

export default fastifyPlugin(
    async function (fastify, opts) {
        if (!fastify.hasPlugin('fastify-socket.io')) {
            throw new Error('fastify-socket.io has to be registered before fastify-socketio-session');
        }

        if (!fastify.hasPlugin('fastify-session')) {
            throw new Error('@mgcrea/fastify-session has to be registered before fastify-socketio-session');
        }

        // @ts-expect-error io is loaded via fastify-socket-io
        fastify.io.engine.use((req: IncomingMessage, res: ServerResponse, next: (err?: Error) => void) => {
            fastify
                // @ts-expect-error loadSession is loaded via fastify-session
                .loadSession(req, req.headers.cookie)
                .then(() => {
                    fastify
                        // @ts-expect-error encodeSession is loaded via fastify-session
                        .encodeSession(req)
                        .then(
                            (
                                cookie: {
                                    name: string;
                                    value: string;
                                    options: CookieSerializeOptions;
                                } = undefined
                            ) => {
                                if (cookie === undefined) return;

                                // @ts-expect-error Incompatible cookie options
                                res.setHeader('Set-Cookie', serialize(cookie.name, cookie.value, cookie.options));
                            }
                        )
                        .catch(next);
                })
                .catch(next);
        });
    },
    {
        fastify: '4.x',
        name: 'fastify-socketio-session',
    }
);

/**
 * Socket.IO middleware to refresh the session upon each request.
 * Disconnects the socket if no session is found or could be loaded.
 *
 * @param socket The socket instance
 * @param disconnectWithoutSession Disconnect the socket if no session is found or could be loaded
 * @returns socket.io middleware
 */
export const sessionRefreshMiddleware = (
    socket: Socket,
    disconnectWithoutSession = true
): ((event: Event, next: (err?: Error) => void) => void) => {
    return async (event, next) => {
        try {
            // @ts-expect-error This one is loaded via fastify-session
            await socket.request.session.reload(socket.request);
        } catch (err) {
            if (disconnectWithoutSession) {
                socket.disconnect();
            }

            return next(err);
        }
        return next();
    };
};
