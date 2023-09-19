var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default,
  sessionRefreshMiddleware: () => sessionRefreshMiddleware
});
module.exports = __toCommonJS(src_exports);
var import_fastify_plugin = __toESM(require("fastify-plugin"), 1);
var src_default = (0, import_fastify_plugin.default)(async function(fastify, opts) {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sessionRefreshMiddleware
});
//# sourceMappingURL=index.cjs.map