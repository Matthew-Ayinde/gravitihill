import { getDb } from "@/lib/mongodb";
import { adminSchema, type Admin } from "@/lib/schemas";

/**
 * Admin identities. `_id` is the lowercased email — the natural unique key
 * for a login. Written to by scripts/create-admin.ts, read by the login
 * Server Action in app/admin/login/actions.ts.
 */

const COLLECTION = "admins";
type Doc = Admin & { _id: string };

async function collection() {
  return (await getDb()).collection<Doc>(COLLECTION);
}

export async function findAdminByEmail(email: string): Promise<Admin | undefined> {
  const doc = await (await collection()).findOne({ _id: email.trim().toLowerCase() });
  if (!doc) return undefined;
  const { _id, ...rest } = doc;
  return adminSchema.parse(rest);
}

export async function upsertAdmin(email: string, passwordHash: string): Promise<void> {
  const id = email.trim().toLowerCase();
  const data = adminSchema.parse({ email: id, passwordHash, createdAt: new Date().toISOString() });
  await (await collection()).replaceOne(
    { _id: id },
    data,
    { upsert: true },
  );
}

export async function countAdmins(): Promise<number> {
  return (await collection()).countDocuments();
}
