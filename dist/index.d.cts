import * as fastify from 'fastify';
import { Socket } from 'socket.io';
import { IncomingMessage, ServerResponse } from 'http';

declare const _default: (fastify: fastify.FastifyInstance<fastify.RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, fastify.FastifyBaseLogger, fastify.FastifyTypeProviderDefault>, opts: Record<never, never>) => Promise<void>;

/**
 * Socket.IO middleware to refresh the session upon each request.
 * Disconnects the socket if no session is found or could be loaded.
 *
 * @param socket The socket instance
 * @param disconnectWithoutSession Disconnect the socket if no session is found or could be loaded
 * @returns socket.io middleware
 */
declare const sessionRefreshMiddleware: (socket: Socket, disconnectWithoutSession?: boolean) => (event: Event, next: (err?: Error) => void) => void;

export { _default as default, sessionRefreshMiddleware };
