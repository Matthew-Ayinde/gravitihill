import { MongoClient, type Db } from "mongodb";

/**
 * Cached MongoClient, created lazily on first use — not at module import —
 * so importing this module (e.g. transitively, while Next collects routes
 * during `next build`) never opens a connection or requires MONGODB_URI
 * until a request actually calls `getDb()`.
 *
 * In development the module is re-evaluated on every HMR pass, so the
 * promise is stashed on `globalThis` to avoid opening a new connection pool
 * on every edit. In production the module-level variable alone is enough,
 * since the module is only evaluated once per process.
 */

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is not set. Add it to .env.local — see README §Environment.`,
    );
  }
  return value;
}

function createClientPromise(): Promise<MongoClient> {
  // Without this, the driver silently serializes any `undefined` field
  // (e.g. an optional `platformHref` we didn't set) as BSON `null` instead
  // of omitting it — which then fails Zod's `.optional()` schemas on read,
  // since `.optional()` accepts `undefined` but not `null`.
  const client = new MongoClient(required("MONGODB_URI"), { ignoreUndefined: true });
  return client.connect();
}

let cachedClientPromise: Promise<MongoClient> | undefined;

function getClientPromise(): Promise<MongoClient> {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = createClientPromise();
    }
    return global._mongoClientPromise;
  }
  if (!cachedClientPromise) {
    cachedClientPromise = createClientPromise();
  }
  return cachedClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(process.env.MONGODB_DB || "gravitihill");
}
