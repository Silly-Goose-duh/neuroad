import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const FILE = path.join(process.cwd(), "data", "waitlist.json");
const BLOB_PATH = "waitlist.json";
const hits = new Map<string, { n: number; t: number }>();

type Row = { email: string; role: string; at: string };

function ip(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local"
  );
}

function limited(key: string) {
  const now = Date.now();
  const row = hits.get(key);
  if (!row || now - row.t > 60_000) {
    hits.set(key, { n: 1, t: now });
    return false;
  }
  row.n += 1;
  return row.n > 8;
}

async function readRows(): Promise<Row[]> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { list } = await import("@vercel/blob");
    const found = await list({ prefix: BLOB_PATH, limit: 1 });
    const blob = found.blobs.find((item) => item.pathname === BLOB_PATH);
    if (!blob) return [];
    const res = await fetch(blob.url);
    if (!res.ok) return [];
    const parsed = await res.json();
    return Array.isArray(parsed) ? parsed : [];
  }
  try {
    const parsed = JSON.parse(await fs.readFile(FILE, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeRows(rows: Row[]) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    await put(BLOB_PATH, JSON.stringify(rows, null, 2), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(rows, null, 2));
}

export async function POST(req: Request) {
  if (limited(ip(req))) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let body: { email?: string; role?: string; website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "email" }, { status: 400 });
  }

  const role = (body.role || "").slice(0, 40);
  try {
    const rows = await readRows();
    rows.push({ email, role, at: new Date().toISOString() });
    await writeRows(rows);
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
