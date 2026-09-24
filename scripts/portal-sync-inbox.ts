// Files new author replies from the editor inbox under their manuscripts.
//
//   pnpm portal:sync-inbox              (read mail since the last run)
//   pnpm portal:sync-inbox --since 2026-09-24T00:00:00Z   (first run only)
//
// Run it from cron on the server as the deploy user, e.g. every 5 minutes:
//   */5 * * * * cd ~/apps/jyi && pnpm -s portal:sync-inbox >> ~/inbox-sync.log 2>&1

import { parseArgs } from "node:util";

try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local; rely on the environment.
}

const { values } = parseArgs({ options: { since: { type: "string" } } });
const { syncInbox } = await import("../app/lib/portal/inbox.ts");

try {
  const r = await syncInbox({ since: values.since });
  console.log(
    `${new Date().toISOString()} checked ${r.checked}, filed ${r.matched}, left for editors ${r.unmatched}, skipped ${r.skipped}`,
  );
} catch (error) {
  console.error(`${new Date().toISOString()} inbox sync failed:`, error instanceof Error ? error.message : error);
  process.exit(1);
}
