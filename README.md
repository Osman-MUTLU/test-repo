# Dependency-free Node.js workspace starter

A small ESM monorepo using npm workspaces and Node.js built-ins only. It contains a shared greeting/calculation package and a stateless HTTP API; there are no third-party runtime or test dependencies.

## Quick start

Requires Node.js 18 or newer and npm.

```sh
npm install
npm test
npm start
```

The API listens on `http://127.0.0.1:3000` by default. Set `PORT` to choose another port, for example `PORT=3001 npm start`.

## API

- `GET http://127.0.0.1:3000/health` returns `{"status":"ok"}`.
- `GET http://127.0.0.1:3000/greet?name=Ada` returns `{"greeting":"Hello, Ada!"}`. If `name` is omitted or blank, the greeting uses `World`.
- Unknown routes return JSON 404; unsupported methods on known routes return JSON 405.

The API enables wildcard CORS for its GET/OPTIONS demo endpoints so the static UI can call it from a `file://` URL. This is for local demonstration only, not a production security configuration.

## Packages

- `@test-repo/shared` exports `greet(name)` and `add(a, b)`.
- `@test-repo/api` imports the shared greeting function and provides the HTTP server.
- `packages/ui/index.html` is the static browser UI; open that file directly after starting the API.

The native test suites use `node:test` and `node:assert/strict`; `npm test` runs both shared unit tests and API HTTP integration tests. `npm install` sets up npm workspace links; the project adds no external dependencies.
