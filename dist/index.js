// src/index.ts
import fastifyPlugin from "fastify-plugin";
var src_default = fastifyPlugin(async function(fastify, opts) {
  if (!fastify.hasPlugin("fastify-socket.io")) {
    throw new Error("fastify-socket.io has to be registered before fastify-socketio-session");
  }
  if (!fastify.hasPlugin("fastify-session")) {
    throw new Error("@mgcrea/fastify-session has to be registered before fastify-socketio-session");
  }
  fastify.io.engine.on("initial_headers", async (headers, request) => {
    await fastify.loadSession(request, request.headers.cookie);
  });
}, {
  fastify: "4.x",
  name: "fastify-socketio-session"
});
var sessionRefreshMiddleware = (socket, disconnectWithoutSession = true) => {
  return async (event, next) => {
    try {
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
export {
  src_default as default,
  sessionRefreshMiddleware
};
//# sourceMappingURL=index.js.map