import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "./server.js";

async function withServer(run) {
  const server = createServer();
  server.listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  const { port } = server.address();
  try {
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
}

test("GET /health returns a JSON health status and CORS headers", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /^application\/json\s*;/);
    assert.equal(response.headers.get("access-control-allow-origin"), "*");
    assert.deepEqual(await response.json(), { status: "ok" });
  });
});

test("GET /greet decodes the name query and defaults when it is missing", async () => {
  await withServer(async (baseUrl) => {
    const namedResponse = await fetch(`${baseUrl}/greet?name=Ada%20Lovelace`);
    assert.equal(namedResponse.status, 200);
    assert.deepEqual(await namedResponse.json(), { greeting: "Hello, Ada Lovelace!" });

    const defaultResponse = await fetch(`${baseUrl}/greet`);
    assert.equal(defaultResponse.status, 200);
    assert.deepEqual(await defaultResponse.json(), { greeting: "Hello, World!" });
  });
});

test("unknown routes return a predictable JSON 404", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/missing`);
    assert.equal(response.status, 404);
    assert.match(response.headers.get("content-type"), /^application\/json\s*;/);
    assert.deepEqual(await response.json(), { error: "Not Found" });
  });
});

test("unsupported methods return JSON 405 and an Allow header", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`, { method: "POST" });
    assert.equal(response.status, 405);
    assert.equal(response.headers.get("allow"), "GET, OPTIONS");
    assert.deepEqual(await response.json(), { error: "Method Not Allowed" });
  });
});

test("OPTIONS returns an empty preflight response with CORS headers", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/greet`, { method: "OPTIONS" });
    assert.equal(response.status, 204);
    assert.equal(response.headers.get("access-control-allow-origin"), "*");
    assert.match(response.headers.get("access-control-allow-methods"), /GET/);
    assert.equal(await response.text(), "");
  });
});
