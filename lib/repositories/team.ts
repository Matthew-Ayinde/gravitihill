import { getDb } from "@/lib/mongodb";
import { personSchema, type Person } from "@/lib/schemas";

const COLLECTION = "team";
type Doc = Person & { _id: string; order: number; updatedAt: string };

async function collection() {
  return (await getDb()).collection<Doc>(COLLECTION);
}

function strip(doc: Doc): Person {
  const { _id, order, updatedAt, ...rest } = doc;
  return personSchema.parse(rest);
}

export async function listTeam(): Promise<Person[]> {
  const docs = await (await collection()).find({}).sort({ order: 1 }).toArray();
  return docs.map(strip);
}

export async function findPerson(slug: string): Promise<Person | undefined> {
  const doc = await (await collection()).findOne({ _id: slug });
  return doc ? strip(doc) : undefined;
}

export async function upsertPerson(input: Person, order: number): Promise<void> {
  const data = personSchema.parse(input);
  await (await collection()).replaceOne(
    { _id: data.slug },
    { ...data, order, updatedAt: new Date().toISOString() },
    { upsert: true },
  );
}

export async function deletePerson(slug: string): Promise<void> {
  await (await collection()).deleteOne({ _id: slug });
}
