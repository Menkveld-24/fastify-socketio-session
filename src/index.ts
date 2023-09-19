import fastifyPlugin from 'fastify-plugin';
import { Socket } from 'socket.io';

export default fastifyPlugin(
    async function (fastify, opts) {
        if (!fastify.hasPlugin('fastify-socket.io')) {
            throw new Error('fastify-socket.io has to be registered before fastify-socketio-session');
        }

        if (!fastify.hasPlugin('fastify-session')) {
            throw new Error('@mgcrea/fastify-session has to be registered before fastify-socketio-session');
        }

        // This is triggered upon first contact of a socket
        // @ts-expect-error fastify.io is loaded via fastify-socket.io
        fastify.io.engine.on('initial_headers', async (headers, request) => {
            // @ts-expect-error This one is loaded via fastify-session
            await fastify.loadSession(request, request.headers.cookie);
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
