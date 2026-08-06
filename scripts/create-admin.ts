import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import bcrypt from "bcryptjs";
import { upsertAdmin } from "@/lib/repositories/admins";

/**
 * Creates (or resets the password of) an admin login. Re-runnable — upserts
 * by email, so running it again with the same email rotates the password.
 * Run with: npm run admin:create
 */

async function promptHidden(rl: ReturnType<typeof createInterface>, question: string): Promise<string> {
  // readline has no built-in masked input; good enough for a one-time local
  // setup script run in a terminal the operator controls.
  return rl.question(question);
}

async function main() {
  const rl = createInterface({ input: stdin, output: stdout });

  const email = (await rl.question("Admin email: ")).trim().toLowerCase();
  if (!email || !email.includes("@")) {
    console.error("Enter a valid email address.");
    process.exit(1);
  }

  const password = await promptHidden(rl, "Admin password (min 10 characters): ");
  rl.close();

  if (password.length < 10) {
    console.error("Password must be at least 10 characters.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await upsertAdmin(email, passwordHash);

  console.log(`\nAdmin account ready: ${email}`);
  console.log("Log in at /admin/login.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
