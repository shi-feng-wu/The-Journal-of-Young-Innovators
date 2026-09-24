// Creates a portal editor (or reissues a set-password link for an existing
// one) and prints the link. Use it to create the first admin:
//
//   pnpm portal:add-editor --email editor@young-innovator.org --name "Jane Doe" --admin
//
// Run it on the server as the deploy user, from the app directory, so it
// writes to the same database as the site (PORTAL_DATA_DIR in .env.local).

import { parseArgs } from "node:util";

try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local; fall back to the default data directory.
}

const { values } = parseArgs({
  options: {
    email: { type: "string" },
    name: { type: "string" },
    admin: { type: "boolean", default: false },
    url: { type: "string", default: "https://young-innovator.org" },
  },
});

if (!values.email) {
  console.error('Usage: pnpm portal:add-editor --email <email> --name "<name>" [--admin] [--url http://localhost:3000]');
  process.exit(1);
}

const { DATA_DIR, get, now, run } = await import("../app/lib/portal/db.ts");
const { createPasswordToken } = await import("../app/lib/portal/auth.ts");

const email = values.email.trim().toLowerCase();
let editor = get<{ id: number; name: string; is_admin: number }>(
  "SELECT id, name, is_admin FROM editors WHERE email = :email",
  { email },
);

if (!editor) {
  if (!values.name) {
    console.error("--name is required for a new editor.");
    process.exit(1);
  }
  run(
    `INSERT INTO editors (email, name, is_admin, created_at)
     VALUES (:email, :name, :isAdmin, :createdAt)`,
    { email, name: values.name.trim(), isAdmin: values.admin ? 1 : 0, createdAt: now() },
  );
  editor = get("SELECT id, name, is_admin FROM editors WHERE email = :email", { email })!;
  console.log(`Created ${values.admin ? "admin" : "editor"} ${editor.name} <${email}>`);
} else {
  if (values.admin && !editor.is_admin) {
    run("UPDATE editors SET is_admin = 1, disabled = 0 WHERE id = :id", { id: editor.id });
    console.log(`${editor.name} is now an admin.`);
  }
  console.log(`Editor ${editor.name} <${email}> already exists; issuing a new link.`);
}

const token = createPasswordToken(editor.id);
console.log(`Database: ${DATA_DIR}/portal.db`);
console.log(`\nSet-password link (single use, expires in 72 hours):\n${values.url}/portal/set-password?token=${token}\n`);
