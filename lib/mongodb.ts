import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Missing MONGODB_URI environment variable. Define it in .env before connecting to the database."
  );
}

// Shape of the cache we stash the connection (and in-flight connect promise)
// in. Keeping both lets concurrent callers await the same connection attempt
// instead of racing to open separate ones.
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Next.js dev mode clears the Node module cache on every file change (fast
// refresh), which would normally re-run this module and open a brand new
// connection on each edit. Stashing the cache on `globalThis` survives that
// module reload, so we reuse the same connection instead of piling up new
// ones against MongoDB.
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

/**
 * Connects to MongoDB via Mongoose, reusing a cached connection when one
 * already exists. Safe to call on every request/handler — it only opens a
 * new connection the first time it's needed.
 */
export async function connectToDatabase(): Promise<Mongoose> {
  // Already connected: hand back the existing connection.
  if (cached.conn) {
    return cached.conn;
  }

  // A connection attempt is already in flight: await that instead of
  // starting a second one.
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI as string, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset the cached promise so the next call can retry the connection
    // instead of forever awaiting a rejected promise.
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;
