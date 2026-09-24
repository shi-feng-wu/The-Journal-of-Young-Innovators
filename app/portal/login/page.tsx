import { redirect } from "next/navigation";
import { getCurrentEditor } from "@/lib/portal/auth";
import AuthCard from "../_components/AuthCard";
import LoginForm from "./LoginForm";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getCurrentEditor()) redirect("/portal");
  return (
    <AuthCard title="Sign in">
      <LoginForm />
    </AuthCard>
  );
}
