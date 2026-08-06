import { ObjectId } from "mongodb";
import { z } from "zod";
import { getDb } from "@/lib/mongodb";
import type { ContactInput } from "@/lib/contact-schema";

/**
 * Persisted contact enquiries. Defined with classic `zod` here rather than in
 * lib/contact-schema.ts — that file is imported by the client-side
 * ContactForm and is deliberately built on `zod/mini` to keep classic Zod's
 * ~50kB off /contact. This module is server-only (repository layer, never
 * imported by a client component), so there's no bundle to protect.
 */

export const submissionStatusSchema = z.enum(["new", "read", "archived"]);
export type SubmissionStatus = z.infer<typeof submissionStatusSchema>;

const submissionSchema = z.object({
  name: z.string(),
  company: z.string(),
  role: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  enquiryType: z.string(),
  budget: z.string().optional(),
  message: z.string(),
  status: submissionStatusSchema,
  createdAt: z.string(),
});
export type ContactSubmission = z.infer<typeof submissionSchema> & { id: string };

const COLLECTION = "contactSubmissions";
type Doc = z.infer<typeof submissionSchema> & { _id: ObjectId };

async function collection() {
  return (await getDb()).collection<Doc>(COLLECTION);
}

function strip(doc: Doc): ContactSubmission {
  const { _id, ...rest } = doc;
  return { ...submissionSchema.parse(rest), id: _id.toHexString() };
}

export async function recordSubmission(input: ContactInput): Promise<void> {
  const data = submissionSchema.parse({
    name: input.name,
    company: input.company,
    role: input.role,
    email: input.email,
    phone: input.phone || undefined,
    enquiryType: input.enquiryType,
    budget: input.budget || undefined,
    message: input.message,
    status: "new",
    createdAt: new Date().toISOString(),
  });
  await (await collection()).insertOne({ ...data, _id: new ObjectId() });
}

/** Newest first — the admin inbox order. */
export async function listSubmissions(): Promise<ContactSubmission[]> {
  const docs = await (await collection()).find({}).sort({ createdAt: -1 }).toArray();
  return docs.map(strip);
}

export async function countNewSubmissions(): Promise<number> {
  return (await collection()).countDocuments({ status: "new" });
}

export async function setSubmissionStatus(id: string, status: SubmissionStatus): Promise<void> {
  if (!ObjectId.isValid(id)) return;
  await (await collection()).updateOne({ _id: new ObjectId(id) }, { $set: { status } });
}
