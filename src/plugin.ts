import fastifyPlugin from "fastify-plugin";

export default fastifyPlugin(async function (fastify, opts) {
    
    if (!fastify.hasPlugin("fastify-socket.io")) {
      throw new Error('fastify-socket.io has to be registered before fastify-socketio-session');
    }

    if (!fastify.hasPlugin("fastify-session")) {
      throw new Error('@mgcrea/fastify-session has to be registered before fastify-socketio-session');
    }

    // This is triggered upon first contact of a socket
    fastify.io.engine.on("initial_headers", async (headers, request) => {
        // @ts-expect-error The typing doesnt load or smth
        await fastify.loadSession(request, request.headers.cookie);
      });
}, {
  fastify: "4.x",
  name: "fastify-socketio-session",
});