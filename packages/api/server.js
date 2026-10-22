import { createServer as createHttpServer } from "node:http";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { greet } from "@test-repo/shared";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function sendJson(response, statusCode, payload, extraHeaders = {}) {
  response.writeHead(statusCode, {
    ...corsHeaders,
    "Content-Type": "application/json; charset=utf-8",
    ...extraHeaders,
  });
  response.end(JSON.stringify(payload));
}

export function createServer() {
  return createHttpServer((request, response) => {
    if (request.method === "OPTIONS") {
      response.writeHead(204, corsHeaders);
      response.end();
      return;
    }

    let pathname;
    try {
      pathname = new URL(request.url, "http://localhost").pathname;
    } catch {
      sendJson(response, 400, { error: "Bad Request" });
      return;
    }

    if (pathname !== "/health" && pathname !== "/greet") {
      sendJson(response, 404, { error: "Not Found" });
      return;
    }

    if (request.method !== "GET") {
      sendJson(response, 405, { error: "Method Not Allowed" }, { Allow: "GET, OPTIONS" });
      return;
    }

    if (pathname === "/health") {
      sendJson(response, 200, { status: "ok" });
      return;
    }

    const url = new URL(request.url, "http://localhost");
    sendJson(response, 200, { greeting: greet(url.searchParams.get("name") ?? undefined) });
  });
}

function startServer() {
  const port = Number(process.env.PORT ?? 3000);
  const server = createServer();

  server.listen(port, "127.0.0.1", () => {
    console.log(`API listening at http://127.0.0.1:${port}`);
  });

  const shutdown = () => {
    server.close(() => process.exit(0));
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
  server.on("error", (error) => {
    console.error("API server failed:", error);
    process.exitCode = 1;
  });
}

const isDirectExecution = process.argv[1]
  && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isDirectExecution) {
  startServer();
}
