// Nightly backup of the editor portal: a consistent copy of the database
// (VACUUM INTO works while the site is writing) plus every stored file,
// packed into one dated archive. Keeps the newest 14 archives.
//
//   pnpm portal:backup
//
// Optional: set PORTAL_BACKUP_S3_URI (e.g. s3://bucket/portal) and install
// the AWS CLI with credentials, and each archive is also copied to S3.
//
// Restore: stop the site, move the data directory aside, then
//   mkdir -p $PORTAL_DATA_DIR && tar xzf <archive> -C $PORTAL_DATA_DIR
//   mv $PORTAL_DATA_DIR/portal-backup.db $PORTAL_DATA_DIR/portal.db
// and start the site again.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local; rely on the environment.
}

const { DATA_DIR, getDb } = await import("../app/lib/portal/db.ts");

const BACKUP_DIR = path.resolve(process.env.PORTAL_BACKUP_DIR ?? path.join(os.homedir(), "jyi-backups"));
const KEEP = 14;

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const work = fs.mkdtempSync(path.join(os.tmpdir(), "portal-backup-"));
const archive = path.join(BACKUP_DIR, `portal-${stamp}.tar.gz`);

try {
  fs.mkdirSync(BACKUP_DIR, { recursive: true, mode: 0o700 });

  // A single consistent copy of the database, even mid-write.
  const dbCopy = path.join(work, "portal-backup.db");
  getDb().exec(`VACUUM INTO '${dbCopy.replace(/'/g, "''")}'`);

  // Database copy plus manuscripts and attachments (the live db and its WAL
  // files are left out; the copy above replaces them).
  const entries = fs.readdirSync(DATA_DIR).filter((f) => !/^portal\.db(-wal|-shm)?$/.test(f));
  execFileSync("tar", ["czf", archive, "-C", work, "portal-backup.db", "-C", DATA_DIR, ...entries]);
  fs.chmodSync(archive, 0o600);

  // Keep the newest archives only.
  const old = fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => /^portal-.*\.tar\.gz$/.test(f))
    .sort()
    .reverse()
    .slice(KEEP);
  for (const f of old) fs.rmSync(path.join(BACKUP_DIR, f));

  const size = (fs.statSync(archive).size / 1024 / 1024).toFixed(1);
  console.log(`${new Date().toISOString()} wrote ${archive} (${size} MB), removed ${old.length} old`);

  const s3 = process.env.PORTAL_BACKUP_S3_URI;
  if (s3) {
    execFileSync("aws", ["s3", "cp", archive, `${s3.replace(/\/$/, "")}/${path.basename(archive)}`, "--only-show-errors"]);
    console.log(`${new Date().toISOString()} copied to ${s3}`);
  }
} catch (error) {
  console.error(`${new Date().toISOString()} backup failed:`, error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  fs.rmSync(work, { recursive: true, force: true });
}
