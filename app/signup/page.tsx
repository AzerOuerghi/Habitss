import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { Card } from "@/components/ui";
import { getUser } from "@/lib/auth";

export default async function SignupPage() {
  if (await getUser()) redirect("/today");

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-2xl font-semibold">Créer un compte</h1>
      <Card>
        <AuthForm mode="signup" />
      </Card>
    </div>
  );
}
