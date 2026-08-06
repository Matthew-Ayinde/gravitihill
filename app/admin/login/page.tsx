import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Lockup } from "@/components/ui/Lockup";
import { LoginForm } from "@/components/admin/LoginForm";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false } };

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <div className="flex min-h-full items-center justify-center bg-ridge px-6 py-16">
      <div className="w-full max-w-sm">
        <Lockup variant="white" width={140} href={null} />
        <p className="type-eyebrow mt-8 text-accent">Admin</p>
        <h1 className="type-display mt-3 text-h2 text-white">Sign in.</h1>
        <p className="mt-3 text-body-lg text-white/65">
          Content for gravitihill.com lives here — services, sectors,
          insights, and the rest.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
