import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import { getSession } from "@/lib/auth";

/**
 * Wraps every authenticated /admin page. Middleware already blocks
 * unauthenticated requests, but this re-checks server-side — defense in
 * depth, and it's how the sidebar gets the signed-in admin's email.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-full">
      <Sidebar email={session.email} />
      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-8 py-12 lg:px-12">{children}</div>
      </main>
    </div>
  );
}
