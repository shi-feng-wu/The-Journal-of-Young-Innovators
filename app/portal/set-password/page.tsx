import Link from "next/link";
import { findPasswordToken, MIN_PASSWORD_LENGTH } from "@/lib/portal/auth";
import AuthCard from "../_components/AuthCard";
import SetPasswordForm from "./SetPasswordForm";

export const metadata = { title: "Set your password" };

export default async function SetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;
  const editor = token ? findPasswordToken(token) : undefined;

  if (!editor) {
    return (
      <AuthCard
        title="Link expired"
        subtitle="This link has expired or was already used. Ask a portal admin to send you a new one."
      >
        <Link
          href="/portal/login"
          className="block text-center font-mono text-xs uppercase tracking-[0.16em] text-white underline underline-offset-4"
        >
          Go to sign in
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Set your password"
      subtitle={`Signing in as ${editor.email}. Use at least ${MIN_PASSWORD_LENGTH} characters.`}
    >
      <SetPasswordForm token={token} minLength={MIN_PASSWORD_LENGTH} />
    </AuthCard>
  );
}
