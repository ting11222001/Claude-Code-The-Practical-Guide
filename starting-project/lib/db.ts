import { Database, type SQLQueryBindings } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "app.db");

const SCHEMA = `
CREATE TABLE IF NOT EXISTS "user" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" INTEGER NOT NULL DEFAULT 0,
  "image" TEXT,
  "createdAt" DATE NOT NULL,
  "updatedAt" DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS "session" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
  "token" TEXT NOT NULL UNIQUE,
  "expiresAt" DATE NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" DATE NOT NULL,
  "updatedAt" DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS "account" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "accessTokenExpiresAt" DATE,
  "refreshTokenExpiresAt" DATE,
  "scope" TEXT,
  "idToken" TEXT,
  "password" TEXT,
  "createdAt" DATE NOT NULL,
  "updatedAt" DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS "verification" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" DATE NOT NULL,
  "createdAt" DATE NOT NULL,
  "updatedAt" DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_json TEXT NOT NULL,
  is_public INTEGER NOT NULL DEFAULT 0,
  public_slug TEXT UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_public_slug ON notes(public_slug);
CREATE INDEX IF NOT EXISTS idx_notes_is_public ON notes(is_public);
`;

function createDb(): Database {
  mkdirSync(DATA_DIR, { recursive: true });
  const database = new Database(DB_PATH, { create: true });
  database.exec("PRAGMA journal_mode = WAL;");
  database.exec("PRAGMA foreign_keys = ON;");
  database.exec("PRAGMA busy_timeout = 5000;");
  database.exec(SCHEMA);
  return database;
}

// Cache on globalThis so Next.js dev HMR doesn't open new connections on every reload.
const globalForDb = globalThis as unknown as { __db?: Database };

export const db: Database = globalForDb.__db ?? createDb();
globalForDb.__db = db;

export function getDb(): Database {
  return db;
}

type Params = SQLQueryBindings[];

export function query<T>(sql: string, params: Params = []): T[] {
  return db.query<T, Params>(sql).all(...params);
}

export function get<T>(sql: string, params: Params = []): T | undefined {
  return db.query<T, Params>(sql).get(...params) ?? undefined;
}

export function run(sql: string, params: Params = []) {
  return db.query(sql).run(...params);
}
